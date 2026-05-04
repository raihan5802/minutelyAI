from dotenv import load_dotenv
load_dotenv()

import os
from typing import TypedDict

from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI


class MeetingState(TypedDict):
    transcript: str
    summary: str
    action_items: str
    decisions: str
    open_questions: str
    final_output: str


# DeepSeek V3 — OpenAI-compatible API, ~$0.0004 per meeting analysis.
llm = ChatOpenAI(
    model="deepseek-chat",
    openai_api_key=os.getenv("DEEPSEEK_API_KEY"),
    openai_api_base="https://api.deepseek.com/v1",
    temperature=0
)


def summarize(state: MeetingState) -> dict:
    messages = [
        SystemMessage(content="You are an expert meeting analyst for MinutelyAI. Your job is to extract structured information from meeting transcripts. Be concise and precise."),
        HumanMessage(content="Read this meeting transcript carefully and write a clear summary in 3 to 5 sentences. Cover the main topics discussed, the overall purpose of the meeting, and the general outcome. Transcript:\n" + state["transcript"])
    ]
    result = llm.invoke(messages)
    return {"summary": result.content.strip()}


def extract_action_items(state: MeetingState) -> dict:
    messages = [
        SystemMessage(content="You are an expert meeting analyst for MinutelyAI. Extract information in clean structured format."),
        HumanMessage(content="From the meeting transcript below, extract every action item mentioned. For each action item write it on its own line in this exact format: TASK: [what needs to be done] | OWNER: [person responsible, write Unknown if not mentioned] | DUE: [deadline if mentioned, write Not specified if not mentioned]. If there are no action items write: No action items identified. Transcript:\n" + state["transcript"])
    ]
    result = llm.invoke(messages)
    return {"action_items": result.content.strip()}


def identify_decisions(state: MeetingState) -> dict:
    messages = [
        SystemMessage(content="You are an expert meeting analyst for MinutelyAI. Extract information in clean structured format."),
        HumanMessage(content="From the meeting transcript below, list every decision that was formally made or agreed upon by the participants. Write each decision on its own line starting with a dash. Only include things that were actually decided, not things that were merely discussed or suggested. If no decisions were made write: No decisions recorded. Transcript:\n" + state["transcript"])
    ]
    result = llm.invoke(messages)
    return {"decisions": result.content.strip()}


def find_open_questions(state: MeetingState) -> dict:
    messages = [
        SystemMessage(content="You are an expert meeting analyst for MinutelyAI. Extract information in clean structured format."),
        HumanMessage(content="From the meeting transcript below, identify every question, issue, or topic that was raised but NOT resolved or decided during the meeting. Write each open question on its own line starting with a dash. These are things the team still needs to figure out. If everything was resolved write: No open questions. Transcript:\n" + state["transcript"])
    ]
    result = llm.invoke(messages)
    return {"open_questions": result.content.strip()}


def format_output(state: MeetingState) -> dict:
    import json
    
    action_items_list = [
        line.strip()
        for line in state["action_items"].split('\n')
        if line.strip() and line.strip() != "No action items identified"
    ]
    
    decisions_list = [
        line.strip().lstrip("- ")
        for line in state["decisions"].split('\n')
        if line.strip() and line.strip() != "No decisions recorded"
    ]
    
    open_questions_list = [
        line.strip().lstrip("- ")
        for line in state["open_questions"].split('\n')
        if line.strip() and line.strip() != "No open questions"
    ]
    
    output = {
        "summary": state["summary"],
        "action_items": action_items_list,
        "decisions": decisions_list,
        "open_questions": open_questions_list,
        "model_used": "DeepSeek V3"
    }
    
    final_json = json.dumps(output, indent=2)
    return {"final_output": final_json}


def build_agent():
    graph = StateGraph(MeetingState)
    
    graph.add_node("summarize", summarize)
    graph.add_node("extract_action_items", extract_action_items)
    graph.add_node("identify_decisions", identify_decisions)
    graph.add_node("find_open_questions", find_open_questions)
    graph.add_node("format_output", format_output)
    
    graph.set_entry_point("summarize")
    
    graph.add_edge("summarize", "extract_action_items")
    graph.add_edge("extract_action_items", "identify_decisions")
    graph.add_edge("identify_decisions", "find_open_questions")
    graph.add_edge("find_open_questions", "format_output")
    graph.add_edge("format_output", END)
    
    return graph.compile()


# Compiled once at module level — reused across all FastAPI requests.
agent = build_agent()

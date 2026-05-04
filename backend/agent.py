"""MinutelyAI — LangGraph agent using Google Gemini 2.0 Flash via Google AI Studio. Free tier: 1,500 requests per day, no credit card needed. Get your key at aistudio.google.com."""

from typing import TypedDict
import os

from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI


class MeetingState(TypedDict):
    transcript: str
    summary: str
    action_items: str
    decisions: str
    open_questions: str
    final_output: str


# Gemini 2.0 Flash — free at 1,500 req/day. Same GOOGLE_API_KEY works locally and on Railway.
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0
)

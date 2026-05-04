from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

from agents.meeting_agent import agent


router = APIRouter()


class AnalyzeRequest(BaseModel):
    transcript: str


class AnalyzeResponse(BaseModel):
    summary: str
    action_items: list[str]
    decisions: list[str]
    open_questions: list[str]
    model_used: str


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_transcript(body: AnalyzeRequest):
    if not body.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript cannot be empty.")
    
    try:
        result = agent.invoke({
            "transcript": body.transcript,
            "summary": "",
            "action_items": "",
            "decisions": "",
            "open_questions": "",
            "final_output": ""
        })
        
        final_output = result.get("final_output", "{}")
        parsed = json.loads(final_output)
        
        return AnalyzeResponse(
            summary=parsed.get("summary", ""),
            action_items=parsed.get("action_items", []),
            decisions=parsed.get("decisions", []),
            open_questions=parsed.get("open_questions", []),
            model_used=parsed.get("model_used", "")
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Agent failed: {str(exc)}")

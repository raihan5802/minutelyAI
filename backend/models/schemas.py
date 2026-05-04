"""MinutelyAI — Pydantic schemas for transcription request and response."""

from pydantic import BaseModel


class TranscriptRequest(BaseModel):
    text: str


class TranscriptResponse(BaseModel):
    transcript: str
    duration_seconds: float = 0.0
    word_count: int

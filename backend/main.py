from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.transcribe import router as transcribe_router
from routers.analyze import router as analyze_router
from routers.notion import router as notion_router

app = FastAPI(
	title="MinutelyAI API",
	description="Transcription and AI analysis API for MinutelyAI — turns meetings into structured summaries",
	version="1.0.0",
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=False,
	allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allow_headers=["*"],
)

app.include_router(transcribe_router, prefix="/api", tags=["transcription"])
app.include_router(analyze_router, prefix="/api", tags=["analysis"])
app.include_router(notion_router, prefix="/api", tags=["notion"])


@app.get("/health")
async def health_check():
	return {"status": "ok", "model": "whisper-tiny", "project": "minutelyai"}

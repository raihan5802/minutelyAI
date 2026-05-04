from fastapi import APIRouter, UploadFile, File, HTTPException
import whisper
import tempfile
import os

from models.schemas import TranscriptResponse, TranscriptRequest


router = APIRouter()

# Loaded once at server startup — tiny model uses ~400MB RAM, ideal for Railway free tier.
model = whisper.load_model("tiny")


@router.post("/transcribe/audio", response_model=TranscriptResponse)
async def transcribe_audio(file: UploadFile = File(...)):
	contents = await file.read()
	if len(contents) > 26214400:
		raise HTTPException(status_code=400, detail="File too large. Maximum size is 25MB.")

	tmp_path = None
	try:
		suffix = os.path.splitext(file.filename or "")[1]
		with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
			tmp_file.write(contents)
			tmp_path = tmp_file.name

		result = model.transcribe(tmp_path)
		os.remove(tmp_path)

		transcript_text = result.get("text", "")
		word_count = len(transcript_text.split())
		segments = result.get("segments") or []
		duration_seconds = float(segments[-1].get("end", 0.0)) if segments else 0.0

		return TranscriptResponse(
			transcript=transcript_text,
			duration_seconds=duration_seconds,
			word_count=word_count,
		)
	except Exception as exc:
		if tmp_path and os.path.exists(tmp_path):
			os.remove(tmp_path)
		raise HTTPException(status_code=500, detail=f"Transcription failed: {str(exc)}")


@router.post("/transcribe/text", response_model=TranscriptResponse)
async def transcribe_text(body: TranscriptRequest):
	word_count = len(body.text.split())
	return TranscriptResponse(
		transcript=body.text,
		duration_seconds=0.0,
		word_count=word_count,
	)

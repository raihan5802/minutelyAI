export interface AnalyzeResponse {
  summary: string;
  action_items: string[];
  decisions: string[];
  open_questions: string[];
  model_used: string;
}

export interface TranscriptResponse {
  transcript: string;
  duration_seconds: number;
  word_count: number;
}

export interface NotionExportResponse {
  page_url: string;
  page_id: string;
}

export async function analyzeTranscript(transcript: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) {
    throw new Error("Failed to analyze transcript.");
  }

  const data = await res.json();
  return data as AnalyzeResponse;
}

export async function uploadAudio(file: File): Promise<TranscriptResponse> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transcribe/audio`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    throw new Error("Failed to transcribe audio.");
  }

  const data = await res.json();
  return data as TranscriptResponse;
}

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";
import { analyzeTranscript, uploadAudio, AnalyzeResponse } from "@/lib/api";

type Props = {
  onResult: (data: AnalyzeResponse) => void;
  onError: (msg: string) => void;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadForm: React.FC<Props> = ({ onResult, onError, setLoading: externalSetLoading }) => {
  const [mode, setMode] = useState<"text" | "audio">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (mode === "text" && text.trim() === "") {
      onError("Please paste a transcript first.");
      return;
    }
    if (mode === "audio" && !file) {
      onError("Please select an audio file.");
      return;
    }

    setLoading(true);
    externalSetLoading?.(true);
    try {
      let analysis: AnalyzeResponse;

      if (mode === "audio") {
        setLoadingStep("Transcribing audio with Whisper...");
        const tr = await uploadAudio(file as File);
        setLoadingStep("Running AI agent...");
        analysis = await analyzeTranscript(tr.transcript);
      } else {
        setLoadingStep("Running AI agent...");
        analysis = await analyzeTranscript(text);
      }

      onResult(analysis);
    } catch (err: any) {
      const msg = err?.message || String(err) || "An unknown error occurred.";
      onError(msg);
    } finally {
      setLoading(false);
      externalSetLoading?.(false);
      setLoadingStep("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === "text" ? undefined : "outline"}
          onClick={() => setMode("text")}
        >
          Text
        </Button>
        <Button
          variant={mode === "audio" ? undefined : "outline"}
          onClick={() => setMode("audio")}
        >
          Audio
        </Button>
      </div>

      {mode === "text" ? (
        <textarea
          className="w-full rounded-md border px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          rows={8}
        />
      ) : (
        <div className="border border-dashed rounded p-4 text-center">
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <input
              type="file"
              accept="audio/*,audio/mpeg,audio/wav,audio/mp4,audio/ogg"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="h-5 w-5" />
              {file ? file.name : "Drop audio file or click to upload"}
            </div>
          </label>
        </div>
      )}

      <div>
        <button
          type="submit"
          className="w-full rounded-md bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{loadingStep || "Processing..."}</span>
            </div>
          ) : (
            "Analyze Meeting"
          )}
        </button>
      </div>
    </form>
  );
};

export default UploadForm;

"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";
import { AnalyzeResponse } from "@/lib/api";
import UploadForm from "@/components/UploadForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import ResultsSkeleton from "@/components/ResultsSkeleton";

export default function Page() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Zap className="h-8 w-8 text-amber-500" />
          MinutelyAI
        </h1>
        <p className="text-muted-foreground mt-2">
          Turn any meeting into action items, decisions, and summaries — instantly.
        </p>
      </header>

      <UploadForm
        onResult={(data) => {
          setResult(data);
          setError(null);
        }}
        onError={(msg) => {
          setError(msg);
          setResult(null);
        }}
        setLoading={setLoading}
      />

      {error && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <hr className="my-8 border-t" />

      {loading ? (
        <ResultsSkeleton />
      ) : result ? (
        <ResultsDisplay data={result} />
      ) : (
        <p className="text-center text-sm text-muted-foreground">Your meeting analysis will appear here.</p>
      )}
    </main>
  );
}

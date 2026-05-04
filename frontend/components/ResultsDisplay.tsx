"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Gavel, HelpCircle, Download } from "lucide-react";
import { AnalyzeResponse } from "@/lib/api";
import ActionItems from "@/components/ActionItems";
import NotionExport from "@/components/NotionExport";

type Props = {
  data: AnalyzeResponse;
};

const ResultsDisplay: React.FC<Props> = ({ data }) => {
  const onDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onDownload}
          aria-label="Download analysis"
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <NotionExport data={data} meetingTitle="Meeting Analysis" />
      </div>

      <div className="border rounded-md bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h3 className="text-sm font-medium">Meeting Summary</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm">{data.summary}</p>
        </div>
      </div>

      <ActionItems items={data.action_items} />

      <div className="border rounded-md bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            <h3 className="text-sm font-medium">Decisions Made</h3>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100">{data.decisions.length}</span>
        </div>
        <div className="p-4">
          {data.decisions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No decisions recorded.</p>
          ) : (
            <ul className="space-y-2 list-none">
              {data.decisions.map((d, i) => (
                <li key={i} className="text-sm">
                  <span className="mr-2">✅</span>
                  {d}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <h3 className="text-sm font-medium">Open Questions</h3>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100">{data.open_questions.length}</span>
        </div>
        <div className="p-4">
          {data.open_questions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open questions.</p>
          ) : (
            <ul className="space-y-2 list-none">
              {data.open_questions.map((q, i) => (
                <li key={i} className="text-sm">
                  <span className="mr-2">❓</span>
                  {q}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">Analyzed by {data.model_used}</div>
    </div>
  );
};

export default ResultsDisplay;

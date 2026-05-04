"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { AnalyzeResponse } from "@/lib/api";

type NotionExportProps = {
  data: AnalyzeResponse;
  meetingTitle?: string;
};

const NotionExport: React.FC<NotionExportProps> = ({
  data,
  meetingTitle = "Meeting Summary",
}) => {
  const [loading, setLoading] = useState(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setExportedUrl(null);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/export/notion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meeting_title: meetingTitle,
          summary: data.summary,
          action_items: data.action_items,
          decisions: data.decisions,
          open_questions: data.open_questions,
        }),
      });

      if (!res.ok) {
        throw new Error("Export failed — check your Notion API key and page permissions.");
      }

      const json = await res.json();
      setExportedUrl(json.page_url);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={handleExport} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Exporting to Notion...
          </>
        ) : (
          <>
            <ExternalLink className="mr-2 h-4 w-4" />
            Export to Notion
          </>
        )}
      </Button>

      {exportedUrl !== null && (
        <div className="flex items-center gap-2 text-sm text-green-600 border border-green-200 rounded-md px-3 py-2 bg-green-50">
          <span>✅</span>
          <span>Exported successfully —</span>
          <a
            href={exportedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            Open in Notion
          </a>
        </div>
      )}

      {error !== null && (
        <div className="text-sm text-red-600 border border-red-200 rounded-md px-3 py-2 bg-red-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default NotionExport;

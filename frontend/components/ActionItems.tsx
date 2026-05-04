import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare } from "lucide-react";

type ActionItemsProps = {
  items: string[];
};

const badgeClass = "inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800";

const ActionItems: React.FC<ActionItemsProps> = ({ items }) => {
  const parsed = items.map((item) => {
    const parts = item.split(" | ");
    const task = parts[0]?.replace(/^TASK:\s*/i, "") || "";
    const owner = parts[1]?.replace(/^OWNER:\s*/i, "") || "";
    const due = parts[2]?.replace(/^DUE:\s*/i, "") || "";
    return { task, owner, due };
  });

  return (
    <div className="border rounded-md bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-sky-600" />
          <h3 className="text-sm font-medium">Action Items</h3>
        </div>
        <span className={badgeClass}>{items.length}</span>
      </div>

      <div className="p-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No action items identified.</p>
        ) : (
          <div className="space-y-3">
            {parsed.map((p, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="font-semibold flex-1">{p.task}</div>
                <span className={badgeClass}>{p.owner}</span>
                <div className="text-sm text-muted-foreground">{p.due}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionItems;

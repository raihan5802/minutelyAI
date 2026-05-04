import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ResultsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse border rounded-md bg-white">
          <div className="p-4">
            <div className="bg-gray-200 rounded w-1/3 h-4 mb-3" />
            <div className="bg-gray-200 rounded h-3 w-full mb-2" />
            <div className="bg-gray-200 rounded h-3 w-full mb-2" />
            <div className="bg-gray-200 rounded h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsSkeleton;

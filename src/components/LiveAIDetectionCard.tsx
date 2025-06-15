
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { LineChart, Target } from "lucide-react";

const LiveAIDetectionCard: React.FC = () => (
  <Card className="bg-violet-800/80 border-0 rounded-xl px-2 py-6 flex flex-col items-center text-center shadow">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-white text-xl">
        <LineChart className="h-6 w-6 text-white" />
        Live AI Detection
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center pt-0">
      <Target className="h-14 w-14 text-pink-300 mx-auto mb-2" />
      <div className="text-slate-50 text-lg font-medium mb-1">
        No emotion detected
      </div>
      <div className="text-slate-300 text-sm">
        Enable auto-detection or capture manually
      </div>
    </CardContent>
  </Card>
);

export default LiveAIDetectionCard;

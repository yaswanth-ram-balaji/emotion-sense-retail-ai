
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { LineChart, Target } from "lucide-react";

interface LiveAIDetectionCardProps {
  // Props for LiveAIDetectionCard are now empty---no backendStatus or model selection here!
}

const LiveAIDetectionCard: React.FC<LiveAIDetectionCardProps> = () => (
  <Card className="bg-violet-800/80 border-0 rounded-xl px-2 py-4 sm:px-2 sm:py-6 flex flex-col items-center text-center shadow relative overflow-visible">
    <CardHeader className="pb-2 mt-2">
      <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg md:text-xl">
        <LineChart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        Live AI Detection
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center pt-0">
      <Target className="h-10 w-10 sm:h-14 sm:w-14 text-pink-300 mx-auto mb-1 sm:mb-2" />
      <div className="text-slate-50 text-sm sm:text-base md:text-lg font-medium mb-0.5 sm:mb-1">
        No emotion detected
      </div>
      <div className="text-slate-300 text-xs sm:text-sm">
        Enable auto-detection or capture manually
      </div>
    </CardContent>
  </Card>
);

export default LiveAIDetectionCard;

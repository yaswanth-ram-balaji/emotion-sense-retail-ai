
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { LineChart, Target } from "lucide-react";

interface LiveAIDetectionCardProps {
  // Props for LiveAIDetectionCard are now empty---no backendStatus or model selection here!
}

const LiveAIDetectionCard: React.FC<LiveAIDetectionCardProps> = () => {
  // Provide a minimal card even if it's just an empty shell for now.
  return (
    <Card className="bg-slate-800/50 border-slate-700 min-h-[50px] shadow-none">
      {/* You can add any visual here or leave empty if no content is needed */}
    </Card>
  );
};

export default LiveAIDetectionCard;


import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { LineChart, Target } from "lucide-react";

interface LiveAIDetectionCardProps {
  // Props for LiveAIDetectionCard are now empty---no backendStatus or model selection here!
}

const LiveAIDetectionCard: React.FC<LiveAIDetectionCardProps> = () => {
  // Provide a minimal card even if it's just an empty shell for now.
  return (
    <Card>
      {/* Empty for now, reserved for future Live AI detection UI */}
    </Card>
  );
};

export default LiveAIDetectionCard;

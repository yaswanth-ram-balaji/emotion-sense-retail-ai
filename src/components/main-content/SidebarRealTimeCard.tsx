
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EmotionLog from "@/components/EmotionLog";

interface SidebarRealTimeCardProps {
  emotionHistory: any[];
}

const SidebarRealTimeCard: React.FC<SidebarRealTimeCardProps> = ({ emotionHistory }) => (
  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base sm:text-lg font-semibold text-slate-200">
        Pulse of the Moment
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EmotionLog data={emotionHistory.slice(0, 10)} />
    </CardContent>
  </Card>
);

export default SidebarRealTimeCard;

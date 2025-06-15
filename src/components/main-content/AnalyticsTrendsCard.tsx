import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EmotionChart from "@/components/EmotionChart";
interface AnalyticsTrendsCardProps {
  emotionHistory: any[];
  autoCapture: boolean;
}
const AnalyticsTrendsCard: React.FC<AnalyticsTrendsCardProps> = ({
  emotionHistory,
  autoCapture
}) => <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base text-slate-200 font-bold sm:text-xl">
        Emotional Waves & Trends
        {!autoCapture && <span className="ml-2 inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium text-fuchsia-600 bg-fuchsia-100">
          Manual Mode
        </span>}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EmotionChart data={emotionHistory} />
    </CardContent>
  </Card>;
export default AnalyticsTrendsCard;
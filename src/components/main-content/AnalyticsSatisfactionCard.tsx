import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
interface AnalyticsSatisfactionCardProps {
  emotionHistory: any[];
  unhappyCount: number;
}
const AnalyticsSatisfactionCard: React.FC<AnalyticsSatisfactionCardProps> = ({
  emotionHistory,
  unhappyCount
}) => <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base text-slate-200 font-bold sm:text-xl">
        Smiles & Satisfaction Barometer
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center">
        <div className="text-5xl font-bold text-green-400">
          {emotionHistory.length > 0 ? Math.round((emotionHistory.length - unhappyCount) / emotionHistory.length * 100) : 0}%
        </div>
        <div className="text-slate-400 mt-2">Satisfied Customers</div>
        <div className="mt-4 text-sm text-slate-300">
          Based on {emotionHistory.length} customer interactions
        </div>
      </div>
    </CardContent>
  </Card>;
export default AnalyticsSatisfactionCard;
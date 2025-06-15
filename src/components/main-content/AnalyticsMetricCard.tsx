import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
interface AnalyticsMetricCardProps {
  emotionHistory: any[];
  unhappyCount: number;
}
const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = ({
  emotionHistory,
  unhappyCount
}) => <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base text-slate-200 font-bold sm:text-xl">
        Joy & Unhappiness Scoreboard
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 text-sm">Happy Customers</span>
            <span className="text-green-400 font-medium">
              {emotionHistory.filter(e => e.emotion === 'happy').length}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{
            width: `${emotionHistory.length > 0 ? emotionHistory.filter(e => e.emotion === 'happy').length / emotionHistory.length * 100 : 0}%`
          }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 text-sm">Unhappy Customers</span>
            <span className="text-red-400 font-medium">{unhappyCount}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{
            width: `${emotionHistory.length > 0 ? unhappyCount / emotionHistory.length * 100 : 0}%`
          }}></div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>;
export default AnalyticsMetricCard;
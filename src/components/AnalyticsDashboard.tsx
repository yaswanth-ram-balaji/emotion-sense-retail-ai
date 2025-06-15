import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmotionChart from "@/components/EmotionChart";
import EmotionHeatmap from "./EmotionHeatmap";

interface AnalyticsDashboardProps {
  emotionHistory: any[];
  unhappyCount: number;
  autoCapture: boolean;
  backendStatus: "connected" | "disconnected" | "checking";
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  emotionHistory,
  unhappyCount,
  autoCapture,
  backendStatus
}) => (
  <div className="space-y-6">
    <EmotionHeatmap emotionHistory={emotionHistory} />
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <BarChart3 className="h-5 w-5" />
          Emotion Trends
          {!autoCapture && (
            <Badge variant="outline" className="ml-2">
              Manual Mode
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmotionChart data={emotionHistory} />
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Users className="h-5 w-5" />
            Customer Satisfaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-400">
              {emotionHistory.length > 0
                ? Math.round(
                    ((emotionHistory.length - unhappyCount) /
                      emotionHistory.length) *
                      100
                  )
                : 0}
              %
            </div>
            <div className="text-slate-400 mt-2">Satisfied Customers</div>
            <div className="mt-4 text-sm text-slate-300">
              Based on {emotionHistory.length} customer interactions
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <TrendingUp className="h-5 w-5" />
            Emotion Metrics
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
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      emotionHistory.length > 0
                        ? (emotionHistory.filter(e => e.emotion === 'happy')
                            .length /
                            emotionHistory.length) *
                          100
                        : 0
                    }%`
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 text-sm">Unhappy Customers</span>
                <span className="text-red-400 font-medium">{unhappyCount}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${
                      emotionHistory.length > 0
                        ? (unhappyCount / emotionHistory.length) * 100
                        : 0
                    }%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AnalyticsDashboard;

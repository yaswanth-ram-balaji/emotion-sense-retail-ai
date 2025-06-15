
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmotionChart from "@/components/EmotionChart";

interface EmotionData {
  timestamp: string;
  emotion: string;
  confidence?: number;
  type: "entry" | "exit";
  emotion_scores?: Record<string, number>;
}

interface AnalyticsDashboardProps {
  emotionHistory: EmotionData[];
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <BarChart3 className="h-5 w-5" />
          Emotion Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmotionChart data={emotionHistory} />
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Users className="h-5 w-5" />
          Session Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Total Analyses</span>
          <Badge variant="secondary">{emotionHistory.length}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Unhappy Exits</span>
          <Badge variant={unhappyCount > 2 ? "destructive" : "secondary"}>
            {unhappyCount}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Auto Detection</span>
          <Badge variant={autoCapture ? "default" : "secondary"}>
            {autoCapture ? "Running" : "Stopped"}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Backend Status</span>
          <Badge variant={backendStatus === "connected" ? "default" : "destructive"}>
            {backendStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AnalyticsDashboard;

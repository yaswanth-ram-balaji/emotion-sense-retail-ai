import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmotionChart from "@/components/EmotionChart";
import EmotionHeatmap from "./EmotionHeatmap";

interface AnalyticsDashboardProps {
  emotionHistory: any[];
  unhappyCount: number;
  autoCapture: boolean;
  backendStatus: "connected" | "disconnected" | "checking";
}

function downloadJSON(data: any[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(data: any[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csvRows = [
    keys.join(","),
    ...data.map(row =>
      keys.map(key => {
        const val = row[key];
        if (typeof val === "object" && val !== null) {
          return '"' + JSON.stringify(val).replace(/"/g, '""') + '"';
        }
        return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(",")
    )
  ];
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  emotionHistory,
  unhappyCount,
  autoCapture,
  backendStatus
}) => (
  <div className="space-y-6">
    {/* Export buttons area at the top */}
    <div className="flex flex-wrap items-center gap-3 justify-end mb-2">
      <button
        className="flex items-center gap-1 px-3 py-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition text-sm shadow"
        title="Export emotion history as CSV"
        onClick={() => downloadCSV(emotionHistory, "emotion-history.csv")}
        disabled={!emotionHistory.length}
      >
        <Download className="w-4 h-4" /> Export CSV
      </button>
      <button
        className="flex items-center gap-1 px-3 py-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition text-sm shadow"
        title="Export emotion history as JSON"
        onClick={() => downloadJSON(emotionHistory, "emotion-history.json")}
        disabled={!emotionHistory.length}
      >
        <Download className="w-4 h-4" /> Export JSON
      </button>
    </div>
    <EmotionHeatmap emotionHistory={emotionHistory} />
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100 text-base sm:text-lg md:text-xl">
          <BarChart3 className="h-5 w-5" />
          Emotion Trends
          {!autoCapture && (
            <span
              className="ml-2 inline-flex items-center rounded-full border border-fuchsia-400 bg-fuchsia-900/10 px-3 py-0.5 text-xs font-semibold text-fuchsia-300 shadow transition hover:bg-fuchsia-800/90 hover:text-white focus:outline-none"
              style={{
                letterSpacing: "0.03em",
                boxShadow: "0 1px 6px 0 #be4bfa33"
              }}
            >
              Manual Mode
            </span>
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

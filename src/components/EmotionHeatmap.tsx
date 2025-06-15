
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
// Removed import for HeatMap
import { ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// Group emotion logs into [hour][emotion] counts for heatmap
function aggregateByHour(emotionHistory) {
  const emotions = ['happy', 'neutral', 'sad', 'angry', 'fear', 'disgust', 'surprise', 'contempt'];
  // Map: {hour: {emotion: count}}
  const hourMap = {};
  for (let i = 0; i < 24; i++) {
    hourMap[i] = {};
    emotions.forEach(e => { hourMap[i][e] = 0; });
  }
  emotionHistory.forEach((log) => {
    const date = new Date(log.timestamp);
    const hour = date.getHours();
    const emotion = log.emotion.toLowerCase();
    if (emotions.includes(emotion)) {
      hourMap[hour][emotion]++;
    }
  });
  // Prepare recharts data: [{ hour: '00', happy: 0, sad: 3, ... }]
  return Object.entries(hourMap).map(([hour, counts]) => ({
    hour: hour.toString().padStart(2, '0'),
    ...counts,
  }));
}

const emotionColors = {
  happy: "#22c55e",
  neutral: "#fbbf24",
  sad: "#2563eb",
  angry: "#ef4444",
  fear: "#c026d3",
  disgust: "#14b8a6",
  surprise: "#eab308",
  contempt: "#64748b"
};

const EmotionHeatmap = ({ emotionHistory }) => {
  const data = useMemo(() => aggregateByHour(emotionHistory), [emotionHistory]);
  const emotions = Object.keys(emotionColors);

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <BarChart3 className="h-5 w-5" />
          Emotion Heatmap (by Hour)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto pb-2">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="text-left pr-2 py-1">Hour</th>
                {emotions.map(e => (
                  <th key={e} className="px-1 py-1 text-center" style={{ color: emotionColors[e] }}>{e.charAt(0).toUpperCase() + e.slice(1)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.hour}>
                  <td className="text-slate-300 pr-2 py-1 font-mono">{row.hour}:00</td>
                  {emotions.map(e => (
                    <td
                      key={e}
                      className="text-center px-1"
                      style={{
                        background: row[e] > 0 ? `${emotionColors[e]}33` : 'transparent',
                        color: row[e] > 2 ? '#fff' : emotionColors[e],
                        borderRadius: '4px',
                        fontWeight: row[e] > 2 ? 'bold' : 'normal'
                      }}
                      title={row[e] > 0 ? `${row[e]} detections` : ''}
                    >
                      {row[e] > 0 ? row[e] : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pt-2 text-slate-400 text-xs">
            Each cell shows the number of detected customer emotions per hour (last 50 sessions).
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionHeatmap;

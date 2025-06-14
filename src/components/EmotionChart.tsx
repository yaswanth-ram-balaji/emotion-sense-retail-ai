
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EmotionData {
  timestamp: string;
  emotion: string;
  confidence?: number;
  type: 'entry' | 'exit';
}

interface EmotionChartProps {
  data: EmotionData[];
}

const EMOTION_COLORS = {
  'Happy': '#22c55e',
  'Sad': '#3b82f6',
  'Angry': '#ef4444',
  'Surprised': '#eab308',
  'Fear': '#8b5cf6',
  'Disgust': '#f97316',
  'Neutral': '#6b7280',
  'Contempt': '#ec4899'
};

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  // Process data for bar chart (emotion frequency)
  const emotionCounts = data.reduce((acc, item) => {
    acc[item.emotion] = (acc[item.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
    color: EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS] || '#6b7280'
  }));

  // Process data for pie chart
  const pieChartData = barChartData.map(item => ({
    name: item.emotion,
    value: item.count,
    color: item.color
  }));

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
        No emotion data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="emotion" 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#f3f4f6'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#f3f4f6'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {pieChartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-300">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionChart;

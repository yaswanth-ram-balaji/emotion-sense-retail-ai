
import React from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EmotionData {
  timestamp: string;
  emotion: string;
  confidence?: number;
  type: 'entry' | 'exit';
}

interface EmotionLogProps {
  data: EmotionData[];
}

const getEmotionEmoji = (emotion: string): string => {
  const normalizedEmotion = emotion.toLowerCase();
  const emojiMap: { [key: string]: string } = {
    'happy': '😊',
    'happiness': '😊',
    'joy': '😊',
    'sad': '😢',
    'sadness': '😢',
    'angry': '😠',
    'anger': '😠',
    'surprised': '😲',
    'surprise': '😲',
    'fear': '😨',
    'fearful': '😨',
    'disgust': '🤢',
    'disgusted': '🤢',
    'neutral': '😐',
    'contempt': '😤',
    'contemptuous': '😤'
  };
  return emojiMap[normalizedEmotion] || '🤔';
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};

const EmotionLog: React.FC<EmotionLogProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No activity recorded</p>
        <p className="text-xs mt-1">Enable auto-detection to see live emotions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {data.map((entry, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
        >
          <div className="flex items-center gap-3">
            <div className="text-lg">
              {getEmotionEmoji(entry.emotion)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-200 font-medium text-sm capitalize">
                  {entry.emotion}
                </span>
                {entry.type === 'entry' ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
              </div>
              <div className="text-xs text-slate-400">
                {formatTime(entry.timestamp)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {entry.confidence && (
              <Badge variant="secondary" className="text-xs">
                {(entry.confidence * 100).toFixed(0)}%
              </Badge>
            )}
            <Badge 
              variant={entry.type === 'entry' ? 'default' : 'outline'}
              className="text-xs"
            >
              {entry.type}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmotionLog;

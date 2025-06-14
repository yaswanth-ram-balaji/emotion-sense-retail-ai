
import React from 'react';
import { Activity, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface EmotionDisplayProps {
  emotion: string;
  confidence: number;
  entryEmotion: string;
  exitEmotion: string;
  satisfactionResult: {
    satisfaction: string;
    delta: string;
  } | null;
}

const getEmotionEmoji = (emotion: string): string => {
  const emojiMap: { [key: string]: string } = {
    'Happy': '😊',
    'Sad': '😢',
    'Angry': '😠',
    'Surprised': '😲',
    'Fear': '😨',
    'Disgust': '🤢',
    'Neutral': '😐',
    'Contempt': '😤'
  };
  return emojiMap[emotion] || '🤔';
};

const getEmotionColor = (emotion: string): string => {
  const colorMap: { [key: string]: string } = {
    'Happy': 'text-green-400',
    'Sad': 'text-blue-400',
    'Angry': 'text-red-400',
    'Surprised': 'text-yellow-400',
    'Fear': 'text-purple-400',
    'Disgust': 'text-orange-400',
    'Neutral': 'text-gray-400',
    'Contempt': 'text-pink-400'
  };
  return colorMap[emotion] || 'text-gray-400';
};

const getSatisfactionColor = (satisfaction: string): string => {
  if (satisfaction.includes('Satisfied')) return 'text-green-400';
  if (satisfaction.includes('Unhappy')) return 'text-red-400';
  return 'text-yellow-400';
};

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({
  emotion,
  confidence,
  entryEmotion,
  exitEmotion,
  satisfactionResult
}) => {
  return (
    <div className="space-y-4">
      {/* Current Emotion */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Activity className="h-5 w-5" />
            Current Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {emotion ? (
            <>
              <div className="text-6xl mb-2">
                {getEmotionEmoji(emotion)}
              </div>
              <div className={`text-2xl font-bold ${getEmotionColor(emotion)}`}>
                {emotion}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-slate-300">{(confidence * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={confidence * 100} 
                  className="h-2 bg-slate-700"
                />
              </div>
            </>
          ) : (
            <div className="py-8 text-slate-400">
              <div className="text-4xl mb-2">🎯</div>
              <p>No emotion detected</p>
              <p className="text-sm">Capture an emotion to begin</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Journey Tracking */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Customer Journey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Entry</div>
              {entryEmotion ? (
                <>
                  <div className="text-2xl">{getEmotionEmoji(entryEmotion)}</div>
                  <div className={`text-sm font-medium ${getEmotionColor(entryEmotion)}`}>
                    {entryEmotion}
                  </div>
                </>
              ) : (
                <div className="text-slate-500 text-sm">Not captured</div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-slate-400" />
            </div>

            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Exit</div>
              {exitEmotion ? (
                <>
                  <div className="text-2xl">{getEmotionEmoji(exitEmotion)}</div>
                  <div className={`text-sm font-medium ${getEmotionColor(exitEmotion)}`}>
                    {exitEmotion}
                  </div>
                </>
              ) : (
                <div className="text-slate-500 text-sm">Not captured</div>
              )}
            </div>
          </div>

          {satisfactionResult && (
            <div className="pt-4 border-t border-slate-600">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {satisfactionResult.satisfaction.includes('Satisfied') ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`font-medium ${getSatisfactionColor(satisfactionResult.satisfaction)}`}>
                    {satisfactionResult.satisfaction}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {satisfactionResult.delta}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionDisplay;

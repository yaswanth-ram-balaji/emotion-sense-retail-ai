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
  emotionScores?: Record<string, number> | null;
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

const getEmotionColor = (emotion: string): string => {
  const normalizedEmotion = emotion.toLowerCase();
  const colorMap: { [key: string]: string } = {
    'happy': 'text-green-400',
    'happiness': 'text-green-400',
    'joy': 'text-green-400',
    'sad': 'text-blue-400',
    'sadness': 'text-blue-400',
    'angry': 'text-red-400',
    'anger': 'text-red-400',
    'surprised': 'text-yellow-400',
    'surprise': 'text-yellow-400',
    'fear': 'text-purple-400',
    'fearful': 'text-purple-400',
    'disgust': 'text-orange-400',
    'disgusted': 'text-orange-400',
    'neutral': 'text-gray-400',
    'contempt': 'text-pink-400',
    'contemptuous': 'text-pink-400'
  };
  return colorMap[normalizedEmotion] || 'text-gray-400';
};

const getSatisfactionColor = (satisfaction: string): string => {
  if (satisfaction.toLowerCase().includes('satisfied')) return 'text-green-400';
  if (satisfaction.toLowerCase().includes('unhappy')) return 'text-red-400';
  return 'text-yellow-400';
};

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({
  emotion,
  confidence,
  entryEmotion,
  exitEmotion,
  satisfactionResult,
  emotionScores
}) => {
  // Helper: sorted scores, highest first
  const sortedScores = emotionScores 
    ? Object.entries(emotionScores)
        .map(([k, v]) => [String(k), Number(v)] as [string, number])
        .sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="space-y-4">
      {/* Current Emotion */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Activity className="h-5 w-5" />
            Live AI Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {emotion ? (
            <>
              <div className="text-6xl mb-2">
                {getEmotionEmoji(emotion)}
              </div>
              <div className={`text-2xl font-bold capitalize ${getEmotionColor(emotion)}`}>
                {emotion}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-slate-300">{(Number(confidence) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={Number(confidence) * 100} 
                  className="h-2 bg-slate-700"
                />
              </div>
              {sortedScores.length > 0 && (
                <div className="pt-2">
                  <div className="text-sm text-slate-400 font-semibold">All emotion scores:</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {sortedScores.map(([em, score]) => (
                      <span
                        key={String(em)}
                        className={`text-xs rounded px-2 py-1 bg-slate-700/50 m-1 ${getEmotionColor(String(em))}`}
                        title={
                          typeof em === 'string'
                            ? em.charAt(0).toUpperCase() + em.slice(1)
                            : String(em)
                        }
                      >
                        {(typeof em === 'string'
                          ? em.charAt(0).toUpperCase() + em.slice(1)
                          : String(em)
                        )}: {Number(score).toFixed(1)}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-slate-400">
              <div className="text-4xl mb-2">🎯</div>
              <p>No emotion detected</p>
              <p className="text-sm">Enable auto-detection or capture manually</p>
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
                  <div className={`text-sm font-medium capitalize ${getEmotionColor(entryEmotion)}`}>
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
                  <div className={`text-sm font-medium capitalize ${getEmotionColor(exitEmotion)}`}>
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
                  {satisfactionResult.satisfaction.toLowerCase().includes('satisfied') ? (
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

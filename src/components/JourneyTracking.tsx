import React from "react";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SatisfactionResult {
  satisfaction: string;
  delta: string;
}

interface JourneyTrackingProps {
  entryEmotion: string;
  exitEmotion: string;
  satisfactionResult: SatisfactionResult | null;
}

// Local helper functions for emotion display
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

const JourneyTracking: React.FC<JourneyTrackingProps> = ({
  entryEmotion,
  exitEmotion,
  satisfactionResult,
}) => {
  return (
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
                {satisfactionResult.satisfaction.toLowerCase().includes("satisfied") ? (
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
  );
};

export default JourneyTracking;

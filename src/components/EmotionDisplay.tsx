import React from 'react';
import CurrentEmotion from './CurrentEmotion';
import JourneyTracking from './JourneyTracking';

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

// Helper functions are still local for prop drilling; in a bigger app, lift up to a utils file.
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
}) => (
  <div className="space-y-4">
    <CurrentEmotion
      emotion={emotion}
      confidence={confidence}
      emotionScores={emotionScores}
      getEmotionEmoji={getEmotionEmoji}
      getEmotionColor={getEmotionColor}
    />
    {/* Removed JourneyTracking from the sidebar */}
  </div>
);

export default EmotionDisplay;

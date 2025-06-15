import React from "react";
import MainHeader from "@/components/MainHeader";
import CameraPanel from "@/components/CameraPanel";
import JourneyTracking from "@/components/JourneyTracking";
import EmotionDisplay from "@/components/EmotionDisplay";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import EmotionHeatmap from "@/components/EmotionHeatmap";
import Sidebar from "@/components/Sidebar";
import EmotionLog from "@/components/EmotionLog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BarChart3, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmotionSense } from '@/hooks/useEmotionSense';

// Helper functions for emotion display and journey tracking
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

const GradientSection = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full mb-8">
    <div className="w-full mx-auto bg-gradient-to-r from-purple-800 via-blue-800 to-indigo-900 p-1 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="bg-slate-950 dark:bg-slate-900 rounded-2xl p-6 hover:bg-slate-900 transition-colors">
        {children}
      </div>
    </div>
  </div>
);

const SidebarSection = ({ children, title, icon }: { children: React.ReactNode; title: string; icon?: React.ReactNode }) => (
  <div className="mb-6">
    <Card className="bg-slate-800/70 border-none shadow-xl rounded-2xl hover:scale-[1.02] transition-transform duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-300">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </div>
);

const Index = () => {
  const emotion = useEmotionSense();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-900 py-8 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <MainHeader
          backendStatus={emotion.backendStatus}
          selectedModel={emotion.selectedModel}
          onModelChange={emotion.setSelectedModel}
          unhappyCount={emotion.unhappyCount}
          useUpload={emotion.useUpload}
          setUseUpload={emotion.setUseUpload}
          faceBlur={emotion.faceBlur}
          setFaceBlur={emotion.setFaceBlur}
          retryBackendConnection={emotion.retryBackendConnection}
        />

        {/* 1. Live AI Emotion Detection */}
        <GradientSection>
          <CameraPanel
            useUpload={emotion.useUpload}
            fullscreen={emotion.fullscreen}
            setFullscreen={emotion.setFullscreen}
            photoUrl={emotion.photoUrl}
            setPhotoUrl={emotion.setPhotoUrl}
            detectEmotionFromPhoto={emotion.detectEmotionFromPhoto}
            isAnalyzing={emotion.isAnalyzing}
            backendStatus={emotion.backendStatus}
            autoCapture={emotion.autoCapture}
            onAutoCaptureChange={emotion.setAutoCapture}
            onAnalyzeEntry={emotion.analyzeEmotion.bind(null, "entry")}
            onAnalyzeExit={emotion.analyzeEmotion.bind(null, "exit")}
            onCompare={emotion.compareSatisfaction}
            onReset={emotion.resetSession}
            entryEmotion={emotion.entryEmotion}
            exitEmotion={emotion.exitEmotion}
            faceBlur={emotion.faceBlur}
            cameraVideoRef={emotion.videoRef}
          />
        </GradientSection>
        {/* 2. Live AI Detection - minimal indicator summary */}
        <GradientSection>
          <EmotionDisplay
            emotion={emotion.currentEmotion}
            confidence={emotion.emotionConfidence}
            entryEmotion={emotion.entryEmotion}
            exitEmotion={emotion.exitEmotion}
            satisfactionResult={emotion.satisfactionResult}
            emotionScores={emotion.currentEmotionScores}
          />
        </GradientSection>
        {/* 3. Customer Journey */}
        <GradientSection>
          <JourneyTracking
            entryEmotion={emotion.entryEmotion}
            exitEmotion={emotion.exitEmotion}
            satisfactionResult={emotion.satisfactionResult}
            getEmotionEmoji={getEmotionEmoji}
            getEmotionColor={getEmotionColor}
            getSatisfactionColor={getSatisfactionColor}
          />
        </GradientSection>
        {/* 4. Emotion Metrics */}
        <GradientSection>
          <AnalyticsDashboard
            emotionHistory={emotion.emotionHistory}
            unhappyCount={emotion.unhappyCount}
            autoCapture={emotion.autoCapture}
            backendStatus={emotion.backendStatus}
          />
        </GradientSection>
        {/* 5. Customer Satisfaction */}
        <GradientSection>
          <SidebarSection title="Customer Satisfaction" icon={<Users className="text-green-400" />}>
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl font-extrabold text-green-400">
                {emotion.emotionHistory.length > 0
                  ? Math.round(
                    ((emotion.emotionHistory.length - emotion.unhappyCount) /
                      emotion.emotionHistory.length) *
                    100
                  )
                  : 0}%
              </div>
              <div className="text-slate-300">Satisfied Customers</div>
              <Button className="mt-2 bg-gradient-to-r from-green-400 to-blue-400 text-white shadow hover:from-green-500 hover:to-blue-500 transition">
                View Details
              </Button>
            </div>
          </SidebarSection>
        </GradientSection>

        {/* Sidebar sections (6-9) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 6. Real-Time Activity */}
          <SidebarSection title="Real-Time Activity" icon={<Clock className="text-blue-300" />}>
            <EmotionLog data={emotion.emotionHistory.slice(0, 10)} />
          </SidebarSection>
          {/* 7. Emotion Trends */}
          <SidebarSection title="Emotion Trends" icon={<BarChart3 className="text-orange-300" />}>
            <AnalyticsDashboard
              emotionHistory={emotion.emotionHistory}
              unhappyCount={emotion.unhappyCount}
              autoCapture={emotion.autoCapture}
              backendStatus={emotion.backendStatus}
            />
          </SidebarSection>
          {/* 8. Emotion Heatmap */}
          <SidebarSection title="Emotion Heatmap" icon={<BarChart3 className="text-pink-400" />}>
            <EmotionHeatmap emotionHistory={emotion.emotionHistory} />
          </SidebarSection>
          {/* 9. AI Insights */}
          <SidebarSection title="AI Insights" icon={<TrendingUp className="text-yellow-400" />}>
            <div className="space-y-2 text-sm text-slate-300">
              <p>• Monitor peak unhappy exit times</p>
              <p>• Consider staff training during high-stress periods</p>
              <p>• Implement immediate follow-up for dissatisfied customers</p>
              <p>• Analyze correlation between wait times and emotions</p>
            </div>
          </SidebarSection>
        </div>
      </div>
    </div>
  );
};

export default Index;

import React from "react";
import { useEmotionSense } from '@/hooks/useEmotionSense';
import MainHeader from "@/components/MainHeader";
import MainContentLayout from "@/components/MainContentLayout";
import CameraPanel from "@/components/CameraPanel";
import JourneyTracking from "@/components/JourneyTracking";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import EmotionDisplay from "@/components/EmotionDisplay";
import Sidebar from "@/components/Sidebar";
import EmotionChart from "@/components/EmotionChart";
import EmotionHeatmap from "@/components/EmotionHeatmap";

// Responsive padding and margin for mobile
const Index = () => {
  const emotion = useEmotionSense();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* 1. Live AI Emotion Detection */}
        <div>
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
        </div>
        {/* 2. Live AI Detection */}
        <div>
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
            onAnalyzeEntry={() => emotion.analyzeEmotion("entry")}
            onAnalyzeExit={() => emotion.analyzeEmotion("exit")}
            onCompare={emotion.compareSatisfaction}
            onReset={emotion.resetSession}
            entryEmotion={emotion.entryEmotion}
            exitEmotion={emotion.exitEmotion}
            faceBlur={emotion.faceBlur}
            cameraVideoRef={emotion.videoRef}
          />
        </div>
        {/* 3. Customer Journey */}
        <div>
          <JourneyTracking
            entryEmotion={emotion.entryEmotion}
            exitEmotion={emotion.exitEmotion}
            satisfactionResult={emotion.satisfactionResult}
            getEmotionEmoji={(emotionStr: string) => {
              // Keep getEmotionEmoji logic in one place
              const normalized = emotionStr?.toLowerCase?.() || "";
              const emojiMap: Record<string, string> = {
                "happy": "😊", "happiness": "😊", "joy": "😊",
                "sad": "😢", "sadness": "😢",
                "angry": "😠", "anger": "😠",
                "surprised": "😲", "surprise": "😲",
                "fear": "😨", "fearful": "😨",
                "disgust": "🤢", "disgusted": "🤢",
                "neutral": "😐",
                "contempt": "😤", "contemptuous": "😤"
              };
              return emojiMap[normalized] || "🤔";
            }}
            getEmotionColor={(emotionStr: string) => {
              // Keep getEmotionColor logic in one place
              const normalized = emotionStr?.toLowerCase?.() || "";
              const colorMap: Record<string, string> = {
                "happy": "text-green-400", "happiness": "text-green-400", "joy": "text-green-400",
                "sad": "text-blue-400", "sadness": "text-blue-400",
                "angry": "text-red-400", "anger": "text-red-400",
                "surprised": "text-yellow-400", "surprise": "text-yellow-400",
                "fear": "text-purple-400", "fearful": "text-purple-400",
                "disgust": "text-orange-400", "disgusted": "text-orange-400",
                "neutral": "text-gray-400",
                "contempt": "text-pink-400", "contemptuous": "text-pink-400"
              };
              return colorMap[normalized] || "text-gray-400";
            }}
            getSatisfactionColor={(s: string) => {
              const sat = s?.toLowerCase?.() || "";
              if (sat.includes('satisfied')) return 'text-green-400';
              if (sat.includes('unhappy')) return 'text-red-400';
              return 'text-yellow-400';
            }}
          />
        </div>
        {/* 4. Emotion Metrics */}
        <div>
          <EmotionDisplay
            emotion={emotion.currentEmotion}
            confidence={emotion.emotionConfidence}
            entryEmotion={emotion.entryEmotion}
            exitEmotion={emotion.exitEmotion}
            satisfactionResult={emotion.satisfactionResult}
            emotionScores={emotion.currentEmotionScores}
          />
        </div>
        {/* 5. Customer Satisfaction */}
        <div>
          <Sidebar
            currentEmotion={emotion.currentEmotion}
            emotionConfidence={emotion.emotionConfidence}
            entryEmotion={emotion.entryEmotion}
            exitEmotion={emotion.exitEmotion}
            satisfactionResult={emotion.satisfactionResult}
            emotionScores={emotion.currentEmotionScores}
            emotionHistory={emotion.emotionHistory}
            ageGuess={emotion.ageGuess}
            genderGuess={emotion.genderGuess}
          />
        </div>
        {/* 6. Real-Time Activity */}
        <div>
          <MainContentLayout
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
            onAnalyzeEntry={() => emotion.analyzeEmotion("entry")}
            onAnalyzeExit={() => emotion.analyzeEmotion("exit")}
            onCompare={emotion.compareSatisfaction}
            onReset={emotion.resetSession}
            entryEmotion={emotion.entryEmotion}
            exitEmotion={emotion.exitEmotion}
            emotionHistory={emotion.emotionHistory}
            unhappyCount={emotion.unhappyCount}
            currentEmotion={emotion.currentEmotion}
            emotionConfidence={emotion.emotionConfidence}
            satisfactionResult={emotion.satisfactionResult}
            emotionScores={emotion.currentEmotionScores}
            faceBlur={emotion.faceBlur}
            ageGuess={emotion.ageGuess}
            genderGuess={emotion.genderGuess}
            cameraVideoRef={emotion.videoRef}
          />
        </div>
        {/* 7. Emotion Trends */}
        <div>
          <EmotionChart data={emotion.emotionHistory} />
        </div>
        {/* 8. Emotion Heatmap */}
        <div>
          <EmotionHeatmap emotionHistory={emotion.emotionHistory} />
        </div>
        {/* 9. AI Insights */}
        <div>
          {/* Use the insights block from Sidebar */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 space-y-2 mt-2">
            <div className="text-lg font-semibold text-slate-100 mb-2">AI Insights</div>
            <div className="text-slate-300 text-sm space-y-1">
              <p>• Monitor peak unhappy exit times</p>
              <p>• Consider staff training during high-stress periods</p>
              <p>• Implement immediate follow-up for dissatisfied customers</p>
              <p>• Analyze correlation between wait times and emotions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

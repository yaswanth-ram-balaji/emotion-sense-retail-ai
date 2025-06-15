
import React from "react";
import { useEmotionSense } from '@/hooks/useEmotionSense';
import AppSidebar from "@/components/AppSidebar";
import MainContentLayout from "@/components/MainContentLayout";

// The new main dashboard layout with glassy sidebar
const Index = () => {
  const emotion = useEmotionSense();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <AppSidebar useUpload={emotion.useUpload} setUseUpload={emotion.setUseUpload} />
      <main className="flex-1 min-h-screen flex flex-col items-stretch p-8 bg-transparent overflow-x-hidden">
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
          cameraVideoRef={emotion.videoRef}
        />
      </main>
    </div>
  );
};

export default Index;

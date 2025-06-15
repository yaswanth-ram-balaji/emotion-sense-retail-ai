import React from "react";
import { useEmotionSense } from '@/hooks/useEmotionSense';
import MainContentLayout from "@/components/MainContentLayout";
import MainHeader from "@/components/MainHeader";

const Index = () => {
  const emotion = useEmotionSense();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
      </div>
    </div>
  );
};

export default Index;

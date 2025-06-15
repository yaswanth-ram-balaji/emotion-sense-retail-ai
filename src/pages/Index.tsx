
import React from "react";
import { useEmotionSense } from '@/hooks/useEmotionSense';
import MainContentLayout from "@/components/MainContentLayout";
import MainHeader from "@/components/MainHeader";

const Index = () => {
  const emotion = useEmotionSense();

  return (
    // Semi-translucent frosted glass wrapper with good padding
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto p-0 sm:p-6 space-y-6 bg-slate-900/70 backdrop-blur-lg rounded-lg shadow-2xl border border-slate-700"
        style={{ boxShadow: "0 6px 24px 0 #1119, 0 1.5px 8px 0 #2a235a55" }}>
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


import React from "react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Sidebar from "@/components/Sidebar";
import CameraPanel from "@/components/CameraPanel";
import EmotionHeatmap from "@/components/EmotionHeatmap";
import EmotionChart from "@/components/EmotionChart";
import JourneyTracking from "@/components/JourneyTracking";

interface MainContentLayoutProps {
  useUpload: boolean;
  fullscreen: boolean;
  setFullscreen: (val: boolean) => void;
  photoUrl: string | null;
  setPhotoUrl: (val: string | null) => void;
  detectEmotionFromPhoto: () => void;
  isAnalyzing: boolean;
  backendStatus: "connected" | "disconnected" | "checking";
  autoCapture: boolean;
  onAutoCaptureChange: (val: boolean) => void;
  onAnalyzeEntry: () => void;
  onAnalyzeExit: () => void;
  onCompare: () => void;
  onReset: () => void;
  entryEmotion: string;
  exitEmotion: string;
  emotionHistory: any[];
  unhappyCount: number;
  currentEmotion: string;
  emotionConfidence: number;
  satisfactionResult: any;
  emotionScores: any;
  faceBlur: boolean;
  ageGuess?: number | null;
  genderGuess?: string | null;
  cameraVideoRef?: React.RefObject<HTMLVideoElement>;
}

// Responsive two-column scrollable dashboard layout, cards in left, metrics in right sidebar
const MainContentLayout: React.FC<MainContentLayoutProps> = ({
  useUpload,
  fullscreen,
  setFullscreen,
  photoUrl,
  setPhotoUrl,
  detectEmotionFromPhoto,
  isAnalyzing,
  backendStatus,
  autoCapture,
  onAutoCaptureChange,
  onAnalyzeEntry,
  onAnalyzeExit,
  onCompare,
  onReset,
  entryEmotion,
  exitEmotion,
  emotionHistory,
  unhappyCount,
  currentEmotion,
  emotionConfidence,
  satisfactionResult,
  emotionScores,
  faceBlur,
  ageGuess,
  genderGuess,
  cameraVideoRef
}) => (
  <div className="flex w-full max-w-7xl mx-auto gap-6 mt-4 md:mb-10 mb-3 px-1">
    {/* Main scrollable vertical modules */}
    <section className="flex flex-col gap-6 flex-1 min-w-0">
      {/* 1. Live AI Emotion Detection */}
      <CameraPanel
        useUpload={useUpload}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
        photoUrl={photoUrl}
        setPhotoUrl={setPhotoUrl}
        detectEmotionFromPhoto={detectEmotionFromPhoto}
        isAnalyzing={isAnalyzing}
        backendStatus={backendStatus}
        autoCapture={autoCapture}
        onAutoCaptureChange={onAutoCaptureChange}
        onAnalyzeEntry={onAnalyzeEntry}
        onAnalyzeExit={onAnalyzeExit}
        onCompare={onCompare}
        onReset={onReset}
        entryEmotion={entryEmotion}
        exitEmotion={exitEmotion}
        faceBlur={faceBlur}
        cameraVideoRef={cameraVideoRef}
      />
      {/* 2. Emotion Heatmap */}
      <EmotionHeatmap emotionHistory={emotionHistory} />
      {/* 3. Emotion Trends (bar and pie) */}
      <EmotionChart data={emotionHistory} />
      {/* 4/5. AnalyticsDashboard for Satisfaction % and Metrics */}
      <AnalyticsDashboard
        emotionHistory={emotionHistory}
        unhappyCount={unhappyCount}
        autoCapture={autoCapture}
        backendStatus={backendStatus}
      />
    </section>
    {/* Sidebar: all right-panel metric cards, sticky on large screens */}
    <aside className="flex flex-col gap-6 w-full md:w-[370px] max-w-[370px] min-w-[320px] md:sticky md:top-4">
      <Sidebar
        currentEmotion={currentEmotion}
        emotionConfidence={emotionConfidence}
        entryEmotion={entryEmotion}
        exitEmotion={exitEmotion}
        satisfactionResult={satisfactionResult}
        emotionScores={emotionScores}
        emotionHistory={emotionHistory}
        ageGuess={ageGuess}
        genderGuess={genderGuess}
      />
      {/* JourneyTracking as separate card for "Customer Journey", matches screenshot */}
      <JourneyTracking
        entryEmotion={entryEmotion}
        exitEmotion={exitEmotion}
        satisfactionResult={satisfactionResult}
      />
    </aside>
  </div>
);

export default MainContentLayout;

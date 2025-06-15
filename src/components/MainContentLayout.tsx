
import React from "react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Sidebar from "@/components/Sidebar";
import CameraPanel from "@/components/CameraPanel";

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
}

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
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
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
      />
      <AnalyticsDashboard
        emotionHistory={emotionHistory}
        unhappyCount={unhappyCount}
        autoCapture={autoCapture}
        backendStatus={backendStatus}
      />
    </div>
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
  </div>
);

export default MainContentLayout;

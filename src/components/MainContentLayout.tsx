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
  cameraVideoRef?: React.RefObject<HTMLVideoElement>;
}

// For easy maintenance, keep the vertical stacking here
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
  <div className="max-w-4xl mx-auto w-full flex flex-col gap-7 py-8">
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

    {/* 2. Emotion Heatmap (Hourly) */}
    <div>
      <h2 className="text-xl font-semibold text-slate-100 mb-2">Emotion Heatmap (Hourly)</h2>
      <AnalyticsDashboard
        emotionHistory={emotionHistory}
        unhappyCount={unhappyCount}
        autoCapture={autoCapture}
        backendStatus={backendStatus}
      />
    </div>

    {/* 3. Emotion Trends */}
    <div>
      <h2 className="text-xl font-semibold text-slate-100 mb-2">Emotion Trends</h2>
      {/* If you have a line chart or similar for trends, add it here.
          Example: <EmotionTrendChart ... /> */}
      {/* Placeholder: */}
      <p className="text-slate-300 bg-slate-800/50 rounded-lg p-6 text-center">[Emotion Trends Chart Placeholder]</p>
    </div>

    {/* 4. Customer Satisfaction */}
    <div>
      <h2 className="text-xl font-semibold text-slate-100 mb-2">Customer Satisfaction</h2>
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

    {/* 5. Emotion Metrics */}
    <div>
      <h2 className="text-xl font-semibold text-slate-100 mb-2">Emotion Metrics</h2>
      {/* If there is a metrics component add here, else placeholder */}
      <p className="text-slate-300 bg-slate-800/50 rounded-lg p-6 text-center">[Emotion Metrics Card Placeholder]</p>
    </div>

    {/* 6. Customer Journey */}
    <div>
      <h2 className="text-xl font-semibold text-slate-100 mb-2">Customer Journey</h2>
      {/* Add customer journey content if available */}
      <p className="text-slate-300 bg-slate-800/50 rounded-lg p-6 text-center">[Customer Journey Placeholder]</p>
    </div>

    {/* 7. Real-Time Activity */}
    <div>
      <h2 className="text-xl font-semibold text-slate-100 mb-2">Real-Time Activity</h2>
      {/* Activity/live log, could use EmotionLog or similar */}
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

    {/* 8. AI Insights */}
    <div>
      <h2 className="text-xl font-semibold text-slate-100 mb-2">AI Insights</h2>
      {/* Add insight content or keep as is */}
      <div className="text-slate-300 bg-slate-800/50 rounded-lg p-6">
        <ul className="list-disc ml-4 space-y-1">
          <li>Monitor peak unhappy exit times</li>
          <li>Consider staff training during high-stress periods</li>
          <li>Implement immediate follow-up for dissatisfied customers</li>
          <li>Analyze correlation between wait times and emotions</li>
        </ul>
      </div>
    </div>
  </div>
);

export default MainContentLayout;

import React from "react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Sidebar from "@/components/Sidebar";
import CameraPanel from "@/components/CameraPanel";
import JourneyTracking from "@/components/JourneyTracking";
import LiveAIDetectionCard from "@/components/LiveAIDetectionCard";

// Extract necessary sections from AnalyticsDashboard and Sidebar for ordering
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EmotionChart from "@/components/EmotionChart";
import EmotionHeatmap from "./EmotionHeatmap";
import EmotionLog from "@/components/EmotionLog";
import { Clock, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CurrentEmotion from "./CurrentEmotion"; // Add this import for using CurrentEmotion

// Import the new refactored mini-section components:
import AnalyticsMetricCard from "@/components/main-content/AnalyticsMetricCard";
import AnalyticsSatisfactionCard from "@/components/main-content/AnalyticsSatisfactionCard";
import SidebarRealTimeCard from "@/components/main-content/SidebarRealTimeCard";
import AnalyticsTrendsCard from "@/components/main-content/AnalyticsTrendsCard";
import AnalyticsHeatmapCard from "@/components/main-content/AnalyticsHeatmapCard";
import SidebarInsightsCard from "@/components/main-content/SidebarInsightsCard";

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
  // --- Add these for model selection state/control ---
  selectedModel: string;
  onModelChange: (val: string) => void;
}

// Mobile order enforced layout
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
  cameraVideoRef,
  selectedModel,
  onModelChange,
}) => {
  // Helper functions for JourneyTracking (matching expected prop types)
  const getEmotionEmoji = (emotion: string): string => {
    const normalized = emotion?.toLowerCase() ?? "";
    const emojiMap: {
      [key: string]: string;
    } = {
      happy: "😊",
      happiness: "😊",
      joy: "😊",
      sad: "😢",
      sadness: "😢",
      angry: "😠",
      anger: "😠",
      surprised: "😲",
      surprise: "😲",
      fear: "😨",
      fearful: "😨",
      disgust: "🤢",
      disgusted: "🤢",
      neutral: "😐",
      contempt: "😤",
      contemptuous: "😤"
    };
    return emojiMap[normalized] || "🤔";
  };
  const getEmotionColor = (emotion: string): string => {
    const normalized = emotion?.toLowerCase() ?? "";
    const colorMap: {
      [key: string]: string;
    } = {
      happy: "text-green-400",
      happiness: "text-green-400",
      joy: "text-green-400",
      sad: "text-blue-400",
      sadness: "text-blue-400",
      angry: "text-red-400",
      anger: "text-red-400",
      surprised: "text-yellow-400",
      surprise: "text-yellow-400",
      fear: "text-purple-400",
      fearful: "text-purple-400",
      disgust: "text-orange-400",
      disgusted: "text-orange-400",
      neutral: "text-gray-400",
      contempt: "text-pink-400",
      contemptuous: "text-pink-400"
    };
    return colorMap[normalized] || "text-gray-400";
  };
  const getSatisfactionColor = (satisfaction: string): string => {
    if (!satisfaction) return "text-gray-400";
    if (satisfaction.toLowerCase().includes("satisfied")) return "text-green-400";
    if (satisfaction.toLowerCase().includes("unhappy")) return "text-red-400";
    return "text-yellow-400";
  };

  // Media query for mobile: max-width 1023px
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;
  if (isMobile) {
    return <div className="flex flex-col gap-5">
      {/* 1. Live AI Emotion Detection WITHOUT backend/model controls */}
      <div>
        <LiveAIDetectionCard />
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
      </div>
      {/* 2. Live AI Detection real-time values */}
      <div className="pt-1">
        <CurrentEmotion emotion={currentEmotion} confidence={emotionConfidence} emotionScores={emotionScores} getEmotionEmoji={getEmotionEmoji} getEmotionColor={getEmotionColor} />
      </div>

      {/* 3. Customer Journey */}
      <div className="pt-1">
        <JourneyTracking entryEmotion={entryEmotion} exitEmotion={exitEmotion} satisfactionResult={satisfactionResult} getEmotionEmoji={getEmotionEmoji} getEmotionColor={getEmotionColor} getSatisfactionColor={getSatisfactionColor} />
      </div>

      {/* 4. Emotion Metrics */}
      <div>
        <AnalyticsMetricCard emotionHistory={emotionHistory} unhappyCount={unhappyCount} />
      </div>

      {/* 5. Customer Satisfaction */}
      <div>
        <AnalyticsSatisfactionCard emotionHistory={emotionHistory} unhappyCount={unhappyCount} />
      </div>

      {/* 6. Real-Time Activity */}
      <div>
        <SidebarRealTimeCard emotionHistory={emotionHistory} />
      </div>

      {/* 7. Emotion Trends */}
      <div>
        <AnalyticsTrendsCard emotionHistory={emotionHistory} autoCapture={autoCapture} />
      </div>

      {/* 8. Emotion Heatmap */}
      <div>
        <AnalyticsHeatmapCard emotionHistory={emotionHistory} />
      </div>

      {/* 9. AI Insights */}
      <div>
        <SidebarInsightsCard />
      </div>
    </div>;
  }

  // Desktop/tablet version
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      {/* 1. Live AI Emotion Detection without props */}
      <LiveAIDetectionCard />
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
      <div className="mt-2 flex items-center gap-2 mb-1">
        
      </div>

      <JourneyTracking entryEmotion={entryEmotion} exitEmotion={exitEmotion} satisfactionResult={satisfactionResult} getEmotionEmoji={getEmotionEmoji} getEmotionColor={getEmotionColor} getSatisfactionColor={getSatisfactionColor} />
      <div className="mt-2 flex items-center gap-2 mb-1">
        
      </div>

      <AnalyticsDashboard emotionHistory={emotionHistory} unhappyCount={unhappyCount} autoCapture={autoCapture} backendStatus={backendStatus} />
      {/* Add unique heading inside the AnalyticsDashboard if needed in that component */}
    </div>
    <Sidebar currentEmotion={currentEmotion} emotionConfidence={emotionConfidence} entryEmotion={entryEmotion} exitEmotion={exitEmotion} satisfactionResult={satisfactionResult} emotionScores={emotionScores} emotionHistory={emotionHistory} ageGuess={ageGuess} genderGuess={genderGuess} />
  </div>;
};

export default MainContentLayout;

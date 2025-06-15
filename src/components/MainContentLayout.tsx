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

// -------- Mini components for card reordering -------- //
const AnalyticsMetricCard = ({
  emotionHistory,
  unhappyCount
}) => <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base sm:text-lg font-semibold text-slate-200">
        Joy & Unhappiness Scoreboard
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 text-sm">Happy Customers</span>
            <span className="text-green-400 font-medium">
              {emotionHistory.filter(e => e.emotion === 'happy').length}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{
            width: `${emotionHistory.length > 0 ? emotionHistory.filter(e => e.emotion === 'happy').length / emotionHistory.length * 100 : 0}%`
          }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 text-sm">Unhappy Customers</span>
            <span className="text-red-400 font-medium">{unhappyCount}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{
            width: `${emotionHistory.length > 0 ? unhappyCount / emotionHistory.length * 100 : 0}%`
          }}></div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>;
const AnalyticsSatisfactionCard = ({
  emotionHistory,
  unhappyCount
}) => <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base sm:text-lg font-semibold text-slate-200">
        Smiles & Satisfaction Barometer
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center">
        <div className="text-5xl font-bold text-green-400">
          {emotionHistory.length > 0 ? Math.round((emotionHistory.length - unhappyCount) / emotionHistory.length * 100) : 0}
          %
        </div>
        <div className="text-slate-400 mt-2">Satisfied Customers</div>
        <div className="mt-4 text-sm text-slate-300">
          Based on {emotionHistory.length} customer interactions
        </div>
      </div>
    </CardContent>
  </Card>;
const SidebarRealTimeCard = ({
  emotionHistory
}) => <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base sm:text-lg font-semibold text-slate-200">
        Pulse of the Moment
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EmotionLog data={emotionHistory.slice(0, 10)} />
    </CardContent>
  </Card>;
const AnalyticsTrendsCard = ({
  emotionHistory,
  autoCapture
}) => <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base sm:text-lg font-semibold text-slate-200">
        Emotional Waves & Trends
        {!autoCapture && <span className="ml-2 inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium text-fuchsia-600 bg-fuchsia-100">
            Manual Mode
          </span>}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EmotionChart data={emotionHistory} />
    </CardContent>
  </Card>;
const AnalyticsHeatmapCard = ({
  emotionHistory
}) =>
// Section heading is inside EmotionHeatmap component
<EmotionHeatmap emotionHistory={emotionHistory} />;
const SidebarInsightsCard = () => <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base sm:text-lg font-semibold text-slate-200">
        Actionable AI Superpowers
      </CardTitle>
    </CardHeader>
    <CardContent className="text-slate-300 text-xs sm:text-sm space-y-2">
      <p>• Monitor peak unhappy exit times</p>
      <p>• Consider staff training during high-stress periods</p>
      <p>• Implement immediate follow-up for dissatisfied customers</p>
      <p>• Analyze correlation between wait times and emotions</p>
    </CardContent>
  </Card>;

// Import the new refactored mini-section components:
import AnalyticsMetricCard from "@/components/main-content/AnalyticsMetricCard";
import AnalyticsSatisfactionCard from "@/components/main-content/AnalyticsSatisfactionCard";
import SidebarRealTimeCard from "@/components/main-content/SidebarRealTimeCard";
import AnalyticsTrendsCard from "@/components/main-content/AnalyticsTrendsCard";
import AnalyticsHeatmapCard from "@/components/main-content/AnalyticsHeatmapCard";
import SidebarInsightsCard from "@/components/main-content/SidebarInsightsCard";

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
  cameraVideoRef
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
    return (
      <div className="flex flex-col gap-5">

        {/* 1. Live AI Emotion Detection */}
        <div>
          <CameraPanel
            useUpload={useUpload} fullscreen={fullscreen} setFullscreen={setFullscreen} photoUrl={photoUrl} setPhotoUrl={setPhotoUrl} detectEmotionFromPhoto={detectEmotionFromPhoto} isAnalyzing={isAnalyzing} backendStatus={backendStatus} autoCapture={autoCapture} onAutoCaptureChange={onAutoCaptureChange} onAnalyzeEntry={onAnalyzeEntry} onAnalyzeExit={onAnalyzeExit} onCompare={onCompare} onReset={onReset} entryEmotion={entryEmotion} exitEmotion={exitEmotion} faceBlur={faceBlur} cameraVideoRef={cameraVideoRef} />
          <div className="mt-2 flex items-center gap-2 mb-1">
            <span className="text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-400 bg-clip-text font-bold text-2xl tracking-tight drop-shadow-lg animate-fade-in">
              <span role="img" aria-label="camera">📷</span> Live AI Detection
            </span>
          </div>
        </div>

        {/* 2. Live AI Detection real-time values */}
        <div className="pt-1">
          <CurrentEmotion
            emotion={currentEmotion} confidence={emotionConfidence} emotionScores={emotionScores} getEmotionEmoji={getEmotionEmoji} getEmotionColor={getEmotionColor} />
          <div className="mt-2 flex items-center gap-2 mb-1">
            <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent uppercase animate-scale-in">
              <span role="img" aria-label="bar-chart">📊</span> Real-Time Mood
            </span>
          </div>
        </div>

        {/* 3. Customer Journey */}
        <div className="pt-1">
          <JourneyTracking
            entryEmotion={entryEmotion} exitEmotion={exitEmotion} satisfactionResult={satisfactionResult} getEmotionEmoji={getEmotionEmoji} getEmotionColor={getEmotionColor} getSatisfactionColor={getSatisfactionColor} />
          <div className="mt-2 flex items-center gap-2 mb-1">
            <span className="text-2xl font-playfair font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-red-400 bg-clip-text text-transparent drop-shadow-glow animate-slide-in-right tracking-tight">
              <span role="img" aria-label="journey">🗺️</span> Customer Journey Map
            </span>
          </div>
        </div>

        {/* 4. Emotion Metrics */}
        <div>
          <AnalyticsMetricCard emotionHistory={emotionHistory} unhappyCount={unhappyCount} />
          <div className="mt-2 flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight text-orange-400 bg-gradient-to-r from-orange-400 via-red-400 to-fuchsia-500 bg-clip-text text-transparent uppercase animate-pulse">
              <span role="img" aria-label="metrics">📈</span> Emotion Metrics
            </span>
          </div>
        </div>

        {/* 5. Customer Satisfaction */}
        <div>
          <AnalyticsSatisfactionCard emotionHistory={emotionHistory} unhappyCount={unhappyCount} />
          <div className="mt-2 flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold font-serif tracking-tight bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent animate-fade-in">
              <span role="img" aria-label="smile">😁</span> Satisfaction Score
            </span>
          </div>
        </div>

        {/* 6. Real-Time Activity */}
        <div>
          <SidebarRealTimeCard emotionHistory={emotionHistory} />
          <div className="mt-2 flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-fuchsia-500 bg-clip-text text-transparent animate-scale-in uppercase">
              <span role="img" aria-label="activity">⏰</span> Real-Time Activity
            </span>
          </div>
        </div>

        {/* 7. Emotion Trends */}
        <div>
          <AnalyticsTrendsCard emotionHistory={emotionHistory} autoCapture={autoCapture} />
          <div className="mt-2 flex items-center gap-2 mb-1">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-200 bg-clip-text text-transparent tracking-tight animate-slide-in-right">
              <span role="img" aria-label="waves">🌊</span> Emotional Trends
            </span>
          </div>
        </div>

        {/* 8. Emotion Heatmap */}
        <div>
          <AnalyticsHeatmapCard emotionHistory={emotionHistory} />
          <div className="mt-2 flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent animate-fade-in uppercase">
              <span role="img" aria-label="fire">🔥</span> Heatmap
            </span>
          </div>
        </div>

        {/* 9. AI Insights */}
        <div>
          <SidebarInsightsCard />
          <div className="mt-2 flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold font-serif bg-gradient-to-r from-blue-400 via-green-400 to-teal-400 bg-clip-text text-transparent drop-shadow-sm animate-scale-in  uppercase">
              <span role="img" aria-label="ai">🤖</span> AI Insights
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Desktop/tablet version
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">

        <CameraPanel
          useUpload={useUpload} fullscreen={fullscreen} setFullscreen={setFullscreen} photoUrl={photoUrl} setPhotoUrl={setPhotoUrl} detectEmotionFromPhoto={detectEmotionFromPhoto} isAnalyzing={isAnalyzing} backendStatus={backendStatus} autoCapture={autoCapture} onAutoCaptureChange={onAutoCaptureChange} onAnalyzeEntry={onAnalyzeEntry} onAnalyzeExit={onAnalyzeExit} onCompare={onCompare} onReset={onReset} entryEmotion={entryEmotion} exitEmotion={exitEmotion} faceBlur={faceBlur} cameraVideoRef={cameraVideoRef} />
        <div className="mt-2 flex items-center gap-2 mb-1">
          <span className="flex items-center gap-2 font-black bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-violet-600 bg-clip-text text-transparent text-3xl drop-shadow-lg animate-scale-in">
            <span role="img" aria-label="camera">📷</span> Live AI Detection
          </span>
        </div>

        <JourneyTracking
          entryEmotion={entryEmotion} exitEmotion={exitEmotion} satisfactionResult={satisfactionResult} getEmotionEmoji={getEmotionEmoji} getEmotionColor={getEmotionColor} getSatisfactionColor={getSatisfactionColor} />
        <div className="mt-2 flex items-center gap-2 mb-1">
          <span className="flex items-center gap-2 bg-gradient-to-r from-yellow-300 via-pink-400 to-red-400 bg-clip-text text-transparent text-3xl font-extrabold tracking-wide drop-shadow-md animate-fade-in">
            <span role="img" aria-label="journey">🗺️</span> Customer Journey Map
          </span>
        </div>

        <AnalyticsDashboard
          emotionHistory={emotionHistory} unhappyCount={unhappyCount} autoCapture={autoCapture} backendStatus={backendStatus} />
        {/* Add unique heading inside the AnalyticsDashboard if needed in that component */}
      </div>
      <Sidebar
        currentEmotion={currentEmotion} emotionConfidence={emotionConfidence} entryEmotion={entryEmotion} exitEmotion={exitEmotion} satisfactionResult={satisfactionResult} emotionScores={emotionScores} emotionHistory={emotionHistory} ageGuess={ageGuess} genderGuess={genderGuess} />
    </div>
  );
};

export default MainContentLayout;

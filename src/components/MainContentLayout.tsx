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
const AnalyticsMetricCard = ({ emotionHistory, unhappyCount }) => (
  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg bg-gradient-to-r from-green-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow font-bold tracking-wider">
        <TrendingUp className="h-5 w-5 text-green-300" />
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
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{
                width: `${
                  emotionHistory.length > 0
                    ? (emotionHistory.filter(e => e.emotion === 'happy')
                        .length /
                        emotionHistory.length) *
                      100
                    : 0
                }%`
              }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 text-sm">Unhappy Customers</span>
            <span className="text-red-400 font-medium">{unhappyCount}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{
                width: `${
                  emotionHistory.length > 0
                    ? (unhappyCount / emotionHistory.length) * 100
                    : 0
                }%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AnalyticsSatisfactionCard = ({ emotionHistory, unhappyCount }) => (
  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg bg-gradient-to-r from-green-500 via-yellow-400 to-pink-500 bg-clip-text text-transparent font-extrabold tracking-widest animate-gradient">
        <Users className="h-5 w-5 text-yellow-300" />
        Smiles & Satisfaction Barometer
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center">
        <div className="text-5xl font-bold text-green-400">
          {emotionHistory.length > 0
            ? Math.round(
                ((emotionHistory.length - unhappyCount) /
                  emotionHistory.length) *
                  100
              )
            : 0}
          %
        </div>
        <div className="text-slate-400 mt-2">Satisfied Customers</div>
        <div className="mt-4 text-sm text-slate-300">
          Based on {emotionHistory.length} customer interactions
        </div>
      </div>
    </CardContent>
  </Card>
);

const SidebarRealTimeCard = ({ emotionHistory }) => (
  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-extrabold bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
        <Clock className="h-5 w-5 text-blue-300" />
        Pulse of the Moment
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EmotionLog data={emotionHistory.slice(0, 10)} />
    </CardContent>
  </Card>
);

const AnalyticsTrendsCard = ({ emotionHistory, autoCapture }) => (
  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-extrabold bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-fuchsia-500 bg-clip-text text-transparent tracking-widest animate-gradient">
        <TrendingUp className="h-5 w-5 text-fuchsia-300" />
        Emotional Waves & Trends
        {!autoCapture && (
          <span
            className="ml-2 inline-flex items-center rounded-full border border-fuchsia-400 bg-fuchsia-900/10 px-3 py-0.5 text-xs font-semibold text-fuchsia-300 shadow transition hover:bg-fuchsia-800/90 hover:text-white focus:outline-none"
            style={{
              letterSpacing: "0.03em",
              boxShadow: "0 1px 6px 0 #be4bfa33"
            }}
          >
            Manual Mode
          </span>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EmotionChart data={emotionHistory} />
    </CardContent>
  </Card>
);

const AnalyticsHeatmapCard = ({ emotionHistory }) => (
  // Section heading is inside EmotionHeatmap component
  <EmotionHeatmap emotionHistory={emotionHistory} />
);

const SidebarInsightsCard = () => (
  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-300 bg-clip-text text-transparent">
        <TrendingUp className="h-5 w-5 text-purple-300" />
        Actionable AI Superpowers
      </CardTitle>
    </CardHeader>
    <CardContent className="text-slate-300 text-xs sm:text-sm space-y-2">
      <p>• Monitor peak unhappy exit times</p>
      <p>• Consider staff training during high-stress periods</p>
      <p>• Implement immediate follow-up for dissatisfied customers</p>
      <p>• Analyze correlation between wait times and emotions</p>
    </CardContent>
  </Card>
);

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
    const emojiMap: { [key: string]: string } = {
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
    const colorMap: { [key: string]: string } = {
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
        {/* 1. Live AI Emotion Detection (Camera Panel header zone + status) */}
        <div>
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

        {/* 2. Live AI Detection */}
        <div className="pt-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-fuchsia-400 via-green-300 to-fuchsia-400 bg-clip-text text-transparent tracking-wide animate-gradient">
              <span className="inline-block animate-bounce">✨</span>
              Live AI Detection
              <span className="inline-block animate-bounce">✨</span>
            </span>
          </div>
          <CurrentEmotion
            emotion={currentEmotion}
            confidence={emotionConfidence}
            emotionScores={emotionScores}
            getEmotionEmoji={getEmotionEmoji}
            getEmotionColor={getEmotionColor}
          />
        </div>

        {/* 3. Customer Journey */}
        <div className="pt-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-yellow-400 via-green-300 to-fuchsia-400 bg-clip-text text-transparent mb-2 tracking-wider animate-gradient">
              <TrendingUp className="h-5 w-5 text-yellow-300" />
              Customer Journey Map
            </span>
          </div>
          <JourneyTracking
            entryEmotion={entryEmotion}
            exitEmotion={exitEmotion}
            satisfactionResult={satisfactionResult}
            getEmotionEmoji={getEmotionEmoji}
            getEmotionColor={getEmotionColor}
            getSatisfactionColor={getSatisfactionColor}
          />
        </div>

        {/* 4. Emotion Metrics */}
        <AnalyticsMetricCard
          emotionHistory={emotionHistory}
          unhappyCount={unhappyCount}
        />

        {/* 5. Customer Satisfaction */}
        <AnalyticsSatisfactionCard
          emotionHistory={emotionHistory}
          unhappyCount={unhappyCount}
        />

        {/* 6. Real-Time Activity */}
        <SidebarRealTimeCard emotionHistory={emotionHistory} />

        {/* 7. Emotion Trends */}
        <AnalyticsTrendsCard
          emotionHistory={emotionHistory}
          autoCapture={autoCapture}
        />

        {/* 8. Emotion Heatmap */}
        <AnalyticsHeatmapCard emotionHistory={emotionHistory} />

        {/* 9. AI Insights */}
        <SidebarInsightsCard />
      </div>
    );
  }

  // Updated desktop/tablet grid layout: Live AI Detection above Customer Journey
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <span className="flex items-center text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-fuchsia-400 via-green-300 to-fuchsia-400 bg-clip-text text-transparent mb-2 tracking-wider animate-gradient">
            <span className="inline-block animate-bounce">✨</span>
            Live AI Detection
          </span>
        </div>
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
        {/* Live AI Detection on desktop/tablet just like mobile */}
        <LiveAIDetectionCard />
        {/* Customer Journey immediately after Live AI Detection */}
        <div>
          <span className="flex items-center text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-green-300 to-fuchsia-400 bg-clip-text text-transparent mb-2 tracking-wider animate-gradient">
            <TrendingUp className="h-5 w-5 text-yellow-300" />
            Customer Journey Map
          </span>
        </div>
        <JourneyTracking
          entryEmotion={entryEmotion}
          exitEmotion={exitEmotion}
          satisfactionResult={satisfactionResult}
          getEmotionEmoji={getEmotionEmoji}
          getEmotionColor={getEmotionColor}
          getSatisfactionColor={getSatisfactionColor}
        />
        {/* AnalyticsDashboard (remaining card group) */}
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
};

export default MainContentLayout;

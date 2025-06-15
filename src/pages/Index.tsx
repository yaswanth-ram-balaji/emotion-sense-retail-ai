
import React from "react";
import MainHeader from "@/components/MainHeader";
import CameraPanel from "@/components/CameraPanel";
import JourneyTracking from "@/components/JourneyTracking";
import EmotionDisplay from "@/components/EmotionDisplay";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import EmotionHeatmap from "@/components/EmotionHeatmap";
import EmotionLog from "@/components/EmotionLog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BarChart3, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmotionSense } from '@/hooks/useEmotionSense';

// Sidebar cards as dedicated component for tidiness
const Sidebar = ({ emotion, confidence, entryEmotion, exitEmotion, satisfactionResult, emotionScores, emotionHistory }) => (
  <aside className="lg:sticky lg:top-6 flex flex-col gap-4 w-full">
    {/* Live Detection */}
    <Card className="bg-[#351c63]/90 border-none">
      <CardHeader>
        <CardTitle className="text-slate-50 text-xl">Live AI Detection</CardTitle>
      </CardHeader>
      <CardContent>
        <EmotionDisplay
          emotion={emotion}
          confidence={confidence}
          entryEmotion={entryEmotion}
          exitEmotion={exitEmotion}
          satisfactionResult={satisfactionResult}
          emotionScores={emotionScores}
        />
      </CardContent>
    </Card>
    {/* Customer Journey */}
    <Card className="bg-[#3a2170]/90 border-none">
      <CardHeader>
        <CardTitle className="text-slate-50 text-xl">Customer Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <JourneyTracking
          entryEmotion={entryEmotion}
          exitEmotion={exitEmotion}
          satisfactionResult={satisfactionResult}
        />
      </CardContent>
    </Card>
    {/* Real-Time Activity */}
    <Card className="bg-[#442485]/90 border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100 text-base">
          <Clock className="h-5 w-5 text-slate-300" />
          Real-Time Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmotionLog data={emotionHistory.slice(0, 10)} />
      </CardContent>
    </Card>
    {/* AI Insights */}
    <Card className="bg-[#544093]/90 border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100 text-base">
          <TrendingUp className="h-5 w-5 text-yellow-400" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-200 text-sm space-y-1">
        <p>• Monitor peak unhappy exit times</p>
        <p>• Consider staff training during high-stress periods</p>
        <p>• Implement immediate follow-up for dissatisfied customers</p>
        <p>• Analyze correlation between wait times and emotions</p>
      </CardContent>
    </Card>
  </aside>
);

const Index = () => {
  const emotion = useEmotionSense();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#390F6B] via-[#4B2279] to-[#2E1855] py-0 px-0">
      {/* Header */}
      <div className="w-full bg-[#480874] flex flex-col px-0">
        {/* Top info bar */}
        <div className="flex justify-between items-center px-6 py-2 border-b border-purple-700">
          <div className="flex gap-3 items-center text-xs text-[#cebcff]">
            <span className="font-bold">🟢 Your FastAPI detection backend for Customer Experience Measurement is connected</span>
          </div>
          <div className="flex gap-2 text-white items-center">
            <span className="bg-[#241E59] px-2 py-1.5 rounded text-xs font-bold">17</span>
            <span className="ml-2 text-xs">User: /company/email</span>
          </div>
        </div>
        {/* Main title + Model Selector */}
        <div className="flex flex-col lg:flex-row w-full justify-between items-center py-5 px-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-extrabold text-white">Retail EmotionSense</h1>
            <p className="text-md text-purple-200 mt-2">
              Real-Time AI Emotion Tracking for Enhanced Customer Experience
            </p>
          </div>
          <div className="mt-3 lg:mt-0 flex gap-3 items-center">
            <span className="text-purple-200 text-sm font-semibold">Model:</span>
            <select
              value={emotion.selectedModel}
              onChange={e => emotion.setSelectedModel(e.target.value)}
              className="bg-[#30195c] border border-purple-400 text-white px-4 py-2 rounded focus:outline-none"
              style={{ minWidth: 140 }}
            >
              <option value="deepface">DeepFace</option>
              <option value="huggingface">FER+ (HuggingFace)</option>
            </select>
          </div>
        </div>
      </div>
      {/* Main area */}
      <div className="max-w-7xl mx-auto py-4 px-2 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT MAIN - cards and charts */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Live AI Detection Card */}
          <div className="rounded-xl bg-[#351c63] shadow-xl border-purple-900/60 border p-0">
            <div className="flex items-center justify-between px-6 pt-5">
              <span className="font-semibold text-white text-lg">Live AI Emotion Detection</span>
              <span className="ml-2 px-2 py-1 bg-green-600 rounded text-xs font-bold text-white">
                Camera Live
              </span>
            </div>
            <div className="p-6 flex flex-col">
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
                onAnalyzeEntry={emotion.analyzeEmotion.bind(null, "entry")}
                onAnalyzeExit={emotion.analyzeEmotion.bind(null, "exit")}
                onCompare={emotion.compareSatisfaction}
                onReset={emotion.resetSession}
                entryEmotion={emotion.entryEmotion}
                exitEmotion={emotion.exitEmotion}
                faceBlur={emotion.faceBlur}
                cameraVideoRef={emotion.videoRef}
              />
            </div>
          </div>
          {/* Emotion Heatmap */}
          <div className="rounded-xl bg-[#372a72] border-purple-900/60 border shadow-xl p-0">
            <div className="px-6 pt-5 pb-0">
              <span className="font-semibold text-white text-lg">Emotion Heatmap (by Hour)</span>
            </div>
            <div className="p-6 pb-6">
              <EmotionHeatmap emotionHistory={emotion.emotionHistory} />
            </div>
          </div>
          {/* Trends & Satisfaction row */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Emotion Trends */}
            <div className="flex-1 rounded-xl bg-[#233664] border-purple-900/60 border shadow-xl p-0">
              <div className="px-6 pt-5 pb-0">
                <span className="font-semibold text-white text-lg">Emotion Trends</span>
              </div>
              <div className="p-6 pb-6">
                <AnalyticsDashboard
                  emotionHistory={emotion.emotionHistory}
                  unhappyCount={emotion.unhappyCount}
                  autoCapture={emotion.autoCapture}
                  backendStatus={emotion.backendStatus}
                />
              </div>
            </div>
            {/* Customer Satisfaction and Metrics */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="rounded-xl bg-[#27405d] border-purple-900/60 border shadow-xl flex flex-col justify-center items-center p-0">
                <div className="pt-6 text-5xl font-extrabold text-green-400">
                  {emotion.emotionHistory.length > 0
                    ? `${Math.round(
                        ((emotion.emotionHistory.length - emotion.unhappyCount) /
                          emotion.emotionHistory.length) *
                          100
                      )}%`
                    : "0%"}
                </div>
                <div className="text-slate-300 font-semibold text-lg text-center mb-4">
                  Satisfied Customers
                </div>
              </div>
              <div className="rounded-xl bg-[#27405d] border-purple-900/60 border shadow-xl flex flex-col justify-center items-center p-4">
                <div className="text-slate-300 font-semibold text-lg text-center mb-3">Emotion Metrics</div>
                <div className="w-full">
                  {/* Simple metric bar, approximate based on image */}
                  <div className="flex justify-between text-xs text-purple-200 mb-1">
                    <span>Happy Customers</span>
                    <span>{emotion.emotionHistory.filter(e => e.emotion === "happy").length}</span>
                  </div>
                  <div className="w-full h-2 rounded bg-purple-900 mb-2">
                    <div className="h-2 rounded bg-green-400"
                      style={{ width: `${(emotion.emotionHistory.filter(e => e.emotion === "happy").length / (emotion.emotionHistory.length || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-purple-200 mb-1">
                    <span>Unhappy Customers</span>
                    <span>{emotion.unhappyCount}</span>
                  </div>
                  <div className="w-full h-2 rounded bg-purple-900">
                    <div className="h-2 rounded bg-red-400"
                      style={{ width: `${(emotion.unhappyCount / (emotion.emotionHistory.length || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT SIDEBAR */}
        <div className="md:col-span-1 sticky top-5 h-fit">
          {/* Sidebar Sections */}
          <div className="flex flex-col gap-5">
            {/* Live AI Detection */}
            <div className="rounded-xl bg-[#351c63] shadow-xl border-purple-900/60 border p-0">
              <div className="flex items-center px-6 pt-5 pb-1">
                <span className="font-semibold text-white text-base">Live AI Detection</span>
              </div>
              <div className="p-6 pt-2">
                <EmotionDisplay
                  emotion={emotion.currentEmotion}
                  confidence={emotion.emotionConfidence}
                  entryEmotion={emotion.entryEmotion}
                  exitEmotion={emotion.exitEmotion}
                  satisfactionResult={emotion.satisfactionResult}
                  emotionScores={emotion.currentEmotionScores}
                />
              </div>
            </div>
            {/* Customer Journey */}
            <div className="rounded-xl bg-[#3a2170] shadow-xl border-purple-900/60 border p-0">
              <div className="flex items-center px-6 pt-5 pb-1">
                <span className="font-semibold text-white text-base">Customer Journey</span>
              </div>
              <div className="p-6 pt-2">
                <JourneyTracking
                  entryEmotion={emotion.entryEmotion}
                  exitEmotion={emotion.exitEmotion}
                  satisfactionResult={emotion.satisfactionResult}
                />
              </div>
            </div>
            {/* Real-Time Activity */}
            <div className="rounded-xl bg-[#442485] shadow-xl border-purple-900/60 border p-0">
              <div className="flex items-center px-6 pt-5 pb-1">
                <span className="font-semibold text-white text-base">Real-Time Activity</span>
              </div>
              <div className="p-6 pt-2">
                <EmotionLog data={emotion.emotionHistory.slice(0, 10)} />
              </div>
            </div>
            {/* AI Insights */}
            <div className="rounded-xl bg-[#544093] shadow-xl border-purple-900/60 border p-0">
              <div className="flex items-center px-6 pt-5 pb-1">
                <span className="font-semibold text-white text-base">AI Insights</span>
              </div>
              <div className="p-6 pt-2 text-purple-200 text-sm space-y-1">
                <p>• Monitor peak unhappy exit times</p>
                <p>• Consider staff training during high-stress periods</p>
                <p>• Implement immediate follow-up for dissatisfied customers</p>
                <p>• Analyze correlation between wait times and emotions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;


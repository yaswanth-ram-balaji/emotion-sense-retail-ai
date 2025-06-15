
import React from "react";
import { useEmotionSense } from "@/hooks/useEmotionSense";
import EmotionDisplay from "@/components/EmotionDisplay";
import JourneyTracking from "@/components/JourneyTracking";
import EmotionLog from "@/components/EmotionLog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Index = () => {
  const emotion = useEmotionSense();

  // Main satisfaction % calculation
  const customerCount = emotion.emotionHistory.length;
  const unhappyCount = emotion.unhappyCount;
  const satisfiedPct =
    customerCount > 0
      ? Math.round(((customerCount - unhappyCount) / customerCount) * 100)
      : 0;

  return (
    <div className="w-full min-h-screen py-0 px-0 bg-gradient-to-br from-[#390F6B] via-[#4B2279] to-[#2E1855]">
      {/* Header Section */}
      <header className="w-full px-0 py-4 bg-[#480874] flex flex-col md:flex-row items-center justify-between border-b border-purple-700">
        <div className="px-6 py-2 flex items-center gap-3 text-xs text-purple-200 w-full">
          <span className="text-lg font-extrabold text-white tracking-tight">Retail EmotionSense</span>
          <span className="bg-[#241E59] mx-4 px-2 py-1 rounded text-xs font-bold">17</span>
          <span className="ml-2 text-xs">User: /company/email</span>
          <span className="flex-1"></span>
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
      </header>
      {/* Main 2-Column Layout */}
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT: Main metrics/panels */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Main Detection Panel */}
          <Card className="rounded-2xl bg-[#2F1A4E] border-none shadow-lg p-0">
            <CardHeader>
              <CardTitle className="text-white font-bold text-xl flex items-center gap-2">
                Live AI Detection
                <span className="ml-4 px-2 py-1 bg-green-600 rounded text-xs font-bold text-white">Camera Live</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Just the emotion display as in your image */}
              <EmotionDisplay
                emotion={emotion.currentEmotion}
                confidence={emotion.emotionConfidence}
                entryEmotion={emotion.entryEmotion}
                exitEmotion={emotion.exitEmotion}
                satisfactionResult={emotion.satisfactionResult}
                emotionScores={emotion.currentEmotionScores}
              />
            </CardContent>
          </Card>
          {/* Satisfied Customers Card & Emotion Metrics Row */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Satisfied Customers */}
            <Card className="flex-1 flex flex-col justify-center items-center bg-[#3a2170] border-none rounded-2xl shadow-lg p-0">
              <div className="pt-7 text-5xl font-extrabold text-green-400">
                {`${satisfiedPct}%`}
              </div>
              <div className="pb-6 text-slate-200 font-bold text-lg text-center">Satisfied Customers</div>
            </Card>
            {/* Emotion Metrics */}
            <Card className="flex-1 bg-[#442485] border-none rounded-2xl shadow-lg p-0">
              <div className="pt-6 text-slate-200 font-bold text-lg text-center">
                Emotion Metrics
              </div>
              <div className="px-6 pb-6 pt-3">
                <div className="flex justify-between items-center text-xs text-purple-100 mb-1 mt-2">
                  <span>Happy Customers</span>
                  <span className="text-green-300 font-bold">{emotion.emotionHistory.filter(e => e.emotion === "happy").length}</span>
                </div>
                <div className="w-full h-2 rounded bg-purple-900 mb-3">
                  <div className="h-2 rounded bg-green-400"
                    style={{ width: `${(emotion.emotionHistory.filter(e => e.emotion === "happy").length / (emotion.emotionHistory.length || 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-purple-100 mb-1">
                  <span>Unhappy Customers</span>
                  <span className="text-red-300 font-bold">{unhappyCount}</span>
                </div>
                <div className="w-full h-2 rounded bg-purple-900">
                  <div className="h-2 rounded bg-red-400"
                    style={{ width: `${(unhappyCount / (emotion.emotionHistory.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        {/* RIGHT SIDEBAR */}
        <aside className="md:col-span-1 flex flex-col gap-8">
          {/* Customer Journey Card */}
          <Card className="rounded-2xl bg-[#3c236c] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-white font-semibold text-lg">Customer Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <JourneyTracking
                entryEmotion={emotion.entryEmotion}
                exitEmotion={emotion.exitEmotion}
                satisfactionResult={emotion.satisfactionResult}
              />
            </CardContent>
          </Card>
          {/* Real-Time Activity */}
          <Card className="rounded-2xl bg-[#442485] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-white font-semibold text-lg">Real-Time Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionLog data={emotion.emotionHistory.slice(0, 10)} />
            </CardContent>
          </Card>
          {/* AI Insights */}
          <Card className="rounded-2xl bg-[#544093] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-white font-semibold text-lg">AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 text-sm space-y-2">
              <p>• Monitor peak unhappy exit times</p>
              <p>• Consider staff training during high-stress periods</p>
              <p>• Implement immediate follow-up for dissatisfied customers</p>
              <p>• Analyze correlation between wait times and emotions</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Index;

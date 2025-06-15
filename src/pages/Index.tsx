
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
    <div className="min-h-screen bg-gradient-to-br from-[#401a72] via-[#311959] to-[#33275d] py-8 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content (2/3) */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          {/* Header */}
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
          {/* Camera panel */}
          <Card className="bg-[#352050]/80 border-none">
            <CardHeader>
              <CardTitle className="text-slate-100 text-xl">Live AI Emotion Detection</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          {/* Emotion Heatmap */}
          <Card className="bg-[#372a72]/90 border-none">
            <CardHeader>
              <CardTitle className="text-slate-50 text-xl">Emotion Heatmap (by Hour)</CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionHeatmap emotionHistory={emotion.emotionHistory} />
            </CardContent>
          </Card>
          {/* Trends & Satisfaction row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Emotion Trends */}
            <Card className="bg-[#233664]/90 border-none">
              <CardHeader>
                <CardTitle className="text-slate-50 text-xl">Emotion Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard
                  emotionHistory={emotion.emotionHistory}
                  unhappyCount={emotion.unhappyCount}
                  autoCapture={emotion.autoCapture}
                  backendStatus={emotion.backendStatus}
                />
              </CardContent>
            </Card>
            {/* Satisfaction Summary */}
            <Card className="bg-[#27405d]/90 border-none flex flex-col justify-center items-center">
              <CardHeader>
                <CardTitle className="text-green-400 text-4xl text-center font-extrabold">
                  {emotion.emotionHistory.length > 0
                    ? `${Math.round(
                      ((emotion.emotionHistory.length - emotion.unhappyCount) /
                        emotion.emotionHistory.length) *
                      100
                    )}%`
                    : "0%"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-300 font-semibold text-lg text-center mb-4">Customer Satisfaction</div>
                <Button className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white shadow hover:from-green-500 hover:to-blue-500 transition">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Sidebar (1/3) */}
        <div className="col-span-1 w-full">
          <Sidebar
            emotion={emotion.currentEmotion}
            confidence={emotion.emotionConfidence}
            entryEmotion={emotion.entryEmotion}
            exitEmotion={emotion.exitEmotion}
            satisfactionResult={emotion.satisfactionResult}
            emotionScores={emotion.currentEmotionScores}
            emotionHistory={emotion.emotionHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

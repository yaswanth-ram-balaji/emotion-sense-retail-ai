import React from "react";
import EmotionDisplay from "@/components/EmotionDisplay";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp } from "lucide-react";
import EmotionLog from "@/components/EmotionLog";

interface EmotionData {
  timestamp: string;
  emotion: string;
  confidence?: number;
  type: "entry" | "exit";
  emotion_scores?: Record<string, number>;
}

interface SatisfactionResult {
  satisfaction: string;
  delta: string;
}

interface SidebarProps {
  currentEmotion: string;
  emotionConfidence: number;
  entryEmotion: string;
  exitEmotion: string;
  satisfactionResult: SatisfactionResult | null;
  emotionScores?: Record<string, number> | null;
  emotionHistory: EmotionData[];
  ageGuess?: number | null;
  genderGuess?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentEmotion,
  emotionConfidence,
  entryEmotion,
  exitEmotion,
  satisfactionResult,
  emotionScores,
  emotionHistory,
  ageGuess,
  genderGuess
}) => (
  <div className="space-y-4">
    <EmotionDisplay
      emotion={currentEmotion}
      confidence={emotionConfidence}
      entryEmotion={entryEmotion}
      exitEmotion={exitEmotion}
      satisfactionResult={satisfactionResult}
      emotionScores={emotionScores}
    />
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Clock className="h-5 w-5" />
          Real-Time Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmotionLog data={emotionHistory.slice(0, 10)} />
      </CardContent>
    </Card>
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <TrendingUp className="h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 text-sm space-y-2">
        <p>• Monitor peak unhappy exit times</p>
        <p>• Consider staff training during high-stress periods</p>
        <p>• Implement immediate follow-up for dissatisfied customers</p>
        <p>• Analyze correlation between wait times and emotions</p>
      </CardContent>
    </Card>
    {/* Demographic Estimation */}
    <div className="bg-slate-800/60 rounded-lg px-4 py-3 border border-slate-600 space-y-1">
      <div className="text-slate-400 text-xs mb-1 font-semibold tracking-wide uppercase">
        Demographic Estimation
      </div>
      <div className="flex items-center gap-3 text-base">
        <div className="flex flex-col text-slate-200">
          <span>Age:</span>
          <span className="font-semibold text-lg">
            {ageGuess !== undefined && ageGuess !== null
              ? ageGuess
              : <span className="text-slate-500 italic">–</span>}
          </span>
        </div>
        <div className="flex flex-col text-slate-200 ml-6">
          <span>Gender:</span>
          <span className="font-semibold text-lg">
            {genderGuess
              ? genderGuess
              : <span className="text-slate-500 italic">–</span>}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default Sidebar;

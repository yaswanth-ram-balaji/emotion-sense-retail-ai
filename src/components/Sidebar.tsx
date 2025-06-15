
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
}) => {
  // LOG the incoming props for debugging
  console.log("Sidebar received ageGuess:", ageGuess, "genderGuess:", genderGuess);
  return (
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
          <CardTitle className="flex items-center gap-2 text-slate-100 text-base sm:text-lg"> {/* was text-slate-100 */}
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
          <CardTitle className="flex items-center gap-2 text-slate-100 text-base sm:text-lg">
            <TrendingUp className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 text-xs sm:text-sm space-y-2">
          <p>• Monitor peak unhappy exit times</p>
          <p>• Consider staff training during high-stress periods</p>
          <p>• Implement immediate follow-up for dissatisfied customers</p>
          <p>• Analyze correlation between wait times and emotions</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;

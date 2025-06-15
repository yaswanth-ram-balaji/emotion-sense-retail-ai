import React from "react";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
interface CurrentEmotionProps {
  emotion: string;
  confidence: number;
  emotionScores?: Record<string, number> | null;
  getEmotionEmoji: (emotion: string) => string;
  getEmotionColor: (emotion: string) => string;
}
const CurrentEmotion: React.FC<CurrentEmotionProps> = ({
  emotion,
  confidence,
  emotionScores,
  getEmotionEmoji,
  getEmotionColor
}) => {
  const sortedScores = emotionScores ? Object.entries(emotionScores).map(([k, v]) => [String(k), Number(v)] as [string, number]).sort((a, b) => b[1] - a[1]) : [];
  return <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100 text-base sm:text-lg font-bold md:text-xl">
          <Activity className="h-5 w-5" />
          Live AI Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {emotion ? <>
            <div className="text-4xl sm:text-5xl mb-2">{getEmotionEmoji(emotion)}</div>
            <div className={`text-lg sm:text-2xl font-bold capitalize ${getEmotionColor(emotion)}`}>
              {emotion}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">Confidence</span>
                <span className="text-slate-300">{(Number(confidence) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={Number(confidence) * 100} className="h-2 bg-slate-700" />
            </div>
            {sortedScores.length > 0 && <div className="pt-2">
                <div className="text-xs sm:text-sm text-slate-400 font-semibold">All emotion scores:</div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {sortedScores.map(([em, score]) => <span key={String(em)} className={`text-xs rounded px-2 py-1 bg-slate-700/50 m-1 ${getEmotionColor(String(em))}`} title={typeof em === "string" ? em.charAt(0).toUpperCase() + em.slice(1) : String(em)}>
                      {typeof em === "string" ? em.charAt(0).toUpperCase() + em.slice(1) : String(em)}
                      : {Number(score).toFixed(1)}%
                    </span>)}
                </div>
              </div>}
          </> : <div className="py-8 text-slate-400">
            <div className="text-3xl sm:text-4xl mb-2">🎯</div>
            <p>No emotion detected</p>
            <p className="text-xs sm:text-sm">Enable auto-detection or capture manually</p>
          </div>}
      </CardContent>
    </Card>;
};
export default CurrentEmotion;
import React from "react";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface SatisfactionResult {
  satisfaction: string;
  delta: string;
}
interface JourneyTrackingProps {
  entryEmotion: string;
  exitEmotion: string;
  satisfactionResult: SatisfactionResult | null;
  getEmotionEmoji: (emotion: string) => string;
  getEmotionColor: (emotion: string) => string;
  getSatisfactionColor: (satisfaction: string) => string;
}
const JourneyTracking: React.FC<JourneyTrackingProps> = ({
  entryEmotion,
  exitEmotion,
  satisfactionResult,
  getEmotionEmoji,
  getEmotionColor,
  getSatisfactionColor
}) => {
  return <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100 text-base sm:text-lg font-bold md:text-xl">Customer Journey</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-slate-400 mb-1">Entry</div>
            {entryEmotion ? <>
                <div className="text-lg sm:text-xl">{getEmotionEmoji(entryEmotion)}</div>
                <div className={`text-xs sm:text-sm font-medium capitalize ${getEmotionColor(entryEmotion)}`}>
                  {entryEmotion}
                </div>
              </> : <div className="text-slate-500 text-xs sm:text-sm">Not captured</div>}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-slate-400" />
          </div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-slate-400 mb-1">Exit</div>
            {exitEmotion ? <>
                <div className="text-lg sm:text-xl">{getEmotionEmoji(exitEmotion)}</div>
                <div className={`text-xs sm:text-sm font-medium capitalize ${getEmotionColor(exitEmotion)}`}>
                  {exitEmotion}
                </div>
              </> : <div className="text-slate-500 text-xs sm:text-sm">Not captured</div>}
          </div>
        </div>
        {satisfactionResult && <div className="pt-4 border-t border-slate-600">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {satisfactionResult.satisfaction.toLowerCase().includes("satisfied") ? <TrendingUp className="h-4 w-4 text-green-400" /> : <TrendingDown className="h-4 w-4 text-red-400" />}
                <span className={`font-medium ${getSatisfactionColor(satisfactionResult.satisfaction)} text-sm sm:text-base`}>
                  {satisfactionResult.satisfaction}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {satisfactionResult.delta}
              </Badge>
            </div>
          </div>}
      </CardContent>
    </Card>;
};
export default JourneyTracking;
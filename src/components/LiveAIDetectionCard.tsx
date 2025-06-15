
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { LineChart, Target, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface LiveAIDetectionCardProps {
  backendStatus: "connected" | "disconnected" | "checking";
  selectedModel: string;
  onModelChange: (val: string) => void;
}

const emotionModels = [
  { label: "DeepFace", value: "deepface" },
  { label: "FER+ (HuggingFace)", value: "huggingface" }
];

const LiveAIDetectionCard: React.FC<LiveAIDetectionCardProps> = ({
  backendStatus,
  selectedModel,
  onModelChange,
}) => (
  <Card className="bg-violet-800/80 border-0 rounded-xl px-2 py-4 sm:px-2 sm:py-6 flex flex-col items-center text-center shadow relative overflow-visible">
    {/* Backend & Model selectors now in top-left overlay, unique style */}
    <div className="absolute -top-5 left-3 flex flex-col sm:flex-row gap-2 z-20">
      {/* Backend status badge */}
      <Badge variant={backendStatus === 'connected' ? 'default' : 'destructive'}
        className={`flex items-center gap-1 rounded-lg px-3 py-1 shadow-lg ring-2 ${
          backendStatus === 'connected'
            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        }`}
        style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      >
        <Shield size={16} className="inline mr-1" />
        Backend: {backendStatus}
      </Badge>
      {/* Model selector */}
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-[140px] h-8 rounded-lg px-2 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 border-2 border-purple-400 text-xs text-purple-50 ring-2 ring-purple-500/30 shadow-lg font-bold hover:from-pink-900 hover:to-purple-900 transition">
          <span>
            {selectedModel ? emotionModels.find(m => m.value === selectedModel)?.label : "Select Model"}
          </span>
        </SelectTrigger>
        <SelectContent className="bg-violet-950/95 rounded-lg shadow-xl border-2 border-violet-800 z-[60]">
          {emotionModels.map(m => (
            <SelectItem key={m.value} value={m.value} className="text-xs hover:bg-purple-700 focus:bg-purple-700 focus:text-white">
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <CardHeader className="pb-2 mt-5">
      <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg md:text-xl">
        <LineChart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        Live AI Detection
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center pt-0">
      <Target className="h-10 w-10 sm:h-14 sm:w-14 text-pink-300 mx-auto mb-1 sm:mb-2" />
      <div className="text-slate-50 text-sm sm:text-base md:text-lg font-medium mb-0.5 sm:mb-1">
        No emotion detected
      </div>
      <div className="text-slate-300 text-xs sm:text-sm">
        Enable auto-detection or capture manually
      </div>
    </CardContent>
  </Card>
);
export default LiveAIDetectionCard;

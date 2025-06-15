
import React from "react";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface HeaderBannerProps {
  backendStatus: "connected" | "disconnected" | "checking";
  selectedModel: string;
  onModelChange: (val: string) => void;
}

const emotionModels = [
  { label: "DeepFace", value: "deepface" },
  { label: "FER+ (HuggingFace)", value: "huggingface" }
];

const HeaderBanner: React.FC<HeaderBannerProps> = ({ backendStatus, selectedModel, onModelChange }) => (
  <div className="bg-blue-600/20 backdrop-blur-sm border-b border-blue-500/20 p-4">
    <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <span className="text-blue-100 text-sm">
            Real-Time AI Emotion Detection for Customer Experience Enhancement
          </span>
        </div>
        <Badge variant={backendStatus === 'connected' ? 'default' : 'destructive'} className="w-fit self-start sm:self-auto">
          Backend: {backendStatus}
        </Badge>
      </div>
      <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <span className="text-blue-100 text-sm whitespace-nowrap">Model:</span>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-full sm:w-[120px] bg-slate-900 border-blue-400">
            <SelectValue>
              {emotionModels.find(m => m.value === selectedModel)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {emotionModels.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

export default HeaderBanner;

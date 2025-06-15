
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
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-blue-400" />
        <span className="text-blue-100 text-sm">
          Real-Time AI Emotion Detection for Customer Experience Enhancement
        </span>
        <Badge variant={backendStatus === 'connected' ? 'default' : 'destructive'}>
          Backend: {backendStatus}
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-blue-100 text-sm">Model:</span>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-[120px] bg-slate-900 border-blue-400">
            <SelectValue>{emotionModels.find(m => m.value === selectedModel)?.label}</SelectValue>
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

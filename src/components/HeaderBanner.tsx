
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
  <div className="bg-blue-600/20 backdrop-blur-sm border-b border-blue-500/20 p-2 sm:p-4">
    <div className="max-w-7xl mx-auto flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
          <span className="text-blue-100 text-xs sm:text-sm">
            Real-Time AI Emotion Detection for Customer Experience Enhancement
          </span>
        </div>
        <Badge 
          variant={backendStatus === 'connected' ? 'default' : 'destructive'}
          className="w-fit self-start sm:self-auto text-xs sm:text-sm py-0.5 px-2"
        >
          Backend: {backendStatus}
        </Badge>
      </div>
      <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-1 sm:gap-3 w-full sm:w-auto">
        <span className="text-blue-100 text-xs sm:text-sm whitespace-nowrap">Model:</span>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger 
            className="
              w-full sm:w-[140px]
              bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800
              border border-purple-400 focus:border-purple-500 shadow
              text-xs sm:text-sm h-8 sm:h-10
              text-purple-200 font-semibold
              hover:from-purple-900 hover:to-blue-900 hover:text-purple-100
              transition-colors duration-200
              outline-none ring-2 ring-transparent focus:ring-purple-500
              "
          >
            <SelectValue placeholder="Select the model">
              {emotionModels.find(m => m.value === selectedModel)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {emotionModels.map((m) => (
              <SelectItem 
                key={m.value} 
                value={m.value} 
                className="
                  text-xs sm:text-sm
                  hover:bg-purple-700 focus:bg-purple-700
                  focus:text-white
                  transition-colors
                  "
              >
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);
export default HeaderBanner;



import React from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface CameraControlsProps {
  autoCapture: boolean;
  backendStatus: "connected" | "disconnected" | "checking";
  isAnalyzing: boolean;
  onAutoCaptureChange: (val: boolean) => void;
  onAnalyzeEntry: () => void;
  onAnalyzeExit: () => void;
  onCompare: () => void;
  onReset: () => void;
  entryEmotion: string;
  exitEmotion: string;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  autoCapture,
  backendStatus,
  isAnalyzing,
  onAutoCaptureChange,
  onAnalyzeEntry,
  onAnalyzeExit,
  onCompare,
  onReset,
  entryEmotion,
  exitEmotion
}) => (
  <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
    {/* Auto Capture row */}
    <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-700/30 rounded-lg w-full">
      <div className="flex items-center gap-2 sm:gap-3 w-[70%] sm:w-auto">
        {autoCapture ? <Play className="h-4 w-4 text-green-400" /> : <Pause className="h-4 w-4 text-slate-400" />}
        <span className="text-slate-200 text-xs sm:text-base whitespace-nowrap">Auto AI Detection</span>
        <Badge variant={autoCapture ? "default" : "secondary"} className="text-xs sm:text-sm px-2 py-0.5">
          {autoCapture ? "Active" : "Paused"}
        </Badge>
      </div>
      <Switch
        checked={autoCapture}
        onCheckedChange={onAutoCaptureChange}
        disabled={backendStatus === "disconnected"}
        className="data-[state=checked]:bg-green-500"
      />
    </div>
    {/* --- BUTTON ARRANGEMENT for mobile/tablet --- */}
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row gap-2 w-full">
        <Button
          onClick={onAnalyzeEntry}
          disabled={isAnalyzing || backendStatus === "disconnected"}
          className="w-1/2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
          size="sm"
        >
          {isAnalyzing ? "Analyzing..." : "Capture Entry Emotion"}
        </Button>
        <Button
          onClick={onAnalyzeExit}
          disabled={isAnalyzing || backendStatus === "disconnected"}
          className="w-1/2 bg-red-600 hover:bg-red-700 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
          size="sm"
        >
          {isAnalyzing ? "Analyzing..." : "Capture Exit Emotion"}
        </Button>
      </div>
      <div className="flex flex-row gap-2 w-full">
        <Button
          onClick={onCompare}
          disabled={!entryEmotion || !exitEmotion}
          variant="outline"
          className="w-1/2 border-purple-500 text-purple-400 hover:bg-purple-500/10 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
          size="sm"
        >
          Compare Satisfaction
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="w-1/2 border-slate-500 text-slate-400 hover:bg-slate-500/10 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
          size="sm"
        >
          Reset Session
        </Button>
      </div>
    </div>
  </div>
);
export default CameraControls;

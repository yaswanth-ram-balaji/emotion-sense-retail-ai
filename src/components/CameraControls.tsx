
import React from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface CameraControlsProps {
  autoCapture: boolean;
  privacyOptOut: boolean;
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
  privacyOptOut,
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
  <div className="mt-4 space-y-4">
    {/* Auto Capture Control */}
    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
      <div className="flex items-center gap-3">
        {autoCapture ? <Play className="h-4 w-4 text-green-400" /> : <Pause className="h-4 w-4 text-slate-400" />}
        <span className="text-slate-200">Auto AI Detection</span>
        <Badge variant={autoCapture ? "default" : "secondary"}>
          {autoCapture ? "Active" : "Paused"}
        </Badge>
      </div>
      <Switch
        checked={autoCapture}
        onCheckedChange={onAutoCaptureChange}
        disabled={privacyOptOut || backendStatus === "disconnected"}
        className="data-[state=checked]:bg-green-500"
      />
    </div>
    {/* Manual Capture Buttons */}
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onAnalyzeEntry}
        disabled={isAnalyzing || privacyOptOut || backendStatus === "disconnected"}
        className="bg-green-600 hover:bg-green-700"
      >
        {isAnalyzing ? "Analyzing..." : "Capture Entry Emotion"}
      </Button>
      <Button
        onClick={onAnalyzeExit}
        disabled={isAnalyzing || privacyOptOut || backendStatus === "disconnected"}
        className="bg-red-600 hover:bg-red-700"
      >
        {isAnalyzing ? "Analyzing..." : "Capture Exit Emotion"}
      </Button>
      <Button
        onClick={onCompare}
        disabled={!entryEmotion || !exitEmotion}
        variant="outline"
        className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
      >
        Compare Satisfaction
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        className="border-slate-500 text-slate-400 hover:bg-slate-500/10"
      >
        Reset Session
      </Button>
    </div>
  </div>
);

export default CameraControls;

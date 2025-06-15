
import React from "react";
import BackendAlert from "@/components/BackendAlert";
import AlertSection from "@/components/AlertSection";
import ModeToggle from "@/components/ModeToggle";
import ModeSegmentedButton from "@/components/ModeSegmentedButton";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Camera, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface MainHeaderProps {
  backendStatus: "connected" | "disconnected" | "checking";
  selectedModel: string;
  onModelChange: (val: string) => void;
  unhappyCount: number;
  useUpload: boolean;
  setUseUpload: (v: boolean) => void;
  faceBlur: boolean;
  setFaceBlur: (v: boolean) => void;
  retryBackendConnection: () => void;
}
const emotionModels = [{
  label: "DeepFace",
  value: "deepface"
}, {
  label: "FER+ (HuggingFace)",
  value: "huggingface"
}];

// Helper for backend dot color
const getBackendDotColor = (status: string) => {
  if (status === "connected") return "bg-green-500";
  if (status === "disconnected") return "bg-red-500";
  return "bg-yellow-400 animate-pulse";
};

const MainHeader: React.FC<MainHeaderProps> = ({
  backendStatus,
  selectedModel,
  onModelChange,
  unhappyCount,
  useUpload,
  setUseUpload,
  faceBlur,
  setFaceBlur,
  retryBackendConnection
}) => (
  <div className="relative">
    {/* --- Top-right backend status dot, moved further in mobile view --- */}
    <span
      className={`
        absolute 
        ${/* On small screens, move closer to true top-right; on desktop, keep more standard spacing */""}
        top-1 right-2
        sm:top-3 sm:right-3
        z-50
        w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg
        ${getBackendDotColor(backendStatus)}
      `}
      title={backendStatus === "connected" ? "Backend Connected"
        : backendStatus === "disconnected" ? "Backend Not Connected"
        : "Backend Checking..."}
      aria-label="Backend Status"
    />

    {/* --- Title and Tagline --- */}
    <div className="text-center space-y-2 sm:space-y-3 my-2">
      <h1 className="font-extrabold font-sans tracking-tighter bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-4xl transition-all duration-200">
        Retail AI-Emotion Detector
      </h1>
      <p className="text-slate-300 font-medium text-sm sm:text-base md:text-lg lg:text-lg max-w-2xl mx-auto leading-snug">
        Real-Time AI Emotion Tracking for Enhanced Customer Experience
      </p>
    </div>

    {/* --- ONE LINE: Controls Panel, ultra responsive --- */}
    <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-5 py-4 px-2 rounded-2xl bg-gradient-to-r from-slate-800 via-purple-900 to-indigo-900 border-2 border-purple-700 shadow-xl mb-2 mt-4">
      {/* Camera/Upload Segmented Toggle */}
      <ModeSegmentedButton
        value={useUpload ? "upload" : "camera"}
        onChange={v => setUseUpload(v === "upload")}
      />

      {/* Face Blur Toggle Minimal */}
      <div className="flex items-center gap-1 bg-violet-800/20 border border-violet-500 rounded-lg px-3 py-1.5 shadow-sm">
        <Switch id="face-blur-toggle" checked={faceBlur} onCheckedChange={setFaceBlur} className="data-[state=checked]:bg-pink-400/80 scale-90" />
        <label htmlFor="face-blur-toggle" className={`
            ml-1 text-xs tracking-wide font-extrabold uppercase select-none
            ${faceBlur ? "text-pink-200" : "text-violet-200"}
          `}>
          Face Blur
        </label>
      </div>

      {/* Model Selector (Updated Style) */}
      <div className="min-w-[140px] mx-0">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="
            h-9 px-6 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600
            text-white font-bold border-2 border-purple-300 ring-2 ring-blue-900/30 shadow-[0_2px_16px_rgba(120,43,255,0.16)]
            transition-all hover:scale-105 hover:from-indigo-700 hover:to-pink-600
            uppercase text-xs tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-pink-400
          ">
            <span>
              {selectedModel ? emotionModels.find(m => m.value === selectedModel)?.label : "Select Model"}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-violet-950/95 rounded-lg shadow-2xl border-2 border-violet-800 z-[70]">
            {emotionModels.map(m => <SelectItem key={m.value} value={m.value} className="text-xs hover:bg-purple-700 focus:bg-purple-700 focus:text-white">
              {m.label}
            </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Alerts Section */}
    <AlertSection unhappyCount={unhappyCount} />

  </div>
);

export default MainHeader;

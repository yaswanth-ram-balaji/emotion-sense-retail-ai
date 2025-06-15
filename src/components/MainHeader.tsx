
import React from "react";
import BackendAlert from "@/components/BackendAlert";
import AlertSection from "@/components/AlertSection";
import ModeToggle from "@/components/ModeToggle";
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

const emotionModels = [
  { label: "DeepFace", value: "deepface" },
  { label: "FER+ (HuggingFace)", value: "huggingface" }
];

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
  <>
    {/* --- Header Logo and Backend Alert --- */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
      <div className="flex items-center gap-2 px-0 mx-0 my-[4px]">
        <img
          alt="EmotionSense Logo"
          className="w-10 h-10 rounded-full border-2 border-purple-400 shadow-sm"
          src="/lovable-uploads/b9d2ea2e-cc3e-4fc4-b6c3-3ce8921aa796.jpg"
        />
        <span className="font-extrabold tracking-tight sm:text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent font-sans text-base">Auto  AI-Emotion Detect</span>
      </div>
      <div className="flex-1">
        {backendStatus === "disconnected" && <BackendAlert onRetry={retryBackendConnection} />}
      </div>
    </div>

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

      {/* Camera/Upload Mode Toggle --- STYLE UPDATED */}
      <Button
        variant="default"
        className={`
          flex items-center gap-2 px-6 py-2 rounded-full font-extrabold uppercase text-base transition
          border-none ring-2 ring-offset-2 ring-purple-500
          shadow-xl
          bg-gradient-to-br
          ${useUpload 
            ? 'from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-400 hover:via-fuchsia-400 hover:to-purple-500'
            : 'from-green-400 via-teal-400 to-blue-500 hover:from-green-300 hover:via-teal-300 hover:to-blue-400'}
          text-white
          scale-105 hover:scale-110 duration-150 ease-in-out
        `}
        onClick={() => setUseUpload(!useUpload)}
        style={{ minWidth: 150, letterSpacing: '0.04em', outline: 0 }}
      >
        {useUpload ? (
          <>
            <Upload className="w-6 h-6 mr-2" />
            <span className="drop-shadow font-bold">Photo Upload</span>
          </>
        ) : (
          <>
            <Camera className="w-6 h-6 mr-2" />
            <span className="drop-shadow font-bold">Camera Mode</span>
          </>
        )}
      </Button>

      {/* Face Blur Toggle Minimal */}
      <div className="flex items-center gap-1 bg-violet-800/20 border border-violet-500 rounded-lg px-3 py-1.5 shadow-sm">
        <Switch
          id="face-blur-toggle"
          checked={faceBlur}
          onCheckedChange={setFaceBlur}
          className="data-[state=checked]:bg-pink-400/80 scale-90"
        />
        <label
          htmlFor="face-blur-toggle"
          className={`
            ml-1 text-xs tracking-wide font-extrabold uppercase select-none
            ${faceBlur ? "text-pink-200" : "text-violet-200"}
          `}
        >
          Face Blur
        </label>
      </div>

      {/* Backend Status: just dot + text */}
      <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 min-w-[110px] shadow-sm">
        <span
          className={`
            inline-block w-3 h-3 rounded-full
            ${getBackendDotColor(backendStatus)}
          `}
        />
        <span className="text-xs font-semibold"
          style={{color: backendStatus==="connected" ? "#22c55e" : backendStatus==="disconnected" ? "#f87171" : "#facc15"}}>
          {backendStatus === "checking"
            ? "Checking..."
            : backendStatus === "connected"
              ? "Backend Connected"
              : "Not Connected"
          }
        </span>
      </div>

      {/* Model Selector */}
      <div className="min-w-[140px] mx-0">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="
            h-9 rounded-lg px-4 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-blue-700 text-purple-50
            font-bold shadow-md border-2 border-purple-400/90 ring-2 ring-blue-900/30
            hover:from-indigo-800 hover:to-pink-800 transition-all uppercase text-xs
          ">
            <span>
              {selectedModel ? emotionModels.find(m => m.value === selectedModel)?.label : "Select Model"}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-violet-950/95 rounded-lg shadow-2xl border-2 border-violet-800 z-[70]">
            {emotionModels.map(m => (
              <SelectItem key={m.value} value={m.value} className="text-xs hover:bg-purple-700 focus:bg-purple-700 focus:text-white">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Alerts Section */}
    <AlertSection unhappyCount={unhappyCount} />
  </>
);

export default MainHeader;

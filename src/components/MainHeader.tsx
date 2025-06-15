
import React from "react";
import BackendAlert from "@/components/BackendAlert";
import AlertSection from "@/components/AlertSection";
import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Shield } from "lucide-react";
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

    {/* --- Responsive Stylish Single-Line Control Panel --- */}
    <div className="w-full flex flex-nowrap overflow-x-auto items-center justify-center gap-3 sm:gap-4 py-4 px-2 rounded-2xl bg-gradient-to-r from-slate-800 via-purple-900 to-indigo-900 border-2 border-purple-700 shadow-xl mb-2 mt-4">
      
      {/* Camera Mode Button */}
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setUseUpload(false)}
        className={`
          min-w-[100px] rounded-xl font-bold uppercase
          shadow-lg border-2 border-green-400
          ${!useUpload 
            ? 'bg-gradient-to-r from-green-500 via-lime-400 to-teal-400 text-white scale-105 ring-2 ring-green-200 animate-pulse' 
            : 'bg-none hover:bg-green-400/20 text-green-200'}
          transition-all
        `}
      >
        Camera Mode
      </Button>

      {/* Upload Photo Button */}
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setUseUpload(true)}
        className={`
          min-w-[120px] rounded-xl font-bold uppercase
          shadow-lg border-2 border-pink-400
          ${useUpload 
            ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white scale-105 ring-2 ring-pink-200 animate-pulse'
            : 'bg-none hover:bg-pink-500/20 text-pink-200'}
          transition-all
        `}
      >
        Upload Photo
      </Button>

      {/* Face Blur Toggle Button */}
      <Button
        variant="ghost"
        size="lg"
        type="button"
        tabIndex={-1}
        className={
          `
          flex items-center min-w-[120px] gap-2 !p-0 bg-none rounded-xl 
          font-bold uppercase shadow-lg border-2 border-violet-400
          ${faceBlur
            ? 'bg-gradient-to-r from-violet-500 via-pink-400 to-indigo-500 text-white scale-105 ring-2 ring-violet-200 animate-pulse'
            : 'hover:bg-violet-500/20 text-violet-200'}
          transition-all
          `
        }
        aria-disabled
      >
        <Switch
          id="face-blur-toggle"
          checked={faceBlur}
          onCheckedChange={setFaceBlur}
          className={`mx-2 ${faceBlur ? "data-[state=checked]:bg-pink-400/80" : ""}`}
        />
        <label
          htmlFor="face-blur-toggle"
          className={
            `text-xs select-none tracking-wide font-extrabold uppercase
            ${faceBlur ? "text-pink-100" : "text-violet-200"}`
          }
        >
          Face Blur
        </label>
      </Button>

      {/* Backend Status */}
      <Button
        variant="ghost"
        size="lg"
        tabIndex={-1}
        className={`
          flex items-center min-w-[140px] gap-2 px-4 py-2 rounded-xl font-bold shadow-lg border-2 border-blue-400
          ${backendStatus === "connected"
            ? "bg-gradient-to-r from-blue-500 via-green-400 to-cyan-400 text-white ring-2 ring-blue-200 animate-pulse"
            : backendStatus === "checking"
              ? "bg-gradient-to-r from-yellow-400 via-orange-300 to-amber-400 text-black animate-pulse"
              : "bg-gradient-to-r from-red-500 via-pink-500 to-pink-700 text-white"}
          pointer-events-none !cursor-default transition-all
        `}
        style={{ minWidth: 156 }}
      >
        <Shield size={18} className="inline mr-2" />
        <span className="tracking-wider text-xs sm:text-sm font-bold">
          {backendStatus === "checking"
            ? "Checking Backend..."
            : `Backend: ${backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1)}`
          }
        </span>
      </Button>

      {/* Model Selector */}
      <div className="min-w-[160px]">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="
            h-10 rounded-xl px-4
            bg-gradient-to-r from-purple-700 via-fuchsia-600 to-blue-700 text-purple-50
            font-bold shadow-lg border-2 border-purple-400/90 ring-2 ring-blue-900/30
            hover:from-indigo-800 hover:to-pink-800 transition-all uppercase
            text-xs
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


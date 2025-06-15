
import React from "react";
import BackendAlert from "@/components/BackendAlert";
import AlertSection from "@/components/AlertSection";
import ModeToggle from "@/components/ModeToggle";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
      {/* Logo area */}
      <div className="flex items-center gap-2 px-0 mx-0 my-[4px]">
        <img alt="EmotionSense Logo" className="w-10 h-10 rounded-full border-2 border-purple-400 shadow-sm" src="/lovable-uploads/b9d2ea2e-cc3e-4fc4-b6c3-3ce8921aa796.jpg" />
        <span className="font-extrabold tracking-tight sm:text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent font-sans text-base">Auto  AI-Emotion Detect</span>
      </div>
      <div className="flex-1">
        {backendStatus === "disconnected" && <BackendAlert onRetry={retryBackendConnection} />}
      </div>
    </div>

    <div className="text-center space-y-2 sm:space-y-3 my-2">
      <h1 className="font-extrabold font-sans tracking-tighter bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-4xl transition-all duration-200">
        Retail AI-Emotion Detector
      </h1>
      <p className="text-slate-300 font-medium text-sm sm:text-base md:text-lg lg:text-lg max-w-2xl mx-auto leading-snug">
        Real-Time AI Emotion Tracking for Enhanced Customer Experience
      </p>
    </div>

    {/* --- Stylish Control Panel --- */}
    <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-4 py-3 px-2 sm:px-4 rounded-2xl bg-gradient-to-r from-slate-800 via-purple-900 to-indigo-900 border-2 border-purple-700 shadow-lg mb-2 mt-4 animate-fade-in">
      {/* Camera/Upload Buttons */}
      <div className="flex gap-2 bg-white/5 dark:bg-slate-900/80 px-3 py-2 rounded-2xl shadow-lg border border-violet-400/30">
        <Button
          variant={useUpload ? "ghost" : "default"}
          size="lg"
          onClick={() => setUseUpload(false)}
          className={
            `
            font-bold uppercase transition-all min-w-[110px]
            rounded-xl shadow 
            bg-gradient-to-r 
            ${
              useUpload
                ? "from-slate-800/50 via-slate-900 to-purple-900 text-purple-100 hover:from-purple-800 hover:via-purple-900 hover:to-slate-900"
                : "from-green-500 via-blue-500 to-purple-500 text-white ring-2 ring-purple-400 scale-105 shadow-lg hover:from-green-600 hover:to-indigo-600"
            }
            border-0
            `
          }
        >
          Camera Mode
        </Button>
        <Button
          variant={useUpload ? "default" : "ghost"}
          size="lg"
          onClick={() => setUseUpload(true)}
          className={
            `
            font-bold uppercase transition-all min-w-[110px]
            rounded-xl shadow
            bg-gradient-to-r 
            ${
              useUpload
                ? "from-pink-500 via-purple-500 to-blue-500 text-white ring-2 ring-pink-300 scale-105 shadow-lg hover:from-pink-600 hover:to-blue-600"
                : "from-slate-800/50 via-slate-900 to-blue-800 text-purple-100 hover:from-blue-800 hover:to-pink-700"
            }
            border-0
            `
          }
        >
          Upload Photo
        </Button>
      </div>

      {/* Face Blur Toggle */}
      <div className={`flex items-center gap-2 px-3 py-2 bg-white/5 dark:bg-slate-900/70 rounded-2xl shadow-lg border border-pink-400/30
          ${faceBlur ? "ring-2 ring-pink-400" : ""}
        `}
      >
        <Button
          variant="ghost"
          size="lg"
          type="button"
          tabIndex={-1}
          className="
            !p-0 !m-0 flex items-center bg-none hover:bg-none border-0 focus:ring-0 
            active:scale-100
            group
            "
          aria-disabled
        >
          <Switch
            id="face-blur-toggle"
            checked={faceBlur}
            onCheckedChange={setFaceBlur}
            className={`mr-2 group-focus:ring-0 ${faceBlur ? "data-[state=checked]:bg-pink-400/80" : ""}`}
          />
          <label
            htmlFor="face-blur-toggle"
            className={
              `text-xs sm:text-sm select-none font-semibold transition-colors tracking-wide
              ${faceBlur ? "text-pink-300" : "text-slate-100"}`
            }
          >
            Face Blur
          </label>
        </Button>
      </div>

      {/* Backend Status Badge (styled as button-like pill) */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 dark:bg-slate-900/70 rounded-2xl shadow-lg border border-blue-400/30">
        <Button
          variant="ghost"
          size="lg"
          tabIndex={-1}
          className={`
            py-1 pr-2 pl-1 rounded-xl shadow-sm pointer-events-none !cursor-default font-semibold flex items-center gap-2
            ${
              backendStatus === "connected"
                ? "from-green-400/90 to-blue-500/90 bg-gradient-to-r text-white ring-2 ring-blue-200/40 animate-pulse"
                : backendStatus === "checking"
                  ? "from-yellow-300/80 to-yellow-500/90 bg-gradient-to-r text-black animate-pulse"
                  : "from-red-500/90 to-pink-500/90 bg-gradient-to-r text-white"
            }
            border-0
          `}
          style={{ minWidth: 156 }}
        >
          <Shield size={17} className="inline mr-1" />
          <span className="tracking-wide text-sm font-bold">
            {backendStatus === "checking"
              ? "Backend: Checking..."
              : `Backend: ${backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1)}`
            }
          </span>
        </Button>
      </div>

      {/* Model Selector */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 dark:bg-slate-900/70 rounded-2xl shadow-lg border border-purple-400/30">
        <span className="font-bold text-xs text-purple-100">Model</span>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="
            w-[135px] h-10 rounded-lg px-2 
            bg-gradient-to-r from-purple-700 via-violet-600 to-blue-700 text-purple-50
            text-xs font-bold shadow 
            border-0 ring-2 ring-purple-800/50 transition
            focus:ring-2
            hover:from-indigo-800 hover:to-pink-800
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

    <AlertSection unhappyCount={unhappyCount} />
  </>
);

export default MainHeader;


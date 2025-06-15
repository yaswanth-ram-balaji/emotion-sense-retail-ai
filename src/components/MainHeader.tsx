
import React from "react";
import BackendAlert from "@/components/BackendAlert";
import AlertSection from "@/components/AlertSection";
import ModeToggle from "@/components/ModeToggle";
import { Badge } from "@/components/ui/badge";
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

    {/* Control Panel Area */}
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-3 px-2 sm:px-4 rounded-2xl bg-gradient-to-r from-slate-800 via-purple-900 to-indigo-900 border-2 border-purple-700 shadow-lg mb-2 mt-4 animate-fade-in">
      {/* Camera Mode + Upload */}
      <div className="flex flex-row items-center justify-center bg-slate-900/80 rounded-xl px-2 py-1 gap-2 shadow border border-violet-500/30">
        <button
          className={`px-3 py-1 rounded-lg font-bold text-xs sm:text-sm transition-all min-w-[96px]
            ${!useUpload ? 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white shadow-lg scale-105' :
            'bg-slate-800/80 text-purple-100 border border-purple-600/20 hover:bg-purple-800/50'}`}
          onClick={() => setUseUpload(false)}
          aria-pressed={!useUpload}
        >
          Camera Mode
        </button>
        <button
          className={`px-3 py-1 rounded-lg font-bold text-xs sm:text-sm transition-all min-w-[96px]
            ${useUpload ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg scale-105' :
            'bg-slate-800/80 text-purple-100 border border-purple-600/20 hover:bg-pink-800/40'}`}
          onClick={() => setUseUpload(true)}
          aria-pressed={useUpload}
        >
          Upload Photo
        </button>
      </div>
      {/* Face blur toggle */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/70 rounded-xl shadow border border-violet-500/20 min-w-[130px]">
        <Switch
          id="face-blur-toggle"
          checked={faceBlur}
          onCheckedChange={setFaceBlur}
          className={`mr-1 ${faceBlur ? 'data-[state=checked]:bg-pink-600' : ''}`}
        />
        <label
          htmlFor="face-blur-toggle"
          className={`text-xs sm:text-sm select-none font-semibold 
            ${faceBlur ? "text-pink-300" : "text-slate-300"}
            transition-colors`}
        >
          Face Blur
        </label>
      </div>
      {/* Backend Status */}
      <div className="flex items-center gap-1 px-3 py-1 bg-slate-900/70 rounded-xl shadow border border-violet-500/20">
        <Badge
          variant={backendStatus === 'connected' ? 'default' : 'destructive'}
          className={`flex items-center gap-1 rounded-lg px-3 py-1 shadow-sm ring-2 
            ${
              backendStatus === 'connected'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse'
                : backendStatus === 'checking'
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
            }
          `}
          style={{ fontSize: '0.78rem', letterSpacing: '0.04em', fontWeight: 700, boxShadow: "0 2px 7px rgba(0,0,0,0.13)" }}
        >
          <Shield size={15} className="inline mr-1" />
          {backendStatus === 'checking'
            ? (<span>Backend: <span className="animate-pulse">Checking...</span></span>)
            : (<span>Backend: {backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1)}</span>)
          }
        </Badge>
      </div>
      {/* Model Selector */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/70 rounded-xl shadow border border-violet-500/20 min-w-[145px]">
        <span className="font-bold text-xs text-purple-100">Model</span>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-[120px] h-8 rounded-lg px-2 bg-gradient-to-r from-purple-800 to-indigo-800 border-2 border-purple-400 text-xs text-purple-50 ring-2 ring-purple-800/30 shadow font-bold hover:from-pink-900 hover:to-purple-900 transition">
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

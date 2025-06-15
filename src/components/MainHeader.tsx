
import React from "react";
import BackendAlert from "@/components/BackendAlert";
import AlertSection from "@/components/AlertSection";
import ModeToggle from "@/components/ModeToggle";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Shield } from "lucide-react";

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
}) => <>
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
    <AlertSection unhappyCount={unhappyCount} />
    <ModeToggle useUpload={useUpload} onChange={setUseUpload} />
    {/* Face Blur Toggle */}
    <div className="flex items-center justify-center sm:justify-end gap-2 mt-2">
      <label className="text-slate-300 text-xs sm:text-sm flex items-center gap-2 select-none" htmlFor="face-blur-toggle">
        <input id="face-blur-toggle" type="checkbox" className="mr-1 h-4 w-4 accent-purple-500" checked={faceBlur} onChange={e => setFaceBlur(e.target.checked)} />
        Face Blur / Anonymization Mode
      </label>
    </div>
    {/* Backend status & model selector, below face blur toggle */}
    <div className="flex flex-row justify-center items-center gap-2 mt-2 mb-1 w-full">
      <Badge 
        variant={backendStatus === 'connected' ? 'default' : 'destructive'}
        className={`flex items-center gap-1 rounded-lg px-3 py-1 shadow ring-2 ${
          backendStatus === 'connected'
            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        }`}
        style={{ fontSize: '0.78rem', letterSpacing: '0.04em', fontWeight: 700, boxShadow: "0 2px 7px rgba(0,0,0,0.15)" }}
      >
        <Shield size={15} className="inline mr-1" />
        Backend: {backendStatus}
      </Badge>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-[135px] h-8 rounded-lg px-2 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 border-2 border-purple-400 text-xs text-purple-50 ring-2 ring-purple-500/30 shadow font-bold hover:from-pink-900 hover:to-purple-900 transition">
          <span>
            {selectedModel ? emotionModels.find(m => m.value === selectedModel)?.label : "Select Model"}
          </span>
        </SelectTrigger>
        <SelectContent className="bg-violet-950/95 rounded-lg shadow-xl border-2 border-violet-800 z-[60]">
          {emotionModels.map(m => (
            <SelectItem key={m.value} value={m.value} className="text-xs hover:bg-purple-700 focus:bg-purple-700 focus:text-white">
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </>;
export default MainHeader;

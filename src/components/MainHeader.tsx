
import React from "react";
import HeaderBanner from "@/components/HeaderBanner";
import BackendAlert from "@/components/BackendAlert";
import AlertSection from "@/components/AlertSection";
import ModeToggle from "@/components/ModeToggle";

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
    <HeaderBanner
      backendStatus={backendStatus}
      selectedModel={selectedModel}
      onModelChange={onModelChange}
    />
    {backendStatus === "disconnected" && (
      <BackendAlert onRetry={retryBackendConnection} />
    )}
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Retail EmotionSense
      </h1>
      <p className="text-slate-300 text-lg">
        Real-Time AI Emotion Tracking for Enhanced Customer Experience
      </p>
    </div>
    <AlertSection unhappyCount={unhappyCount} />
    <ModeToggle
      useUpload={useUpload}
      onChange={setUseUpload}
    />
    <div className="flex items-center gap-2 justify-end">
      <label className="text-slate-300 text-sm flex items-center gap-2 select-none" htmlFor="face-blur-toggle">
        <input
          id="face-blur-toggle"
          type="checkbox"
          className="mr-1 h-4 w-4 accent-purple-500"
          checked={faceBlur}
          onChange={e => setFaceBlur(e.target.checked)}
        />
        Face Blur / Anonymization Mode
      </label>
    </div>
  </>
);

export default MainHeader;


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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
      {/* Logo area */}
      <div className="flex items-center gap-2">
        {/* Placeholder circular logo, easily swappable */}
        <img
          src="https://lovable.dev/opengraph-image-p98pqg.png"
          alt="EmotionSense Logo"
          className="w-10 h-10 rounded-full border-2 border-purple-400 shadow-sm"
        />
        <span className="font-extrabold tracking-tight text-xl sm:text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent font-sans">
          EmotionSense Retail
        </span>
      </div>
      {/* Model selector, banner, backend alerts can still go here */}
      <div className="flex-1">
        <HeaderBanner
          backendStatus={backendStatus}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
        {backendStatus === "disconnected" && (
          <BackendAlert onRetry={retryBackendConnection} />
        )}
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
    <div className="flex items-center justify-center sm:justify-end gap-2 mt-2">
      <label className="text-slate-300 text-xs sm:text-sm flex items-center gap-2 select-none" htmlFor="face-blur-toggle">
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

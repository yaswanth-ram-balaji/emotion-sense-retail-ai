
import React from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  useUpload: boolean;
  setUseUpload: (val: boolean) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ useUpload, setUseUpload }) => (
  <aside className="w-full max-w-xs h-screen bg-slate-900/70 backdrop-blur-md border-r border-slate-800 p-6 flex flex-col gap-6 shadow-xl">
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
        <span className="block text-purple-300">Retail</span>
        <span className="block text-white glow-purple">EmotionSense</span>
      </h1>
      <p className="mt-2 text-xs text-slate-300/80 font-medium">
        Unlocking real-time emotional insights for unparalleled customer experiences.
      </p>
    </div>
    <div className="flex gap-3 mb-2">
      <Button
        className={`flex-1 font-semibold ${!useUpload ? "bg-[#2936c9] text-white" : "bg-slate-700 text-slate-300"}`}
        variant={!useUpload ? "default" : "secondary"}
        onClick={() => setUseUpload(false)}
      >
        <Camera className="mr-2" />
        Camera Mode
      </Button>
      <Button
        className={`flex-1 font-semibold ${useUpload ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}
        variant={useUpload ? "default" : "secondary"}
        onClick={() => setUseUpload(true)}
      >
        <Upload className="mr-2" />
        Upload Photo
      </Button>
    </div>
    {/* Nav sections (just visual, real content scrolls on right) */}
    <nav className="flex flex-col gap-2 mt-2">
      <SectionNav label="Live AI Emotion Detection" />
      <SectionNav label="Emotion Heatmap (Hourly)" />
      <SectionNav label="Emotion Trends" />
      <SectionNav label="Customer Satisfaction" />
      <SectionNav label="Emotion Metrics" />
      <SectionNav label="Customer Journey" />
      <SectionNav label="Real-Time Activity" />
      <SectionNav label="AI Insights" />
    </nav>
    <style jsx>{`
      .glow-purple { text-shadow: 0 0 8px #9f57e7, 0 0 1px #fff; }
    `}</style>
  </aside>
);

const SectionNav: React.FC<{ label: string }> = ({ label }) => (
  <div className="w-full px-3 py-2 text-sm rounded-md text-slate-200 hover:bg-slate-700/40 font-semibold transition-all cursor-pointer select-none">
    {label}
  </div>
);

export default AppSidebar;

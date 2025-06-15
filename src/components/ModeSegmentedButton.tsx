
import React from "react";
import { Camera, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// Props: value = "camera" or "upload", onChange.
interface ModeSegmentedButtonProps {
  value: "camera" | "upload";
  onChange: (v: "camera" | "upload") => void;
  className?: string;
}

const ModeSegmentedButton: React.FC<ModeSegmentedButtonProps> = ({
  value,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex rounded-full shadow-xl border-2 border-purple-700 bg-gradient-to-r from-purple-700 via-fuchsia-800 to-blue-700 overflow-hidden",
        className
      )}
      style={{ minWidth: 220 }}
    >
      <button
        className={cn(
          "flex-1 flex items-center gap-2 justify-center py-2 px-4 font-bold uppercase transition-all text-sm sm:text-base",
          value === "camera"
            ? "bg-gradient-to-br from-green-400 via-teal-400 to-blue-500 text-white shadow-inner scale-105"
            : "bg-transparent text-purple-100 hover:bg-white/10"
        )}
        onClick={() => value !== "camera" && onChange("camera")}
        type="button"
        aria-pressed={value === "camera"}
      >
        <Camera className="w-5 h-5 mr-1" />
        <span className="hidden xs:inline">Camera Mode</span>
        <span className="xs:hidden">Camera</span>
      </button>
      <button
        className={cn(
          "flex-1 flex items-center gap-2 justify-center py-2 px-4 font-bold uppercase transition-all text-sm sm:text-base",
          value === "upload"
            ? "bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-600 text-white shadow-inner scale-105"
            : "bg-transparent text-purple-100 hover:bg-white/10"
        )}
        onClick={() => value !== "upload" && onChange("upload")}
        type="button"
        aria-pressed={value === "upload"}
      >
        <Upload className="w-5 h-5 mr-1" />
        <span className="hidden xs:inline">Photo Upload</span>
        <span className="xs:hidden">Upload</span>
      </button>
    </div>
  );
};

export default ModeSegmentedButton;

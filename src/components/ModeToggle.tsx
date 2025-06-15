
import React from "react";
import { Button } from "@/components/ui/button";

interface ModeToggleProps {
  useUpload: boolean;
  onChange: (useUpload: boolean) => void;
  cameraDevices: MediaDeviceInfo[];
  selectedDeviceId?: string;
  onDeviceChange: (deviceId: string) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({
  useUpload,
  onChange,
  cameraDevices,
  selectedDeviceId,
  onDeviceChange,
}) => (
  <div className="mb-4 flex flex-wrap items-center gap-4 justify-center">
    <Button
      variant={useUpload ? "secondary" : "default"}
      onClick={() => onChange(false)}
    >
      Camera Mode
    </Button>
    <Button
      variant={useUpload ? "default" : "secondary"}
      onClick={() => onChange(true)}
    >
      Upload Photo
    </Button>
    {!useUpload && cameraDevices.length > 1 && (
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-600 rounded px-3 py-1">
        <span className="text-xs text-slate-200">Camera:</span>
        <select
          value={selectedDeviceId || ''}
          onChange={e => onDeviceChange(e.target.value)}
          className="bg-slate-900 text-white px-2 py-1 rounded border border-slate-500 text-xs outline-none"
        >
          {cameraDevices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || "Camera"}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>
);

export default ModeToggle;

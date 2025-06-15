import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PhotoUploader from "@/components/PhotoUploader";
import CameraFeed from "@/components/CameraFeed";
import { Button } from "@/components/ui/button";
import CameraControls from "@/components/CameraControls";
import { useEffect, useState } from "react";
interface CameraPanelProps {
  useUpload: boolean;
  fullscreen: boolean;
  setFullscreen: (val: boolean) => void;
  photoUrl: string | null;
  setPhotoUrl: (val: string | null) => void;
  detectEmotionFromPhoto: () => void;
  isAnalyzing: boolean;
  backendStatus: "connected" | "disconnected" | "checking";
  autoCapture: boolean;
  onAutoCaptureChange: (val: boolean) => void;
  onAnalyzeEntry: () => void;
  onAnalyzeExit: () => void;
  onCompare: () => void;
  onReset: () => void;
  entryEmotion: string;
  exitEmotion: string;
  faceBlur: boolean;
  cameraVideoRef?: React.RefObject<HTMLVideoElement>;
}
const CameraPanel: React.FC<CameraPanelProps> = ({
  useUpload,
  fullscreen,
  setFullscreen,
  photoUrl,
  setPhotoUrl,
  detectEmotionFromPhoto,
  isAnalyzing,
  backendStatus,
  autoCapture,
  onAutoCaptureChange,
  onAnalyzeEntry,
  onAnalyzeExit,
  onCompare,
  onReset,
  entryEmotion,
  exitEmotion,
  faceBlur,
  cameraVideoRef
}) => {
  // Camera devices and selected ID for flip/switch camera
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [lastFacingMode, setLastFacingMode] = useState<"user" | "environment">("user");
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(all => {
      const cams = all.filter(d => d.kind === "videoinput");
      setDevices(cams);
      // Set default facing mode (prefer user/front)
      if (cams.length && !selectedDeviceId) {
        setSelectedDeviceId(undefined);
      }
    }).catch(() => {});
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  // Flip camera logic (toggle front/back). 
  const handleFlipCamera = () => {
    if (devices.length < 2) return; // nothing to switch
    if (!selectedDeviceId) {
      // Try to switch by facingMode label if possible
      // Browser does not always label front/back, so we'll cycle
      setSelectedDeviceId(devices[1].deviceId);
      setLastFacingMode("environment");
    } else {
      // cycle to other
      const currentIdx = devices.findIndex(d => d.deviceId === selectedDeviceId);
      const nextIdx = (currentIdx + 1) % devices.length;
      setSelectedDeviceId(devices[nextIdx].deviceId);
      setLastFacingMode(lastFacingMode === "user" ? "environment" : "user");
    }
  };

  // Label for the flip button
  let flipLabel = lastFacingMode === "user" ? "Switch to Back Camera" : "Switch to Front Camera";
  return <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Camera className="h-5 w-5" />
          <span className="hidden sm:inline">Live AI Emotion Detection</span>
          <span className="sm:hidden font-normal text-base">AI Detection</span>
          {backendStatus === 'disconnected' && <Badge variant="destructive">Offline</Badge>}
          {backendStatus === 'connected' && <Badge variant="default" className="ml-0 sm:ml-2 bg-green-600 text-xs px-2 py-0.5 rounded-md whitespace-nowrap sm:text-sm">
              <span className="hidden xs:inline">Camera Live</span>
              <span className="xs:hidden">Live</span>
            </Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {useUpload ? <>
            <PhotoUploader onUpload={setPhotoUrl} />
            {photoUrl && <>
                <CameraFeed className="mt-4" photoUrl={photoUrl} showUpload={false} fullscreen={fullscreen} onToggleFullscreen={() => setFullscreen(!fullscreen)} faceBlur={faceBlur} />
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Button onClick={detectEmotionFromPhoto} disabled={isAnalyzing}>
                    Detect Emotion
                  </Button>
                  <Button variant="secondary" onClick={() => setPhotoUrl(null)}>
                    Remove Photo
                  </Button>
                </div>
              </>}
          </> : <CameraFeed fullscreen={fullscreen} ref={cameraVideoRef ?? null} // << USE true ref if provided
      showUpload={false} onToggleFullscreen={() => setFullscreen(!fullscreen)} faceBlur={faceBlur} selectedDeviceId={selectedDeviceId}
      // Flip/camera switch props
      canFlip={devices.length > 1} onFlipCamera={handleFlipCamera} flipLabel={flipLabel} />}
        <CameraControls autoCapture={autoCapture} backendStatus={backendStatus} isAnalyzing={isAnalyzing} onAutoCaptureChange={onAutoCaptureChange} onAnalyzeEntry={onAnalyzeEntry} onAnalyzeExit={onAnalyzeExit} onCompare={onCompare} onReset={onReset} entryEmotion={entryEmotion} exitEmotion={exitEmotion} />
      </CardContent>
    </Card>;
};
export default CameraPanel;

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
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number>(0);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        // Request permissions first
        await navigator.mediaDevices.getUserMedia({ video: true });
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(d => d.kind === "videoinput" && d.deviceId);
        console.log('Available video devices:', videoDevices);
        setDevices(videoDevices);
        
        // Set default to first device (usually front camera)
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(undefined); // Let browser choose default
          setCurrentDeviceIndex(0);
        }
      } catch (error) {
        console.error('Error loading camera devices:', error);
      }
    };

    loadDevices();
  }, []);

  // Flip camera logic
  const handleFlipCamera = () => {
    if (devices.length < 2) {
      console.log('Not enough cameras to flip');
      return;
    }
    
    const nextIndex = (currentDeviceIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    
    console.log(`Switching from device ${currentDeviceIndex} to ${nextIndex}`, nextDevice);
    
    setSelectedDeviceId(nextDevice.deviceId);
    setCurrentDeviceIndex(nextIndex);
  };

  // Generate flip label based on current device
  const getFlipLabel = () => {
    if (devices.length < 2) return "No other cameras";
    
    const currentDevice = devices[currentDeviceIndex];
    const nextIndex = (currentDeviceIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    
    // Try to determine camera type from label
    const getCurrentType = (device: MediaDeviceInfo) => {
      const label = device.label.toLowerCase();
      if (label.includes('front') || label.includes('user') || label.includes('facetime')) {
        return 'Front';
      } else if (label.includes('back') || label.includes('rear') || label.includes('environment')) {
        return 'Back';
      }
      return `Camera ${devices.indexOf(device) + 1}`;
    };
    
    const nextType = getCurrentType(nextDevice);
    return `Switch to ${nextType}`;
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Camera className="h-5 w-5" />
          <span className="hidden sm:inline font-bold text-xl">Live AI Emotion Detection</span>
          <span className="sm:hidden font-normal text-base">AI Detection</span>
          {backendStatus === 'disconnected' && <Badge variant="destructive">Offline</Badge>}
          {backendStatus === 'connected' && (
            <Badge variant="default" className="ml-0 sm:ml-2 bg-green-600 text-xs px-2 py-0.5 rounded-md whitespace-nowrap sm:text-sm">
              <span className="hidden xs:inline">Camera Live</span>
              <span className="xs:hidden">Live</span>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {useUpload ? (
          <>
            <PhotoUploader onUpload={setPhotoUrl} />
            {photoUrl && (
              <>
                <CameraFeed 
                  className="mt-4" 
                  photoUrl={photoUrl} 
                  showUpload={false} 
                  fullscreen={fullscreen} 
                  onToggleFullscreen={() => setFullscreen(!fullscreen)} 
                  faceBlur={faceBlur} 
                />
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Button onClick={detectEmotionFromPhoto} disabled={isAnalyzing}>
                    Detect Emotion
                  </Button>
                  <Button variant="secondary" onClick={() => setPhotoUrl(null)}>
                    Remove Photo
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <CameraFeed 
            fullscreen={fullscreen} 
            ref={cameraVideoRef ?? null}
            showUpload={false} 
            onToggleFullscreen={() => setFullscreen(!fullscreen)} 
            faceBlur={faceBlur} 
            selectedDeviceId={selectedDeviceId}
            canFlip={devices.length > 1} 
            onFlipCamera={handleFlipCamera} 
            flipLabel={getFlipLabel()}
          />
        )}
        <CameraControls 
          autoCapture={autoCapture} 
          backendStatus={backendStatus} 
          isAnalyzing={isAnalyzing} 
          onAutoCaptureChange={onAutoCaptureChange} 
          onAnalyzeEntry={onAnalyzeEntry} 
          onAnalyzeExit={onAnalyzeExit} 
          onCompare={onCompare} 
          onReset={onReset} 
          entryEmotion={entryEmotion} 
          exitEmotion={exitEmotion} 
        />
      </CardContent>
    </Card>
  );
};

export default CameraPanel;

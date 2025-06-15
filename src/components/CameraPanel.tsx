
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PhotoUploader from "@/components/PhotoUploader";
import CameraFeed from "@/components/CameraFeed";
import { Button } from "@/components/ui/button";
import CameraControls from "@/components/CameraControls";

interface CameraPanelProps {
  useUpload: boolean;
  cameraDevices: MediaDeviceInfo[];
  selectedDeviceId?: string;
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
}

const CameraPanel: React.FC<CameraPanelProps> = ({
  useUpload,
  cameraDevices,
  selectedDeviceId,
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
}) => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Camera className="h-5 w-5" />
          Live AI Emotion Detection
          {backendStatus === 'disconnected' && (
            <Badge variant="destructive">Offline</Badge>
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
                <div className="mt-4 flex gap-2">
                  <Button onClick={detectEmotionFromPhoto} disabled={isAnalyzing}>
                    Detect Emotion
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setPhotoUrl(null)}
                  >
                    Remove Photo
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <CameraFeed
            selectedDeviceId={selectedDeviceId}
            ref={null}
            showUpload={false}
            fullscreen={fullscreen}
            onToggleFullscreen={() => setFullscreen(!fullscreen)}
            faceBlur={faceBlur}
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

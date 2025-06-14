
import React, { useEffect, useRef, forwardRef } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CameraFeedProps {
  className?: string;
}

const CameraFeed = forwardRef<HTMLVideoElement, CameraFeedProps>(({ className }, ref) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = (ref as React.RefObject<HTMLVideoElement>) || localVideoRef;

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [videoRef]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-lg overflow-hidden bg-slate-900/50 aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Face detection frame */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-56 border-2 border-green-400/50 rounded-lg">
            <div className="absolute -top-6 left-0 bg-green-400/20 backdrop-blur-sm rounded px-2 py-1">
              <span className="text-green-400 text-xs font-medium">Face Detection Zone</span>
            </div>
          </div>

          {/* Corner indicators */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs">LIVE</span>
          </div>

          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Camera info */}
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3 h-3" />
          <span>Position face within the detection zone</span>
        </div>
        <span>640x480 • 30fps</span>
      </div>
    </div>
  );
});

CameraFeed.displayName = 'CameraFeed';

export default CameraFeed;

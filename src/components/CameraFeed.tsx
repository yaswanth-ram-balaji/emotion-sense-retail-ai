
import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import { Camera, Fullscreen, Upload, SwitchCamera, Minimize } from 'lucide-react';

interface CameraFeedProps {
  className?: string;
  selectedDeviceId?: string;
  onPhotoUpload?: (imgDataUrl: string) => void;
  showUpload?: boolean;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  photoUrl?: string | null;
  faceBlur?: boolean;
  onFlipCamera?: () => void;
  canFlip?: boolean;
  flipLabel?: string;
}

const CameraFeed = forwardRef<HTMLVideoElement, CameraFeedProps>(
  (
    {
      className,
      selectedDeviceId,
      onPhotoUpload,
      showUpload,
      fullscreen,
      onToggleFullscreen,
      photoUrl,
      faceBlur,
      onFlipCamera,
      canFlip,
      flipLabel
    },
    ref
  ) => {
    const videoRef = (ref as React.RefObject<HTMLVideoElement>);
    const [cameraActive, setCameraActive] = useState(false);
    const [isFullscreenActive, setIsFullscreenActive] = useState(false);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    // Camera stream management
    useEffect(() => {
      let currentStream: MediaStream | null = null;
      let isMounted = true;

      const startCamera = async () => {
        try {
          if (photoUrl) return;
          
          // Stop existing stream
          if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
          }

          const constraints: MediaStreamConstraints = {
            video: {
              width: { ideal: 960 },
              height: { ideal: 720 },
              deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
              facingMode: selectedDeviceId ? undefined : 'user'
            }
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          if (videoRef && videoRef.current && isMounted) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadeddata = () => {
              if (isMounted) setCameraActive(true);
            };
          }
          currentStream = stream;
        } catch (error) {
          console.log('Camera access failed, continuing without camera');
          if (isMounted) setCameraActive(false);
        }
      };

      startCamera();

      return () => {
        isMounted = false;
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
        }
      };
    }, [selectedDeviceId, videoRef, photoUrl]);

    // Fullscreen handling
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreenActive(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);

      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      };
    }, []);

    const handleToggleFullscreen = useCallback(async () => {
      if (!videoContainerRef.current) return;

      try {
        if (!isFullscreenActive) {
          const element = videoContainerRef.current;
          if (element.requestFullscreen) {
            await element.requestFullscreen();
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen();
          } else if ((element as any).mozRequestFullScreen) {
            await (element as any).mozRequestFullScreen();
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          } else if ((document as any).mozCancelFullScreen) {
            await (document as any).mozCancelFullScreen();
          } else if ((document as any).msExitFullscreen) {
            await (document as any).msExitFullscreen();
          }
        }
        
        if (onToggleFullscreen) onToggleFullscreen();
      } catch (error) {
        console.log('Fullscreen toggle failed');
      }
    }, [isFullscreenActive, onToggleFullscreen]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = evt => {
          const imgDataUrl = evt.target?.result as string;
          onPhotoUpload && onPhotoUpload(imgDataUrl);
        };
        reader.readAsDataURL(file);
      }
      e.target.value = '';
    };

    return (
      <div
        ref={videoContainerRef}
        className={`relative ${className} ${
          isFullscreenActive || fullscreen 
            ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' 
            : ''
        }`}
        style={isFullscreenActive || fullscreen ? { 
          height: '100vh', 
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        } : undefined}
      >
        <div className={`relative rounded-lg overflow-hidden bg-slate-900/50 ${
          isFullscreenActive || fullscreen 
            ? 'w-full h-full max-w-none' 
            : 'aspect-video'
        }`}>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Uploaded"
              className="w-full h-full object-contain rounded"
              style={{ background: '#111' }}
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay UI */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Face detection frame */}
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-green-400/70 rounded-lg transition-all bg-green-400/5 ${
                isFullscreenActive || fullscreen 
                  ? 'w-64 h-80 sm:w-80 sm:h-96' 
                  : 'w-48 h-60 sm:w-80 sm:h-96'
              }`}
            >
              {faceBlur && (
                <div className="absolute inset-0 z-10"
                  style={{
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    background: 'rgba(30, 41, 59, 0.10)',
                    borderRadius: 'inherit',
                  }}
                ></div>
              )}

              <div className="absolute -top-8 left-0 bg-green-400/20 backdrop-blur-sm rounded px-3 py-1">
                <span className="text-green-400 text-xs sm:text-sm font-medium">
                  Face Detection Zone{faceBlur ? " (Blurred)" : ""}
                </span>
              </div>
            </div>

            {/* Live indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-xs">LIVE</span>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-2 pointer-events-auto z-20">
              <button
                className="bg-black/50 hover:bg-gray-900/80 transition rounded-full p-2 border border-white/10"
                aria-label={isFullscreenActive ? "Exit Fullscreen" : "Enter Fullscreen"}
                onClick={handleToggleFullscreen}
              >
                {isFullscreenActive ? (
                  <Minimize className="w-5 h-5 text-white" />
                ) : (
                  <Fullscreen className="w-5 h-5 text-white" />
                )}
              </button>

              {canFlip && (
                <button
                  className="bg-black/50 hover:bg-gray-900/80 transition rounded-full p-2 border border-white/10"
                  aria-label={flipLabel || "Switch Camera"}
                  onClick={onFlipCamera}
                >
                  <SwitchCamera className="w-5 h-5 text-white" />
                </button>
              )}

              {showUpload && (
                <label className="inline-block bg-black/50 hover:bg-gray-900/80 rounded-full p-2 cursor-pointer border border-white/10">
                  <Upload className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Camera info - hide in fullscreen */}
        {!(isFullscreenActive || fullscreen) && (
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Camera className="w-3 h-3" />
              <span>{photoUrl ? 'Photo Upload Preview' : 'Position face within the detection zone'}</span>
            </div>
            <span>960x720 • 30fps</span>
          </div>
        )}
      </div>
    );
  }
);

CameraFeed.displayName = 'CameraFeed';

export default CameraFeed;

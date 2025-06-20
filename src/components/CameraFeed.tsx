
import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import { Camera, Fullscreen, Upload, SwitchCamera, Minimize } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraCheckPending, setCameraCheckPending] = useState(true);
    const [isFullscreenActive, setIsFullscreenActive] = useState(false);

    // Device change logic
    useEffect(() => {
      (async () => {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          setAvailableDevices(devices.filter(d => d.kind === 'videoinput'));
        } catch (e) {
          console.error('Failed to enumerate devices:', e);
        }
      })();
    }, []);

    // Camera stream start/stop logic
    useEffect(() => {
      let currentStream: MediaStream | null = null;
      let isMounted = true;
      setCameraActive(false);
      setCameraCheckPending(true);

      const startCamera = async () => {
        try {
          if (photoUrl) return;
          if (currentStream) currentStream.getTracks().forEach(track => track.stop());
          const constraints: MediaStreamConstraints = {
            video: {
              width: { ideal: 960 },
              height: { ideal: 720 },
              deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
              facingMode: selectedDeviceId ? undefined : 'user'
            }
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (videoRef && videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(false); // Wait for "loadeddata"
          }
          currentStream = stream;
        } catch (error) {
          console.error('Error accessing camera:', error);
          setCameraActive(false);
        }
      };

      startCamera();

      // Fallback: after 2 seconds, if no 'loadeddata', mark as failed
      const timeoutId = setTimeout(() => {
        if (!cameraActive && isMounted && !photoUrl) setCameraCheckPending(false);
      }, 2000);

      return () => {
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
        }
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }, [selectedDeviceId, videoRef, photoUrl]);

    // Fullscreen handling with improved mobile support
    const videoContainerRef = useRef<HTMLDivElement>(null);
    
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
          // Enter fullscreen
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
          // Exit fullscreen
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
        console.error('Fullscreen toggle failed:', error);
      }
    }, [isFullscreenActive, onToggleFullscreen]);

    // Photo upload
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

    // Event: when video successfully streams, set cameraActive
    const handleVideoLoadedData = () => {
      setCameraActive(true);
      setCameraCheckPending(false);
    };

    // Error UI: only show if not photo mode, and camera is not active after timeout
    const noCameraAvailable = !photoUrl && !cameraActive && !cameraCheckPending;

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
          {/* If photo uploaded: show <img>, else <video> */}
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
              onLoadedData={handleVideoLoadedData}
            />
          )}
          {noCameraAvailable && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
              <span className="text-red-400 font-bold text-lg mb-2">No Camera Available</span>
              <span className="text-slate-100 text-xs text-center px-4">Please check browser camera permissions or connect a camera device.</span>
            </div>
          )}
          {/* Overlay UI */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Face detection frame - responsive sizing */}
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-green-400/70 rounded-lg transition-all bg-green-400/5 ${
                isFullscreenActive || fullscreen 
                  ? 'w-64 h-80 sm:w-80 sm:h-96' 
                  : 'w-48 h-60 sm:w-80 sm:h-96'
              }`}
              style={{
                overflow: 'hidden'
              }}
            >
              {/* Blur overlay if faceBlur mode is on */}
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
            {/* Corner indicators */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-xs">LIVE</span>
            </div>
            {/* Fullscreen & Upload & Flip controls */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-2 pointer-events-auto z-20">
              <button
                className="bg-black/50 hover:bg-gray-900/80 transition rounded-full p-2 mb-2 border border-white/10"
                aria-label={isFullscreenActive ? "Exit Fullscreen" : "Enter Fullscreen"}
                title={isFullscreenActive ? "Exit Fullscreen" : "Enter Fullscreen"}
                type="button"
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
                  className="bg-black/50 hover:bg-gray-900/80 transition rounded-full p-2 mb-2 border border-white/10"
                  aria-label={flipLabel || "Switch Camera"}
                  type="button"
                  onClick={onFlipCamera}
                  title={flipLabel || "Switch Camera"}
                >
                  <SwitchCamera className="w-5 h-5 text-white" />
                </button>
              )}
              {showUpload && (
                <label className="inline-block bg-black/50 hover:bg-gray-900/80 rounded-full p-2 cursor-pointer border border-white/10" title="Upload Photo">
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
              <span>{photoUrl ? 'Photo Upload Preview' : noCameraAvailable ? 'Camera Not Active' : 'Position face within the detection zone'}</span>
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

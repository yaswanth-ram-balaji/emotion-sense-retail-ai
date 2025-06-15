import { useState, useEffect, useRef } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  getBackendUrl,
  checkBackendConnection,
  loadEmotionHistory,
  resetSessionState,
} from './useEmotionSense';
import { extractAgeGender } from '@/utils/demographics';

export interface EmotionData {
  timestamp: string;
  emotion: string;
  confidence?: number;
  type: 'entry' | 'exit';
  emotion_scores?: Record<string, number>;
}

interface SatisfactionResult {
  satisfaction: string;
  delta: string;
}

export function useEmotionSenseCore() {
  // State
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [currentEmotionScores, setCurrentEmotionScores] = useState<Record<string, number> | null>(null);
  const [entryEmotion, setEntryEmotion] = useState<string>('');
  const [exitEmotion, setExitEmotion] = useState<string>('');
  const [satisfactionResult, setSatisfactionResult] = useState<SatisfactionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [autoCapture, setAutoCapture] = useState<boolean>(false);
  const [unhappyCount, setUnhappyCount] = useState<number>(0);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [selectedModel, setSelectedModel] = useState<string>('fer');
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [useUpload, setUseUpload] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [faceBlur, setFaceBlur] = useState<boolean>(false);
  // const [ageGuess, setAgeGuess] = useState<number | null>(null);
  // const [genderGuess, setGenderGuess] = useState<string | null>(null);

  useEffect(() => {
    checkBackendConnection(setBackendStatus);
    loadEmotionHistory(backendStatus, setEmotionHistory);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (autoCapture && backendStatus === 'connected') {
      intervalRef.current = setInterval(() => {
        detectCurrentEmotion();
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line
  }, [autoCapture, backendStatus]);

  const backendUrl = getBackendUrl(backendStatus);

  const captureImage = async (): Promise<string> => {
    if (!videoRef.current) throw new Error('Video not available');
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  };

  const detectCurrentEmotion = async () => {
    if (isAnalyzing || backendStatus !== 'connected') return;
    setIsAnalyzing(true);

    try {
      console.log('Starting emotion detection...');
      const imageBase64 = await captureImage();
      console.log('Image captured, processing...');

      // Detect face
      const faceResponse = await fetch(`${backendUrl}/detect-face`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: imageBase64, method: selectedModel })
      });
      if (!faceResponse.ok) {
        throw new Error(`Face detection failed: ${faceResponse.status} ${faceResponse.statusText}`);
      }
      const faceData = await faceResponse.json();
      console.log('Face detection response:', faceData);

      if (!faceData.face_crop_base64) {
        throw new Error('No face detected in image');
      }

      // Step 2: Analyze emotion
      const emotionResponse = await fetch(`${backendUrl}/analyze_emotion`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: faceData.face_crop_base64, method: selectedModel })
      });
      if (!emotionResponse.ok) {
        throw new Error(`Emotion analysis failed: ${emotionResponse.status} ${emotionResponse.statusText}`);
      }

      const emotionData = await emotionResponse.json();
      console.log('Emotion analysis response (full):', emotionData);

      // Demographic extraction - REMOVED
      // const { age, gender } = extractDemographicsFromBackend(emotionData);
      // setAgeGuess(age !== null && !Number.isNaN(age) ? age : null);
      // setGenderGuess(gender && gender !== "null" && gender !== "None" ? gender : null);
      // if ((age === null || Number.isNaN(age)) && (!gender || gender === "null" || gender === "None")) {
      //   toast({
      //     title: "No Demographic Data",
      //     description: "Could not extract age/gender from backend response.",
      //     variant: "default"
      //   });
      // }

      setCurrentEmotion(emotionData.emotion);
      setEmotionConfidence(emotionData.confidence || 0.85);
      setCurrentEmotionScores(emotionData.emotion_scores || null);

      console.log(
        `Detected emotion: ${emotionData.emotion} (${(emotionData.confidence * 100).toFixed(1)}% confidence)`
      );
      if (emotionData.emotion_scores) {
        console.log('Emotion scores:', emotionData.emotion_scores);
      }
    } catch (error) {
      console.error('Error in emotion detection:', error);

      // Check backend connection via helper
      const isConnected = await checkBackendConnection(setBackendStatus);
      if (!isConnected) {
        toast({
          title: "Backend Disconnected",
          description: "Backend connection lost. Please check your FastAPI server.",
          variant: "destructive"
        });
        setAutoCapture(false);
      } else if (!autoCapture) {
        toast({
          title: "Detection Failed",
          description: error instanceof Error ? error.message : "Could not detect emotion",
          variant: "destructive"
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeEmotion = async (type: 'entry' | 'exit') => {
    if (backendStatus === 'disconnected') {
      toast({
        title: "Backend Not Available",
        description: "Please start the FastAPI server.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      console.log(`Starting ${type} emotion analysis...`);
      const imageBase64 = await captureImage();
      let emotion: string;
      let confidence: number;
      let emotionScores: Record<string, number> | undefined;

      // Step 1: Detect face
      const faceResponse = await fetch(`${backendUrl}/detect-face`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: imageBase64, method: selectedModel })
      });
      if (!faceResponse.ok) {
        throw new Error(`Face detection failed: ${faceResponse.status}`);
      }
      const faceData = await faceResponse.json();

      if (!faceData.face_crop_base64) {
        throw new Error('No face detected in image');
      }

      // Step 2: Analyze emotion
      const emotionResponse = await fetch(`${backendUrl}/analyze_emotion`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: faceData.face_crop_base64, method: selectedModel })
      });
      if (!emotionResponse.ok) {
        throw new Error(`Emotion analysis failed: ${emotionResponse.status}`);
      }
      const emotionData = await emotionResponse.json();
      emotion = emotionData.emotion;
      confidence = emotionData.confidence || 0.85;
      emotionScores = emotionData.emotion_scores || null;

      setCurrentEmotion(emotion);
      setEmotionConfidence(confidence);
      setCurrentEmotionScores(emotionScores);

      if (type === 'entry') {
        setEntryEmotion(emotion);
      } else {
        setExitEmotion(emotion);
      }

      const newEntry: EmotionData = {
        timestamp: new Date().toISOString(),
        emotion,
        confidence,
        type,
        emotion_scores: emotionScores
      };
      setEmotionHistory(prev => [newEntry, ...prev].slice(0, 50));

      if (type === 'exit' && (emotion === 'angry' || emotion === 'sad' || emotion === 'disgust' || emotion === 'fear')) {
        setUnhappyCount(prev => prev + 1);
      }

      toast({
        title: `${type === 'entry' ? 'Entry' : 'Exit'} Emotion Captured`,
        description: `Customer appears ${emotion.toLowerCase()} (${(confidence * 100).toFixed(1)}% confidence)`
      });

      console.log(`${type} emotion: ${emotion} (${(confidence * 100).toFixed(1)}% confidence)`);
      if (emotionScores) {
        console.log('Emotion scores:', emotionScores);
      }

    } catch (error) {
      console.error('Error analyzing emotion:', error);

      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze emotion",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const compareSatisfaction = async () => {
    if (!entryEmotion || !exitEmotion) {
      toast({
        title: "Incomplete Data",
        description: "Please capture both entry and exit emotions first.",
        variant: "destructive"
      });
      return;
    }

    try {
      let data: SatisfactionResult;

      // Only real backend used
      if (backendStatus === 'connected') {
        const response = await fetch(`${backendUrl}/compare-emotion`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ entry: entryEmotion, exit: exitEmotion })
        });

        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error('Backend comparison failed');
        }
      } else {
        // Fallback logic (should never hit)
        data = { satisfaction: "Unknown", delta: "N/A" };
      }

      setSatisfactionResult(data);

      toast({
        title: `Satisfaction Analysis Complete`,
        description: "Customer journey analyzed successfully"
      });

    } catch (error) {
      console.error('Error comparing emotions:', error);
    }
  };

  const resetSession = () => {
    resetSessionState({
      setCurrentEmotion,
      setEmotionConfidence,
      setEntryEmotion,
      setExitEmotion,
      setSatisfactionResult,
      setAutoCapture,
      toast,
    });
  };

  const retryBackendConnection = async () => {
    setBackendStatus('checking');
    const connected = await checkBackendConnection(setBackendStatus);
    if (connected) {
      toast({
        title: "Backend Connected",
        description: "Successfully connected to emotion detection server"
      });
      loadEmotionHistory(backendStatus, setEmotionHistory);
    } else {
      toast({
        title: "Connection Failed",
        description: "Make sure FastAPI server is running on localhost:8000",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const cameras = devices.filter(d => d.kind === 'videoinput');
      })
      .catch(() => {});
    // Do not set as dependency to avoid endless devices call loop
    // eslint-disable-next-line
  }, []);

  const handleUseUploadToggle = () => {
    setUseUpload(prev => {
      if (!prev) { setPhotoUrl(null); }
      return !prev;
    });
  };

  useEffect(() => {
    if (!useUpload) {
      setPhotoUrl(null);
    }
  }, [useUpload]);

  const detectEmotionFromPhoto = async () => {
    if (!photoUrl) return;
    setIsAnalyzing(true);

    try {
      const imageBase64 = photoUrl.split(",")[1] || photoUrl;

      // Step 1: Detect face
      const faceResponse = await fetch(`${backendUrl}/detect-face`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: imageBase64, method: selectedModel })
      });
      if (!faceResponse.ok) {
        throw new Error(`Face detection failed: ${faceResponse.status}`);
      }
      const faceData = await faceResponse.json();
      if (!faceData.face_crop_base64) {
        throw new Error('No face detected in image');
      }

      // Step 2: Analyze emotion
      const emotionResponse = await fetch(`${backendUrl}/analyze_emotion`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: faceData.face_crop_base64, method: selectedModel })
      });
      if (!emotionResponse.ok) {
        throw new Error(`Emotion analysis failed: ${emotionResponse.status}`);
      }
      const emotionData = await emotionResponse.json();
      console.log('Photo emotion analysis response (full):', emotionData);

      // Demographic extraction - REMOVED
      // const { age, gender } = extractDemographicsFromBackend(emotionData);
      // setAgeGuess(age !== null && !Number.isNaN(age) ? age : null);
      // setGenderGuess(gender && gender !== "null" && gender !== "None" ? gender : null);

      setCurrentEmotion(emotionData.emotion);
      setEmotionConfidence(emotionData.confidence || 0.85);
      setCurrentEmotionScores(emotionData.emotion_scores || null);

      toast({
        title: 'Photo Emotion Detected',
        description: `Detected: ${emotionData.emotion} (${(emotionData.confidence * 100).toFixed(1)}%)`
      });
    } catch (error) {
      console.error('Error analyzing uploaded photo:', error);
      toast({
        title: "Photo Detection Failed",
        description: error instanceof Error ? error.message : "Could not detect photo emotion",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("public:emotion_logs")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "emotion_logs",
        },
        (payload) => {
          const newEntry = payload.new;
          if (
            newEntry &&
            newEntry.type === "exit" &&
            ["angry", "sad", "disgust", "fear"].includes(newEntry.emotion)
          ) {
            toast({
              title: "⚡ Unhappy Departure Detected",
              description: `A customer left feeling ${newEntry.emotion}! Immediate attention recommended.`,
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    currentEmotion,
    emotionConfidence,
    currentEmotionScores,
    entryEmotion,
    exitEmotion,
    satisfactionResult,
    emotionHistory,
    isAnalyzing,
    autoCapture,
    unhappyCount,
    backendStatus,
    selectedModel,
    videoRef,
    intervalRef,
    fullscreen,
    useUpload,
    photoUrl,
    faceBlur,
    setSelectedModel,
    setAutoCapture,
    setFullscreen,
    setUseUpload,
    setPhotoUrl,
    setFaceBlur,
    detectCurrentEmotion,
    analyzeEmotion,
    compareSatisfaction,
    resetSession,
    detectEmotionFromPhoto,
    retryBackendConnection,
  };
}

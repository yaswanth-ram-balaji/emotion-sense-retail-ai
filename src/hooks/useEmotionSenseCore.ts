import { useState, useEffect, useRef } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  getBackendUrl,
  checkBackendConnection,
  loadEmotionHistory,
  resetSessionState,
} from './useEmotionSense';

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

  useEffect(() => {
    console.log('Initializing emotion detection system...');
    checkBackendConnection(setBackendStatus);
    loadEmotionHistory(backendStatus, setEmotionHistory);
  }, []);

  useEffect(() => {
    if (autoCapture && backendStatus === 'connected') {
      console.log('Starting auto-capture interval...');
      intervalRef.current = setInterval(() => {
        detectCurrentEmotion();
      }, 3000);
    } else {
      if (intervalRef.current) {
        console.log('Stopping auto-capture interval...');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoCapture, backendStatus]);

  const backendUrl = getBackendUrl(backendStatus);

  const captureImage = async (): Promise<string> => {
    if (!videoRef.current) {
      throw new Error('Video element not available');
    }
    
    const video = videoRef.current;
    if (video.readyState !== 4) {
      throw new Error('Video not ready');
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    return dataUrl.split(',')[1];
  };

  const makeApiRequest = async (endpoint: string, data?: any) => {
    const url = `${backendUrl}${endpoint}`;
    console.log(`Making API request to: ${url}`);
    
    const options: RequestInit = {
      method: data ? 'POST' : 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  };

  const detectCurrentEmotion = async () => {
    if (isAnalyzing || backendStatus !== 'connected') {
      console.log('Skipping detection - analyzing or backend disconnected');
      return;
    }
    
    setIsAnalyzing(true);

    try {
      console.log('Starting emotion detection...');
      const imageBase64 = await captureImage();
      console.log('Image captured successfully');

      // Step 1: Detect face
      const faceData = await makeApiRequest('/detect-face', {
        image_base64: imageBase64,
        method: selectedModel
      });
      
      if (!faceData.face_crop_base64) {
        throw new Error('No face detected in image');
      }

      // Step 2: Analyze emotion
      const emotionData = await makeApiRequest('/analyze_emotion', {
        image_base64: faceData.face_crop_base64,
        method: selectedModel
      });

      console.log('Emotion detection successful:', emotionData);

      setCurrentEmotion(emotionData.emotion);
      setEmotionConfidence(emotionData.confidence || 0.85);
      setCurrentEmotionScores(emotionData.emotion_scores || null);

    } catch (error) {
      console.error('Error in emotion detection:', error);
      
      // Re-check backend connection
      const isConnected = await checkBackendConnection(setBackendStatus);
      if (!isConnected) {
        toast({
          title: "Backend Disconnected",
          description: "Lost connection to emotion detection server",
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
        description: "Please start the FastAPI server first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      console.log(`Starting ${type} emotion analysis...`);
      const imageBase64 = await captureImage();

      // Step 1: Detect face
      const faceData = await makeApiRequest('/detect-face', {
        image_base64: imageBase64,
        method: selectedModel
      });
      
      if (!faceData.face_crop_base64) {
        throw new Error('No face detected in image');
      }

      // Step 2: Analyze emotion
      const emotionData = await makeApiRequest('/analyze_emotion', {
        image_base64: faceData.face_crop_base64,
        method: selectedModel
      });

      const emotion = emotionData.emotion;
      const confidence = emotionData.confidence || 0.85;
      const emotionScores = emotionData.emotion_scores || null;

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

      if (type === 'exit' && ['angry', 'sad', 'disgust', 'fear'].includes(emotion)) {
        setUnhappyCount(prev => prev + 1);
      }

      toast({
        title: `${type === 'entry' ? 'Entry' : 'Exit'} Emotion Captured`,
        description: `Customer appears ${emotion.toLowerCase()} (${(confidence * 100).toFixed(1)}% confidence)`
      });

      console.log(`${type} emotion analysis completed:`, emotion, confidence);

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
        description: "Please capture both entry and exit emotions first",
        variant: "destructive"
      });
      return;
    }

    try {
      let data: SatisfactionResult;

      if (backendStatus === 'connected') {
        data = await makeApiRequest('/compare-emotion', {
          entry: entryEmotion,
          exit: exitEmotion
        });
      } else {
        data = { satisfaction: "Unknown", delta: "N/A" };
      }

      setSatisfactionResult(data);

      toast({
        title: "Satisfaction Analysis Complete",
        description: `Journey analyzed: ${data.satisfaction}`
      });

    } catch (error) {
      console.error('Error comparing emotions:', error);
      toast({
        title: "Comparison Failed",
        description: "Could not compare emotions",
        variant: "destructive"
      });
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
    console.log('Retrying backend connection...');
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

  const handleUseUploadToggle = () => {
    setUseUpload(prev => {
      if (!prev) { 
        setPhotoUrl(null); 
      }
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
      const faceData = await makeApiRequest('/detect-face', {
        image_base64: imageBase64,
        method: selectedModel
      });
      
      if (!faceData.face_crop_base64) {
        throw new Error('No face detected in image');
      }

      // Step 2: Analyze emotion
      const emotionData = await makeApiRequest('/analyze_emotion', {
        image_base64: faceData.face_crop_base64,
        method: selectedModel
      });

      console.log('Photo emotion analysis successful:', emotionData);

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
        description: error instanceof Error ? error.message : "Could not detect emotion from photo",
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
    setUseUpload: handleUseUploadToggle,
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

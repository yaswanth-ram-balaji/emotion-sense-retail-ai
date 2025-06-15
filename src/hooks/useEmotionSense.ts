import { useState, useEffect, useRef } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export function useEmotionSense() {
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
  const [ageGuess, setAgeGuess] = useState<number | null>(null);
  const [genderGuess, setGenderGuess] = useState<string | null>(null);

  function extractAgeGender(obj: any): { age: number | null, gender: string | null } {
    if (!obj || typeof obj !== "object") return { age: null, gender: null };
    let age: number | null = null;
    let gender: string | null = null;

    if (typeof obj.age === "number") age = Math.round(obj.age);
    else if (typeof obj.Age === "number") age = Math.round(obj.Age);
    else if (typeof obj.age_guess === "number") age = Math.round(obj.age_guess);
    else if (typeof obj.ageGuess === "number") age = Math.round(obj.ageGuess);

    if (typeof obj.gender === "string" && obj.gender.trim() !== "") gender = obj.gender[0].toUpperCase() + obj.gender.slice(1);
    else if (typeof obj.Gender === "string" && obj.Gender.trim() !== "") gender = obj.Gender[0].toUpperCase() + obj.Gender.slice(1);
    else if (typeof obj.gender_guess === "string" && obj.gender_guess.trim() !== "") gender = obj.gender_guess[0].toUpperCase() + obj.gender_guess.slice(1);
    else if (typeof obj.genderGuess === "string" && obj.genderGuess.trim() !== "") gender = obj.genderGuess[0].toUpperCase() + obj.genderGuess.slice(1);

    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
        const nested = extractAgeGender(obj[key]);
        if (nested.age !== null && age === null) age = nested.age;
        if (nested.gender !== null && gender === null) gender = nested.gender;
      }
    }
    return { age, gender };
  }

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/docs', {
        method: 'GET',
        mode: 'cors'
      });
      if (response.ok) {
        setBackendStatus('connected');
        console.log('Backend connected successfully');
        return true;
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/docs', {
        method: 'GET',
        mode: 'cors'
      });
      if (response.ok) {
        setBackendStatus('connected');
        console.log('Backend connected via 127.0.0.1');
        return true;
      }
    } catch (error) {
      console.error('Backend connection failed on 127.0.0.1:', error);
    }

    setBackendStatus('disconnected'); // Only real backend status
    return false;
  };

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
  }, [autoCapture, backendStatus]);

  useEffect(() => {
    checkBackendConnection();
    loadEmotionHistory();
  }, []);

  const getBackendUrl = () => {
    return backendStatus === 'connected' ? 'http://localhost:8000' : 'http://127.0.0.1:8000';
  };

  const loadEmotionHistory = async () => {
    try {
      if (backendStatus === 'connected') {
        const response = await fetch(`${getBackendUrl()}/emotion-log`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEmotionHistory(data);
          console.log('Loaded emotion history:', data);
        }
      }
    } catch (error) {
      console.log('Could not load emotion history:', error);
    }
  };

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
      const faceResponse = await fetch(`${getBackendUrl()}/detect-face`, {
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
      const emotionResponse = await fetch(`${getBackendUrl()}/analyze_emotion`, {
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

      // robustly extract demographics
      const { age, gender } = extractAgeGender(emotionData);
      setAgeGuess(age);
      setGenderGuess(gender);

      // warn if neither found
      if (age === null && gender === null) {
        toast({
          title: "No Demographic Data",
          description: "Could not extract age/gender from backend response.",
          variant: "default"
        });
      }

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

      const isConnected = await checkBackendConnection();
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
      const faceResponse = await fetch(`${getBackendUrl()}/detect-face`, {
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
      const emotionResponse = await fetch(`${getBackendUrl()}/analyze_emotion`, {
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
        const response = await fetch(`${getBackendUrl()}/compare-emotion`, {
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
    setCurrentEmotion('');
    setEmotionConfidence(0);
    setEntryEmotion('');
    setExitEmotion('');
    setSatisfactionResult(null);
    setAutoCapture(false);
    toast({
      title: "Session Reset",
      description: "Ready for new customer analysis"
    });
  };

  const retryBackendConnection = async () => {
    setBackendStatus('checking');
    const connected = await checkBackendConnection();
    if (connected) {
      toast({
        title: "Backend Connected",
        description: "Successfully connected to emotion detection server"
      });
      loadEmotionHistory();
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

  // Helper: When toggling between modes (camera/upload), reset refs/photos
  const handleUseUploadToggle = () => {
    setUseUpload(prev => {
      if (!prev) { setPhotoUrl(null); }
      return !prev;
    });
  };

  // When switching back to camera, remove upload photo
  useEffect(() => {
    if (!useUpload) {
      setPhotoUrl(null);
    }
  }, [useUpload]);

  // Emotion detection for uploaded image: onPhotoDetect triggers the same backend flow but uses the photoUrl
  const detectEmotionFromPhoto = async () => {
    if (!photoUrl) return;
    setIsAnalyzing(true);

    try {
      const imageBase64 = photoUrl.split(",")[1] || photoUrl;

      // Step 1: Detect face
      const faceResponse = await fetch(`${getBackendUrl()}/detect-face`, {
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
      const emotionResponse = await fetch(`${getBackendUrl()}/analyze_emotion`, {
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

      // robustly extract demographics
      const { age, gender } = extractAgeGender(emotionData);
      setAgeGuess(age);
      setGenderGuess(gender);

      if (age === null && gender === null) {
        toast({
          title: "No Demographic Data",
          description: "Could not extract age/gender from backend response.",
          variant: "default"
        });
      }

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

  // Realtime listener for "unhappy" emotions
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
          // We only care about exits with unhappy emotions
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

  // Helper to reset demographic guesses
  const resetDemographics = () => {
    setAgeGuess(null);
    setGenderGuess(null);
  };

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
    ageGuess,
    genderGuess,
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

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Activity, AlertTriangle, Shield, BarChart3, Users, TrendingUp, Clock, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import CameraFeed from '@/components/CameraFeed';
import EmotionDisplay from '@/components/EmotionDisplay';
import EmotionChart from '@/components/EmotionChart';
import EmotionLog from '@/components/EmotionLog';
import AlertSection from '@/components/AlertSection';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import UploadFile from "@/components/UploadFile";
import { useAuth } from "@/hooks/useAuth";

interface EmotionData {
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

// NEW: Supported emotion models
const emotionModels = [
  { label: 'FER (default)', value: 'fer' },
  { label: 'DeepFace', value: 'deepface' }
];

const Index = () => {
  const { user, signOut } = useAuth();
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [currentEmotionScores, setCurrentEmotionScores] = useState<Record<string, number> | null>(null);
  const [entryEmotion, setEntryEmotion] = useState<string>('');
  const [exitEmotion, setExitEmotion] = useState<string>('');
  const [satisfactionResult, setSatisfactionResult] = useState<SatisfactionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [privacyOptOut, setPrivacyOptOut] = useState<boolean>(false);
  const [autoCapture, setAutoCapture] = useState<boolean>(false);
  const [unhappyCount, setUnhappyCount] = useState<number>(0);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [selectedModel, setSelectedModel] = useState<string>('fer');
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check backend connectivity
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
    if (autoCapture && !privacyOptOut && backendStatus === 'connected') {
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
  }, [autoCapture, privacyOptOut, backendStatus]);

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
    if (privacyOptOut || isAnalyzing || backendStatus !== 'connected') return;

    setIsAnalyzing(true);

    try {
      console.log('Starting emotion detection...');
      const imageBase64 = await captureImage();
      console.log('Image captured, processing...');

      let emotion: string;
      let confidence: number;
      let emotionScores: Record<string, number> | undefined;

      // Step 1: Detect face with proper headers
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
      console.log('Emotion analysis response:', emotionData);

      emotion = emotionData.emotion;
      confidence = emotionData.confidence || 0.85;
      emotionScores = emotionData.emotion_scores || null;

      setCurrentEmotion(emotion);
      setEmotionConfidence(confidence);
      setCurrentEmotionScores(emotionScores);

      console.log(`Detected emotion: ${emotion} (${(confidence * 100).toFixed(1)}% confidence)`);
      if (emotionScores) {
        console.log('Emotion scores:', emotionScores);
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
    if (privacyOptOut) {
      toast({
        title: "Privacy Mode Active",
        description: "Emotion analysis is disabled. Toggle privacy settings to enable.",
        variant: "destructive"
      });
      return;
    }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Privacy Banner */}
      <div className="bg-blue-600/20 backdrop-blur-sm border-b border-blue-500/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-blue-100 text-sm">
              Real-Time AI Emotion Detection for Customer Experience Enhancement
            </span>
            <Badge variant={backendStatus === 'connected' ? 'default' : 'destructive'}>
              Backend: {backendStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            {/* NEW: Model Selector */}
            <span className="text-blue-100 text-sm">Model:</span>
            <Select value={selectedModel} onValueChange={val => setSelectedModel(val)}>
              <SelectTrigger className="w-[120px] bg-slate-900 border-blue-400">
                <SelectValue>{emotionModels.find(m => m.value === selectedModel)?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {emotionModels.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-blue-100 text-sm">Opt out of Emotion Detection</span>
            <Switch
              checked={privacyOptOut}
              onCheckedChange={setPrivacyOptOut}
              className="data-[state=checked]:bg-red-500"
            />
          </div>
        </div>
      </div>

      {/* Backend Connection Alert */}
      {backendStatus === 'disconnected' && (
        <div className="bg-red-600/20 backdrop-blur-sm border-b border-red-500/20 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-red-100 text-sm">
                Backend server not connected. Start FastAPI server with: <code>uvicorn main:app --reload --host 0.0.0.0 --port 8000</code>
              </span>
            </div>
            <Button 
              onClick={retryBackendConnection}
              variant="outline" 
              size="sm"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              Retry Connection
            </Button>
          </div>
        </div>
      )}

      {/* Removed Demo Mode Banner */}

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Retail EmotionSense
          </h1>
          <p className="text-slate-300 text-lg">
            Real-Time AI Emotion Tracking for Enhanced Customer Experience
          </p>
        </div>

        {/* Alert Section */}
        <AlertSection unhappyCount={unhappyCount} />

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera and Controls */}
          <div className="lg:col-span-2 space-y-6">
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
                <CameraFeed ref={videoRef} />
                
                <div className="mt-4 space-y-4">
                  {/* Auto Capture Control */}
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {autoCapture ? <Play className="h-4 w-4 text-green-400" /> : <Pause className="h-4 w-4 text-slate-400" />}
                      <span className="text-slate-200">Auto AI Detection</span>
                      <Badge variant={autoCapture ? "default" : "secondary"}>
                        {autoCapture ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <Switch
                      checked={autoCapture}
                      onCheckedChange={setAutoCapture}
                      disabled={privacyOptOut || backendStatus === 'disconnected'}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>

                  {/* Manual Capture Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => analyzeEmotion('entry')}
                      disabled={isAnalyzing || privacyOptOut || backendStatus === 'disconnected'}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Capture Entry Emotion'}
                    </Button>
                    <Button
                      onClick={() => analyzeEmotion('exit')}
                      disabled={isAnalyzing || privacyOptOut || backendStatus === 'disconnected'}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Capture Exit Emotion'}
                    </Button>
                    <Button
                      onClick={compareSatisfaction}
                      disabled={!entryEmotion || !exitEmotion}
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                    >
                      Compare Satisfaction
                    </Button>
                    <Button
                      onClick={resetSession}
                      variant="outline"
                      className="border-slate-500 text-slate-400 hover:bg-slate-500/10"
                    >
                      Reset Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-100">
                    <BarChart3 className="h-5 w-5" />
                    Emotion Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmotionChart data={emotionHistory} />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-100">
                    <Users className="h-5 w-5" />
                    Session Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Analyses</span>
                    <Badge variant="secondary">{emotionHistory.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Unhappy Exits</span>
                    <Badge variant={unhappyCount > 2 ? "destructive" : "secondary"}>
                      {unhappyCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Auto Detection</span>
                    <Badge variant={autoCapture ? "default" : "secondary"}>
                      {autoCapture ? "Running" : "Stopped"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Backend Status</span>
                    <Badge variant={backendStatus === 'connected' ? "default" : "destructive"}>
                      {backendStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CURRENT EMOTION DISPLAY */}
            <EmotionDisplay
              emotion={currentEmotion}
              confidence={emotionConfidence}
              entryEmotion={entryEmotion}
              exitEmotion={exitEmotion}
              satisfactionResult={satisfactionResult}
              // Pass scores to EmotionDisplay
              emotionScores={currentEmotionScores}
            />
            {/* Emotion History Log */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Clock className="h-5 w-5" />
                  Real-Time Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmotionLog data={emotionHistory.slice(0, 10)} />
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <TrendingUp className="h-5 w-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 text-sm space-y-2">
                <p>• Monitor peak unhappy exit times</p>
                <p>• Consider staff training during high-stress periods</p>
                <p>• Implement immediate follow-up for dissatisfied customers</p>
                <p>• Analyze correlation between wait times and emotions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

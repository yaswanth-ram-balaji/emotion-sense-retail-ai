
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

interface EmotionData {
  timestamp: string;
  emotion: string;
  confidence?: number;
  type: 'entry' | 'exit';
}

interface SatisfactionResult {
  satisfaction: string;
  delta: string;
}

const Index = () => {
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [entryEmotion, setEntryEmotion] = useState<string>('');
  const [exitEmotion, setExitEmotion] = useState<string>('');
  const [satisfactionResult, setSatisfactionResult] = useState<SatisfactionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [privacyOptOut, setPrivacyOptOut] = useState<boolean>(false);
  const [autoCapture, setAutoCapture] = useState<boolean>(false);
  const [unhappyCount, setUnhappyCount] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-capture functionality
  useEffect(() => {
    if (autoCapture && !privacyOptOut) {
      intervalRef.current = setInterval(() => {
        detectCurrentEmotion();
      }, 3000); // Capture every 3 seconds
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
  }, [autoCapture, privacyOptOut]);

  // Load emotion history on component mount
  useEffect(() => {
    loadEmotionHistory();
  }, []);

  const loadEmotionHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/emotion-log');
      if (response.ok) {
        const data = await response.json();
        setEmotionHistory(data);
        console.log('Loaded emotion history:', data);
      }
    } catch (error) {
      console.log('Backend not available for emotion history');
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
    if (privacyOptOut || isAnalyzing) return;

    setIsAnalyzing(true);
    
    try {
      console.log('Starting emotion detection...');
      
      // Capture image from camera
      const imageBase64 = await captureImage();
      console.log('Image captured, sending to backend...');
      
      // Step 1: Detect face
      const faceResponse = await fetch('http://localhost:8000/detect-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: imageBase64 })
      });

      if (!faceResponse.ok) {
        throw new Error(`Face detection failed: ${faceResponse.status}`);
      }
      
      const faceData = await faceResponse.json();
      console.log('Face detection response:', faceData);
      
      if (!faceData.face_crop_base64) {
        throw new Error('No face detected in image');
      }

      // Step 2: Analyze emotion
      const emotionResponse = await fetch('http://localhost:8000/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ face_crop_base64: faceData.face_crop_base64 })
      });

      if (!emotionResponse.ok) {
        throw new Error(`Emotion analysis failed: ${emotionResponse.status}`);
      }
      
      const emotionData = await emotionResponse.json();
      console.log('Emotion analysis response:', emotionData);
      
      const emotion = emotionData.emotion;
      const confidence = emotionData.confidence || 0.85;

      setCurrentEmotion(emotion);
      setEmotionConfidence(confidence);

      console.log(`Detected emotion: ${emotion} (${(confidence * 100).toFixed(1)}% confidence)`);

    } catch (error) {
      console.error('Error in emotion detection:', error);
      
      if (!autoCapture) {
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

    setIsAnalyzing(true);
    
    try {
      console.log(`Starting ${type} emotion analysis...`);
      
      // Capture image from camera
      const imageBase64 = await captureImage();
      
      // Step 1: Detect face
      const faceResponse = await fetch('http://localhost:8000/detect-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: imageBase64 })
      });

      if (!faceResponse.ok) {
        throw new Error(`Face detection failed: ${faceResponse.status}`);
      }
      
      const faceData = await faceResponse.json();
      
      if (!faceData.face_crop_base64) {
        throw new Error('No face detected in image');
      }

      // Step 2: Analyze emotion
      const emotionResponse = await fetch('http://localhost:8000/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ face_crop_base64: faceData.face_crop_base64 })
      });

      if (!emotionResponse.ok) {
        throw new Error(`Emotion analysis failed: ${emotionResponse.status}`);
      }
      
      const emotionData = await emotionResponse.json();
      const emotion = emotionData.emotion;
      const confidence = emotionData.confidence || 0.85;

      setCurrentEmotion(emotion);
      setEmotionConfidence(confidence);

      if (type === 'entry') {
        setEntryEmotion(emotion);
      } else {
        setExitEmotion(emotion);
      }

      // Add to history
      const newEntry: EmotionData = {
        timestamp: new Date().toISOString(),
        emotion,
        confidence,
        type
      };
      setEmotionHistory(prev => [newEntry, ...prev].slice(0, 50));

      // Track unhappy exits for alerts
      if (type === 'exit' && (emotion === 'angry' || emotion === 'sad' || emotion === 'disgust' || emotion === 'fear')) {
        setUnhappyCount(prev => prev + 1);
      }

      toast({
        title: `${type === 'entry' ? 'Entry' : 'Exit'} Emotion Captured`,
        description: `Customer appears ${emotion.toLowerCase()} (${(confidence * 100).toFixed(1)}% confidence)`
      });

      console.log(`${type} emotion: ${emotion} (${(confidence * 100).toFixed(1)}% confidence)`);

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
      const response = await fetch('http://localhost:8000/compare-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: entryEmotion, exit: exitEmotion })
      });

      if (response.ok) {
        const data = await response.json();
        setSatisfactionResult(data);
      } else {
        // Fallback logic for satisfaction comparison
        const positiveEmotions = ['happy', 'surprise', 'neutral'];
        const negativeEmotions = ['angry', 'sad', 'disgust', 'fear'];
        
        const isPositiveExit = positiveEmotions.includes(exitEmotion.toLowerCase());
        const isNegativeExit = negativeEmotions.includes(exitEmotion.toLowerCase());
        
        let satisfaction = 'Neutral';
        if (isPositiveExit) {
          satisfaction = 'Satisfied';
        } else if (isNegativeExit) {
          satisfaction = 'Unhappy Exit';
        }
        
        setSatisfactionResult({
          satisfaction,
          delta: entryEmotion === exitEmotion ? 'No Change' : `${entryEmotion} → ${exitEmotion}`
        });
      }

      toast({
        title: "Satisfaction Analysis Complete",
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
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-100 text-sm">Opt out of Emotion Detection</span>
            <Switch
              checked={privacyOptOut}
              onCheckedChange={setPrivacyOptOut}
              className="data-[state=checked]:bg-red-500"
            />
          </div>
        </div>
      </div>

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
                      disabled={privacyOptOut}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>

                  {/* Manual Capture Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => analyzeEmotion('entry')}
                      disabled={isAnalyzing || privacyOptOut}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Capture Entry Emotion'}
                    </Button>
                    <Button
                      onClick={() => analyzeEmotion('exit')}
                      disabled={isAnalyzing || privacyOptOut}
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
                    <span className="text-slate-300">Privacy Mode</span>
                    <Badge variant={privacyOptOut ? "destructive" : "default"}>
                      {privacyOptOut ? "Disabled" : "Active"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Emotion Display */}
            <EmotionDisplay
              emotion={currentEmotion}
              confidence={emotionConfidence}
              entryEmotion={entryEmotion}
              exitEmotion={exitEmotion}
              satisfactionResult={satisfactionResult}
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

// Mock backend service for development/testing
export class MockBackendService {
  private static instance: MockBackendService;
  private emotionLog: Array<{
    timestamp: string;
    emotion: string;
    confidence: number;
    type: 'entry' | 'exit';
  }> = [];

  private constructor() {}

  static getInstance(): MockBackendService {
    if (!MockBackendService.instance) {
      MockBackendService.instance = new MockBackendService();
    }
    return MockBackendService.instance;
  }

  // Simulate emotion detection
  async detectFace(imageBase64: string) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock face detection - always return success for testing
    return {
      face_crop_base64: imageBase64 // Return the same image for simplicity
    };
  }

  async analyzeEmotion(faceCropBase64: string) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock emotion detection with realistic emotions
    const emotions = ['happy', 'neutral', 'surprised', 'sad', 'angry'];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence
    
    return {
      emotion,
      confidence
    };
  }

  async compareEmotions(entry: string, exit: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const positiveEmotions = ['happy', 'surprised', 'neutral'];
    const isPositiveExit = positiveEmotions.includes(exit.toLowerCase());
    const isPositiveEntry = positiveEmotions.includes(entry.toLowerCase());
    
    let satisfaction = 'Neutral';
    if (isPositiveExit && !isPositiveEntry) {
      satisfaction = 'Improved Experience';
    } else if (isPositiveExit) {
      satisfaction = 'Satisfied';
    } else {
      satisfaction = 'Unhappy Exit';
    }
    
    return {
      satisfaction,
      delta: `${entry} → ${exit}`
    };
  }

  async getEmotionLog() {
    return [...this.emotionLog];
  }

  addToEmotionLog(emotion: string, confidence: number, type: 'entry' | 'exit') {
    this.emotionLog.unshift({
      timestamp: new Date().toISOString(),
      emotion,
      confidence,
      type
    });
    
    // Keep only last 50 entries
    if (this.emotionLog.length > 50) {
      this.emotionLog = this.emotionLog.slice(0, 50);
    }
  }
}

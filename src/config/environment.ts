// Environment configuration for different deployment stages
export const config = {
  // Backend URL configuration
  getBackendUrl: (): string => {
    // Check if we're in production (deployed)
    if (import.meta.env.PROD) {
      // TODO: Replace with your Railway URL after deployment
      // Example: return 'https://emotion-detection-backend-production.railway.app';
      return import.meta.env.VITE_BACKEND_URL || 'https://emotion-detection-backend-production.railway.app';
    }
    
    // Development mode - try localhost first, then fallback
    return 'http://localhost:8000';
  },

  // Alternative backend URLs for fallback
  getBackendUrls: (): string[] => {
    if (import.meta.env.PROD) {
      return [
        import.meta.env.VITE_BACKEND_URL || 'https://emotion-detection-backend-production.railway.app'
      ];
    }
    
    return [
      'http://localhost:8000',
      'http://127.0.0.1:8000'
    ];
  },

  // API endpoints
  endpoints: {
    detectFace: '/detect-face',
    analyzeEmotion: '/analyze_emotion',
    compareEmotion: '/compare-emotion',
    emotionLog: '/emotion-log',
    health: '/docs'
  }
};

// Helper function to test backend connectivity
export const testBackendConnection = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(`${url}/docs`, {
      method: 'GET',
      mode: 'cors',
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Auto-detect best backend URL
export const findWorkingBackendUrl = async (): Promise<string> => {
  const urls = config.getBackendUrls();
  
  for (const url of urls) {
    const isWorking = await testBackendConnection(url);
    if (isWorking) {
      return url;
    }
  }
  
  // Return first URL as fallback
  return urls[0];
};
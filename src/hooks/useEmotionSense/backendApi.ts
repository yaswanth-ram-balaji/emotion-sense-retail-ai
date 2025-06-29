// Updated backend API with production support
import { config, findWorkingBackendUrl, testBackendConnection } from '@/config/environment';

export function getBackendUrl(backendStatus: string) {
  return config.getBackendUrl();
}

export async function checkBackendConnection(
  setBackendStatus: (s: "connected" | "disconnected" | "checking") => void
) {
  setBackendStatus("checking");
  
  try {
    // In production, use configured URL
    if (import.meta.env.PROD) {
      const backendUrl = config.getBackendUrl();
      const isConnected = await testBackendConnection(backendUrl);
      
      if (isConnected) {
        setBackendStatus("connected");
        return true;
      } else {
        setBackendStatus("disconnected");
        return false;
      }
    }
    
    // Development mode - try multiple URLs
    const workingUrl = await findWorkingBackendUrl();
    const isConnected = await testBackendConnection(workingUrl);
    
    if (isConnected) {
      setBackendStatus("connected");
      return true;
    } else {
      setBackendStatus("disconnected");
      return false;
    }
  } catch (error) {
    console.error('Backend connection check failed:', error);
    setBackendStatus("disconnected");
    return false;
  }
}

export async function loadEmotionHistory(
  backendStatus: string,
  setEmotionHistory: (v: any[]) => void
) {
  try {
    if (backendStatus === "connected") {
      const backendUrl = config.getBackendUrl();
      const response = await fetch(
        `${backendUrl}${config.endpoints.emotionLog}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEmotionHistory(data);
      }
    }
  } catch (error) {
    console.warn('Failed to load emotion history:', error);
  }
}
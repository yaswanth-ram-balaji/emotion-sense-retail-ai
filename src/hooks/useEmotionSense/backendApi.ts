// Super simple backend API - automatically detects Railway or local
export function getBackendUrl(backendStatus: string) {
  // In production, use environment variable (set by Netlify)
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // Development fallback
  return backendStatus === "connected" 
    ? "http://localhost:8000" 
    : "http://127.0.0.1:8000";
}

export async function checkBackendConnection(
  setBackendStatus: (s: "connected" | "disconnected" | "checking") => void
) {
  setBackendStatus("checking");
  
  // Try production URL first (Railway)
  if (import.meta.env.VITE_BACKEND_URL) {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/docs`, {
        method: "GET",
        mode: "cors",
      });
      if (response.ok) {
        setBackendStatus("connected");
        return true;
      }
    } catch (error) {
      console.log("Production backend not available, trying local...");
    }
  }
  
  // Try local development servers
  const localUrls = ["http://localhost:8000", "http://127.0.0.1:8000"];
  
  for (const url of localUrls) {
    try {
      const response = await fetch(`${url}/docs`, {
        method: "GET",
        mode: "cors",
      });
      if (response.ok) {
        setBackendStatus("connected");
        return true;
      }
    } catch (error) {
      // Continue to next URL
    }
  }
  
  setBackendStatus("disconnected");
  return false;
}

export async function loadEmotionHistory(
  backendStatus: string,
  setEmotionHistory: (v: any[]) => void
) {
  try {
    if (backendStatus === "connected") {
      const backendUrl = getBackendUrl(backendStatus);
      const response = await fetch(`${backendUrl}/emotion-log`, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEmotionHistory(data);
      }
    }
  } catch (error) {
    // Silently fail - not critical
  }
}
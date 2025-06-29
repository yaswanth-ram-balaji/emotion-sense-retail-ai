// Enhanced backend API with better connection detection
export function getBackendUrl(backendStatus: string) {
  // Priority 1: Production Railway URL (from Netlify environment)
  if (import.meta.env.VITE_BACKEND_URL) {
    console.log("🚀 Using production backend:", import.meta.env.VITE_BACKEND_URL);
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // Priority 2: Development fallback
  console.log("🔧 Using development backend: localhost:8000");
  return "http://localhost:8000";
}

export async function checkBackendConnection(
  setBackendStatus: (s: "connected" | "disconnected" | "checking") => void
) {
  console.log("🔍 Checking backend connection...");
  setBackendStatus("checking");
  
  // Try production URL first (Railway/deployed backend)
  if (import.meta.env.VITE_BACKEND_URL) {
    console.log("🌐 Testing production backend:", import.meta.env.VITE_BACKEND_URL);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Accept": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Production backend connected:", data);
        setBackendStatus("connected");
        return true;
      }
    } catch (error) {
      console.log("❌ Production backend failed:", error);
    }
  }
  
  // Try local development servers
  const localUrls = ["http://localhost:8000", "http://127.0.0.1:8000"];
  
  for (const url of localUrls) {
    console.log("🔧 Testing local backend:", url);
    try {
      const response = await fetch(`${url}/health`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Accept": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Local backend connected:", data);
        setBackendStatus("connected");
        return true;
      }
    } catch (error) {
      console.log("❌ Local backend failed:", url, error);
    }
  }
  
  console.log("💥 All backend connections failed");
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
      console.log("📊 Loading emotion history from:", backendUrl);
      
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
        console.log("✅ Emotion history loaded:", data.length, "entries");
        setEmotionHistory(data);
      } else {
        console.log("⚠️ Emotion history endpoint returned:", response.status);
      }
    }
  } catch (error) {
    console.log("❌ Failed to load emotion history:", error);
  }
}
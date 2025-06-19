
// Utility for backend API communication - Local Development Only

export function getBackendUrl(backendStatus: string) {
  // For local development, always use localhost
  return "http://localhost:8000";
}

export async function checkBackendConnection(
  setBackendStatus: (s: "connected" | "disconnected" | "checking") => void
) {
  try {
    // Try localhost first
    const response = await fetch("http://localhost:8000/health", {
      method: "GET",
      mode: "cors",
    });
    if (response.ok) {
      setBackendStatus("connected");
      return true;
    }
  } catch {}
  
  try {
    // Fallback to 127.0.0.1
    const response = await fetch("http://127.0.0.1:8000/health", {
      method: "GET",
      mode: "cors",
    });
    if (response.ok) {
      setBackendStatus("connected");
      return true;
    }
  } catch {}

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
    console.log("Could not load emotion history:", error);
  }
}

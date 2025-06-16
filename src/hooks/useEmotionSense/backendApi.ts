
// Utility for backend API communication

export function getBackendUrl(backendStatus: string) {
  // Pick the correct backend address
  return backendStatus === "connected"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
}

export function getNetworkBackendUrl() {
  // For mobile/network access, you'll need to replace this with your laptop's actual IP
  // Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
  // Example: return "http://192.168.1.100:8000";
  return "http://YOUR_LAPTOP_IP:8000"; // Replace with your actual laptop IP
}

export async function checkBackendConnection(
  setBackendStatus: (s: "connected" | "disconnected" | "checking") => void
) {
  try {
    // First try localhost (for laptop)
    const response = await fetch("http://localhost:8000/docs", {
      method: "GET",
      mode: "cors",
    });
    if (response.ok) {
      setBackendStatus("connected");
      return true;
    }
  } catch {}
  
  try {
    // Then try 127.0.0.1 (for laptop)
    const response = await fetch("http://127.0.0.1:8000/docs", {
      method: "GET",
      mode: "cors",
    });
    if (response.ok) {
      setBackendStatus("connected");
      return true;
    }
  } catch {}

  try {
    // Try network IP for mobile access
    const networkUrl = getNetworkBackendUrl();
    if (networkUrl !== "http://YOUR_LAPTOP_IP:8000") {
      const response = await fetch(`${networkUrl}/docs`, {
        method: "GET",
        mode: "cors",
      });
      if (response.ok) {
        setBackendStatus("connected");
        return true;
      }
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
      let backendUrl = getBackendUrl(backendStatus);
      
      // If localhost fails, try network IP
      try {
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
          return;
        }
      } catch {}

      // Try network IP as fallback
      const networkUrl = getNetworkBackendUrl();
      if (networkUrl !== "http://YOUR_LAPTOP_IP:8000") {
        const response = await fetch(`${networkUrl}/emotion-log`, {
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
    }
  } catch (error) {
    // ignore for now
  }
}

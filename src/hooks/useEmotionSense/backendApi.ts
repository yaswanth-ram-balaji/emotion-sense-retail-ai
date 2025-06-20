
// Utility for backend API communication

export function getBackendUrl(backendStatus: string) {
  // Pick the correct backend address
  return backendStatus === "connected"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
}

export async function checkBackendConnection(
  setBackendStatus: (s: "connected" | "disconnected" | "checking") => void
) {
  try {
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
    const response = await fetch("http://127.0.0.1:8000/docs", {
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
      const response = await fetch(
        `${getBackendUrl(backendStatus)}/emotion-log`,
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
    // ignore for now
  }
}

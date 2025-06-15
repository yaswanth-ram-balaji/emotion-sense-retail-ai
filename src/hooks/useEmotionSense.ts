
import { useEmotionSenseCore } from "./useEmotionSenseCore";

// ONLY re-export backend/session helpers (no demographics)
export { getBackendUrl, checkBackendConnection, loadEmotionHistory } from "./useEmotionSense/index";
export { resetSessionState } from "./useEmotionSense/index";

// Main export
export const useEmotionSense = useEmotionSenseCore;

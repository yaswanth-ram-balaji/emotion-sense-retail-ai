
import { useEmotionSenseCore } from "./useEmotionSenseCore";

// Re-export helpers needed by useEmotionSenseCore and other modules
export { getBackendUrl, checkBackendConnection, loadEmotionHistory } from "./useEmotionSense/index";
export { resetSessionState } from "./useEmotionSense/index";

// Main export
export const useEmotionSense = useEmotionSenseCore;

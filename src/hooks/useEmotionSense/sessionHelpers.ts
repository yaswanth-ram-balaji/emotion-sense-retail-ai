
// Session helpers for useEmotionSenseCore extracted

export function resetSessionState(setters: { [key: string]: (v: any) => void, toast?: (args: any) => void }) {
  setters.setCurrentEmotion('');
  setters.setEmotionConfidence(0);
  setters.setEntryEmotion('');
  setters.setExitEmotion('');
  setters.setSatisfactionResult(null);
  setters.setAutoCapture(false);
  if (setters.toast) {
    setters.toast({
      title: "Session Reset",
      description: "Ready for new customer analysis"
    });
  }
}

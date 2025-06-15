
import React from "react";
import EmotionHeatmap from "@/components/EmotionHeatmap";

const AnalyticsHeatmapCard = ({ emotionHistory }: { emotionHistory: any[] }) => (
  <EmotionHeatmap emotionHistory={emotionHistory} />
);

export default AnalyticsHeatmapCard;


import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SidebarInsightsCard = () => (
  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
    <CardHeader>
      <CardTitle className="text-base sm:text-lg font-semibold text-slate-200">
        Actionable AI Superpowers
      </CardTitle>
    </CardHeader>
    <CardContent className="text-slate-300 text-xs sm:text-sm space-y-2">
      <p>• Monitor peak unhappy exit times</p>
      <p>• Consider staff training during high-stress periods</p>
      <p>• Implement immediate follow-up for dissatisfied customers</p>
      <p>• Analyze correlation between wait times and emotions</p>
    </CardContent>
  </Card>
);

export default SidebarInsightsCard;

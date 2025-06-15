
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackendAlertProps {
  onRetry: () => void;
}

const BackendAlert: React.FC<BackendAlertProps> = ({ onRetry }) => (
  <div className="bg-red-600/20 backdrop-blur-sm border-b border-red-500/20 p-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <span className="text-red-100 text-sm">
          Backend server not connected. Start FastAPI server with: <code>uvicorn main:app --reload --host 0.0.0.0 --port 8000</code>
        </span>
      </div>
      <Button 
        onClick={onRetry}
        variant="outline"
        size="sm"
        className="border-red-500 text-red-400 hover:bg-red-500/10"
      >
        Retry Connection
      </Button>
    </div>
  </div>
);

export default BackendAlert;

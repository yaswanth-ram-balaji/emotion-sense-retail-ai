
import React from 'react';
import { AlertTriangle, CheckCircle, Users, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface AlertSectionProps {
  unhappyCount: number;
}

const AlertSection: React.FC<AlertSectionProps> = ({ unhappyCount }) => {
  const isHighAlert = unhappyCount >= 3;
  const isMediumAlert = unhappyCount >= 2;

  if (unhappyCount === 0) {
    return (
      <Alert className="bg-green-900/20 border-green-500/30 text-green-100">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertDescription>
          Customer satisfaction is optimal. No concerning patterns detected.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {isHighAlert && (
        <Alert className="bg-red-900/20 border-red-500/50 text-red-100 animate-pulse">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>HIGH ALERT:</strong> {unhappyCount} customers left unhappy in the last 10 minutes. 
              Immediate intervention recommended.
            </div>
            <Badge variant="destructive">
              Critical
            </Badge>
          </AlertDescription>
        </Alert>
      )}

      {isMediumAlert && !isHighAlert && (
        <Alert className="bg-yellow-900/20 border-yellow-500/50 text-yellow-100">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>CAUTION:</strong> {unhappyCount} unhappy exits detected. Monitor closely.
            </div>
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              Warning
            </Badge>
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendations */}
      {isHighAlert && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
          <h3 className="text-slate-100 font-medium mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Recommended Actions
          </h3>
          <ul className="text-slate-300 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <Clock className="h-3 w-3 mt-0.5 text-blue-400" />
              Check current wait times and queue management
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-3 w-3 mt-0.5 text-green-400" />
              Deploy additional customer service staff
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-3 w-3 mt-0.5 text-yellow-400" />
              Review current promotions and pricing
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-3 w-3 mt-0.5 text-purple-400" />
              Conduct immediate customer feedback survey
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlertSection;

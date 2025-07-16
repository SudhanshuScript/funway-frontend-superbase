
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';

interface SessionInfoCellProps {
  sessionName: string;
  sessionId: string;
  addonPackage?: string;
}

export function SessionInfoCell({ 
  sessionName, 
  sessionId, 
  addonPackage 
}: SessionInfoCellProps) {
  return (
    <>
      <div className="text-sm font-medium">{sessionName}</div>
      <div className="text-xs text-muted-foreground mt-1">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>{sessionId}</span>
        </div>
      </div>
      {addonPackage && addonPackage !== 'none' && (
        <Badge variant="secondary" className="mt-1 text-xs bg-blue-100 text-blue-800">
          {addonPackage}
        </Badge>
      )}
    </>
  );
}

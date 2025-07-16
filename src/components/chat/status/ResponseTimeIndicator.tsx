
import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ResponseTimeProps {
  responseTime?: number;
}

export function ResponseTimeIndicator({ responseTime }: ResponseTimeProps) {
  if (!responseTime) return null;
  
  const isDelayed = responseTime > 15;
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-default">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
            isDelayed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {isDelayed ? (
              <>
                <AlertTriangle className="h-3 w-3" />
                <span>Waiting {formatTime(responseTime)}</span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                <span>Responded in {formatTime(responseTime)}</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isDelayed 
            ? `This conversation has been waiting for a response for ${formatTime(responseTime)}`
            : `Last response was sent in ${formatTime(responseTime)}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

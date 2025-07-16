
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Helper that returns JSX for session badges
export const renderSessionBadges = (sessions?: string[]) => {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  // Only show first 2 badges + count if more
  const displayedSessions = sessions.slice(0, 2);
  const remainingCount = sessions.length - displayedSessions.length;

  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {displayedSessions.map(session => (
        <Badge
          key={session}
          variant="outline"
          className="bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/30 whitespace-nowrap text-xs py-0.5"
        >
          {session}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 border-gray-300 cursor-help text-xs py-0.5"
              >
                +{remainingCount} more
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-white border border-gray-200 shadow-md">
              <div className="space-y-1 p-1">
                <p className="text-xs font-medium">Additional Sessions:</p>
                <ul className="text-xs space-y-1">
                  {sessions.slice(2).map(session => (
                    <li key={session} className="text-gray-700">• {session}</li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

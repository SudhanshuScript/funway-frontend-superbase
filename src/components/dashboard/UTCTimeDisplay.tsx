
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function UTCTimeDisplay() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  useEffect(() => {
    // Update time immediately
    setCurrentTime(new Date());
    
    // Set up interval for 30-second refresh
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const formattedDate = format(currentTime, "MMM d, yyyy");
  const formattedTime = format(currentTime, "HH:mm");
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center text-sm text-muted-foreground cursor-default border border-border/50 rounded-md px-3 py-1.5 shadow-sm">
          <Clock className="h-3.5 w-3.5 mr-2" aria-label="UTC Clock" />
          <span>UTC: {formattedTime}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-3">
        <p className="text-sm font-medium">{formattedDate} | {formattedTime} (UTC +00:00)</p>
      </HoverCardContent>
    </HoverCard>
  );
}

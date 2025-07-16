
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Timer, Plus, Minus } from "lucide-react";

interface ActiveSessionCardProps {
  session: {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    capacity: number;
    booked: number;
    status: string;
    type: string;
  };
  progress: number;
  onProgressUpdate: (newProgress: number) => void;
}

export function ActiveSessionCard({ session, progress, onProgressUpdate }: ActiveSessionCardProps) {
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const getTypeColor = (type: string) => {
    switch(type) {
      case "airline":
        return "border-airline-light text-airline-light";
      case "dining":
        return "border-dining text-dining";
      case "amusement":
        return "border-amusement text-amusement";
      default:
        return "";
    }
  };

  const handleIncrementProgress = () => {
    // Increment progress by 5%, max 100%
    const newProgress = Math.min(100, progress + 5);
    onProgressUpdate(newProgress);
  };

  const handleDecrementProgress = () => {
    // Decrement progress by 5%, min 0%
    const newProgress = Math.max(0, progress - 5);
    onProgressUpdate(newProgress);
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // If timer is active, increment progress by 1% every 10 seconds
    if (isTimerActive && progress < 100) {
      interval = setInterval(() => {
        onProgressUpdate(Math.min(100, progress + 1));
      }, 10000); // 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, progress, onProgressUpdate]);

  return (
    <Card className="bg-muted/40">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{session.name}</h3>
              <Badge
                variant="outline"
                className={getTypeColor(session.type)}
              >
                {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
              </Badge>
              <Badge className="ml-2" variant={session.status === "Active" ? "default" : "secondary"}>
                {session.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {session.startTime} - {session.endTime} • {session.booked}/{session.capacity} guests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Session Progress:</span>
            <div className="w-40">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm">{progress}%</span>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleDecrementProgress} 
                disabled={progress <= 0 || isTimerActive}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant={isTimerActive ? "destructive" : "outline"} 
                onClick={toggleTimer}
                className="flex items-center gap-1"
              >
                {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <Timer className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleIncrementProgress} 
                disabled={progress >= 100 || isTimerActive}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" variant="outline">
              View Details
            </Button>
            <Button size="sm">
              Check-in Guests
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

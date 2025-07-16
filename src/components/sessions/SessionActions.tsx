
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Star } from "lucide-react";

interface SessionActionsProps {
  sessionCount: number;
  specialSessionCount: number;
  onAddSession: () => void;
  onViewCalendar: () => void;
}

export function SessionActions({
  sessionCount,
  specialSessionCount,
  onAddSession,
  onViewCalendar
}: SessionActionsProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 className="text-lg font-semibold">Sessions</h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {sessionCount} session{sessionCount !== 1 && 's'}
          </p>
          {specialSessionCount > 0 && (
            <Badge variant="outline" className="border-amber-500 text-amber-600 flex items-center gap-1">
              <Star className="h-3 w-3" fill="currentColor" />
              {specialSessionCount} special
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onViewCalendar}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Calendar View
        </Button>
        <Button onClick={onAddSession} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Publish Session
        </Button>
      </div>
    </div>
  );
}

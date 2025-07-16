
import React, { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getDaysInMonth, isSameDay } from "date-fns";
import { Session } from "@/types";
import { CalendarIcon, Plus, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

interface SessionsCalendarViewProps {
  sessions: Session[];
  onView: (session: Session) => void;
  onEdit: (session: Session) => void;
  onDeactivate: (session: Session) => void;
  onClone: (session: Session) => void;
}

interface SessionsByDate {
  [date: string]: Session[];
}

const SessionsCalendarView = ({
  sessions,
  onView,
  onEdit,
  onDeactivate,
  onClone,
}: SessionsCalendarViewProps) => {
  // Group sessions by date
  const sessionsByDate: SessionsByDate = useMemo(() => {
    return sessions.reduce((acc, session) => {
      const dateKey = session.date.split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(session);
      return acc;
    }, {} as SessionsByDate);
  }, [sessions]);

  const today = new Date();

  // Function to render sessions for each day
  const renderSessionsForDay = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const sessionsForDay = sessionsByDate[dateKey] || [];

    return (
      <div className="h-full flex flex-col">
        <div className="text-sm font-medium">{format(day, "d")}</div>
        {sessionsForDay.length > 0 ? (
          <div className="mt-1 space-y-1">
            {sessionsForDay.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className={`
                  text-xs p-1 rounded cursor-pointer truncate
                  ${session.isActive ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-500"}
                `}
                onClick={() => onView(session)}
              >
                <div className="truncate">{session.name}</div>
                <div className="flex items-center text-[10px]">
                  <User className="w-2 h-2 mr-1" />
                  {session.bookedCount}/{session.maxCapacity}
                </div>
              </div>
            ))}
            {sessionsForDay.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{sessionsForDay.length - 3} more
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => {}}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <TooltipProvider>
          <Calendar
            mode="single"
            selected={today}
            className="rounded-md border"
            components={{
              Day: ({ date }) => renderSessionsForDay(date),
            }}
          />
        </TooltipProvider>

        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Legend:</div>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-primary/10 mr-1"></div>
              <span className="text-xs">Active Session</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-gray-200 mr-1"></div>
              <span className="text-xs">Inactive Session</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionsCalendarView;


import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Day } from "@/components/ui/calendar-day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { format, isToday, isSameDay, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SessionEvent {
  date: Date;
  sessions: number;
  isSpecial?: boolean;
}

interface SessionCalendarProps {
  events?: SessionEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function SessionCalendar({
  events = [],
  selectedDate,
  onDateSelect,
}: SessionCalendarProps) {
  const [date, setDate] = React.useState<Date>(selectedDate || new Date());
  const [displayMonth, setDisplayMonth] = React.useState<Date>(new Date());

  // Update when selected date changes externally
  React.useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
      setDisplayMonth(selectedDate);
    }
  }, [selectedDate]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    setDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setDate(today);
    setDisplayMonth(today);
    if (onDateSelect) {
      onDateSelect(today);
    }
  };

  const goToPreviousMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
  };

  // Create a map of dates with events
  const eventMap = React.useMemo(() => {
    const map = new Map<string, { count: number, isSpecial: boolean }>();
    events.forEach((event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      const existing = map.get(dateKey) || { count: 0, isSpecial: false };
      map.set(dateKey, {
        count: existing.count + event.sessions,
        isSpecial: existing.isSpecial || event.isSpecial || false
      });
    });
    return map;
  }, [events]);

  // Check if a date has events
  const hasEvents = React.useCallback(
    (day: Date) => {
      const dateKey = format(day, "yyyy-MM-dd");
      return eventMap.has(dateKey);
    },
    [eventMap]
  );

  // Check if a date has special events
  const hasSpecialEvents = React.useCallback(
    (day: Date) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const eventData = eventMap.get(dateKey);
      return eventData ? eventData.isSpecial : false;
    },
    [eventMap]
  );

  // Get session count for a date
  const getSessionCount = React.useCallback(
    (day: Date) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const eventData = eventMap.get(dateKey);
      return eventData ? eventData.count : 0;
    },
    [eventMap]
  );

  const renderDay = (props: React.ComponentProps<typeof Day>) => {
    const { date: day } = props;
    if (!day) return <Day {...props} />;

    const dateHasEvents = hasEvents(day);
    const dateHasSpecialEvents = hasSpecialEvents(day);
    const sessionCount = getSessionCount(day);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full h-full">
              <Day 
                {...props} 
                hasEvents={dateHasEvents} 
                isSelected={date && isSameDay(day, date)}
                isToday={isToday(day)}
                displayMonth={displayMonth}
              />
              {dateHasEvents && (
                <div className="absolute bottom-0 left-0 w-full flex justify-center">
                  {dateHasSpecialEvents ? (
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  ) : (
                    <div className="h-1 w-1 bg-primary rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          </TooltipTrigger>
          {dateHasEvents && (
            <TooltipContent>
              <div className="text-xs">
                <p className="font-medium">{format(day, "MMMM d")}</p>
                <p>{sessionCount} session{sessionCount !== 1 ? 's' : ''}</p>
                {dateHasSpecialEvents && <p className="text-amber-500">Special event</p>}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">Sessions Calendar</CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={goToToday}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          className="w-full"
          components={{
            Day: renderDay
          }}
        />
      </CardContent>
    </Card>
  );
}

// Export both default and named export
export { SessionCalendar };

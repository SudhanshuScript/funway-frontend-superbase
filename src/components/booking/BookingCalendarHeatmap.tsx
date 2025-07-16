
import React, { useState } from 'react';
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for booking density
const getRandomBookingCount = () => Math.floor(Math.random() * 12);

const generateMockData = (days: Date[]) => {
  return days.map(day => ({
    date: day,
    bookings: getRandomBookingCount()
  }));
};

// Mock session data for tooltips
const getRandomSessions = (count: number) => {
  const sessions = ['Breakfast', 'Lunch', 'Dinner', 'Brunch', 'High Tea', 'Sunset Dinner', 'Special Event'];
  return Array.from({ length: Math.min(count, 3) }).map(() => 
    sessions[Math.floor(Math.random() * sessions.length)]
  );
};

export function BookingCalendarHeatmap() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth
  });
  
  const bookingData = generateMockData(daysInMonth);
  
  // Enhanced Gyroscope-inspired color scheme with glowing transitions
  const getDayColor = (bookings: number) => {
    if (bookings === 0) return "bg-gyro-dark border border-gyro-border text-gray-500";
    if (bookings <= 2) return "bg-blue-900/40 border border-blue-800/60 text-blue-300 hover:shadow-blue-900/30 hover:shadow-inner";
    if (bookings <= 5) return "bg-gyro-blue/30 border border-gyro-blue/40 text-blue-200 hover:shadow-gyro-blue/30 hover:shadow-inner";
    if (bookings <= 8) return "bg-purple-900/50 border border-purple-800/60 text-purple-200 hover:shadow-purple-700/30 hover:shadow-inner";
    return "bg-gyro-purple/50 border border-gyro-purple shadow-gyro-purple/20 shadow-inner text-white";
  };
  
  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };
  
  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };
  
  return (
    <div className="gyro-card p-6 border-gyro-border bg-gyro-card backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg uppercase font-medium tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevMonth} 
            className="h-8 w-8 rounded-full bg-gyro-card border-gyro-border hover:bg-gyro-blue/20 hover:border-gyro-blue/40"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextMonth} 
            className="h-8 w-8 rounded-full bg-gyro-card border-gyro-border hover:bg-gyro-blue/20 hover:border-gyro-blue/40"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium uppercase text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 rounded-md"></div>
        ))}
        
        {bookingData.map(({ date, bookings }) => {
          const sessions = getRandomSessions(bookings);
          
          return (
            <TooltipProvider key={date.toISOString()}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "h-10 rounded-lg flex flex-col justify-center items-center cursor-pointer transition-all duration-300",
                      getDayColor(bookings),
                      bookings >= 9 && "animate-glow-pulse"
                    )}
                  >
                    <span className="font-medium">{date.getDate()}</span>
                    {bookings > 0 && <span className="text-[0.65rem] opacity-90">{bookings}</span>}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="p-3 bg-gyro-dark border-gyro-border">
                  <div className="text-xs">
                    <p className="font-semibold uppercase tracking-wide mb-1">{format(date, 'MMMM d, yyyy')}</p>
                    <p className="mb-2 text-white">{bookings} {bookings === 1 ? 'booking' : 'bookings'}</p>
                    {bookings > 0 && (
                      <div className="border-t border-gyro-border pt-2 mt-1">
                        <p className="font-medium uppercase text-gray-400 text-[10px] mb-1">Top sessions:</p>
                        <ul className="space-y-1">
                          {sessions.map((session, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-gyro-blue mr-1.5"></span>
                              {session}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      
      <div className="flex justify-end mt-6 border-t border-gyro-border pt-3">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium uppercase text-gray-400">Density:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-gyro-dark border border-gyro-border"></div>
            <span className="text-gray-500">None</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-900/40 border border-blue-800/60"></div>
            <span className="text-blue-300">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-gyro-blue/30 border border-gyro-blue/40"></div>
            <span className="text-blue-200">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-purple-900/50 border border-purple-800/60"></div>
            <span className="text-purple-200">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-gyro-purple/50 border border-gyro-purple"></div>
            <span className="text-white">Full</span>
          </div>
        </div>
      </div>
    </div>
  );
}

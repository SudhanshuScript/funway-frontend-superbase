
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus, BarChart2, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BookingPageHeaderProps {
  handleCreateBooking: () => void;
  showStats: boolean;
  setShowStats: () => void;
}

export function BookingPageHeader({
  handleCreateBooking,
  showStats,
  setShowStats
}: BookingPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Bookings</h1>
        <p className="text-gray-400 mt-1">
          Manage your restaurant's bookings, schedules and guest preferences.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
        <Button 
          variant="outline"
          onClick={setShowStats}
          className="flex items-center gap-2 transition-all border-gyro-border bg-gyro-card text-gray-300 hover:text-white hover:border-gyro-border/60 hover:bg-gyro-cardHover"
        >
          {showStats ? (
            <>
              <X size={16} className="text-red-400" /> Hide Stats
            </>
          ) : (
            <>
              <BarChart2 size={16} className="text-gyro-blue" /> Show Stats
            </>
          )}
        </Button>
        <Button 
          onClick={handleCreateBooking}
          className="shadow-sm transition-all duration-300 bg-gradient-to-r from-gyro-blue to-gyro-purple hover:shadow-lg hover:shadow-gyro-purple/20 hover:-translate-y-0.5 active:translate-y-0.5 rounded-full"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create Booking
        </Button>
      </div>
    </div>
  );
}

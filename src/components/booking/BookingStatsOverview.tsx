
import React from 'react';
import { Card } from "@/components/ui/card";
import { CalendarDays, Users, CreditCard, Clock, TrendingUp } from "lucide-react";
import { BookingStatsCard } from './BookingStatsCard';
import { BookingCalendarHeatmap } from './BookingCalendarHeatmap';

// Mock data for booking stats
const mockStats = {
  todayBookings: 12,
  weekBookings: 87,
  monthBookings: 342,
  mostPopularSession: "Sunset Dinner",
  guestDistribution: {
    vip: 15,
    regular: 55,
    firstTimer: 30
  },
  revenueDaily: 1250,
  revenueWeekly: 8750,
  revenueMonthly: 37500
};

export function BookingStatsOverview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <BookingStatsCard 
          title="Today's Bookings"
          value={mockStats.todayBookings.toString()}
          description={`${mockStats.todayBookings} bookings today`}
          icon={<CalendarDays className="h-4 w-4" />}
        />
        
        <BookingStatsCard 
          title="This Week"
          value={mockStats.weekBookings.toString()}
          description={`${mockStats.weekBookings} bookings this week`}
          icon={<Users className="h-4 w-4" />}
        />
        
        <BookingStatsCard 
          title="Revenue Today"
          value={`$${mockStats.revenueDaily.toLocaleString()}`}
          description={`$${mockStats.revenueWeekly.toLocaleString()} this week`}
          icon={<CreditCard className="h-4 w-4" />}
        />
        
        <BookingStatsCard 
          title="Popular Session"
          value={mockStats.mostPopularSession}
          description="Most booked this month"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>
      
      <div className="md:col-span-2 lg:col-span-4">
        <BookingCalendarHeatmap />
      </div>
    </div>
  );
}

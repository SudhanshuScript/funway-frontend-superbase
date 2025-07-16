
import React from 'react';
import { UpcomingBooking } from "@/types/bookingTypes";
import { BookingSummaryCards } from './customData/BookingSummaryCards';
import { BookingDetailsCard } from './customData/BookingDetailsCard';
import { BookingInsightsHeader } from './customData/BookingInsightsHeader';
import { groupBookingsByDate, groupBookingsBySession } from './customData/utils/bookingGroupUtils';

interface UpcomingBookingsCustomDataProps {
  bookings: UpcomingBooking[];
}

export function UpcomingBookingsCustomData({ bookings }: UpcomingBookingsCustomDataProps) {
  // Group bookings by date and session
  const bookingsByDate = groupBookingsByDate(bookings);
  const bookingsBySession = groupBookingsBySession(bookings);

  return (
    <div className="space-y-6 mt-6">
      <BookingInsightsHeader />
      
      {/* Summary Cards */}
      <BookingSummaryCards bookings={bookings} />
      
      {/* Detailed Breakdown */}
      <BookingDetailsCard 
        bookingsByDate={bookingsByDate} 
        bookingsBySession={bookingsBySession} 
      />
    </div>
  );
}

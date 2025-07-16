
import { useState } from 'react';
import { UpcomingBooking } from '@/types/bookingTypes';
import { ActiveFilterType } from './types';

export function useBookingFilter() {
  // Filter states
  const [activeFilter, setActiveFilter] = useState<ActiveFilterType>("active");
  
  const filterBookings = (bookings: UpcomingBooking[]): UpcomingBooking[] => {
    return bookings.filter(booking => {
      if (activeFilter === "active") return booking.status === "confirmed" || booking.status === "pending";
      return booking.status === activeFilter;
    });
  };

  return {
    activeFilter,
    setActiveFilter,
    filterBookings
  };
}

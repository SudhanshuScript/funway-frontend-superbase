
import { UpcomingBooking } from "@/types/bookingTypes";

export function groupBookingsByDate(bookings: UpcomingBooking[]): Record<string, UpcomingBooking[]> {
  return bookings.reduce((acc, booking) => {
    const date = booking.bookingDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(booking);
    return acc;
  }, {} as Record<string, UpcomingBooking[]>);
}

export function groupBookingsBySession(bookings: UpcomingBooking[]): Record<string, UpcomingBooking[]> {
  return bookings.reduce((acc, booking) => {
    const session = booking.sessionName;
    if (!acc[session]) {
      acc[session] = [];
    }
    acc[session].push(booking);
    return acc;
  }, {} as Record<string, UpcomingBooking[]>);
}

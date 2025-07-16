
import React from 'react';
import { UpcomingBooking } from "@/types/bookingTypes";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Info } from "lucide-react";
import { format } from 'date-fns';

interface BookingsBySessionViewProps {
  bookingsBySession: Record<string, UpcomingBooking[]>;
}

export function BookingsBySessionView({ bookingsBySession }: BookingsBySessionViewProps) {
  return (
    <div className="space-y-4">
      {Object.entries(bookingsBySession).map(([session, sessionBookings]) => (
        <div key={session} className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium">{session}</span>
            <Badge className="ml-auto">{sessionBookings.length} bookings</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sessionBookings.map(booking => (
              <div key={booking.id} className="p-3 bg-muted/40 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">{booking.guestName}</span>
                  <Badge variant={booking.guestType === "VIP" ? "outline" : booking.guestType === "First Timer" ? "outline" : "outline"}>
                    {booking.guestType}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(booking.bookingDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{booking.totalGuests} guests</span>
                  </div>
                  {booking.specialRequests && (
                    <div className="flex items-start gap-1 mt-1">
                      <Info className="h-3.5 w-3.5 mt-0.5" />
                      <span className="text-xs">{booking.specialRequests}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {Object.keys(bookingsBySession).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming bookings found
        </div>
      )}
    </div>
  );
}

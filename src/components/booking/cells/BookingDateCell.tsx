
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Calendar } from 'lucide-react';
import { format, isToday } from 'date-fns';

interface BookingDateCellProps {
  bookingDate: string;
  isNewBooking?: boolean;
}

export function BookingDateCell({ 
  bookingDate, 
  isNewBooking 
}: BookingDateCellProps) {
  const formattedDate = format(new Date(bookingDate), 'MMM d, yyyy');
  const isBookedForToday = isToday(new Date(bookingDate));

  return (
    <div className="flex items-center">
      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
      <span className={isBookedForToday ? "font-medium text-primary" : ""}>
        {formattedDate}
      </span>
      {isBookedForToday && (
        <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">Today</Badge>
      )}
      {isNewBooking && (
        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">New</Badge>
      )}
    </div>
  );
}


import React from 'react';
import { UpcomingBooking } from '@/types/bookingTypes';
import { MoreHorizontal, Bell, Check, X, CalendarRange } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isPast } from 'date-fns';

interface BookingActionsMenuProps {
  booking: UpcomingBooking;
  onSendReminder: () => void;
  onConfirmBooking: () => void;
  onRescheduleBooking: () => void;
  onCancelBooking: () => void;
  onGuestClick?: () => void;
  onCopyContactDetails: () => void;
}

export function BookingActionsMenu({
  booking,
  onSendReminder,
  onConfirmBooking,
  onRescheduleBooking,
  onCancelBooking,
  onGuestClick,
  onCopyContactDetails
}: BookingActionsMenuProps) {
  const isBookingPast = isPast(new Date(booking.bookingDate));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onGuestClick} className="text-accent-foreground hover:text-accent-foreground hover:bg-accent/10">
          View Guest Profile
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={onSendReminder}
          disabled={isBookingPast || booking.status === 'cancelled'}
          className="text-accent-foreground hover:text-accent-foreground hover:bg-accent/10"
        >
          <Bell className="mr-2 h-4 w-4" />
          Send Reminder
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onConfirmBooking}
          disabled={isBookingPast || booking.status === 'confirmed' || booking.status === 'cancelled'}
          className="text-spotBooking hover:text-spotBooking hover:bg-spotBooking/10"
        >
          <Check className="mr-2 h-4 w-4" />
          Confirm Booking
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onRescheduleBooking}
          disabled={isBookingPast || booking.status === 'cancelled'}
          className="text-accent-foreground hover:text-accent-foreground hover:bg-accent/10"
        >
          <CalendarRange className="mr-2 h-4 w-4" />
          Reschedule
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onCancelBooking}
          disabled={isBookingPast || booking.status === 'cancelled'}
          className="text-red-600"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel Booking
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onCopyContactDetails} className="text-accent-foreground hover:text-accent-foreground hover:bg-accent/10">
          Copy Contact Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

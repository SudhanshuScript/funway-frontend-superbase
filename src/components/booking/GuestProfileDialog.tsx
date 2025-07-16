
import React from 'react';
import { UpcomingBooking } from '@/types/bookingTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GuestProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: UpcomingBooking;
}

export function GuestProfileDialog({ open, onOpenChange, booking }: GuestProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guest Profile</DialogTitle>
          <DialogDescription>
            Details for {booking.guestName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Guest Information</h3>
            <p className="text-sm text-muted-foreground">Name: {booking.guestName}</p>
            <p className="text-sm text-muted-foreground">Type: {booking.guestType}</p>
            {booking.contactDetails && (
              <>
                <p className="text-sm text-muted-foreground">Email: {booking.contactDetails.email}</p>
                <p className="text-sm text-muted-foreground">Phone: {booking.contactDetails.phone}</p>
              </>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Booking Information</h3>
            <p className="text-sm text-muted-foreground">Session: {booking.sessionName}</p>
            <p className="text-sm text-muted-foreground">Total Guests: {booking.totalGuests}</p>
            {booking.specialRequests && (
              <p className="text-sm text-muted-foreground">Special Requests: {booking.specialRequests}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


import React from 'react';
import { Button } from "@/components/ui/button";
import { UpcomingBooking } from "@/types/bookingTypes";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface BookingConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooking: UpcomingBooking | null;
  onConfirmBookingConfirmation: () => Promise<void>;
}

export function BookingConfirmationDialog({
  open,
  onOpenChange,
  selectedBooking,
  onConfirmBookingConfirmation
}: BookingConfirmationDialogProps) {
  if (!selectedBooking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            Confirm the booking for {selectedBooking.guestName}?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">Booking details:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Guest: {selectedBooking.guestName}</li>
            <li>Session: {selectedBooking.sessionName}</li>
            <li>Date: {new Date(selectedBooking.bookingDate).toLocaleDateString()}</li>
            <li>Guests: {selectedBooking.totalGuests}</li>
            <li>Payment Status: {selectedBooking.paymentStatus}</li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirmBookingConfirmation}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

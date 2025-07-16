
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";

interface BookingCancellationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooking: UpcomingBooking | null;
  cancellationReason: string;
  setCancellationReason: (reason: string) => void;
  onConfirmCancellation: () => Promise<void>;
}

export function BookingCancellationDialog({
  open,
  onOpenChange,
  selectedBooking,
  cancellationReason,
  setCancellationReason,
  onConfirmCancellation
}: BookingCancellationDialogProps) {
  if (!selectedBooking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel the booking for {selectedBooking.guestName}?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">Booking details:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Guest: {selectedBooking.guestName}</li>
            <li>Session: {selectedBooking.sessionName}</li>
            <li>Date: {new Date(selectedBooking.bookingDate).toLocaleDateString()}</li>
            <li>Guests: {selectedBooking.totalGuests}</li>
          </ul>
          
          <div className="mt-4">
            <Label htmlFor="reason">Reason for cancellation</Label>
            <Textarea 
              id="reason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Please provide a reason for cancellation"
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            No, Keep Booking
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmCancellation}
            disabled={!cancellationReason}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Yes, Cancel Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

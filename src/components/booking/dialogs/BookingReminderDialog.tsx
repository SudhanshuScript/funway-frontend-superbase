
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
import { Send } from "lucide-react";

interface BookingReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooking: UpcomingBooking | null;
  onConfirmSendReminder: () => Promise<void>;
}

export function BookingReminderDialog({
  open,
  onOpenChange,
  selectedBooking,
  onConfirmSendReminder
}: BookingReminderDialogProps) {
  if (!selectedBooking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Reminder</DialogTitle>
          <DialogDescription>
            Send a booking reminder to {selectedBooking.guestName} for their {selectedBooking.sessionName} booking.
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
          
          <p className="mt-4 text-sm text-muted-foreground">
            {selectedBooking.reminderCount > 0 
              ? `${selectedBooking.reminderCount} reminder(s) have already been sent.` 
              : "No reminders have been sent yet."}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirmSendReminder}>
            <Send className="mr-2 h-4 w-4" />
            Send Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

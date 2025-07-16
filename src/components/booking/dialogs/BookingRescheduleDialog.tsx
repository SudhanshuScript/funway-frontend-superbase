
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
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Mock session data - in a real app this would come from an API
const sessions = [
  { id: "SD-001", name: "Sunset Dinner" },
  { id: "BS-002", name: "Brunch Special" },
  { id: "VD-003", name: "Valentine's Day Special" },
  { id: "LN-004", name: "Lunch" },
  { id: "DN-005", name: "Dinner" }
];

interface BookingRescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: UpcomingBooking;
  selectedBooking?: UpcomingBooking | null;
  newBookingDate: Date | undefined;
  setNewBookingDate: (date: Date | undefined) => void;
  newSessionId: string;
  setNewSessionId: (sessionId: string) => void;
  onConfirmReschedule: () => Promise<void>;
}

export function BookingRescheduleDialog({
  open,
  onOpenChange,
  booking,
  selectedBooking,
  newBookingDate,
  setNewBookingDate,
  newSessionId,
  setNewSessionId,
  onConfirmReschedule
}: BookingRescheduleDialogProps) {
  const bookingToUse = booking || selectedBooking;
  
  if (!bookingToUse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
          <DialogDescription>
            Reschedule the booking for {bookingToUse.guestName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Current booking details:</Label>
            <ul className="list-disc pl-5 space-y-1">
              <li>Guest: {bookingToUse.guestName}</li>
              <li>Session: {bookingToUse.sessionName}</li>
              <li>Date: {new Date(bookingToUse.bookingDate).toLocaleDateString()}</li>
              <li>Guests: {bookingToUse.totalGuests}</li>
            </ul>
          </div>
          
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="date">New booking date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newBookingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newBookingDate ? format(newBookingDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newBookingDate}
                    onSelect={setNewBookingDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="session">New session</Label>
              <Select value={newSessionId} onValueChange={setNewSessionId}>
                <SelectTrigger id="session">
                  <SelectValue placeholder="Select a session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map(session => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirmReschedule}
            disabled={!newBookingDate || !newSessionId}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Reschedule Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

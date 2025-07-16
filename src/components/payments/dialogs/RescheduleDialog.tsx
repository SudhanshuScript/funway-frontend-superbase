
import React from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from '../types';

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransaction: Transaction | null;
  rescheduleDate: Date | undefined;
  setRescheduleDate: (date: Date | undefined) => void;
  rescheduleSession: string;
  setRescheduleSession: (session: string) => void;
  onConfirm: () => void;
}

export function RescheduleDialog({
  open,
  onOpenChange,
  selectedTransaction,
  rescheduleDate,
  setRescheduleDate,
  rescheduleSession,
  setRescheduleSession,
  onConfirm
}: RescheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
          <DialogDescription>
            Select a new date and session for this booking. No refunds will be issued for rescheduled bookings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">New Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal text-spotBooking border-spotBooking/30 hover:bg-spotBooking/10 ${!rescheduleDate && 'text-muted-foreground'}`}
                >
                  {rescheduleDate ? format(rescheduleDate, "PPP") : "Select a date"}
                  <CalendarIcon className="ml-auto h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={rescheduleDate}
                  onSelect={setRescheduleDate}
                  disabled={(date) => {
                    const now = new Date();
                    const tomorrow = new Date(now);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return date < tomorrow;
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="session">New Session</Label>
            <Select value={rescheduleSession} onValueChange={setRescheduleSession}>
              <SelectTrigger className="text-spotBooking border-spotBooking/30 hover:bg-spotBooking/10">
                <SelectValue placeholder="Select a session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="special">Special Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm text-amber-600 mt-2">
              <AlertTriangle className="h-4 w-4 inline-block mr-1" />
              Changes must be made at least 24 hours before the original booking.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="spotBooking" onClick={onConfirm}>
            Confirm Reschedule
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

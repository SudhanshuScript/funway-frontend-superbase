
import React from 'react';
import { Button } from "@/components/ui/button";
import { UpcomingBooking } from "@/types/bookingTypes";
import { Send, Calendar, X, Check, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BookingActionsProps {
  booking: UpcomingBooking;
  onSendReminder: (booking: UpcomingBooking) => void;
  onCancelBooking: (booking: UpcomingBooking) => void;
  onConfirmBooking: (booking: UpcomingBooking) => void;
  onRescheduleBooking: (booking: UpcomingBooking) => void;
  onViewDetails: (booking: UpcomingBooking) => void;
}

export function BookingActions({
  booking,
  onSendReminder,
  onCancelBooking,
  onConfirmBooking,
  onRescheduleBooking,
  onViewDetails
}: BookingActionsProps) {
  return (
    <div className="flex justify-end space-x-1 bg-background/80 dark:bg-background/30 px-2 py-1 rounded-md">
      <TooltipProvider>
        {/* Send Reminder Button */}
        {(booking.status !== "cancelled" && booking.paymentStatus === "pending") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onSendReminder(booking)}
                className="h-8 w-8 border-border text-muted-foreground bg-accent/5 hover:bg-accent/10 hover:text-accent-foreground dark:bg-accent/10 dark:border-border dark:hover:bg-accent/20"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send Reminder</TooltipContent>
          </Tooltip>
        )}
        
        {/* Reschedule Button */}
        {booking.status !== "cancelled" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onRescheduleBooking(booking)}
                className="h-8 w-8 border-border text-muted-foreground bg-accent/5 hover:bg-accent/10 hover:text-accent-foreground dark:bg-accent/10 dark:border-border dark:hover:bg-accent/20"
              >
                <Calendar className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reschedule Booking</TooltipContent>
          </Tooltip>
        )}
        
        {/* Cancel Button */}
        {booking.status !== "cancelled" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onCancelBooking(booking)}
                className="h-8 w-8 border-border text-muted-foreground bg-accent/5 hover:bg-accent/10 hover:text-accent-foreground dark:bg-accent/10 dark:border-border dark:hover:bg-accent/20"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cancel Booking</TooltipContent>
          </Tooltip>
        )}
        
        {/* Confirm Button */}
        {booking.status === "pending" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onConfirmBooking(booking)}
                className="h-8 w-8 border-spotBooking/30 text-spotBooking bg-spotBooking/5 hover:bg-spotBooking/10 hover:text-spotBooking dark:bg-spotBooking/10 dark:border-spotBooking/40 dark:hover:bg-spotBooking/20"
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Confirm Booking</TooltipContent>
          </Tooltip>
        )}
        
        {/* View Details Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onViewDetails(booking)}
              className="h-8 w-8 text-muted-foreground bg-background/50 hover:bg-accent hover:text-foreground dark:bg-background/20 dark:hover:bg-accent/30 dark:hover:text-primary-foreground"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View Details</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

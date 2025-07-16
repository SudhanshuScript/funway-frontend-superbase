
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { BookingStatus, PaymentStatus, ReminderStatus } from '@/types/bookingTypes';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  let variant: 
    | "default"
    | "secondary"
    | "outline"
    | "destructive";

  switch (status) {
    case "confirmed":
      variant = "default";
      break;
    case "pending":
      variant = "secondary";
      break;
    case "cancelled":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }

  return (
    <Badge variant={variant}>{status}</Badge>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  let variant: 
    | "default"
    | "secondary"
    | "outline"
    | "destructive";

  switch (status) {
    case "paid":
      variant = "default";
      break;
    case "pending":
      variant = "secondary";
      break;
    case "partial":
      variant = "secondary";
      break;
    case "refunded":
      variant = "outline";
      break;
    default:
      variant = "outline";
  }

  return (
    <Badge variant={variant}>{status}</Badge>
  );
}

interface ReminderStatusBadgeProps {
  status: ReminderStatus;
  lastReminderSent?: string;
  reminderCount: number;
}

export function ReminderStatusBadge({ 
  status, 
  lastReminderSent, 
  reminderCount
}: ReminderStatusBadgeProps) {
  let variant: 
    | "default"
    | "secondary"
    | "outline"
    | "destructive";

  switch (status) {
    case "sent":
      variant = "default";
      break;
    case "not_sent":
      variant = "secondary";
      break;
    case "responded":
      variant = "secondary";
      break;
    case "no_response":
      variant = "outline";
      break;
    default:
      variant = "outline";
  }

  return (
    <div className="flex flex-col text-xs">
      <Badge variant={variant} className="w-fit">
        {status === "not_sent" ? "Not Sent" : status === "no_response" ? "No Response" : status}
      </Badge>
      {lastReminderSent && (
        <span className="text-muted-foreground mt-1">
          {format(parseISO(lastReminderSent), 'MMM d, yyyy')}
          <br/>Count: {reminderCount}
        </span>
      )}
    </div>
  );
}

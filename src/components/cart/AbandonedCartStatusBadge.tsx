
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AbandonmentReason, ReminderStatus } from "@/types/bookingTypes";
import { format, parseISO } from 'date-fns';

// Centralized color mapping configuration
const STATUS_COLORS = {
  // Abandonment reason colors
  abandonmentReasons: {
    payment_failure: "bg-destructive/10 text-destructive border-destructive/30",
    session_unavailability: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    user_dropout: "bg-primary/10 text-primary border-primary/30",
    unknown: "bg-muted/10 text-muted-foreground border-muted/30"
  },
  
  // Reminder status colors
  reminderStatus: {
    not_sent: "bg-muted/10 text-muted-foreground border-muted/30",
    sent: "bg-primary/10 text-primary border-primary/30",
    responded: "bg-green-500/10 text-green-700 border-green-500/30",
    no_response: "bg-amber-500/10 text-amber-700 border-amber-500/30"
  }
};

// Display text mapping configuration
const DISPLAY_TEXT = {
  // Abandonment reason display texts
  abandonmentReasons: {
    payment_failure: 'Payment Failed',
    session_unavailability: 'Session Unavailable',
    user_dropout: 'User Dropout',
    unknown: 'Unknown'
  },
  
  // Reminder status display texts
  reminderStatus: {
    not_sent: 'Not Sent',
    sent: 'Sent',
    responded: 'Responded',
    no_response: 'No Response'
  }
};

// Utility function to get color classes for abandonment reason
const getAbandonmentColor = (reason: AbandonmentReason): string => {
  return STATUS_COLORS.abandonmentReasons[reason] || STATUS_COLORS.abandonmentReasons.unknown;
};

// Utility function to get formatted text for abandonment reason
const formatAbandonmentReason = (reason: AbandonmentReason): string => {
  return DISPLAY_TEXT.abandonmentReasons[reason] || reason;
};

// Utility function to get color classes for reminder status
const getReminderStatusColor = (status: ReminderStatus): string => {
  return STATUS_COLORS.reminderStatus[status] || STATUS_COLORS.reminderStatus.not_sent;
};

// Utility function to get formatted text for reminder status
const formatReminderStatus = (status: ReminderStatus): string => {
  return DISPLAY_TEXT.reminderStatus[status] || status;
};

interface AbandonmentReasonBadgeProps {
  reason: AbandonmentReason;
}

export function AbandonmentReasonBadge({ reason }: AbandonmentReasonBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={getAbandonmentColor(reason)}
    >
      {formatAbandonmentReason(reason)}
    </Badge>
  );
}

interface ReminderStatusBadgeProps {
  status: ReminderStatus;
  lastReminderSent?: string;
  reminderCount: number;
}

export function ReminderStatusBadge({ status, lastReminderSent, reminderCount }: ReminderStatusBadgeProps) {
  return (
    <div className="flex flex-col gap-1">
      <Badge 
        variant="outline" 
        className={getReminderStatusColor(status)}
      >
        {formatReminderStatus(status)}
      </Badge>
      {lastReminderSent && (
        <span className="text-xs text-muted-foreground">
          {format(parseISO(lastReminderSent), 'MMM d, yyyy')}
        </span>
      )}
      {reminderCount > 0 && (
        <span className="text-xs text-muted-foreground">
          Count: {reminderCount}
        </span>
      )}
    </div>
  );
}

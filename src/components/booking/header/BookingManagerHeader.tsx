
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { BookingManagerActions } from './BookingManagerActions';

interface BookingManagerHeaderProps {
  showCustomData: boolean;
  toggleCustomData: () => void;
  showReminderHistory: boolean;
  toggleReminderHistory: () => void;
  handleSendBulkReminders: () => void;
}

export function BookingManagerHeader({
  showCustomData,
  toggleCustomData,
  showReminderHistory,
  toggleReminderHistory,
  handleSendBulkReminders
}: BookingManagerHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between py-4">
      <CardTitle>Upcoming Bookings</CardTitle>
      <BookingManagerActions 
        showCustomData={showCustomData}
        toggleCustomData={toggleCustomData}
        showReminderHistory={showReminderHistory}
        toggleReminderHistory={toggleReminderHistory}
        handleSendBulkReminders={handleSendBulkReminders}
      />
    </div>
  );
}

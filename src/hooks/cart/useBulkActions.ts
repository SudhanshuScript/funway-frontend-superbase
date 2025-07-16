
import { useState } from 'react';
import { toast } from 'sonner';
import { ReminderMethod } from '@/types/bookingTypes';
import { UseBulkActionsResult } from './types';

export function useBulkActions(): UseBulkActionsResult {
  const [loading, setLoading] = useState(false);

  const sendBulkReminders = async (cartIds: string[], templateId: string, method: ReminderMethod) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const successCount = cartIds.length; // In mock data, assume all succeed
      toast.success(`All ${successCount} reminders sent successfully`);
      return successCount;
    } catch (error) {
      console.error("Error sending bulk reminders:", error);
      toast.error("Failed to send bulk reminders");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendBulkReminders,
    loading
  };
}


import { useState } from 'react';
import { toast } from 'sonner';
import { useAuditLogger } from '@/utils/auditLogger';
import { UpcomingBooking } from '@/types/bookingTypes';

export function useBulkBookingActions() {
  const [loading, setLoading] = useState(false);
  const { logEvent } = useAuditLogger();

  // Send bulk reminders
  const sendBulkReminders = async (
    bookingIds: string[],
    bookings: UpcomingBooking[],
    setBookings: React.Dispatch<React.SetStateAction<UpcomingBooking[]>>
  ) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      let successCount = 0;
      const now = new Date().toISOString();
      
      for (const bookingId of bookingIds) {
        try {
          // Update booking with reminder info
          setBookings(prev => 
            prev.map(b => 
              b.id === bookingId 
                ? { 
                    ...b, 
                    reminderStatus: 'sent', 
                    lastReminderSent: now, 
                    reminderCount: b.reminderCount + 1 
                  } 
                : b
            )
          );
          
          // Log the event
          await logEvent('booking', bookingId, 'reminder_sent');
          
          successCount++;
        } catch (error) {
          console.error(`Failed to send reminder for booking ${bookingId}:`, error);
        }
      }
      
      return successCount;
    } catch (error) {
      console.error("Error sending bulk reminders:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendBulkReminders
  };
}

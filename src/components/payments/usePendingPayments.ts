
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Mock data for pending payments with guestType added
const initialPendingPayments = [
  {
    id: "BK-2023-006",
    guestName: "Michael Brown",
    totalGuests: 3,
    sessionName: "Sunset Dinner",
    bookingDate: "2023-06-01",
    dueAmount: 349.99,
    remindersSent: 1,
    paymentStatus: "Pending",
    guestType: "Regular" as const
  },
  {
    id: "BK-2023-007",
    guestName: "Jessica Wilson",
    totalGuests: 2,
    sessionName: "Brunch Special",
    bookingDate: "2023-06-02",
    dueAmount: 189.99,
    remindersSent: 0,
    paymentStatus: "Pending",
    guestType: "First Timer" as const
  },
  {
    id: "BK-2023-008",
    guestName: "Thomas Anderson",
    totalGuests: 4,
    sessionName: "Valentine's Day Special",
    bookingDate: "2023-06-03",
    dueAmount: 499.99,
    remindersSent: 2,
    paymentStatus: "Overdue",
    guestType: "VIP" as const
  }
];

// Define a type for the pending booking
export type PendingBooking = {
  id: string;
  guestName: string;
  totalGuests: number;
  sessionName: string;
  bookingDate: string;
  dueAmount: number;
  remindersSent: number;
  paymentStatus: string;
  guestType?: "Regular" | "VIP" | "First Timer";
};

export function usePendingPayments() {
  const [pendingPayments, setPendingPayments] = useState<PendingBooking[]>(initialPendingPayments);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching pending payments
  useEffect(() => {
    // In a real app, this would be an API call
    setIsLoading(true);
    setTimeout(() => {
      setPendingPayments(initialPendingPayments);
      setIsLoading(false);
    }, 500);
  }, []);

  const sendPaymentReminder = async (bookingId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call to send reminder
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the reminder count for the booking
      setPendingPayments(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, remindersSent: booking.remindersSent + 1 } 
            : booking
        )
      );
      
      // Log the action (in a real app, this would be sent to the server)
      console.log(`Payment reminder sent for booking ${bookingId}`);
      
      return true;
    } catch (error) {
      console.error("Error sending payment reminder:", error);
      throw new Error("Failed to send payment reminder");
    } finally {
      setIsLoading(false);
    }
  };

  const markPaymentComplete = async (bookingId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call to update payment status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the booking from pending payments
      setPendingPayments(prev => prev.filter(booking => booking.id !== bookingId));
      
      toast.success(`Payment for booking ${bookingId} marked as complete`);
      
      return true;
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pendingPayments,
    isLoading,
    sendPaymentReminder,
    markPaymentComplete
  };
}

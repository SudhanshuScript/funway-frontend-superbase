
import { useState } from 'react';
import { toast } from 'sonner';
import { UpcomingBooking, BookingStatus, PaymentStatus } from '@/types/bookingTypes';
import { updateBooking, deleteBooking } from '@/lib/api/bookings';

export function useBookingActions() {
  const [loading, setLoading] = useState(false);

  // Send booking reminder using API
  const sendReminder = async (
    bookingId: string, 
    bookings: UpcomingBooking[], 
    setBookings: React.Dispatch<React.SetStateAction<UpcomingBooking[]>>
  ) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would call an API endpoint to send reminder
      // await apiClient.post(`/bookings/${bookingId}/send-reminder`);
      
      const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            reminderStatus: 'sent' as const,
            lastReminderSent: new Date().toISOString(),
            reminderCount: (booking.reminderCount || 0) + 1,
          };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      toast.success('Reminder sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Confirm booking using new API
  const confirmBooking = async (
    bookingId: string, 
    bookings: UpcomingBooking[], 
    setBookings: React.Dispatch<React.SetStateAction<UpcomingBooking[]>>
  ) => {
    setLoading(true);
    
    try {
      // Use the new API function
      await updateBooking(bookingId, { 
        paymentStatus: 'Paid',
        checkInStatus: 'Awaited'
      });
      
      const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            status: 'confirmed' as BookingStatus,
          };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      toast.success('Booking confirmed successfully');
      return true;
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Failed to confirm booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking using new API
  const cancelBooking = async (
    bookingId: string, 
    reason: string,
    bookings: UpcomingBooking[], 
    setBookings: React.Dispatch<React.SetStateAction<UpcomingBooking[]>>
  ) => {
    setLoading(true);
    
    try {
      // Use the new API function to update status instead of delete
      await updateBooking(bookingId, {
        checkInStatus: 'Awaited', // Reset check-in status
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
      });
      
      const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            status: 'cancelled' as BookingStatus,
            cancellationReason: reason,
          };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      toast.success('Booking cancelled successfully');
      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update payment status using new API
  const updatePaymentStatus = async (
    bookingId: string,
    newStatus: PaymentStatus,
    bookings: UpcomingBooking[],
    setBookings: React.Dispatch<React.SetStateAction<UpcomingBooking[]>>
  ) => {
    setLoading(true);
    
    try {
      // Map PaymentStatus to API format
      const apiPaymentStatus = newStatus === 'paid' ? 'Paid' : 
                              newStatus === 'partial' ? 'Partially Paid' : 'Pending';
      
      // Use the new API function
      await updateBooking(bookingId, { 
        paymentStatus: apiPaymentStatus as 'Pending' | 'Partially Paid' | 'Paid'
      });
      
      const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingId) {
          // If setting to paid and booking is pending, also update status to confirmed
          const newBookingStatus = 
            newStatus === 'paid' && booking.status === 'pending' 
              ? 'confirmed' as BookingStatus
              : booking.status;
          
          return {
            ...booking,
            paymentStatus: newStatus,
            status: newBookingStatus
          };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      toast.success(`Payment status updated to ${newStatus}`);
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reschedule booking using new API
  const rescheduleBooking = async (
    bookingId: string, 
    newDate: Date,
    newSessionId: string,
    bookings: UpcomingBooking[], 
    setBookings: React.Dispatch<React.SetStateAction<UpcomingBooking[]>>
  ) => {
    setLoading(true);
    
    try {
      // Use the new API function
      await updateBooking(bookingId, {
        bookingDate: newDate.toISOString(),
        sessionId: newSessionId,
      });
      
      const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            bookingDate: newDate.toISOString(),
            sessionId: newSessionId,
          };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      toast.success('Booking rescheduled successfully');
      return true;
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast.error('Failed to reschedule booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendReminder,
    confirmBooking,
    cancelBooking,
    rescheduleBooking,
    updatePaymentStatus
  };
}

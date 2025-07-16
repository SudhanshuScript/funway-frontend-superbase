
import { useBookingData } from './bookings/useBookingData';
import { useBookingFilter } from './bookings/useBookingFilter';
import { useBookingActions } from './bookings/useBookingActions';
import { useBulkBookingActions } from './bookings/useBulkBookingActions';
import { PaymentStatus } from '@/types/bookingTypes';

export function useUpcomingBookings() {
  const { bookings, setBookings, stats } = useBookingData();
  const { activeFilter, setActiveFilter, filterBookings } = useBookingFilter();
  const { 
    loading: actionsLoading, 
    sendReminder, 
    confirmBooking, 
    cancelBooking, 
    rescheduleBooking,
    updatePaymentStatus 
  } = useBookingActions();
  const { loading: bulkActionsLoading, sendBulkReminders: bulkSendReminders } = useBulkBookingActions();

  const filteredBookings = filterBookings(bookings);
  
  const loading = actionsLoading || bulkActionsLoading;

  // Wrapper functions to simplify the API
  const handleSendReminder = async (bookingId: string) => {
    return await sendReminder(bookingId, bookings, setBookings);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    return await confirmBooking(bookingId, bookings, setBookings);
  };

  const handleCancelBooking = async (bookingId: string, reason: string = "") => {
    return await cancelBooking(bookingId, reason, bookings, setBookings);
  };

  const handleRescheduleBooking = async (bookingId: string, newDate: Date, newSessionId: string) => {
    return await rescheduleBooking(bookingId, newDate, newSessionId, bookings, setBookings);
  };

  const handleUpdatePaymentStatus = async (bookingId: string, newStatus: PaymentStatus) => {
    return await updatePaymentStatus(bookingId, newStatus, bookings, setBookings);
  };

  const handleSendBulkReminders = async (bookingIds: string[]) => {
    return await bulkSendReminders(bookingIds, bookings, setBookings);
  };

  return {
    bookings: filteredBookings,
    stats,
    loading,
    activeFilter,
    setActiveFilter,
    sendReminder: handleSendReminder,
    confirmBooking: handleConfirmBooking,
    cancelBooking: handleCancelBooking,
    rescheduleBooking: handleRescheduleBooking,
    updatePaymentStatus: handleUpdatePaymentStatus,
    sendBulkReminders: handleSendBulkReminders
  };
}

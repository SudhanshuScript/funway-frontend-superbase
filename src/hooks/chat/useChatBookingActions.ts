
import { toast } from 'sonner';
import { BookingSummary } from '@/types/chatTypes';

export function useChatBookingActions(
  selectedConversationId: string | null,
  onSendMessage: (conversationId: string, content: string) => void
) {
  // Handle booking actions
  const handleModifyBooking = (bookingId: string) => {
    toast.info(`Opening modification form for booking ${bookingId}`);
    // This would open a modal in a real implementation
  };

  const handleSendPaymentLink = (bookingId: string) => {
    toast.success(`Payment link sent for booking ${bookingId}`);
    
    if (selectedConversationId) {
      onSendMessage(
        selectedConversationId,
        "Here's your payment link to complete the reservation: https://flydining.com/pay/booking-" + bookingId
      );
    }
  };

  const handleSendReminder = (bookingId: string) => {
    toast.success(`Reminder sent for booking ${bookingId}`);
    
    if (selectedConversationId && bookingSummary) {
      onSendMessage(
        selectedConversationId,
        `Just a friendly reminder about your upcoming reservation:\n\nDate: ${new Date(bookingSummary.date).toLocaleDateString()}\nTime: ${bookingSummary.time}\nSession: ${bookingSummary.session_name}\nGuests: ${bookingSummary.guest_count}\n\nWe look forward to welcoming you at SkyBistro!`
      );
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    toast.info(`Opening cancellation form for booking ${bookingId}`);
    // This would open a modal in a real implementation
  };

  const handleViewGuestProfile = (guestId: string) => {
    toast.info(`Opening guest profile for ${guestId}`);
    // This would navigate to the guests page or open a modal in a real implementation
  };
  
  // Booking reminder helper that uses the bookingSummary to format message
  let bookingSummary: BookingSummary | null = null;
  
  const setBookingSummary = (summary: BookingSummary | null) => {
    bookingSummary = summary;
  };

  return {
    setBookingSummary,
    handleModifyBooking,
    handleSendPaymentLink,
    handleSendReminder,
    handleCancelBooking,
    handleViewGuestProfile
  };
}

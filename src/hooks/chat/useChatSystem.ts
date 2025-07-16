
import { useState } from 'react';
import { useChatFilters } from './useChatFilters';
import { useChatMessages } from './useChatMessages';
import { useChatBookingActions } from './useChatBookingActions';
import { mockQuickReplies, mockFranchises } from './mockChatData';
import { QuickReply, ChatStatus, MessageTag } from '@/types/chatTypes';
import { toast } from 'sonner';

export function useChatSystem() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  // Get conversations and filters
  const { 
    conversations,
    filters,
    handleFiltersChange,
    handleSearchChange,
    updateConversationStatus,
    bulkArchiveConversations,
    bulkAssignConversations,
    bulkUpdateStatus,
    reassignConversation
  } = useChatFilters();
  
  // Get messages and related data for selected conversation
  const {
    messages,
    bookingSummary,
    guestProfile,
    bookingActions,
    isLoadingMessages,
    handleSendMessage,
    addMessageTag,
    removeMessageTag
  } = useChatMessages(selectedConversationId);
  
  // Get booking-related actions
  const {
    setBookingSummary,
    handleModifyBooking,
    handleSendPaymentLink,
    handleSendReminder,
    handleCancelBooking,
    handleViewGuestProfile
  } = useChatBookingActions(selectedConversationId, handleSendMessage);
  
  // Set booking summary for the booking actions hook
  if (bookingSummary) {
    setBookingSummary(bookingSummary);
  }
  
  // Quick reply handling
  const handleSelectQuickReply = (reply: QuickReply) => {
    if (selectedConversationId) {
      handleSendMessage(selectedConversationId, reply.content);
    }
  };
  
  // Bulk export conversations
  const bulkExportConversations = (conversationIds: string[]) => {
    // This would be implemented with real export logic in a production environment
    toast.info('Export functionality would download selected conversations as PDF');
    console.log('Exporting conversations:', conversationIds);
    return true;
  };
  
  return {
    conversations,
    messages,
    selectedConversationId,
    bookingSummary,
    guestProfile,
    bookingActions,
    quickReplies: mockQuickReplies,
    isLoadingMessages,
    franchises: mockFranchises,
    filters,
    setSelectedConversationId,
    handleSendMessage,
    handleSearchChange,
    handleFiltersChange,
    handleModifyBooking,
    handleSendPaymentLink,
    handleSendReminder,
    handleCancelBooking,
    handleViewGuestProfile,
    handleSelectQuickReply,
    updateConversationStatus,
    bulkArchiveConversations,
    bulkAssignConversations,
    bulkUpdateStatus,
    bulkExportConversations,
    reassignConversation,
    addMessageTag,
    removeMessageTag
  };
}

// Re-export for backward compatibility
export { useChatSystem as default };

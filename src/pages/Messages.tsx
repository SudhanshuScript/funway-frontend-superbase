
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MessageSquare } from "lucide-react";
import { useUserRole } from '@/providers/UserRoleProvider';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { GuestChatLayout } from "@/components/chat/GuestChatLayout";
import { useChatSystem } from "@/hooks/useChatSystem";
import { ChatStatus, MessageTag } from "@/types/chatTypes";

const Messages = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  
  const { 
    conversations,
    messages,
    selectedConversationId,
    bookingSummary,
    guestProfile,
    bookingActions,
    quickReplies,
    isLoadingMessages,
    franchises,
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
    updateConversationStatus,
    bulkArchiveConversations,
    bulkAssignConversations,
    bulkUpdateStatus,
    bulkExportConversations,
    reassignConversation,
    addMessageTag,
    removeMessageTag
  } = useChatSystem();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleUpdateStatus = (conversationId: string, status: ChatStatus) => {
    updateConversationStatus(conversationId, status);
  };

  const handleAddTag = (messageId: string, tag: string) => {
    addMessageTag(messageId, tag as MessageTag);
  };
  
  const handleRemoveTag = (messageId: string, tag: string) => {
    removeMessageTag(messageId, tag as MessageTag);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            <h2 className="text-2xl font-bold">Guest Chat Center</h2>
          </div>
        </div>
        
        <GuestChatLayout
          conversations={conversations}
          messages={messages}
          selectedConversationId={selectedConversationId}
          bookingSummary={bookingSummary}
          guestProfile={guestProfile}
          quickReplies={quickReplies}
          bookingActions={bookingActions}
          isLoadingMessages={isLoadingMessages}
          franchises={franchises}
          filters={filters}
          onSelectConversation={setSelectedConversationId}
          onSendMessage={handleSendMessage}
          onSearchChange={handleSearchChange}
          onFiltersChange={handleFiltersChange}
          onModifyBooking={handleModifyBooking}
          onSendPaymentLink={handleSendPaymentLink}
          onSendReminder={handleSendReminder}
          onCancelBooking={handleCancelBooking}
          onViewGuestProfile={handleViewGuestProfile}
          onUpdateConversationStatus={handleUpdateStatus}
          onBulkArchive={bulkArchiveConversations}
          onBulkAssign={bulkAssignConversations}
          onBulkUpdateStatus={bulkUpdateStatus}
          onBulkExport={bulkExportConversations}
          onReassignConversation={reassignConversation}
          onAddMessageTag={handleAddTag}
          onRemoveMessageTag={handleRemoveTag}
        />
      </div>
    </DashboardLayout>
  );
};

export default Messages;

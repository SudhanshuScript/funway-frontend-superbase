
import React, { useState } from 'react';
import { ConversationList } from './ConversationList';
import { BookingInfoSidebar } from './BookingInfoSidebar';
import { ChatFiltersDrawer } from './ChatFiltersDrawer';
import { QuickReplySelector } from './QuickReplySelector';
import { ReassignDialog } from './reassign/ReassignDialog';
import { ChatMainContent } from './layout/ChatMainContent';
import { FranchiseSelector } from './layout/FranchiseSelector';
import { BulkActionsToolbar } from './bulk/BulkActionsToolbar';
import { 
  Conversation, 
  Message, 
  BookingSummary, 
  GuestChatProfile,
  QuickReply,
  ChatFilter,
  BookingAction,
  ChatStatus
} from '@/types/chatTypes';
import { useUserRole } from "@/providers/UserRoleProvider";
import { toast } from 'sonner';

interface GuestChatLayoutProps {
  conversations: Conversation[];
  messages: Message[];
  selectedConversationId: string | null;
  bookingSummary: BookingSummary | null;
  guestProfile: GuestChatProfile | null;
  quickReplies: QuickReply[];
  bookingActions: BookingAction[];
  isLoadingMessages: boolean;
  franchises: { id: string; name: string }[];
  filters: ChatFilter;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, content: string, files?: File[]) => void;
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: ChatFilter) => void;
  onModifyBooking: (bookingId: string) => void;
  onSendPaymentLink: (bookingId: string) => void;
  onSendReminder: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onViewGuestProfile: (guestId: string) => void;
  onUpdateConversationStatus?: (conversationId: string, status: ChatStatus) => void;
  onBulkArchive?: (conversationIds: string[]) => void;
  onBulkAssign?: (conversationIds: string[], franchiseId: string) => void;
  onBulkUpdateStatus?: (conversationIds: string[], status: ChatStatus) => void;
  onBulkExport?: (conversationIds: string[]) => void;
  onReassignConversation?: (conversationId: string, franchiseId: string) => void;
  onAddMessageTag?: (messageId: string, tag: string) => void;
  onRemoveMessageTag?: (messageId: string, tag: string) => void;
}

export function GuestChatLayout({
  conversations,
  messages,
  selectedConversationId,
  bookingSummary,
  guestProfile,
  quickReplies,
  bookingActions = [],
  isLoadingMessages,
  franchises,
  filters,
  onSelectConversation,
  onSendMessage,
  onSearchChange,
  onFiltersChange,
  onModifyBooking,
  onSendPaymentLink,
  onSendReminder,
  onCancelBooking,
  onViewGuestProfile,
  onUpdateConversationStatus,
  onBulkArchive,
  onBulkAssign,
  onBulkUpdateStatus,
  onBulkExport,
  onReassignConversation,
  onAddMessageTag,
  onRemoveMessageTag
}: GuestChatLayoutProps) {
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [isQuickReplyOpen, setIsQuickReplyOpen] = useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [showInfoSidebar, setShowInfoSidebar] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  
  const { currentUser } = useUserRole();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  // Handle conversation selection/update
  const handleConversationSelect = (id: string, selected: boolean) => {
    // Update the selection status of the conversation
    const updatedConversations = conversations.map(conv => 
      conv.id === id ? { ...conv, selected } : conv
    );
    
    // In a real implementation, you would dispatch this to your state management system
    console.log('Updated conversation selection:', updatedConversations.filter(c => c.selected).length, 'selected');
  };

  // Handle location change for franchise selector
  const handleLocationChange = (franchiseId: string) => {
    const updatedFilters = { 
      ...filters, 
      franchise_id: franchiseId 
    };
    onFiltersChange(updatedFilters);
  };

  // Messaging handling
  const handleSendMessage = (content: string, files?: File[]) => {
    if (selectedConversationId) {
      onSendMessage(selectedConversationId, content, files);
    }
  };

  // Chat status update
  const handleStatusChange = (status: ChatStatus) => {
    if (selectedConversationId && onUpdateConversationStatus) {
      onUpdateConversationStatus(selectedConversationId, status);
      toast.success(`Conversation status updated to ${status}`);
    }
  };

  // QuickReply handling
  const handleSelectQuickReply = (reply: QuickReply) => {
    if (selectedConversationId) {
      onSendMessage(selectedConversationId, reply.content);
      setIsQuickReplyOpen(false);
    }
  };

  // Booking action handlers
  const handleModifyBooking = () => {
    if (bookingSummary) {
      onModifyBooking(bookingSummary.id);
    }
  };

  const handleSendPaymentLink = () => {
    if (bookingSummary) {
      onSendPaymentLink(bookingSummary.id);
    }
  };

  const handleSendReminder = () => {
    if (bookingSummary) {
      onSendReminder(bookingSummary.id);
    }
  };

  const handleCancelBooking = () => {
    if (bookingSummary) {
      onCancelBooking(bookingSummary.id);
    }
  };

  const handleViewGuestProfile = () => {
    if (guestProfile) {
      onViewGuestProfile(guestProfile.id);
    }
  };

  // Bulk action handlers
  const handleBulkArchive = () => {
    const selectedIds = conversations.filter(c => c.selected).map(c => c.id);
    if (selectedIds.length > 0 && onBulkArchive) {
      onBulkArchive(selectedIds);
      toast.success(`Archived ${selectedIds.length} conversations`);
      setBulkMode(false);
    }
  };

  const handleBulkAssign = (franchiseId: string) => {
    const selectedIds = conversations.filter(c => c.selected).map(c => c.id);
    if (selectedIds.length > 0 && onBulkAssign) {
      onBulkAssign(selectedIds, franchiseId);
      const franchiseName = franchises.find(f => f.id === franchiseId)?.name || 'selected franchise';
      toast.success(`Assigned ${selectedIds.length} conversations to ${franchiseName}`);
      setBulkMode(false);
    }
  };

  const handleBulkUpdateStatus = (status: ChatStatus) => {
    const selectedIds = conversations.filter(c => c.selected).map(c => c.id);
    if (selectedIds.length > 0 && onBulkUpdateStatus) {
      onBulkUpdateStatus(selectedIds, status);
      toast.success(`Updated ${selectedIds.length} conversations to ${status}`);
      setBulkMode(false);
    }
  };

  const handleBulkExport = () => {
    const selectedIds = conversations.filter(c => c.selected).map(c => c.id);
    if (selectedIds.length > 0 && onBulkExport) {
      onBulkExport(selectedIds);
      toast.success(`Exporting ${selectedIds.length} conversations`);
      setBulkMode(false);
    } else {
      toast.info('Export functionality is not yet implemented');
    }
  };

  // Reassign conversation handler
  const handleReassignConversation = (conversationId: string, franchiseId: string) => {
    if (onReassignConversation) {
      onReassignConversation(conversationId, franchiseId);
      const franchiseName = franchises.find(f => f.id === franchiseId)?.name || 'new franchise';
      toast.success(`Conversation reassigned to ${franchiseName}`);
    }
  };

  // Count selected conversations
  const selectedCount = conversations.filter(c => c.selected).length;

  return (
    <div className="grid h-[calc(100vh-160px)] grid-cols-12 gap-0">
      {/* Bulk actions toolbar at the top when in bulk mode */}
      {bulkMode && isSuperAdmin && (
        <div className="col-span-12">
          <BulkActionsToolbar
            selectedCount={selectedCount}
            onArchiveSelected={handleBulkArchive}
            onAssignSelected={handleBulkAssign}
            onMarkAsStatus={handleBulkUpdateStatus}
            onExportSelected={handleBulkExport}
            franchises={franchises}
            onClose={() => setBulkMode(false)}
          />
        </div>
      )}

      {/* Conversation List */}
      <div className="col-span-3 border-r">
        <div className="flex flex-col h-full">
          {isSuperAdmin && (
            <FranchiseSelector
              franchiseId={filters.franchise_id}
              onFranchiseChange={handleLocationChange}
              franchises={franchises}
            />
          )}
          
          <ConversationList
            conversations={conversations}
            activeConversationId={selectedConversationId}
            setActiveConversationId={onSelectConversation}
            searchQuery={filters.searchQuery}
            setSearchQuery={onSearchChange}
            openFiltersDrawer={() => setIsFiltersDrawerOpen(true)}
            onConversationSelect={handleConversationSelect}
            bulkMode={bulkMode}
            toggleBulkMode={() => setBulkMode(!bulkMode)}
          />
        </div>
      </div>
      
      {/* Chat Window */}
      <div className="col-span-6 flex flex-col h-full">
        <ChatMainContent
          selectedConversationId={selectedConversationId}
          conversations={conversations}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          bookingSummary={bookingSummary}
          bookingActions={bookingActions}
          quickReplies={quickReplies}
          onSendMessage={handleSendMessage}
          onOpenQuickReply={() => setIsQuickReplyOpen(true)}
          toggleInfoSidebar={() => setShowInfoSidebar(!showInfoSidebar)}
          showInfoSidebar={showInfoSidebar}
          onReassignChat={() => setIsReassignDialogOpen(true)}
          onStatusChange={handleStatusChange}
          onSendPaymentLink={handleSendPaymentLink}
          onAddTag={onAddMessageTag}
          onRemoveTag={onRemoveMessageTag}
        />
      </div>
      
      {/* Booking Info Sidebar */}
      <div className={`${showInfoSidebar ? 'col-span-3' : 'hidden'} border-l`}>
        <BookingInfoSidebar
          booking={bookingSummary}
          guestProfile={guestProfile}
          onModifyBooking={handleModifyBooking}
          onSendPaymentLink={handleSendPaymentLink}
          onSendReminder={handleSendReminder}
          onCancelBooking={handleCancelBooking}
          onViewGuestProfile={handleViewGuestProfile}
        />
      </div>
      
      {/* Drawers and Dialogs */}
      <ChatFiltersDrawer
        isOpen={isFiltersDrawerOpen}
        onClose={() => setIsFiltersDrawerOpen(false)}
        filters={filters}
        onApplyFilters={onFiltersChange}
        franchises={franchises}
      />
      
      <QuickReplySelector
        isOpen={isQuickReplyOpen}
        onClose={() => setIsQuickReplyOpen(false)}
        onSelectReply={handleSelectQuickReply}
        quickReplies={quickReplies}
      />
      
      <ReassignDialog
        isOpen={isReassignDialogOpen}
        onClose={() => setIsReassignDialogOpen(false)}
        conversation={selectedConversationId ? conversations.find(c => c.id === selectedConversationId) || null : null}
        franchises={franchises}
        onReassign={handleReassignConversation}
      />
    </div>
  );
}

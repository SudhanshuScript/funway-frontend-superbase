
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MessageSquare, Users, Mail, ClipboardList } from "lucide-react";
import { useUserRole } from '@/providers/UserRoleProvider';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuestChatLayout } from "@/components/chat/GuestChatLayout";
import { LeadsManager } from "@/components/lead/LeadsManager";
import { AutomatedReplies } from "@/components/lead/AutomatedReplies";
import { ActivityLog } from "@/components/lead/ActivityLog";
import { useChatSystem } from "@/hooks/useChatSystem";
import { ChatStatus, MessageTag } from "@/types/chatTypes";

const LeadManagement = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inbox");
  
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
            <h2 className="text-2xl font-bold">Lead Management</h2>
          </div>
        </div>
        
        <Tabs defaultValue="inbox" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="inbox" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Automated Replies
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center">
              <ClipboardList className="mr-2 h-4 w-4" />
              Activity Log
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inbox" className="w-full">
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
          </TabsContent>
          
          <TabsContent value="leads" className="w-full">
            <LeadsManager />
          </TabsContent>
          
          <TabsContent value="templates" className="w-full">
            <AutomatedReplies />
          </TabsContent>
          
          <TabsContent value="activity" className="w-full">
            <ActivityLog />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LeadManagement;

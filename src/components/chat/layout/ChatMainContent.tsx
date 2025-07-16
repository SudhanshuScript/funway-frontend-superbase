
import React from 'react';
import { ChatWindow } from '../ChatWindow';
import { ChatLayoutHeader } from './ChatLayoutHeader';
import { EmptyChatState } from '../EmptyChatState';
import { Conversation, Message, BookingSummary, QuickReply } from '@/types/chatTypes';
import { GuestSourceInsights } from '../GuestSourceInsights';

interface ChatMainContentProps {
  selectedConversationId: string | null;
  conversations: Conversation[];
  messages: Message[];
  isLoadingMessages: boolean;
  bookingSummary: BookingSummary | null;
  bookingActions: any[];
  quickReplies: QuickReply[];
  onSendMessage: (content: string, files?: File[]) => void;
  onOpenQuickReply: () => void;
  toggleInfoSidebar: () => void;
  showInfoSidebar: boolean;
  onReassignChat: () => void;
  onStatusChange: (status: string) => void;
  onSendPaymentLink?: () => void;
  onAddTag?: (messageId: string, tag: string) => void;
  onRemoveTag?: (messageId: string, tag: string) => void;
}

export function ChatMainContent({
  selectedConversationId,
  conversations,
  messages,
  isLoadingMessages,
  bookingSummary,
  bookingActions,
  quickReplies,
  onSendMessage,
  onOpenQuickReply,
  toggleInfoSidebar,
  showInfoSidebar,
  onReassignChat,
  onStatusChange,
  onSendPaymentLink,
  onAddTag,
  onRemoveTag
}: ChatMainContentProps) {
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  if (!selectedConversationId) {
    return <EmptyChatState />;
  }

  return (
    <>
      <ChatLayoutHeader
        selectedConversation={selectedConversation}
        openQuickReply={onOpenQuickReply}
        toggleInfoSidebar={toggleInfoSidebar}
        showInfoSidebar={showInfoSidebar}
        onReassignChat={onReassignChat}
        onStatusChange={onStatusChange}
      />
      
      <GuestSourceInsights conversation={selectedConversation} />
      
      <ChatWindow
        messages={messages}
        onSendMessage={onSendMessage}
        isLoading={isLoadingMessages}
        bookingSummary={bookingSummary}
        bookingActions={bookingActions}
        quickReplies={quickReplies}
        onSendPaymentLink={onSendPaymentLink}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />
    </>
  );
}

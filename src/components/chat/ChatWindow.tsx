
import React, { useState } from 'react';
import { BookingSummary, Message, QuickReply } from "@/types/chatTypes";
import { ChatMessageList } from './messages/ChatMessageList';
import { MessageInput } from './messages/MessageInput';
import { BookingActionsLog } from './BookingActionsLog';
import { useUserRole } from "@/providers/UserRoleProvider";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string, files?: File[]) => void;
  isLoading: boolean;
  bookingSummary: BookingSummary | null;
  bookingActions: any[];
  quickReplies: QuickReply[];
  onSendPaymentLink?: () => void;
  onAddTag?: (messageId: string, tag: string) => void;
  onRemoveTag?: (messageId: string, tag: string) => void;
}

export function ChatWindow({ 
  messages, 
  onSendMessage, 
  isLoading,
  bookingSummary,
  bookingActions,
  quickReplies,
  onSendPaymentLink,
  onAddTag,
  onRemoveTag
}: ChatWindowProps) {
  const { currentUser } = useUserRole();

  return (
    <div className="flex flex-col h-full">
      <ChatMessageList 
        messages={messages}
        isLoading={isLoading}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />
      
      {bookingSummary && bookingActions.length > 0 && (
        <BookingActionsLog actions={bookingActions} />
      )}
      
      <MessageInput 
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        bookingSummary={bookingSummary}
        quickReplies={quickReplies}
        onSendPaymentLink={onSendPaymentLink}
      />
    </div>
  );
}

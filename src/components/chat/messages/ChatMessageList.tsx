
import React, { useRef, useEffect } from 'react';
import { Message } from "@/types/chatTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from './ChatMessage';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  onAddTag?: (messageId: string, tag: string) => void;
  onRemoveTag?: (messageId: string, tag: string) => void;
}

export function ChatMessageList({ 
  messages, 
  isLoading,
  onAddTag,
  onRemoveTag
}: ChatMessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
            />
          ))
        )}
        {isLoading && (
          <div className="flex justify-center">
            <span className="text-muted-foreground">Loading messages...</span>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

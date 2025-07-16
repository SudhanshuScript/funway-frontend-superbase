
import React from 'react';
import { MessageSquare } from 'lucide-react';

export function EmptyChatState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <MessageSquare className="h-16 w-16 mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
      <p className="text-muted-foreground">
        Select a conversation from the list to start chatting or use the search to find a specific conversation.
      </p>
    </div>
  );
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, ArrowRightLeft } from 'lucide-react';
import { Conversation, ChatStatus } from '@/types/chatTypes';
import { StatusTagDropdown } from '../status/StatusTagDropdown';
import { useUserRole } from '@/providers/UserRoleProvider';

interface ChatLayoutHeaderProps {
  selectedConversation: Conversation | undefined;
  openQuickReply: () => void;
  toggleInfoSidebar: () => void;
  showInfoSidebar: boolean;
  onReassignChat: () => void;
  onStatusChange: (status: ChatStatus) => void;
}

export function ChatLayoutHeader({
  selectedConversation,
  openQuickReply,
  toggleInfoSidebar,
  showInfoSidebar,
  onReassignChat,
  onStatusChange
}: ChatLayoutHeaderProps) {
  const { currentUser } = useUserRole();
  const isSuperAdmin = currentUser?.role === 'superadmin';
  
  const handleStatusChange = (status: ChatStatus) => {
    onStatusChange(status);
  };

  return (
    <div className="border-b p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h3 className="font-medium">
            {selectedConversation?.guest_name || "Chat"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedConversation?.franchise_name || ""}
          </p>
        </div>
        
        {selectedConversation && (
          <StatusTagDropdown 
            status={selectedConversation.status as ChatStatus}
            onStatusChange={handleStatusChange}
            disabled={!isSuperAdmin && selectedConversation.status === 'escalated'}
          />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={openQuickReply}
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Quick Reply
        </Button>
        
        {isSuperAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReassignChat}
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Reassign
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleInfoSidebar}
        >
          {showInfoSidebar ? "Hide Info" : "Show Info"}
        </Button>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Search, Filter, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation, ChatStatus } from "@/types/chatTypes";
import { formatDistanceToNow } from "date-fns";
import { StatusTag } from './status/StatusTagDropdown';
import { ResponseTimeIndicator } from './status/ResponseTimeIndicator';
import { useUserRole } from '@/providers/UserRoleProvider';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openFiltersDrawer: () => void;
  onConversationSelect: (id: string, selected: boolean) => void;
  bulkMode: boolean;
  toggleBulkMode: () => void;
}

export function ConversationList({ 
  conversations, 
  activeConversationId, 
  setActiveConversationId,
  searchQuery,
  setSearchQuery,
  openFiltersDrawer,
  onConversationSelect,
  bulkMode,
  toggleBulkMode
}: ConversationListProps) {
  const { currentUser } = useUserRole();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          className="p-2 border rounded-md hover:bg-accent" 
          onClick={openFiltersDrawer}
        >
          <Filter className="h-4 w-4" />
        </button>
        {isSuperAdmin && (
          <button
            className={cn(
              "p-2 border rounded-md",
              bulkMode ? "bg-primary text-white" : "hover:bg-accent"
            )}
            onClick={toggleBulkMode}
          >
            <Check className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "flex items-center p-3 cursor-pointer border-b",
                activeConversationId === conversation.id ? "bg-accent" : "hover:bg-accent/50"
              )}
              onClick={() => setActiveConversationId(conversation.id)}
            >
              {bulkMode && isSuperAdmin && (
                <div className="mr-3" onClick={(e) => {
                  e.stopPropagation();
                  onConversationSelect(conversation.id, !conversation.selected);
                }}>
                  <Checkbox checked={conversation.selected} />
                </div>
              )}
              
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="" alt={conversation.guest_name} />
                <AvatarFallback>
                  {conversation.platform === "telegram" ? "TG" : 
                   conversation.platform === "whatsapp" ? "WA" : "WC"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="font-medium truncate">{conversation.guest_name}</span>
                    <StatusTag status={conversation.status} />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(conversation.last_message_time), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground truncate">
                    {conversation.last_message}
                  </span>
                  {conversation.unread_count > 0 && (
                    <Badge variant="default" className="ml-2">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs py-0 h-4">
                    {conversation.platform}
                  </Badge>
                  <span className="text-xs text-muted-foreground truncate">
                    {conversation.franchise_name}
                  </span>
                  
                  {conversation.response_time !== undefined && (
                    <ResponseTimeIndicator responseTime={conversation.response_time} />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}

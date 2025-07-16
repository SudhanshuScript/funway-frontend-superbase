
import { useState, useEffect } from 'react';
import { useUserRole } from '@/providers/UserRoleProvider';
import { Conversation, ChatFilter, ChatStatus } from '@/types/chatTypes';
import { mockConversations } from './mockChatData';
import { toast } from 'sonner';

export function useChatFilters() {
  const { currentUser } = useUserRole();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filters, setFilters] = useState<ChatFilter>({
    searchQuery: "",
    platform: "all",
    franchise_id: currentUser?.role === "superadmin" ? "all" : currentUser?.franchiseId || "all",
    status: "all",
    tags: []
  });
  
  // Reset filter when user role changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      franchise_id: currentUser?.role === "superadmin" ? "all" : currentUser?.franchiseId || "all"
    }));
  }, [currentUser]);
  
  // Apply filters to conversations
  useEffect(() => {
    // Simulate API call to fetch conversations
    let filteredConversations = [...mockConversations].map(conv => ({
      ...conv,
      selected: false // Add selected property for bulk actions
    }));
    
    // Apply role-based filtering - this is now mandatory for non-superadmins
    if (currentUser?.role !== "superadmin") {
      if (currentUser?.franchiseId) {
        filteredConversations = filteredConversations.filter(
          conv => conv.franchise_id === currentUser.franchiseId
        );
      } else {
        // If not superadmin and no franchise assigned, show no conversations
        filteredConversations = [];
      }
    } else if (filters.franchise_id !== "all") {
      // For superadmins, apply franchise filter only if specifically selected
      filteredConversations = filteredConversations.filter(
        conv => conv.franchise_id === filters.franchise_id
      );
    }
    
    // Apply search filter
    if (filters.searchQuery) {
      filteredConversations = filteredConversations.filter(
        conv => conv.guest_name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
               (conv.guest_phone && conv.guest_phone.includes(filters.searchQuery)) ||
               (conv.booking_id && conv.booking_id.includes(filters.searchQuery))
      );
    }
    
    // Apply platform filter
    if (filters.platform !== "all") {
      filteredConversations = filteredConversations.filter(
        conv => conv.platform === filters.platform
      );
    }
    
    // Apply status filter
    if (filters.status !== "all") {
      filteredConversations = filteredConversations.filter(
        conv => conv.status === filters.status
      );
    }
    
    // Apply response time filter if specified
    if (filters.responseTime !== undefined) {
      filteredConversations = filteredConversations.filter(
        conv => (conv.response_time || 0) > filters.responseTime!
      );
    }
    
    // Sort by most recent message
    filteredConversations.sort((a, b) => 
      new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
    );
    
    setConversations(filteredConversations);
  }, [currentUser, filters]);
  
  // Update a conversation's status
  const updateConversationStatus = (conversationId: string, status: ChatStatus) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, status } : conv
      )
    );
    
    // In a real app, this would make an API call to update the status
    console.log(`Updated conversation ${conversationId} status to ${status}`);
  };
  
  // Bulk archive conversations
  const bulkArchiveConversations = (conversationIds: string[]) => {
    // Remove selected conversations (archive)
    setConversations(prev => 
      prev.filter(conv => !conversationIds.includes(conv.id))
    );
    
    // In a real app, this would make an API call to archive the conversations
    console.log(`Archived conversations:`, conversationIds);
    return true;
  };
  
  // Bulk assign conversations to a franchise
  const bulkAssignConversations = (conversationIds: string[], franchiseId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conversationIds.includes(conv.id) 
          ? { ...conv, franchise_id: franchiseId, selected: false } 
          : conv
      )
    );
    
    // In a real app, this would make an API call to assign the conversations
    console.log(`Assigned conversations to franchise ${franchiseId}:`, conversationIds);
    return true;
  };
  
  // Bulk update conversation status
  const bulkUpdateStatus = (conversationIds: string[], status: ChatStatus) => {
    setConversations(prev => 
      prev.map(conv => 
        conversationIds.includes(conv.id) 
          ? { ...conv, status, selected: false } 
          : conv
      )
    );
    
    // In a real app, this would make an API call to update the status
    console.log(`Updated conversations to status ${status}:`, conversationIds);
    return true;
  };
  
  // Reassign a conversation to another franchise
  const reassignConversation = (conversationId: string, franchiseId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, franchise_id: franchiseId } 
          : conv
      )
    );
    
    // In a real app, this would make an API call to reassign the conversation
    console.log(`Reassigned conversation ${conversationId} to franchise ${franchiseId}`);
    return true;
  };
  
  const handleFiltersChange = (newFilters: ChatFilter) => {
    setFilters(newFilters);
  };
  
  const handleSearchChange = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
  };
  
  return {
    conversations,
    filters,
    handleFiltersChange,
    handleSearchChange,
    updateConversationStatus,
    bulkArchiveConversations,
    bulkAssignConversations,
    bulkUpdateStatus,
    reassignConversation
  };
}

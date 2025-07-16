
import { useState, useEffect } from 'react';
import { useUserRole } from '@/providers/UserRoleProvider';
import { toast } from 'sonner';
import { 
  Message,
  BookingSummary,
  GuestChatProfile,
  Platform,
  BookingAction,
  MessageTag
} from '@/types/chatTypes';
import { 
  mockMessages, 
  mockBookingSummaries, 
  mockGuestProfiles, 
  mockConversations,
  mockBookingActions
} from './mockChatData';

export function useChatMessages(selectedConversationId: string | null) {
  const { currentUser } = useUserRole();
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(null);
  const [guestProfile, setGuestProfile] = useState<GuestChatProfile | null>(null);
  const [bookingActions, setBookingActions] = useState<BookingAction[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      setIsLoadingMessages(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const conversationMessages = mockMessages[selectedConversationId] || [];
        setMessages(conversationMessages);
        
        // Get booking info if available
        const conversation = mockConversations.find(c => c.id === selectedConversationId);
        if (conversation && conversation.booking_id) {
          setBookingSummary(mockBookingSummaries[conversation.booking_id] || null);
          setBookingActions(mockBookingActions[conversation.booking_id] || []);
        } else {
          setBookingSummary(null);
          setBookingActions([]);
        }
        
        // Get guest profile
        if (conversation) {
          setGuestProfile(mockGuestProfiles[conversation.guest_id] || null);
        } else {
          setGuestProfile(null);
        }
        
        setIsLoadingMessages(false);
      }, 500);
    } else {
      setMessages([]);
      setBookingSummary(null);
      setGuestProfile(null);
      setBookingActions([]);
    }
  }, [selectedConversationId]);
  
  // Handle sending a message
  const handleSendMessage = (conversationId: string, content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;
    
    const conversation = mockConversations.find(c => c.id === conversationId);
    
    // Role-based access check for sending messages
    if (currentUser?.role !== "superadmin" && conversation?.franchise_id !== currentUser?.franchiseId) {
      toast.error("You don't have permission to send messages to this conversation");
      return;
    }
    
    // Process files (in a real implementation, these would be uploaded to storage)
    const fileMessages: Message[] = [];
    if (files && files.length > 0) {
      files.forEach(file => {
        // Create mock URL for file preview
        const mediaUrl = URL.createObjectURL(file);
        
        fileMessages.push({
          id: `msg-file-${Date.now()}-${file.name}`,
          conversation_id: conversationId,
          platform: (conversation?.platform || 'web_chat') as Platform,
          guest_id: conversation?.guest_id || '',
          franchise_id: conversation?.franchise_id || '',
          direction: "outbound",
          content: `Sent file: ${file.name}`,
          media_url: mediaUrl,
          file_type: file.type,
          status: "sent",
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      });
    }
    
    // Create text message if content exists
    if (content.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: conversationId,
        platform: (conversation?.platform || 'web_chat') as Platform,
        guest_id: conversation?.guest_id || '',
        franchise_id: conversation?.franchise_id || '',
        direction: "outbound",
        content: content.trim(),
        status: "sent",
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add message to state
      setMessages(prev => [...prev, ...fileMessages, newMessage]);
      
      // Simulate message delivery status updates
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        );
      }, 1000);
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          )
        );
      }, 3000);
    } else {
      // Only file messages
      setMessages(prev => [...prev, ...fileMessages]);
    }
  };
  
  // Add tag to a message
  const addMessageTag = (messageId: string, tag: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const currentTags = msg.tags || [];
          if (!currentTags.includes(tag as MessageTag)) {
            return { 
              ...msg, 
              tags: [...currentTags, tag as MessageTag] 
            };
          }
        }
        return msg;
      })
    );
    
    toast.success(`Message tagged as ${tag}`);
  };
  
  // Remove tag from a message
  const removeMessageTag = (messageId: string, tag: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId && msg.tags) {
          return { 
            ...msg, 
            tags: msg.tags.filter(t => t !== tag) 
          };
        }
        return msg;
      })
    );
    
    toast.success(`Tag ${tag} removed from message`);
  };
  
  return {
    messages,
    bookingSummary,
    guestProfile,
    bookingActions,
    isLoadingMessages,
    handleSendMessage,
    addMessageTag,
    removeMessageTag
  };
}


import { useState } from 'react';
import { LeadMessage, LeadChannel, Lead } from '@/types/leadTypes';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { mockSendWhatsAppMessage, mockSendTelegramMessage } from '../mockLeadData';
import { useLeadActivities } from './useLeadActivities';

export function useLeadMessages(leads: Lead[], setLeads: React.Dispatch<React.SetStateAction<Lead[]>>) {
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const { addActivity } = useLeadActivities();

  const sendMessage = async (leadId: string, message: string, channel: LeadChannel, userId: string | undefined, userFranchiseId?: string): Promise<boolean> => {
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      toast.error("Lead not found");
      return false;
    }
    
    if (userId !== "superadmin" && lead.franchise_id !== userFranchiseId) {
      toast.error("You don't have permission to message this lead");
      return false;
    }
    
    const currentTime = new Date().toISOString();
    let messageSent = false;
    
    try {
      if (channel === 'whatsapp' && lead.phone) {
        messageSent = await mockSendWhatsAppMessage(lead.phone, message);
      } else if (channel === 'telegram') {
        const mockChatId = leadId;
        messageSent = await mockSendTelegramMessage(mockChatId, message);
      } else if (channel === 'email' && lead.email) {
        messageSent = true;
      } else {
        toast.error("Cannot send message: Invalid channel or missing contact info");
        return false;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      return false;
    }
    
    if (!messageSent) {
      toast.error("Failed to send message");
      return false;
    }
    
    const newMessage: LeadMessage = {
      id: `message-${uuidv4()}`,
      lead_id: leadId,
      sender: 'admin',
      channel,
      message,
      sent_at: currentTime,
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    await addActivity({
      leadId,
      activityType: 'message',
      details: `Sent message via ${channel}: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
      performedBy: userId || 'unknown',
      franchiseId: lead.franchise_id,
    });
    
    const updatedLeads = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status: lead.status === 'new' ? 'contacted' : lead.status,
          last_activity: "Message sent",
          updated_at: currentTime
        };
      }
      return l;
    });
    
    setLeads(updatedLeads);
    
    toast.success("Message sent successfully");
    return true;
  };

  return {
    messages,
    setMessages,
    sendMessage
  };
}

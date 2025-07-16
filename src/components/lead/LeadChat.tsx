
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lead, LeadMessage, LeadChannel } from "@/types/leadTypes";
import { format } from 'date-fns';
import { Send, PhoneCall, AlertCircle } from "lucide-react";
import { mockSendWhatsAppMessage, mockSendTelegramMessage } from "@/hooks/lead/mockLeadData";
import { useUserRole } from "@/providers/UserRoleProvider";

interface LeadChatProps {
  lead: Lead;
  messages: LeadMessage[];
  onSendMessage: (leadId: string, message: string, channel: LeadChannel) => Promise<boolean>;
  onMakeNote: (leadId: string, note: string) => Promise<boolean>;
}

export function LeadChat({
  lead,
  messages,
  onSendMessage,
  onMakeNote
}: LeadChatProps) {
  const { currentUser } = useUserRole();
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages come in
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !lead.channel || lead.channel === 'none') return;
    
    setIsSending(true);
    try {
      const success = await onSendMessage(lead.id, messageText, lead.channel);
      if (success) {
        setMessageText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  const getChannelLabel = (channel: LeadChannel) => {
    switch (channel) {
      case 'whatsapp': return 'WhatsApp';
      case 'telegram': return 'Telegram';
      case 'email': return 'Email';
      case 'phone': return 'Phone';
      default: return 'None';
    }
  };
  
  const getChannelIcon = (channel: LeadChannel) => {
    switch (channel) {
      case 'whatsapp': return '💬';
      case 'telegram': return '📨';
      case 'email': return '✉️';
      case 'phone': return '📞';
      default: return '❓';
    }
  };
  
  // Handle cases where chat is not available
  if (!lead.channel || lead.channel === 'none' || lead.channel === 'phone') {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">Communication Log</span>
            {lead.channel === 'phone' && <PhoneCall className="h-4 w-4 text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4" />
          {lead.channel === 'phone' ? (
            <div>
              <p className="mb-3">This lead came from a phone call.</p>
              <p>You can add notes about your conversations with this lead.</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (messageText.trim()) {
                  onMakeNote(lead.id, messageText);
                  setMessageText("");
                }
              }} className="mt-6 w-full">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a note about the phone call..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!messageText.trim()}>Add Note</Button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <p className="mb-3">No messaging channel is available for this lead.</p>
              <p>You can add notes or update the lead's contact information.</p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <span>{getChannelIcon(lead.channel)}</span>
          <span className="text-lg">{getChannelLabel(lead.channel)} Chat</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pb-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'admin' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.message}</p>
                  <div 
                    className={`text-xs mt-1 ${
                      message.sender === 'admin' 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    {format(new Date(message.sent_at), 'h:mm a')}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            placeholder={`Type a message to send via ${getChannelLabel(lead.channel)}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isSending}
            className="flex-1"
          />
          <Button type="submit" disabled={!messageText.trim() || isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

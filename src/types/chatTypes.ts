
export type Platform = "telegram" | "whatsapp" | "web_chat";
export type MessageDirection = "inbound" | "outbound";
export type MessageStatus = "sent" | "delivered" | "read" | "failed";
export type ChatStatus = "new" | "pending" | "resolved" | "escalated" | "unread" | "assigned";
export type MessageTag = "payment" | "offer_inquiry" | "reschedule" | "complaint" | "general" | "menu" | "directions" | "feedback";

export interface Message {
  id: string;
  conversation_id: string;
  platform: Platform;
  guest_id: string;
  booking_id?: string;
  franchise_id: string;
  direction: MessageDirection;
  content: string;
  media_url?: string;
  file_type?: string;
  status: MessageStatus;
  sent_at: string;
  updated_at: string;
  tags?: MessageTag[];
}

export interface Conversation {
  id: string;
  guest_id: string;
  guest_name: string;
  guest_phone?: string;
  platform: Platform;
  franchise_id: string;
  franchise_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  status: ChatStatus;
  booking_id?: string;
  assigned_to?: string;
  response_time?: number; // in minutes
  device?: string;
  source?: string;
  selected?: boolean; // for multi-select
}

export interface QuickReply {
  id: string;
  title: string;
  content: string;
  franchise_id?: string;
}

export interface BookingSummary {
  id: string;
  date: string;
  time: string;
  session_name: string;
  guest_count: number;
  status: string;
  guest_name: string;
  guest_phone?: string;
  franchise_id: string;
  franchise_name: string;
}

export interface GuestChatProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  total_visits: number;
  loyalty_points: number;
  last_visit?: string;
  preferred_franchise?: string;
  preferred_meal_time?: string;
  last_feedback_rating?: number;
  last_booking_issue?: string;
  most_frequent_franchise?: string;
}

export interface ChatFilter {
  searchQuery: string;
  platform: Platform | 'all';
  franchise_id: string | 'all';
  status: ChatStatus | 'all';
  tags: MessageTag[];
  responseTime?: number;
}

export interface BookingAction {
  id: string;
  booking_id: string;
  action_type: 'modify' | 'payment' | 'reminder' | 'cancel' | 'confirmation';
  performed_by: string;
  performed_at: string;
  details?: string;
}

export interface ChatFile {
  name: string;
  size: number;
  type: string;
  url: string;
  preview_url?: string;
}

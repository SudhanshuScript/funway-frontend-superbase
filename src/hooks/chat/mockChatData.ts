
import { Conversation, Message, BookingSummary, GuestChatProfile, QuickReply, BookingAction } from '@/types/chatTypes';

// Mock franchises
export const mockFranchises = [
  { id: "franchise-1", name: "FlyDining Goa" },
  { id: "franchise-2", name: "FlyDining Bangalore" },
  { id: "franchise-3", name: "FlyDining Mumbai" },
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    guest_id: "guest-1",
    guest_name: "John Doe",
    guest_phone: "+91 9876543210",
    platform: "whatsapp",
    franchise_id: "franchise-1",
    franchise_name: "FlyDining Goa",
    last_message: "When is my reservation?",
    last_message_time: new Date().toISOString(),
    unread_count: 2,
    status: "new",
    booking_id: "booking-1",
    response_time: 5,
    device: "Mobile",
    source: "Organic"
  },
  {
    id: "conv-2",
    guest_id: "guest-2",
    guest_name: "Jane Smith",
    guest_phone: "+91 9876543211",
    platform: "telegram",
    franchise_id: "franchise-2",
    franchise_name: "FlyDining Bangalore",
    last_message: "Is vegetarian food available?",
    last_message_time: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    unread_count: 0,
    status: "pending",
    response_time: 18,
    device: "Desktop",
    source: "Website"
  },
  {
    id: "conv-3",
    guest_id: "guest-3",
    guest_name: "David Wilson",
    guest_phone: "+91 9876543212",
    platform: "web_chat",
    franchise_id: "franchise-3",
    franchise_name: "FlyDining Mumbai",
    last_message: "Thanks for the confirmation!",
    last_message_time: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    unread_count: 0,
    status: "resolved",
    booking_id: "booking-2",
    response_time: 3,
    device: "Tablet",
    source: "Instagram Ad"
  },
  {
    id: "conv-4",
    guest_id: "guest-4",
    guest_name: "Sarah Johnson",
    guest_phone: "+91 9876543213",
    platform: "whatsapp",
    franchise_id: "franchise-1",
    franchise_name: "FlyDining Goa",
    last_message: "I need to cancel my booking",
    last_message_time: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    unread_count: 1,
    status: "escalated",
    booking_id: "booking-3",
    device: "Mobile",
    source: "Direct"
  }
];

// Mock messages for each conversation
export const mockMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversation_id: "conv-1",
      platform: "whatsapp",
      guest_id: "guest-1",
      franchise_id: "franchise-1",
      direction: "inbound",
      content: "Hi, I made a booking for tomorrow. Can you confirm the time?",
      status: "read",
      sent_at: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
      updated_at: new Date(Date.now() - 30 * 60000).toISOString(),
      tags: ["general"]
    },
    {
      id: "msg-2",
      conversation_id: "conv-1",
      platform: "whatsapp",
      guest_id: "guest-1",
      franchise_id: "franchise-1",
      direction: "outbound",
      content: "Hello John! Your booking is confirmed for tomorrow at 7:30 PM for the Sunset Dining experience.",
      status: "read",
      sent_at: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
      updated_at: new Date(Date.now() - 25 * 60000).toISOString()
    },
    {
      id: "msg-3",
      conversation_id: "conv-1",
      platform: "whatsapp",
      guest_id: "guest-1",
      franchise_id: "franchise-1",
      direction: "inbound",
      content: "Great! Do I need to arrive early?",
      status: "read",
      sent_at: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
      updated_at: new Date(Date.now() - 20 * 60000).toISOString()
    },
    {
      id: "msg-4",
      conversation_id: "conv-1",
      platform: "whatsapp",
      guest_id: "guest-1",
      franchise_id: "franchise-1",
      direction: "outbound",
      content: "Yes, please arrive 30 minutes before your scheduled time for the safety briefing and check-in process.",
      status: "read",
      sent_at: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
      updated_at: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
      id: "msg-5",
      conversation_id: "conv-1",
      platform: "whatsapp",
      guest_id: "guest-1",
      franchise_id: "franchise-1",
      direction: "inbound",
      content: "When is my reservation?",
      status: "read",
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: ["reschedule"]
    }
  ],
  "conv-2": [
    {
      id: "msg-6",
      conversation_id: "conv-2",
      platform: "telegram",
      guest_id: "guest-2",
      franchise_id: "franchise-2",
      direction: "inbound",
      content: "Hi, do you offer vegetarian food options?",
      status: "read",
      sent_at: new Date(Date.now() - 35 * 60000).toISOString(), // 35 minutes ago
      updated_at: new Date(Date.now() - 35 * 60000).toISOString(),
      tags: ["menu"]
    },
    {
      id: "msg-7",
      conversation_id: "conv-2",
      platform: "telegram",
      guest_id: "guest-2",
      franchise_id: "franchise-2",
      direction: "outbound",
      content: "Hello Jane! Yes, we have an extensive vegetarian menu including gourmet options. Would you like me to send you our vegetarian selections?",
      status: "read",
      sent_at: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
      updated_at: new Date(Date.now() - 30 * 60000).toISOString()
    },
    {
      id: "msg-8",
      conversation_id: "conv-2",
      platform: "telegram",
      guest_id: "guest-2",
      franchise_id: "franchise-2",
      direction: "inbound",
      content: "Yes please, and do you have vegan options as well?",
      status: "read",
      sent_at: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
      updated_at: new Date(Date.now() - 25 * 60000).toISOString()
    },
    {
      id: "msg-9",
      conversation_id: "conv-2",
      platform: "telegram",
      guest_id: "guest-2",
      franchise_id: "franchise-2",
      direction: "inbound",
      content: "Is vegetarian food available?",
      status: "delivered",
      sent_at: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
      updated_at: new Date(Date.now() - 15 * 60000).toISOString(),
      tags: ["menu"]
    }
  ],
  "conv-3": [
    {
      id: "msg-10",
      conversation_id: "conv-3",
      platform: "web_chat",
      guest_id: "guest-3",
      franchise_id: "franchise-3",
      direction: "inbound",
      content: "I'd like to book a table for 4 people this weekend",
      status: "read",
      sent_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 2 * 60 * 60000).toISOString()
    },
    {
      id: "msg-11",
      conversation_id: "conv-3",
      platform: "web_chat",
      guest_id: "guest-3",
      franchise_id: "franchise-3",
      direction: "outbound",
      content: "Hello David! I'd be happy to help you book a table. We have availability on Saturday at 6:30 PM or 8:00 PM. Would either of those times work for you?",
      status: "read",
      sent_at: new Date(Date.now() - 1.9 * 60 * 60000).toISOString(),
      updated_at: new Date(Date.now() - 1.9 * 60 * 60000).toISOString()
    },
    {
      id: "msg-12",
      conversation_id: "conv-3",
      platform: "web_chat",
      guest_id: "guest-3",
      franchise_id: "franchise-3",
      direction: "inbound",
      content: "8:00 PM works for us!",
      status: "read",
      sent_at: new Date(Date.now() - 1.8 * 60 * 60000).toISOString(),
      updated_at: new Date(Date.now() - 1.8 * 60 * 60000).toISOString()
    },
    {
      id: "msg-13",
      conversation_id: "conv-3",
      platform: "web_chat",
      guest_id: "guest-3",
      franchise_id: "franchise-3",
      direction: "outbound",
      content: "Perfect! I've booked your table for 4 people this Saturday at 8:00 PM. You'll receive a confirmation email shortly with all the details. Is there anything else you'd like to know?",
      status: "read",
      sent_at: new Date(Date.now() - 1.7 * 60 * 60000).toISOString(),
      updated_at: new Date(Date.now() - 1.7 * 60 * 60000).toISOString()
    },
    {
      id: "msg-14",
      conversation_id: "conv-3",
      platform: "web_chat",
      guest_id: "guest-3",
      franchise_id: "franchise-3",
      direction: "inbound",
      content: "Thanks for the confirmation!",
      status: "read",
      sent_at: new Date(Date.now() - 1 * 60 * 60000).toISOString(), // 1 hour ago
      updated_at: new Date(Date.now() - 1 * 60 * 60000).toISOString()
    }
  ],
  "conv-4": [
    {
      id: "msg-15",
      conversation_id: "conv-4",
      platform: "whatsapp",
      guest_id: "guest-4",
      franchise_id: "franchise-1",
      direction: "inbound",
      content: "Hello, I need to cancel my booking for tomorrow night due to an emergency",
      status: "read",
      sent_at: new Date(Date.now() - 4 * 60 * 60000).toISOString(), // 4 hours ago
      updated_at: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
      tags: ["complaint"]
    },
    {
      id: "msg-16",
      conversation_id: "conv-4",
      platform: "whatsapp",
      guest_id: "guest-4",
      franchise_id: "franchise-1",
      direction: "outbound",
      content: "I'm sorry to hear that, Sarah. Let me check your booking details and our cancellation policy. One moment please.",
      status: "read",
      sent_at: new Date(Date.now() - 3.9 * 60 * 60000).toISOString(),
      updated_at: new Date(Date.now() - 3.9 * 60 * 60000).toISOString()
    },
    {
      id: "msg-17",
      conversation_id: "conv-4",
      platform: "whatsapp",
      guest_id: "guest-4",
      franchise_id: "franchise-1",
      direction: "outbound",
      content: "I've found your booking. Since it's less than 24 hours before your reservation, there would normally be a cancellation fee. However, given the emergency circumstances, we'll make an exception and process a full refund. Is there anything else I can help you with?",
      status: "read",
      sent_at: new Date(Date.now() - 3.8 * 60 * 60000).toISOString(),
      updated_at: new Date(Date.now() - 3.8 * 60 * 60000).toISOString()
    },
    {
      id: "msg-18",
      conversation_id: "conv-4",
      platform: "whatsapp",
      guest_id: "guest-4",
      franchise_id: "franchise-1",
      direction: "inbound",
      content: "Thank you so much for understanding. How long will the refund take to process?",
      status: "read",
      sent_at: new Date(Date.now() - 3.7 * 60 * 60000).toISOString(),
      updated_at: new Date(Date.now() - 3.7 * 60 * 60000).toISOString(),
      tags: ["payment"]
    },
    {
      id: "msg-19",
      conversation_id: "conv-4",
      platform: "whatsapp",
      guest_id: "guest-4",
      franchise_id: "franchise-1",
      direction: "outbound",
      content: "The refund should be processed within 3-5 business days, depending on your bank. You'll receive an email confirmation once it's been initiated.",
      status: "read",
      sent_at: new Date(Date.now() - 3.6 * 60 * 60000).toISOString(),
      updated_at: new Date(Date.now() - 3.6 * 60 * 60000).toISOString()
    },
    {
      id: "msg-20",
      conversation_id: "conv-4",
      platform: "whatsapp",
      guest_id: "guest-4",
      franchise_id: "franchise-1",
      direction: "inbound",
      content: "I need to cancel my booking",
      status: "delivered",
      sent_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 2 * 60 * 60000).toISOString()
    }
  ]
};

// Mock booking summaries
export const mockBookingSummaries: Record<string, BookingSummary> = {
  "booking-1": {
    id: "booking-1",
    date: new Date(Date.now() + 24 * 60 * 60000).toISOString(), // Tomorrow
    time: "19:30",
    session_name: "Sunset Dining Experience",
    guest_count: 2,
    status: "confirmed",
    guest_name: "John Doe",
    guest_phone: "+91 9876543210",
    franchise_id: "franchise-1",
    franchise_name: "FlyDining Goa"
  },
  "booking-2": {
    id: "booking-2",
    date: new Date(Date.now() + 3 * 24 * 60 * 60000).toISOString(), // 3 days later
    time: "20:00",
    session_name: "City Lights Dinner",
    guest_count: 4,
    status: "confirmed",
    guest_name: "David Wilson",
    guest_phone: "+91 9876543212",
    franchise_id: "franchise-3",
    franchise_name: "FlyDining Mumbai"
  },
  "booking-3": {
    id: "booking-3",
    date: new Date(Date.now() + 24 * 60 * 60000).toISOString(), // Tomorrow
    time: "18:30",
    session_name: "Evening Special",
    guest_count: 3,
    status: "cancelled",
    guest_name: "Sarah Johnson",
    guest_phone: "+91 9876543213",
    franchise_id: "franchise-1",
    franchise_name: "FlyDining Goa"
  }
};

// Mock guest profiles
export const mockGuestProfiles: Record<string, GuestChatProfile> = {
  "guest-1": {
    id: "guest-1",
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john.doe@example.com",
    total_visits: 2,
    loyalty_points: 150,
    last_visit: new Date(Date.now() - 30 * 24 * 60 * 60000).toISOString(), // 30 days ago
    preferred_franchise: "FlyDining Goa",
    preferred_meal_time: "Dinner",
    last_feedback_rating: 4,
    most_frequent_franchise: "FlyDining Goa (2 visits)"
  },
  "guest-2": {
    id: "guest-2",
    name: "Jane Smith",
    phone: "+91 9876543211",
    email: "jane.smith@example.com",
    total_visits: 0,
    loyalty_points: 0,
    preferred_meal_time: "Lunch"
  },
  "guest-3": {
    id: "guest-3",
    name: "David Wilson",
    phone: "+91 9876543212",
    email: "david.wilson@example.com",
    total_visits: 3,
    loyalty_points: 280,
    last_visit: new Date(Date.now() - 15 * 24 * 60 * 60000).toISOString(), // 15 days ago
    preferred_franchise: "FlyDining Mumbai",
    preferred_meal_time: "Dinner",
    last_feedback_rating: 5,
    most_frequent_franchise: "FlyDining Mumbai (2 visits)",
    last_booking_issue: "None"
  },
  "guest-4": {
    id: "guest-4",
    name: "Sarah Johnson",
    phone: "+91 9876543213",
    email: "sarah.johnson@example.com",
    total_visits: 1,
    loyalty_points: 75,
    last_visit: new Date(Date.now() - 60 * 24 * 60 * 60000).toISOString(), // 60 days ago
    preferred_franchise: "FlyDining Goa",
    preferred_meal_time: "Dinner",
    last_feedback_rating: 3,
    most_frequent_franchise: "FlyDining Goa (1 visit)",
    last_booking_issue: "Rescheduled once"
  }
};

// Mock booking actions
export const mockBookingActions: Record<string, BookingAction[]> = {
  "booking-1": [
    {
      id: "action-1",
      booking_id: "booking-1",
      action_type: "confirmation",
      performed_by: "GoaManager",
      performed_at: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
      details: "Initial booking confirmation"
    },
    {
      id: "action-2",
      booking_id: "booking-1",
      action_type: "reminder",
      performed_by: "System",
      performed_at: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
    },
    {
      id: "action-3",
      booking_id: "booking-1",
      action_type: "modify",
      performed_by: "GoaManager",
      performed_at: new Date(Date.now() - 12 * 60 * 60000).toISOString(), // 12 hours ago
      details: "to 8:30 PM"
    }
  ],
  "booking-2": [
    {
      id: "action-4",
      booking_id: "booking-2",
      action_type: "confirmation",
      performed_by: "MumbaiManager",
      performed_at: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(), // 5 days ago
      details: "Initial booking confirmation"
    },
    {
      id: "action-5",
      booking_id: "booking-2",
      action_type: "payment",
      performed_by: "Admin",
      performed_at: new Date(Date.now() - 4 * 24 * 60 * 60000).toISOString(), // 4 days ago
    }
  ],
  "booking-3": [
    {
      id: "action-6",
      booking_id: "booking-3",
      action_type: "confirmation",
      performed_by: "GoaManager",
      performed_at: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(), // 7 days ago
      details: "Initial booking confirmation"
    },
    {
      id: "action-7",
      booking_id: "booking-3",
      action_type: "reminder",
      performed_by: "System",
      performed_at: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
    },
    {
      id: "action-8",
      booking_id: "booking-3",
      action_type: "cancel",
      performed_by: "Customer",
      performed_at: new Date(Date.now() - 4 * 60 * 60000).toISOString(), // 4 hours ago
      details: "Emergency cancellation"
    }
  ]
};

// Mock quick replies
export const mockQuickReplies: QuickReply[] = [
  {
    id: "qr-1",
    title: "Booking Confirmation",
    content: "Your booking has been confirmed. We look forward to welcoming you!"
  },
  {
    id: "qr-2",
    title: "Menu Options",
    content: "Our menu includes a variety of vegetarian, non-vegetarian, and vegan options. You can view the full menu on our website: https://skybistro.com/menu"
  },
  {
    id: "qr-3",
    title: "Reschedule Policy",
    content: "You can reschedule your booking up to 24 hours before your reservation without any charges. For changes within 24 hours, please contact us directly."
  },
  {
    id: "qr-4",
    title: "Dress Code",
    content: "Our dress code is smart casual. We recommend comfortable clothing and avoid open-toed shoes for safety reasons."
  },
  {
    id: "qr-5",
    title: "Weather Policy",
    content: "In case of unfavorable weather conditions, we may need to reschedule your booking. We'll notify you at least 3 hours in advance and offer alternative dates or a full refund."
  }
];

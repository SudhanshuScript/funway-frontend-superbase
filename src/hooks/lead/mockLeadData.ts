import { v4 as uuidv4 } from 'uuid';
import { 
  Lead, 
  LeadActivity, 
  FollowUp, 
  LeadSource, 
  LeadInterest, 
  LeadStatus, 
  LeadAnalytics, 
  LeadMessage,
  LeadChannel
} from '@/types/leadTypes';
import { addDays, subDays, format } from 'date-fns';

export const leadSourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'referral', label: 'Referral' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'other', label: 'Other' }
];

export const leadInterestOptions = [
  { value: 'session', label: 'Dining Session' },
  { value: 'offer', label: 'Special Offer' },
  { value: 'franchise', label: 'Franchise Inquiry' },
  { value: 'gift_voucher', label: 'Gift Voucher' },
  { value: 'general', label: 'General Inquiry' }
];

export const leadStatusOptions = [
  { value: 'new', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'converted', label: 'Converted' },
  { value: 'dropped', label: 'Dropped' }
];

export const mockFranchiseStaff = [
  { id: 'staff-1', name: 'John Doe', role: 'Manager', franchise_id: 'franchise-1' },
  { id: 'staff-2', name: 'Jane Smith', role: 'Sales', franchise_id: 'franchise-1' },
  { id: 'staff-3', name: 'Mike Johnson', role: 'Manager', franchise_id: 'franchise-2' },
  { id: 'staff-4', name: 'Sarah Williams', role: 'Customer Support', franchise_id: 'franchise-2' },
  { id: 'staff-5', name: 'Carlos Rodriguez', role: 'Manager', franchise_id: 'franchise-3' },
  { id: 'staff-6', name: 'Emma Chen', role: 'Marketing', franchise_id: 'franchise-3' }
];

export const franchiseOptions = [
  { id: 'franchise-1', name: 'FlyDining Bangalore' },
  { id: 'franchise-2', name: 'FlyDining Ooty' },
  { id: 'franchise-3', name: 'FlyDining Puerto Rico' }
];

const currentDate = new Date();
const yesterday = subDays(currentDate, 1).toISOString();
const twoDaysAgo = subDays(currentDate, 2).toISOString();
const threeDaysAgo = subDays(currentDate, 3).toISOString();
const fourDaysAgo = subDays(currentDate, 4).toISOString();
const fiveDaysAgo = subDays(currentDate, 5).toISOString();
const oneWeekAgo = subDays(currentDate, 7).toISOString();

const tomorrow = addDays(currentDate, 1).toISOString();
const dayAfterTomorrow = addDays(currentDate, 2).toISOString();

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+919876543210',
    source: 'instagram',
    interest: 'session',
    franchise_id: 'franchise-1',
    status: 'new',
    assigned_to: 'staff-1',
    notes: 'Interested in a birthday dinner',
    created_at: yesterday,
    updated_at: yesterday,
    last_activity: 'Lead created',
    channel: 'whatsapp'
  },
  {
    id: 'lead-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+919876543211',
    source: 'website',
    interest: 'offer',
    franchise_id: 'franchise-1',
    status: 'contacted',
    assigned_to: 'staff-2',
    notes: 'Looking for discount offers',
    created_at: twoDaysAgo,
    updated_at: yesterday,
    last_activity: 'Sent follow-up email',
    channel: 'email'
  },
  {
    id: 'lead-3',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    phone: '+919876543212',
    source: 'referral',
    interest: 'franchise',
    franchise_id: 'franchise-2',
    status: 'follow_up',
    assigned_to: 'staff-3',
    notes: 'Interested in franchise opportunities in Goa',
    created_at: threeDaysAgo,
    updated_at: yesterday,
    last_activity: 'Scheduled call for tomorrow',
    next_follow_up: tomorrow,
    channel: 'phone'
  },
  {
    id: 'lead-4',
    name: 'Diana Garcia',
    email: 'diana@example.com',
    phone: '+919876543213',
    source: 'facebook',
    interest: 'session',
    franchise_id: 'franchise-3',
    status: 'converted',
    assigned_to: 'staff-5',
    notes: 'Booked dinner for 4 people',
    created_at: fourDaysAgo,
    updated_at: yesterday,
    last_activity: 'Converted to booking',
    booking_id: 'booking-12345',
    converted_to_guest: true,
    converted_at: yesterday,
    guest_id: 'guest-12345',
    channel: 'whatsapp'
  },
  {
    id: 'lead-5',
    name: 'Edward Kim',
    email: 'edward@example.com',
    phone: '+919876543214',
    source: 'email',
    interest: 'gift_voucher',
    franchise_id: 'franchise-2',
    status: 'dropped',
    assigned_to: 'staff-4',
    notes: 'No longer interested',
    created_at: fiveDaysAgo,
    updated_at: twoDaysAgo,
    last_activity: 'Marked as dropped',
    channel: 'email'
  },
  {
    id: 'lead-6',
    name: 'Fatima Ali',
    email: 'fatima@example.com',
    phone: '+919876543215',
    source: 'whatsapp',
    interest: 'session',
    franchise_id: 'franchise-1',
    status: 'new',
    assigned_to: 'staff-2',
    notes: 'Inquired about anniversary dinner',
    created_at: yesterday,
    updated_at: yesterday,
    last_activity: 'Initial contact',
    channel: 'whatsapp'
  },
  {
    id: 'lead-7',
    name: 'George Chen',
    phone: '+919876543216',
    source: 'phone',
    interest: 'offer',
    franchise_id: 'franchise-3',
    status: 'contacted',
    assigned_to: 'staff-6',
    notes: 'Called about weekend offers',
    created_at: threeDaysAgo,
    updated_at: yesterday,
    last_activity: 'Phone call follow-up',
    channel: 'phone'
  },
  {
    id: 'lead-8',
    name: 'Helen Brown',
    email: 'helen@example.com',
    source: 'walk_in',
    interest: 'franchise',
    franchise_id: 'franchise-1',
    status: 'follow_up',
    assigned_to: 'staff-1',
    notes: 'Visited office to inquire about franchise',
    created_at: oneWeekAgo,
    updated_at: threeDaysAgo,
    last_activity: 'Scheduled meeting',
    next_follow_up: dayAfterTomorrow,
    channel: 'none'
  },
  {
    id: 'lead-9',
    name: 'Ian Matthews',
    email: 'ian@example.com',
    phone: '+919876543217',
    source: 'website',
    interest: 'session',
    franchise_id: 'franchise-2',
    status: 'converted',
    assigned_to: 'staff-3',
    notes: 'Corporate booking',
    created_at: oneWeekAgo,
    updated_at: twoDaysAgo,
    last_activity: 'Converted to booking',
    booking_id: 'booking-12346',
    converted_to_guest: true,
    converted_at: twoDaysAgo,
    guest_id: 'guest-12346',
    channel: 'email'
  },
  {
    id: 'lead-10',
    name: 'Jessica Lopez',
    phone: '+919876543218',
    source: 'telegram',
    interest: 'general',
    franchise_id: 'franchise-3',
    status: 'new',
    assigned_to: 'staff-5',
    created_at: yesterday,
    updated_at: yesterday,
    last_activity: 'Lead created',
    channel: 'telegram'
  }
];

export const mockLeadActivities: LeadActivity[] = [
  {
    id: 'activity-1',
    lead_id: 'lead-1',
    activity_type: 'note',
    details: 'Lead created from Instagram campaign',
    performed_by: 'staff-1',
    performed_at: yesterday,
    franchise_id: 'franchise-1'
  },
  {
    id: 'activity-2',
    lead_id: 'lead-2',
    activity_type: 'contact',
    details: 'Sent initial email',
    performed_by: 'staff-2',
    performed_at: twoDaysAgo,
    franchise_id: 'franchise-1'
  },
  {
    id: 'activity-3',
    lead_id: 'lead-2',
    activity_type: 'note',
    details: 'Sent follow-up email',
    performed_by: 'staff-2',
    performed_at: yesterday,
    franchise_id: 'franchise-1'
  },
  {
    id: 'activity-4',
    lead_id: 'lead-3',
    activity_type: 'status_change',
    details: 'Changed status to follow-up',
    performed_by: 'staff-3',
    performed_at: twoDaysAgo,
    franchise_id: 'franchise-2'
  },
  {
    id: 'activity-5',
    lead_id: 'lead-3',
    activity_type: 'follow_up',
    details: 'Scheduled call for tomorrow',
    performed_by: 'staff-3',
    performed_at: yesterday,
    franchise_id: 'franchise-2'
  },
  {
    id: 'activity-6',
    lead_id: 'lead-4',
    activity_type: 'conversion',
    details: 'Converted to booking #booking-12345',
    performed_by: 'staff-5',
    performed_at: yesterday,
    franchise_id: 'franchise-3'
  },
  {
    id: 'activity-7',
    lead_id: 'lead-5',
    activity_type: 'status_change',
    details: 'Changed status to dropped',
    performed_by: 'staff-4',
    performed_at: twoDaysAgo,
    franchise_id: 'franchise-2'
  }
];

export const mockFollowUps: FollowUp[] = [
  {
    id: 'follow-up-1',
    lead_id: 'lead-3',
    scheduled_for: tomorrow,
    notes: 'Call to discuss franchise options',
    completed: false,
    assigned_to: 'staff-3',
    created_by: 'staff-3',
    created_at: yesterday
  },
  {
    id: 'follow-up-2',
    lead_id: 'lead-8',
    scheduled_for: dayAfterTomorrow,
    notes: 'Meeting to discuss franchise details',
    completed: false,
    assigned_to: 'staff-1',
    created_by: 'staff-1',
    created_at: threeDaysAgo
  },
  {
    id: 'follow-up-3',
    lead_id: 'lead-2',
    scheduled_for: twoDaysAgo,
    notes: 'Send special offer details',
    completed: true,
    completed_at: yesterday,
    assigned_to: 'staff-2',
    created_by: 'staff-2',
    created_at: threeDaysAgo
  }
];

export const mockLeadMessages: LeadMessage[] = [
  {
    id: 'message-1',
    lead_id: 'lead-1',
    sender: 'lead',
    channel: 'whatsapp',
    message: 'Hi, I saw your Instagram post and I\'m interested in booking a dinner for my birthday.',
    sent_at: yesterday,
    status: 'read'
  },
  {
    id: 'message-2',
    lead_id: 'lead-1',
    sender: 'admin',
    channel: 'whatsapp',
    message: 'Hello Alice! Thank you for your interest. When would you like to book your birthday dinner?',
    sent_at: yesterday,
    status: 'read'
  },
  {
    id: 'message-3',
    lead_id: 'lead-4',
    sender: 'lead',
    channel: 'whatsapp',
    message: 'Do you have any availability this weekend?',
    sent_at: threeDaysAgo,
    status: 'read'
  },
  {
    id: 'message-4',
    lead_id: 'lead-4',
    sender: 'admin',
    channel: 'whatsapp',
    message: 'Yes, we have slots available on Saturday at 7 PM and 9 PM. Would you like to book one of those?',
    sent_at: threeDaysAgo,
    status: 'read'
  },
  {
    id: 'message-5',
    lead_id: 'lead-4',
    sender: 'lead',
    channel: 'whatsapp',
    message: 'I\'ll take the 7 PM slot for 4 people.',
    sent_at: twoDaysAgo,
    status: 'read'
  },
  {
    id: 'message-6',
    lead_id: 'lead-6',
    sender: 'lead',
    channel: 'whatsapp',
    message: 'Hello, do you have any special arrangements for anniversary celebrations?',
    sent_at: yesterday,
    status: 'read'
  },
  {
    id: 'message-7',
    lead_id: 'lead-10',
    sender: 'lead',
    channel: 'telegram',
    message: 'Hi there, I\'d like to know more about your dining experiences.',
    sent_at: yesterday,
    status: 'read'
  }
];

export const mockLeadAnalytics: LeadAnalytics = {
  total: 10,
  new_this_week: 6,
  conversion_rate: 20,
  average_response_time: 30,
  by_source: {
    'website': 2,
    'instagram': 1,
    'facebook': 1,
    'referral': 1,
    'walk_in': 1,
    'phone': 1,
    'email': 1,
    'whatsapp': 1,
    'telegram': 1,
    'other': 0
  },
  by_status: {
    'new': 3,
    'contacted': 2,
    'follow_up': 2,
    'converted': 2,
    'dropped': 1
  },
  by_franchise: {
    'franchise-1': 4,
    'franchise-2': 3,
    'franchise-3': 3
  }
};

export const mockSendWhatsAppMessage = async (phone: string, message: string): Promise<boolean> => {
  console.log(`Sending WhatsApp message to ${phone}: ${message}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const mockSendTelegramMessage = async (chatId: string, message: string): Promise<boolean> => {
  console.log(`Sending Telegram message to ${chatId}: ${message}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

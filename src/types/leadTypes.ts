
export type LeadSource = 'website' | 'instagram' | 'facebook' | 'referral' | 'walk_in' | 'phone' | 'email' | 'whatsapp' | 'telegram' | 'other';
export type LeadInterest = 'session' | 'offer' | 'franchise' | 'gift_voucher' | 'general';
export type LeadStatus = 'new' | 'contacted' | 'follow_up' | 'converted' | 'dropped';
export type LeadChannel = 'whatsapp' | 'telegram' | 'email' | 'phone' | 'none';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  interest: LeadInterest;
  franchise_id: string;
  status: LeadStatus;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  conversation_id?: string;
  booking_id?: string;
  last_activity?: string;
  next_follow_up?: string;
  channel?: LeadChannel;
  converted_to_guest?: boolean;
  converted_at?: string;
  guest_id?: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: 'note' | 'contact' | 'message' | 'status_change' | 'follow_up' | 'conversion';
  details: string;
  performed_by: string;
  performed_at: string;
  franchise_id: string;
}

export interface LeadMessage {
  id: string;
  lead_id: string;
  sender: 'admin' | 'lead';
  channel: LeadChannel;
  message: string;
  sent_at: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  media_url?: string;
  file_type?: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  scheduled_for: string;
  notes: string;
  completed: boolean;
  completed_at?: string;
  assigned_to: string;
  created_by: string;
  created_at: string;
}

export interface LeadFilter {
  searchQuery: string;
  source: LeadSource | 'all';
  status: LeadStatus | 'all';
  interest: LeadInterest | 'all';
  franchise_id: string | 'all';
  assigned_to: string | 'all';
  date_range?: {
    from: Date | null;
    to: Date | null;
  };
}

export interface LeadAnalytics {
  total: number;
  new_this_week: number;
  conversion_rate: number;
  average_response_time: number;
  by_source: Record<LeadSource, number>;
  by_status: Record<LeadStatus, number>;
  by_franchise: Record<string, number>;
}

export const getSourceBadge = (source: LeadSource) => {
  switch (source) {
    case "website":
      return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: "🌐" };
    case "instagram":
      return { color: "bg-purple-100 text-purple-800 border-purple-200", icon: "📸" };
    case "facebook":
      return { color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: "👍" };
    case "referral":
      return { color: "bg-green-100 text-green-800 border-green-200", icon: "👥" };
    case "walk_in":
      return { color: "bg-amber-100 text-amber-800 border-amber-200", icon: "🚶" };
    case "phone":
      return { color: "bg-red-100 text-red-800 border-red-200", icon: "📞" };
    case "email":
      return { color: "bg-sky-100 text-sky-800 border-sky-200", icon: "✉️" };
    case "whatsapp":
      return { color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: "💬" };
    case "telegram":
      return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: "📨" };
    default:
      return { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "❓" };
  }
};

export const getInterestBadge = (interest: LeadInterest) => {
  switch (interest) {
    case "session":
      return { color: "bg-amber-100 text-amber-800 border-amber-200", icon: "🍽️" };
    case "offer":
      return { color: "bg-green-100 text-green-800 border-green-200", icon: "🎁" };
    case "franchise":
      return { color: "bg-purple-100 text-purple-800 border-purple-200", icon: "🏢" };
    case "gift_voucher":
      return { color: "bg-red-100 text-red-800 border-red-200", icon: "🎫" };
    case "general":
      return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: "ℹ️" };
    default:
      return { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "❓" };
  }
};

export const getStatusBadge = (status: LeadStatus) => {
  switch (status) {
    case "new":
      return { color: "bg-blue-500", text: "New" };
    case "contacted":
      return { color: "bg-amber-400", text: "Contacted" };
    case "follow_up":
      return { color: "bg-purple-500", text: "Follow-Up" };
    case "converted":
      return { color: "bg-green-500", text: "Converted" };
    case "dropped":
      return { color: "bg-red-500", text: "Dropped" };
    default:
      return { color: "bg-gray-500", text: status };
  }
};

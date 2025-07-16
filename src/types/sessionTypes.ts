
// Database model from Supabase - column structure
export interface SessionDB {
  id: string;
  name: string;
  type: string;
  start_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  max_capacity: number;
  booked_count: number;
  is_active: boolean;
  // Special date fields
  is_special_date?: boolean;
  special_date_name?: string;
  special_pricing?: number;
  special_addons?: string[];
  special_conditions?: string;
  // Recurrence fields
  is_recurring?: boolean;
  recurring_type?: string;
  franchise_id?: string;
  created_at?: string;
  updated_at?: string;
  // Deactivation fields
  deactivation_reason?: string;
  deactivated_by?: string;
  deactivated_at?: string;
  // Additional fields for notes
  notes?: string;
}

// Frontend interface with camelCase properties
export interface Session {
  id: string;
  name: string;
  type: string;
  date: string;
  start_date?: string;
  startTime: string;
  start_time?: string;
  endTime: string;
  end_time?: string;
  duration: number;
  maxCapacity: number;
  max_capacity?: number;
  bookedCount: number;
  booked_count?: number;
  isActive: boolean;
  is_active?: boolean;
  isSpecialDate?: boolean;
  is_special_date?: boolean;
  specialDateName?: string;
  special_date_name?: string;
  specialPricing?: number;
  special_pricing?: number;
  specialAddOns?: string[];
  special_addons?: string[];
  specialConditions?: string;
  special_conditions?: string;
  isRecurring?: boolean;
  is_recurring?: boolean;
  recurringType?: string;
  recurring_type?: string;
  franchise_id?: string;
  // Deactivation fields
  deactivationReason?: string;
  deactivation_reason?: string;
  deactivatedBy?: string;
  deactivated_by?: string;
  deactivatedAt?: string;
  deactivated_at?: string;
  // Time fields
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  // Notes field
  notes?: string;
}

// Session stats interface
export interface SessionStats {
  mostPopular: {
    name: string;
    type: string;
    bookings: number;
  }[];
  bestPerforming: {
    name: string;
    type: string;
    utilization: number;
  }[];
  underutilized: {
    name: string;
    type: string;
    utilization: number;
  }[];
}

export interface SessionAnalytics {
  totalSessions: number;
  activeSessions: number;
  upcomingSessions: number;
  popularSessions: {
    name: string;
    bookings: number;
  }[];
  utilizationRate: number;
}

// Function to convert between database and frontend formats
export const mapSessionDBToSession = (sessionDB: SessionDB): Session => {
  return {
    id: sessionDB.id,
    name: sessionDB.name,
    type: sessionDB.type,
    date: sessionDB.start_date,
    start_date: sessionDB.start_date,
    startTime: sessionDB.start_time,
    start_time: sessionDB.start_time,
    endTime: sessionDB.end_time,
    end_time: sessionDB.end_time,
    duration: sessionDB.duration,
    maxCapacity: sessionDB.max_capacity,
    max_capacity: sessionDB.max_capacity,
    bookedCount: sessionDB.booked_count,
    booked_count: sessionDB.booked_count,
    isActive: sessionDB.is_active,
    is_active: sessionDB.is_active,
    isSpecialDate: sessionDB.is_special_date,
    is_special_date: sessionDB.is_special_date,
    specialDateName: sessionDB.special_date_name,
    special_date_name: sessionDB.special_date_name,
    specialPricing: sessionDB.special_pricing,
    special_pricing: sessionDB.special_pricing,
    specialAddOns: sessionDB.special_addons,
    special_addons: sessionDB.special_addons,
    specialConditions: sessionDB.special_conditions,
    special_conditions: sessionDB.special_conditions,
    isRecurring: sessionDB.is_recurring,
    is_recurring: sessionDB.is_recurring,
    recurringType: sessionDB.recurring_type,
    recurring_type: sessionDB.recurring_type,
    franchise_id: sessionDB.franchise_id,
    deactivationReason: sessionDB.deactivation_reason,
    deactivation_reason: sessionDB.deactivation_reason,
    deactivatedBy: sessionDB.deactivated_by,
    deactivated_by: sessionDB.deactivated_by,
    deactivatedAt: sessionDB.deactivated_at,
    deactivated_at: sessionDB.deactivated_at,
    createdAt: sessionDB.created_at,
    created_at: sessionDB.created_at,
    updatedAt: sessionDB.updated_at,
    updated_at: sessionDB.updated_at,
    notes: sessionDB.notes
  };
};

export const mapSessionToSessionDB = (session: Session): SessionDB => {
  return {
    id: session.id,
    name: session.name,
    type: session.type,
    start_date: session.date || session.start_date || '',
    start_time: session.startTime || session.start_time || '',
    end_time: session.endTime || session.end_time || '',
    duration: session.duration,
    max_capacity: session.maxCapacity || session.max_capacity || 0,
    booked_count: session.bookedCount || session.booked_count || 0,
    is_active: session.isActive || session.is_active || false,
    is_special_date: session.isSpecialDate || session.is_special_date,
    special_date_name: session.specialDateName || session.special_date_name,
    special_pricing: session.specialPricing || session.special_pricing,
    special_addons: session.specialAddOns || session.special_addons,
    special_conditions: session.specialConditions || session.special_conditions,
    is_recurring: session.isRecurring || session.is_recurring,
    recurring_type: session.recurringType || session.recurring_type,
    franchise_id: session.franchise_id,
    deactivation_reason: session.deactivationReason || session.deactivation_reason,
    deactivated_by: session.deactivatedBy || session.deactivated_by,
    deactivated_at: session.deactivatedAt || session.deactivated_at,
    created_at: session.createdAt || session.created_at,
    updated_at: session.updatedAt || session.updated_at,
    notes: session.notes
  };
};

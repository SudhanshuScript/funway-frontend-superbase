
export type FranchiseStatus = "active" | "inactive";
export type PaymentGateway = "Stripe" | "PayPal" | "Square" | "Other";
export type InactivityReason = "Payment Pending" | "Maintenance" | "Legal Issue" | "Owner Request" | null;
export type StaffDesignation = "Chef" | "Host" | "DJ" | "Safety Officer" | "Manager";
export type StaffAccessLevel = "Admin" | "Manager" | "Staff";
export type StaffStatus = "active" | "inactive";

export interface IpRestriction {
  ip: string;
  description: string;
  added_by?: string;
  added_at?: string;
}

export interface Franchise {
  id: string;
  name?: string;
  company_name?: string;
  owner_name?: string | null;
  contact_number?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  tax_id?: string | null;
  tax_percentage?: number | null;
  tax_inclusive?: boolean | null;
  payment_gateway?: PaymentGateway | null;
  payment_api_key?: string | null;
  call_center_number?: string | null;
  telegram_channel_id?: string | null;
  status?: FranchiseStatus | null;
  inactivity_reason?: InactivityReason;
  default_currency?: string | null;
  timezone?: string | null;
  language?: string | null;
  welcome_message?: string | null;
  theme_color?: string | null;
  logo_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface FranchiseDB {
  id: string;
  company_name: string;
  owner_name: string | null;
  contact_number: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  tax_id: string | null;
  tax_percentage: number | null;
  tax_inclusive: boolean | null;
  payment_gateway: string | null;
  payment_api_key: string | null;
  call_center_number: string | null;
  telegram_channel_id: string | null;
  status: string | null;
  inactivity_reason: string | null;
  default_currency: string | null;
  timezone: string | null;
  language: string | null;
  welcome_message: string | null;
  theme_color: string | null;
  logo_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Map franchise DB record to frontend Franchise type with proper type conversions
export const mapDbToFranchise = (dbRecord: FranchiseDB): Franchise => ({
  ...dbRecord,
  name: dbRecord.company_name,
  status: dbRecord.status as FranchiseStatus,
  payment_gateway: dbRecord.payment_gateway as PaymentGateway,
  inactivity_reason: dbRecord.inactivity_reason as InactivityReason
});

export interface EmployeeDB {
  id: string;
  franchise_id: string | null;
  name: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  telegram_id: string | null;
  ip_restrictions: string[] | null;
  access_level: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface StaffMember {
  id: string;
  franchise_id: string | null;
  full_name: string;
  designation: string;
  contact_number: string;
  email: string;
  telegram_id?: string;
  ip_restrictions?: string[];
  access_level: StaffAccessLevel;
  status: StaffStatus;
}

export const mapEmployeeToStaffMember = (employee: EmployeeDB): StaffMember => ({
  id: employee.id,
  franchise_id: employee.franchise_id,
  full_name: employee.name,
  designation: employee.role || "Staff",
  contact_number: employee.phone || "",
  email: employee.email || "",
  telegram_id: employee.telegram_id || "",
  ip_restrictions: employee.ip_restrictions || [],
  access_level: (employee.access_level as StaffAccessLevel) || "Staff",
  status: (employee.status as StaffStatus) || "active"
});

export const getAccessLevelColor = (accessLevel: StaffAccessLevel): string => {
  switch (accessLevel) {
    case "Admin":
      return "bg-red-500 hover:bg-red-600";
    case "Manager":
      return "bg-blue-500 hover:bg-blue-600";
    default:
      return "bg-green-500 hover:bg-green-600";
  }
};

// Define Session interfaces needed by addSessions.ts
export interface Session {
  id: string;
  name: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  isActive: boolean;
  isSpecialDate?: boolean;
  specialDateName?: string;
}

export interface SessionDB {
  id: string;
  name: string;
  type: string;
  start_date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  booked_count: number;
  is_active: boolean;
  is_special_date: boolean;
  special_date_name: string | null;
  created_at: string;
}

export const mapSessionDbToSession = (dbRecord: SessionDB): Session => ({
  id: dbRecord.id,
  name: dbRecord.name,
  type: dbRecord.type,
  date: dbRecord.start_date,
  startTime: dbRecord.start_time,
  endTime: dbRecord.end_time,
  maxCapacity: dbRecord.max_capacity,
  bookedCount: dbRecord.booked_count,
  isActive: dbRecord.is_active,
  isSpecialDate: dbRecord.is_special_date,
  specialDateName: dbRecord.special_date_name || undefined
});


export type StaffStatus = "active" | "inactive" | "on_leave" | "training";
export type StaffDesignation = "Chef" | "Host" | "DJ" | "Safety Officer" | "Manager" | "Photographer" | "Waiter" | "Security";
export type StaffAccessLevel = "Admin" | "Manager" | "Staff";
export type TrainingStatus = "assigned" | "completed" | "expired" | "not_required";
export type ShiftType = "morning" | "afternoon" | "evening" | "night";

// Complete DB model for employee from Supabase
export interface EmployeeDB {
  id: string;
  franchise_id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  telegram_id?: string;
  telegram_access?: boolean;
  created_at?: string;
  updated_at?: string;
  ip_restrictions?: string[];
  access_level?: StaffAccessLevel;
  status?: StaffStatus;
  department?: string;
  hire_date?: string;
  emergency_contact?: string;
}

// Frontend representation of staff
export interface StaffMember {
  id: string;
  franchise_id: string;
  full_name: string;
  designation: StaffDesignation;
  contact_number: string;
  email: string;
  telegram_id?: string;
  telegram_access: boolean;
  ip_restrictions?: string[];
  access_level: StaffAccessLevel;
  status: StaffStatus;
  created_at: string;
  updated_at?: string;
  department?: string;
  hire_date?: string;
  emergency_contact?: string;
  franchise_name?: string;
}

// Staff Shift interface
export interface StaffShift {
  id: string;
  staff_id: string;
  franchise_id: string;
  date: string;
  start_time: string;
  end_time: string;
  role: string;
  created_at: string;
  updated_at?: string;
  notes?: string;
  is_recurring?: boolean;
  recurring_pattern?: string;
  // Adding these properties that are used in the code
  staff_name?: string;
  staff_role?: string;
}

// Staff Training interface
export interface StaffTraining {
  id: string;
  staff_id: string;
  training_name: string;
  assigned_date: string;
  completion_date?: string;
  valid_until?: string;
  certificate_url?: string;
  status: TrainingStatus;
  notes?: string;
  assigned_by?: string;
  // Adding these properties that are used in the code
  staff_name?: string;
  staff_role?: string;
}

export interface IpRestriction {
  id: string;
  staff_id: string;
  ip_address: string;
  is_allowed: boolean;
  created_at: string;
}

// Add EnhancedFranchise type that's used in StaffDirectory
export interface EnhancedFranchise {
  id: string;
  company_name: string;
  name?: string;
  owner_email?: string;
  currency?: string;
  // Additional fields from the franchises table
  owner_name?: string;
  contact_number?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  tax_id?: string;
  tax_percentage?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper function to get a color based on access level
export function getAccessLevelColor(accessLevel: StaffAccessLevel): string {
  switch (accessLevel) {
    case 'Admin':
      return 'bg-red-100 text-red-800';
    case 'Manager':
      return 'bg-blue-100 text-blue-800';
    case 'Staff':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to get a color based on staff status
export function getStatusColor(status: StaffStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'on_leave':
      return 'bg-amber-100 text-amber-800';
    case 'training':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to get department color
export function getDepartmentColor(department: string): string {
  switch (department?.toLowerCase()) {
    case 'dining':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'kitchen':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'hospitality':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'security':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'management':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'marketing':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Map employee DB structure to StaffMember interface
export function mapEmployeeToStaffMember(employee: EmployeeDB): StaffMember {
  return {
    id: employee.id,
    franchise_id: employee.franchise_id,
    full_name: employee.name,
    designation: employee.role as StaffDesignation,
    contact_number: employee.phone || '',
    email: employee.email || '',
    telegram_id: employee.telegram_id,
    telegram_access: employee.telegram_access || false,
    ip_restrictions: employee.ip_restrictions || [],
    access_level: employee.access_level || 'Staff',
    status: employee.status || 'active',
    created_at: employee.created_at || new Date().toISOString(),
    updated_at: employee.updated_at || new Date().toISOString(),
    department: employee.department,
    hire_date: employee.hire_date,
    emergency_contact: employee.emergency_contact,
  };
}

// Departments
export const STAFF_DEPARTMENTS = [
  "Dining",
  "Kitchen",
  "Hospitality",
  "Security",
  "Management",
  "Marketing"
];

// Staff designations grouped by department
export const STAFF_DESIGNATIONS_BY_DEPARTMENT: Record<string, StaffDesignation[]> = {
  "Dining": ["Host", "Waiter"],
  "Kitchen": ["Chef"],
  "Hospitality": ["Manager", "Host"],
  "Security": ["Safety Officer", "Security"],
  "Management": ["Manager"],
  "Entertainment": ["DJ", "Photographer"]
};

// Common training programs 
export const COMMON_TRAINING_PROGRAMS = [
  "Food Safety & Hygiene",
  "Customer Service Excellence", 
  "Emergency Response",
  "Fire Safety",
  "First Aid",
  "High Altitude Safety",
  "Wine & Beverage Service",
  "Leadership Training",
  "Health & Safety Compliance"
];

// Helper to determine if a role should have telegram access by default
export function shouldHaveTelegramAccess(designation: StaffDesignation): boolean {
  return ["Chef", "Manager", "Host", "Safety Officer", "Photographer"].includes(designation);
}

// Training duration defaults in days
export const TRAINING_VALIDITY_DEFAULTS: Record<string, number> = {
  "Food Safety & Hygiene": 365,
  "Emergency Response": 180,
  "Fire Safety": 180,
  "First Aid": 365,
  "High Altitude Safety": 180,
  "Health & Safety Compliance": 365,
  "Default": 180
};

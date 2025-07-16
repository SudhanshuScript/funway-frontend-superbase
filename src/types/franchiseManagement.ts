
export type FranchiseStatus = "active" | "inactive" | "pending_review";
export type PaymentGateway = "Stripe" | "PayPal" | "Square" | "Other";
export type InactivityReason = "Payment Pending" | "Maintenance" | "Legal Issue" | "Owner Request" | null;
export type DocumentType = "business_license" | "tax" | "kyc" | "legal" | "fssai" | "insurance" | "other";
export type DocumentStatus = "valid" | "expired" | "pending" | "rejected";
export type TeamMemberRole = "Manager" | "Chef" | "Host" | "Safety Officer" | "Staff";

export interface FranchiseStats {
  dailyBookings: number;
  weeklyBookings: number;
  monthlyBookings: number;
  utilization: number;
  earnings: number;
  pendingDocuments: number;
  inactiveAlerts: number;
  lastUpdated: string;
}

export interface FranchiseDocument {
  id: string;
  franchiseId: string;
  name: string;
  type: DocumentType;
  fileUrl: string;
  status: DocumentStatus;
  expirationDate?: string;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}

export interface FranchiseManager {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "Owner" | "Manager";
  telegramId?: string;
  ipRestrictions?: string[];
  addedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  telegramAccess: boolean;
  ipWhitelist?: string[];
}

// Enhanced franchise interface
export interface EnhancedFranchise {
  id: string;
  name: string;
  company_name: string;
  legal_name?: string;
  owner_name: string;
  owner_email: string;
  email?: string; // Added for compatibility with existing DB schema
  contact_number: string;
  address?: string; // Added for compatibility with existing DB schema
  start_date?: string;
  status: FranchiseStatus;
  inactivity_reason?: InactivityReason;
  shutdown_reason?: string;
  brand_logo?: string;
  logo_url?: string;
  timezone: string;
  currency: string;
  default_currency?: string; // Added for compatibility with existing DB schema
  tax_id: string;
  tax_percentage: number;
  tax_inclusive: boolean;
  gst_number?: string;
  fssai_cert?: string;
  brand_color?: string;
  website?: string;
  instagram?: string;
  welcome_message?: string;
  theme_color?: string;
  country: string;
  state: string;
  city: string;
  full_address?: string;
  created_at: string;
  updated_at: string;
  stats?: FranchiseStats;
  documents?: FranchiseDocument[];
  staff?: FranchiseManager[];
  team_members?: TeamMember[];
  payment_gateway?: PaymentGateway;
  monday_start?: string;
  monday_end?: string;
  tuesday_start?: string;
  tuesday_end?: string;
  wednesday_start?: string;
  wednesday_end?: string;
  thursday_start?: string;
  thursday_end?: string;
  friday_start?: string;
  friday_end?: string;
  saturday_start?: string;
  saturday_end?: string;
  sunday_start?: string;
  sunday_end?: string;
}

export const mapDbToFranchise = (dbData: any): EnhancedFranchise => {
  return {
    ...dbData,
    name: dbData.name || dbData.company_name,
    company_name: dbData.company_name || dbData.name,
    owner_email: dbData.owner_email || dbData.email,
    email: dbData.email || dbData.owner_email,
    currency: dbData.currency || dbData.default_currency || 'USD',
    full_address: dbData.full_address || dbData.address,
    status: (dbData.status as FranchiseStatus) || 'active',
    payment_gateway: (dbData.payment_gateway as PaymentGateway) || undefined,
    inactivity_reason: (dbData.inactivity_reason as InactivityReason) || undefined
  };
};

// Updated OnboardingStep to include all the step values used in both components
export type OnboardingStep = 
  | "franchise-identity"
  | "location-address" 
  | "registration" 
  | "brand-appearance"
  | "operational-setup"
  | "review"
  | "owner-details"
  | "business-info"
  | "hours-setup";

export interface FranchiseFormData {
  // Primary Franchise Identity
  name: string;
  company_name?: string; // Added for DB compatibility
  legal_name?: string;
  owner_name: string;
  owner_email: string;
  email?: string; // Added for DB compatibility
  contact_number: string;
  id_proof?: File;
  
  // Location & Address
  full_address?: string;
  address?: string; // Added for DB compatibility
  city: string;
  state: string;
  country: string;
  timezone: string;
  currency: string;
  default_currency?: string; // Added for DB compatibility
  start_date?: string;
  map_coordinates?: { lat: number; lng: number };
  
  // Registration & Compliance
  tax_id: string;
  gst_number?: string;
  fssai_cert?: File;
  fssai_expiry?: string;
  business_certificate?: File;
  insurance_document?: File;
  
  // Brand & Appearance
  logo_url?: string;
  brand_logo?: File;
  brand_color?: string;
  theme_color?: string;
  website?: string;
  instagram?: string;
  
  // Operational Setup
  manager_id?: string;
  team_members?: TeamMember[];
  telegram_access?: boolean;
  ip_whitelist?: string[];
  payment_gateway?: PaymentGateway;
  
  // Operating Hours
  monday_start?: string;
  monday_end?: string;
  tuesday_start?: string;
  tuesday_end?: string;
  wednesday_start?: string;
  wednesday_end?: string;
  thursday_start?: string;
  thursday_end?: string;
  friday_start?: string;
  friday_end?: string;
  saturday_start?: string;
  saturday_end?: string;
  sunday_start?: string;
  sunday_end?: string;
  
  // Additional Fields
  welcome_message?: string;
  tax_percentage: number;
  tax_inclusive: boolean;
  status: FranchiseStatus;
}

export interface LocationFilter {
  country: string | null;
  state: string | null;
  city: string | null;
}

export interface FranchiseFiltersState {
  search: string;
  status: string;
  dateRange: { from: Date | null; to: Date | null };
  location: LocationFilter;
}

export interface Country {
  name: string;
  code: string;
  states: State[];
}

export interface State {
  name: string;
  code: string;
  cities: string[];
}

export const FRANCHISE_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending Review", value: "pending_review" }
];

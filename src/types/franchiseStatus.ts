
export type FranchiseStatus = "active" | "inactive";
export type PaymentGateway = "Stripe" | "PayPal" | "Square" | "Other";

// Franchise interfaces
export interface FranchiseDB {
  id: string;
  company_name: string;
  created_at: string;
  logo_url?: string;
  rating?: number;
  status: string;
  owner_name?: string;
  contact_number?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  tax_id?: string;
  tax_percentage?: number;
  tax_inclusive?: boolean;
  payment_gateway?: PaymentGateway;
  payment_api_key?: string;
  call_center_number?: string;
  telegram_channel_id?: string;
  default_currency?: string;
  timezone?: string;
  language?: string;
  welcome_message?: string;
  theme_color?: string;
}

// Extended interface for the frontend
export interface Franchise extends FranchiseDB {
  name?: string; // Alias for company_name
}

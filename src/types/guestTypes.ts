
import { Database } from "@/types/supabase";

export type GuestType = "New" | "Regular" | "VIP" | "Inactive" | "High Potential";
export type OfferStatus = "Sent" | "Viewed" | "Redeemed" | "Expired";

export interface GuestContact {
  email: string;
  phone: string;
}

export interface GuestPreference {
  id: string;
  preference: string;
}

export interface GuestOffer {
  id: string;
  offerId: string;
  offerName: string;
  status: OfferStatus;
  sentOn: string;
  redeemedOn?: string;
  via: string;
}

export interface GuestLoyalty {
  id: string;
  pointsEarned: number;
  pointsRedeemed: number;
  source: string;
  eventTime: string;
}

export interface Guest {
  id: string;
  guestId: string; // e.g., G-001
  name: string;
  email: string;
  phone: string;
  guestType: GuestType;
  franchiseId: string;
  franchiseName: string;
  lastVisit: string;
  totalVisits: number;
  createdAt: string;
  updatedAt: string;
  preferences?: GuestPreference[];
  offers?: GuestOffer[];
  loyalty?: {
    totalPoints: number;
    availablePoints: number;
    transactions: GuestLoyalty[];
  };
  upcomingBookings: number;
  notes?: string;
  tags?: string[];
}

export interface GuestFilters {
  search: string;
  franchiseId: string;
  guestType: string;
  lastVisitRange: { from: Date | null; to: Date | null } | null;
  minBookings: number | null;
  maxBookings: number | null;
  preferences: string[];
  loyaltyRange: { min: number | null; max: number | null } | null;
  offerRedeemed: boolean | null;
}

export interface GuestStats {
  totalGuests: number;
  newThisMonth: number;
  vipGuests: number;
  vipPercentage: number;
  averageVisits: number;
  recordedPreferences: number;
  offerEngagement: number;
  mostPopularOffer: string;
}

export const getGuestTypeColor = (type: GuestType): string => {
  switch (type) {
    case "VIP":
      return "border-pink-500 text-pink-500";
    case "Regular":
      return "border-blue-500 text-blue-500";
    case "New":
      return "border-green-500 text-green-500";
    case "Inactive":
      return "border-amber-500 text-amber-500";
    case "High Potential":
      return "border-purple-500 text-purple-500";
    default:
      return "";
  }
};

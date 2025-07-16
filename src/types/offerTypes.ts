
export type OfferStatus = "Active" | "Scheduled" | "Draft" | "Expired" | "Pending" | "Rejected";
export type OfferType = "Happy Hour" | "Event" | "Loyalty" | "First-Time" | "Custom";
export type DiscountType = "Flat" | "Percentage" | "Fixed Amount" | "Free Add-On";
export type GuestSegment = "VIP" | "Regular" | "New" | "First-Time" | "Unregistered" | "All";
export type DeliveryChannel = "Email" | "WhatsApp" | "Telegram" | "In-App" | "All";

export interface Offer {
  id: string;
  name: string;
  code: string;
  type: OfferType;
  discountType: DiscountType;
  discountValue: number;
  validFrom: string;
  validTo: string;
  validityType: string; // "Weekend Only", "Weekday Only", "All Days", "First Booking", etc.
  maxRedemptions: number;
  perGuestLimit: number;
  redemptions: number;
  status: OfferStatus;
  guestSegments: GuestSegment[];
  franchiseIds: string[];
  deliveryChannels: DeliveryChannel[];
  sessionIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  sentCount?: number;
  viewedCount?: number;
  redeemedCount?: number;
  conversionRate?: number;
}

export interface OfferFormData {
  name: string;
  type: OfferType;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  validFrom: Date | string;
  validTo: Date | string;
  validityType: string;
  maxRedemptions: number;
  perGuestLimit: number;
  guestSegments: GuestSegment[];
  franchiseIds: string[];
  deliveryChannels: DeliveryChannel[];
  sessionIds: string[];
  status: OfferStatus;
  scheduleDate?: Date | string;
}

export interface OfferFilters {
  type: string;
  status: string;
  franchiseId: string;
  guestSegment: string;
  validityType: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export interface OfferAnalyticsData {
  activeOffers: number;
  totalRedemptions: number;
  conversionRate: number;
  expiringOffers: number;
  topOffer: {
    id: string;
    name: string;
    code: string;
    conversionRate: number;
  };
  lowestOffer: {
    id: string;
    name: string;
    code: string;
    conversionRate: number;
    suggestion: string;
  };
}


// Add this type definition if not already defined in this file
export type ReminderMethod = "email" | "sms" | "whatsapp" | "call";

export interface ReminderTemplate {
  id: string;
  name: string;
  subject?: string;
  body: string;
  method: ReminderMethod;
  isDefault: boolean;
}

// Add booking status types
export type BookingStatus = "confirmed" | "pending" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "partial" | "refunded";
export type ReminderStatus = "sent" | "not_sent" | "responded" | "no_response";
export type AbandonmentReason = "payment_failure" | "session_unavailability" | "user_dropout" | "unknown";
export type GuestType = "Regular" | "VIP" | "First Timer";

// Guest Profile interface
export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  guestType: GuestType;
  foodPreference?: "Vegetarian" | "Non-Vegetarian" | "Mixed";
  loyaltyPoints: number;
  totalBookings: number;
  specialNotes?: string;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
}

// Booking History for Guest Profile
export interface BookingHistory {
  id: string;
  bookingDate: string;
  sessionName: string;
  guestCount: number;
  vegCount?: number;
  nonVegCount?: number;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  feedback?: string;
  bookingStatus: BookingStatus;
}

// Payment Method Types
export type PaymentMethodType = "upi" | "card" | "netbanking" | "cash" | "wallet";

// Transaction interface for payment history
export interface Transaction {
  id: string;
  date: string;
  bookingId: string;
  customer: string;
  totalGuests: number;
  amount: number;
  status: string;
  checkInStatus: string;
  method: string;
  franchise: string;
  sessionName: string;
  guestType: string;
  dueAmount?: number;
}

// Upcoming Booking interface
export interface UpcomingBooking {
  id: string;
  guestName: string;
  guestType: GuestType;
  sessionName: string;
  sessionId: string;
  bookingDate: string;
  createdAt: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalGuests: number;
  specialRequests?: string;
  reminderStatus: ReminderStatus;
  lastReminderSent?: string;
  reminderCount: number;
  contactDetails?: {
    email: string;
    phone: string;
  };
  isNewBooking?: boolean;
  vegCount?: number;
  nonVegCount?: number;
  addonPackage?: string;
  cancellationReason?: string;
}

// Abandoned Cart interfaces
export interface ContactDetails {
  email: string;
  phone?: string;
}

export interface DiscountInfo {
  code: string;
  percentage: number;
  expiry: string;
  isRedeemed: boolean;
}

export interface AbandonedCart {
  id: string;
  guestName: string;
  guestType: GuestType;
  totalGuests: number;
  contactDetails: ContactDetails;
  sessionName: string;
  sessionId: string;
  bookingDate: string;
  abandonmentTimestamp: string;
  abandonmentReason: AbandonmentReason;
  reminderStatus: ReminderStatus;
  lastReminderSent?: string;
  reminderCount: number;
  discountOffered?: DiscountInfo;
  isArchived: boolean;
  isRecovered: boolean;
}

// Follow-up records
export interface FollowUpRecord {
  id: string;
  cartId: string;
  guestName: string;
  method: ReminderMethod;
  sentAt: string;
  status: "delivered" | "opened" | "responded" | "failed";
  responseTimestamp?: string;
  discountOffered?: string;
  templateId?: string;
}

// Cart statistics interfaces
export interface ReminderEffectiveness {
  method: ReminderMethod;
  sentCount: number;
  successCount: number;
  successRate: number;
}

export interface TrendData {
  date: string;
  abandonedCount: number;
  recoveredCount: number;
}

export interface DiscountImpact {
  offeredCount: number;
  redeemedCount: number;
  redemptionRate: number;
  averageDiscount: number;
}

export interface AbandonedCartStats {
  totalCarts: number;
  recoveredCarts: number;
  recoveryRate: number;
  averageRecoveryTime: number;
  reminderEffectiveness: ReminderEffectiveness[];
  recoveryTrend: TrendData[];
  discountImpact: DiscountImpact;
}

// Move BookingStats and PopularSession type from hooks/bookings/types.ts
export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  averagePartySize: number;
  popularSessions: PopularSession[];
  vipGuestPercentage: number;
  firstTimeGuestPercentage: number;
}

export interface PopularSession {
  name: string;
  bookings: number;
}

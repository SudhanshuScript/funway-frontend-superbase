
import { useState } from 'react';
import { AbandonedCart, AbandonedCartStats, ReminderTemplate, FollowUpRecord, ReminderMethod } from '@/types/bookingTypes';
import { useAbandonedCartFilters } from './useAbandonedCartFilters';
import { useCartActions } from './useCartActions';
import { useBulkActions } from './useBulkActions';

// Mock data for abandoned carts
const mockAbandonedCarts: AbandonedCart[] = [
  {
    id: "AC-001",
    guestName: "Michael Brown",
    guestType: "Regular",
    totalGuests: 3,
    contactDetails: {
      email: "michael.brown@example.com",
      phone: "+1234567890"
    },
    sessionName: "Sunset Dinner",
    sessionId: "SD-001",
    bookingDate: "2023-06-15",
    abandonmentTimestamp: "2023-06-01T14:23:15Z",
    abandonmentReason: "payment_failure",
    reminderStatus: "sent",
    lastReminderSent: "2023-06-02T10:00:00Z",
    reminderCount: 1,
    isArchived: false,
    isRecovered: false
  },
  {
    id: "AC-002",
    guestName: "Jessica Wilson",
    guestType: "First Timer",
    totalGuests: 2,
    contactDetails: {
      email: "jessica.wilson@example.com"
    },
    sessionName: "Brunch Special",
    sessionId: "BS-002",
    bookingDate: "2023-06-10",
    abandonmentTimestamp: "2023-06-03T09:45:30Z",
    abandonmentReason: "user_dropout",
    reminderStatus: "not_sent",
    reminderCount: 0,
    isArchived: false,
    isRecovered: false
  },
  {
    id: "AC-003",
    guestName: "Thomas Anderson",
    guestType: "VIP",
    totalGuests: 4,
    contactDetails: {
      email: "thomas.anderson@example.com",
      phone: "+1987654321"
    },
    sessionName: "Valentine's Day Special",
    sessionId: "VD-003",
    bookingDate: "2023-06-20",
    abandonmentTimestamp: "2023-06-05T18:12:45Z",
    abandonmentReason: "session_unavailability",
    reminderStatus: "sent",
    lastReminderSent: "2023-06-06T10:00:00Z",
    reminderCount: 2,
    discountOffered: {
      code: "COMEBACK15",
      percentage: 15,
      expiry: "2023-06-13T23:59:59Z",
      isRedeemed: false
    },
    isArchived: false,
    isRecovered: false
  },
  {
    id: "AC-004",
    guestName: "Emma Davis",
    guestType: "Regular",
    totalGuests: 2,
    contactDetails: {
      email: "emma.davis@example.com"
    },
    sessionName: "Lunch",
    sessionId: "LN-004",
    bookingDate: "2023-06-12",
    abandonmentTimestamp: "2023-06-04T12:30:10Z",
    abandonmentReason: "unknown",
    reminderStatus: "responded",
    lastReminderSent: "2023-06-05T10:00:00Z",
    reminderCount: 1,
    isArchived: false,
    isRecovered: true
  },
  {
    id: "AC-005",
    guestName: "Robert Smith",
    guestType: "VIP",
    totalGuests: 6,
    contactDetails: {
      email: "robert.smith@example.com",
      phone: "+1122334455"
    },
    sessionName: "Dinner",
    sessionId: "DN-005",
    bookingDate: "2023-06-18",
    abandonmentTimestamp: "2023-06-02T20:15:28Z",
    abandonmentReason: "payment_failure",
    reminderStatus: "no_response",
    lastReminderSent: "2023-06-04T10:00:00Z",
    reminderCount: 3,
    discountOffered: {
      code: "COMEBACK20",
      percentage: 20,
      expiry: "2023-06-09T23:59:59Z",
      isRedeemed: false
    },
    isArchived: true,
    isRecovered: false
  }
];

// Mock data for follow-up history
const mockFollowUps: FollowUpRecord[] = [
  {
    id: "FU-001",
    cartId: "AC-001",
    guestName: "Michael Brown",
    method: "email",
    sentAt: "2023-06-02T10:00:00Z",
    status: "delivered",
    templateId: "TPL-001"
  },
  {
    id: "FU-002",
    cartId: "AC-003",
    guestName: "Thomas Anderson",
    method: "email",
    sentAt: "2023-06-06T10:00:00Z",
    status: "opened",
    responseTimestamp: undefined,
    discountOffered: "COMEBACK15",
    templateId: "TPL-002"
  },
  {
    id: "FU-003",
    cartId: "AC-003",
    guestName: "Thomas Anderson",
    method: "sms",
    sentAt: "2023-06-07T14:30:00Z",
    status: "delivered",
    templateId: "TPL-003"
  },
  {
    id: "FU-004",
    cartId: "AC-004",
    guestName: "Emma Davis",
    method: "email",
    sentAt: "2023-06-05T10:00:00Z",
    status: "responded",
    responseTimestamp: "2023-06-05T15:42:18Z",
    templateId: "TPL-001"
  },
  {
    id: "FU-005",
    cartId: "AC-005",
    guestName: "Robert Smith",
    method: "whatsapp",
    sentAt: "2023-06-04T10:00:00Z",
    status: "delivered",
    templateId: "TPL-004"
  }
];

// Mock reminder templates with proper ReminderMethod type
const mockReminderTemplates: ReminderTemplate[] = [
  {
    id: "TPL-001",
    name: "Standard Reminder",
    subject: "Complete Your FlyDining Booking",
    body: "Hello {guestName}, we noticed you didn't complete your booking for {sessionName} on {bookingDate}. Your cart is still waiting for you!",
    method: "email",
    isDefault: true
  },
  {
    id: "TPL-002",
    name: "Discount Offer",
    subject: "Special Offer: Complete Your FlyDining Experience",
    body: "Hello {guestName}, we'd love to welcome you! Use code {discountCode} for {discountPercentage}% off your booking for {sessionName}.",
    method: "email",
    isDefault: false
  },
  {
    id: "TPL-003",
    name: "SMS Reminder",
    body: "FlyDining: Complete your {sessionName} booking! Your cart is waiting. Click: {cartLink}",
    method: "sms",
    isDefault: true
  },
  {
    id: "TPL-004",
    name: "WhatsApp Reminder",
    body: "Hello {guestName}! Your FlyDining booking for {sessionName} is incomplete. Tap here to complete your reservation: {cartLink}",
    method: "whatsapp",
    isDefault: true
  }
];

// Mock stats data
const mockStats: AbandonedCartStats = {
  totalCarts: 12,
  recoveredCarts: 5,
  recoveryRate: 41.67,
  averageRecoveryTime: 26, // hours
  reminderEffectiveness: [
    { method: "email", sentCount: 15, successCount: 3, successRate: 20 },
    { method: "sms", sentCount: 8, successCount: 1, successRate: 12.5 },
    { method: "whatsapp", sentCount: 5, successCount: 1, successRate: 20 }
  ],
  discountImpact: {
    offeredCount: 7,
    redeemedCount: 4,
    redemptionRate: 57.14,
    averageDiscount: 15.5
  },
  recoveryTrend: [
    { date: "2023-05-01", abandonedCount: 3, recoveredCount: 1 },
    { date: "2023-05-08", abandonedCount: 2, recoveredCount: 1 },
    { date: "2023-05-15", abandonedCount: 4, recoveredCount: 2 },
    { date: "2023-05-22", abandonedCount: 1, recoveredCount: 0 },
    { date: "2023-05-29", abandonedCount: 2, recoveredCount: 1 }
  ]
};

export function useAbandonedCarts() {
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(mockAbandonedCarts);
  const [followUps] = useState<FollowUpRecord[]>(mockFollowUps);
  const [reminderTemplates] = useState(mockReminderTemplates);
  const [stats] = useState<AbandonedCartStats>(mockStats);
  
  const cartFilters = useAbandonedCartFilters();
  const cartActions = useCartActions();
  const bulkActions = useBulkActions();

  // Update cart state after actions
  const updateCartState = (cartId: string, updates: Partial<AbandonedCart>) => {
    setAbandonedCarts(prev => 
      prev.map(c => c.id === cartId ? { ...c, ...updates } : c)
    );
  };

  // Override cart actions to update state
  const sendReminder = async (cartId: string, templateId: string, method: ReminderMethod) => {
    const success = await cartActions.sendReminder(cartId, templateId, method);
    if (success) {
      const now = new Date().toISOString();
      updateCartState(cartId, {
        reminderStatus: 'sent',
        lastReminderSent: now,
        reminderCount: (abandonedCarts.find(c => c.id === cartId)?.reminderCount || 0) + 1
      });
    }
    return success;
  };

  const offerDiscount = async (cartId: string, percentage: number) => {
    const discountCode = await cartActions.offerDiscount(cartId, percentage);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    updateCartState(cartId, {
      discountOffered: {
        code: discountCode,
        percentage,
        expiry: expiryDate.toISOString(),
        isRedeemed: false
      }
    });
    
    return discountCode;
  };

  const recoverCart = async (cartId: string) => {
    const success = await cartActions.recoverCart(cartId);
    if (success) {
      updateCartState(cartId, { isRecovered: true });
    }
    return success;
  };

  const archiveCart = async (cartId: string, reason: string) => {
    const success = await cartActions.archiveCart(cartId, reason);
    if (success) {
      updateCartState(cartId, { isArchived: true });
    }
    return success;
  };

  const unarchiveCart = async (cartId: string) => {
    const success = await cartActions.unarchiveCart(cartId);
    if (success) {
      updateCartState(cartId, { isArchived: false });
    }
    return success;
  };

  return {
    abandonedCarts,
    followUps,
    reminderTemplates,
    stats,
    loading: cartActions.loading || bulkActions.loading,
    ...cartFilters,
    sendReminder,
    offerDiscount,
    recoverCart,
    archiveCart,
    unarchiveCart,
    sendBulkReminders: bulkActions.sendBulkReminders,
    getReminderTemplate: (templateId: string) => 
      reminderTemplates.find(template => template.id === templateId) || reminderTemplates[0]
  };
}

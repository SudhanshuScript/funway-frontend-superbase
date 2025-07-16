import { useState, useEffect } from 'react';
import { AbandonedCart, AbandonedCartStats, FollowUpRecord, ReminderTemplate, ReminderMethod } from '@/types/bookingTypes';
import { toast } from 'sonner';

const mockReminderTemplates: ReminderTemplate[] = [
  {
    id: "template1",
    name: "First Reminder",
    subject: "Complete Your Booking",
    body: "Hello {name}, we noticed you didn't complete your booking for {session}. Your cart is still saved. Click here to complete your booking.",
    method: "email",
    isDefault: true
  },
  {
    id: "template2",
    name: "Second Reminder",
    subject: "Don't Miss Out!",
    body: "Hi {name}, your reservation for {session} is about to expire. Complete your booking now to secure your spot.",
    method: "email",
    isDefault: false
  },
  {
    id: "template3",
    name: "Text Message Reminder",
    body: "Hello {name}, click here to complete your {session} booking: {link}",
    method: "sms",
    isDefault: true
  }
];

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

const mockFollowUps: FollowUpRecord[] = [
  {
    id: "FU-001",
    cartId: "AC-001",
    guestName: "Michael Brown",
    method: "email",
    sentAt: "2023-06-02T10:00:00Z",
    status: "delivered",
    responseTimestamp: undefined,
    discountOffered: undefined
  },
  {
    id: "FU-002",
    cartId: "AC-003",
    guestName: "Thomas Anderson",
    method: "email",
    sentAt: "2023-06-06T10:00:00Z",
    status: "opened",
    discountOffered: "COMEBACK15"
  },
  {
    id: "FU-003",
    cartId: "AC-003",
    guestName: "Thomas Anderson",
    method: "sms",
    sentAt: "2023-06-07T14:30:00Z",
    status: "delivered"
  },
  {
    id: "FU-004",
    cartId: "AC-004",
    guestName: "Emma Davis",
    method: "email",
    sentAt: "2023-06-05T10:00:00Z",
    status: "responded",
    responseTimestamp: "2023-06-05T15:42:18Z"
  },
  {
    id: "FU-005",
    cartId: "AC-005",
    guestName: "Robert Smith",
    method: "whatsapp",
    sentAt: "2023-06-04T10:00:00Z",
    status: "delivered"
  }
];

const mockStats: AbandonedCartStats = {
  totalCarts: 45,
  recoveredCarts: 12,
  recoveryRate: 26.7,
  averageRecoveryTime: 18,
  reminderEffectiveness: [
    {
      method: "email",
      sentCount: 35,
      successCount: 8,
      successRate: 22.9
    },
    {
      method: "sms",
      sentCount: 20,
      successCount: 4,
      successRate: 20.0
    },
    {
      method: "whatsapp",
      sentCount: 15,
      successCount: 3,
      successRate: 20.0
    }
  ],
  recoveryTrend: [
    {
      date: "2023-05-01",
      abandonedCount: 12,
      recoveredCount: 3
    },
    {
      date: "2023-05-08",
      abandonedCount: 15,
      recoveredCount: 4
    },
    {
      date: "2023-05-15",
      abandonedCount: 18,
      recoveredCount: 5
    }
  ],
  discountImpact: {
    offeredCount: 25,
    redeemedCount: 8,
    redemptionRate: 32.0,
    averageDiscount: 15.5
  }
};

export function useAbandonedCarts() {
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"active" | "archived" | "recovered">("active");
  const [reminderTemplates, setReminderTemplates] = useState<ReminderTemplate[]>([]);
  const [stats, setStats] = useState<AbandonedCartStats>(mockStats);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setAbandonedCarts(mockAbandonedCarts);
        setFollowUps(mockFollowUps);
        setReminderTemplates(mockReminderTemplates);
        setStats(mockStats);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load abandoned cart data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const filteredCarts = abandonedCarts.filter(cart => {
    if (activeFilter === "active") return !cart.isArchived && !cart.isRecovered;
    if (activeFilter === "archived") return cart.isArchived;
    if (activeFilter === "recovered") return cart.isRecovered;
    return true;
  });
  
  const sendReminder = async (
    cartId: string, 
    templateId: string,
    method: ReminderMethod
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const cartIndex = abandonedCarts.findIndex(c => c.id === cartId);
      if (cartIndex === -1) throw new Error("Cart not found");
      
      const template = reminderTemplates.find(t => t.id === templateId);
      if (!template) throw new Error("Template not found");
      
      const newFollowUp: FollowUpRecord = {
        id: `FU-${Date.now()}`,
        cartId,
        guestName: abandonedCarts[cartIndex].guestName,
        method: method,
        sentAt: new Date().toISOString(),
        status: "delivered"
      };
      
      const updatedCarts = [...abandonedCarts];
      updatedCarts[cartIndex] = {
        ...updatedCarts[cartIndex],
        reminderStatus: "sent",
        lastReminderSent: new Date().toISOString(),
        reminderCount: updatedCarts[cartIndex].reminderCount + 1
      };
      
      setAbandonedCarts(updatedCarts);
      setFollowUps([...followUps, newFollowUp]);
      
      toast.success("Reminder sent successfully");
      return true;
    } catch (error: any) {
      console.error("Error sending reminder:", error);
      toast.error(`Failed to send reminder: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const offerDiscount = async (cartId: string, percentage: number): Promise<string> => {
    try {
      setLoading(true);
      
      const cartIndex = abandonedCarts.findIndex(c => c.id === cartId);
      if (cartIndex === -1) throw new Error("Cart not found");
      
      const discountCode = `RECOVER${cartId.replace(/\D/g, '')}${percentage}`;
      
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      
      const updatedCarts = [...abandonedCarts];
      updatedCarts[cartIndex] = {
        ...updatedCarts[cartIndex],
        discountOffered: {
          code: discountCode,
          percentage,
          expiry: expiry.toISOString(),
          isRedeemed: false
        }
      };
      
      setAbandonedCarts(updatedCarts);
      
      toast.success(`Discount code generated: ${discountCode}`);
      return discountCode;
    } catch (error: any) {
      console.error("Error offering discount:", error);
      toast.error(`Failed to offer discount: ${error.message}`);
      return "";
    } finally {
      setLoading(false);
    }
  };
  
  const recoverCart = async (cartId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const cartIndex = abandonedCarts.findIndex(c => c.id === cartId);
      if (cartIndex === -1) throw new Error("Cart not found");
      
      const updatedCarts = [...abandonedCarts];
      updatedCarts[cartIndex] = {
        ...updatedCarts[cartIndex],
        isRecovered: true
      };
      
      setAbandonedCarts(updatedCarts);
      
      setStats({
        ...stats,
        recoveredCarts: stats.recoveredCarts + 1,
        recoveryRate: ((stats.recoveredCarts + 1) / stats.totalCarts) * 100
      });
      
      toast.success("Cart recovered successfully");
      return true;
    } catch (error: any) {
      console.error("Error recovering cart:", error);
      toast.error(`Failed to recover cart: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const archiveCart = async (cartId: string, reason: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const cartIndex = abandonedCarts.findIndex(c => c.id === cartId);
      if (cartIndex === -1) throw new Error("Cart not found");
      
      const updatedCarts = [...abandonedCarts];
      updatedCarts[cartIndex] = {
        ...updatedCarts[cartIndex],
        isArchived: true
      };
      
      setAbandonedCarts(updatedCarts);
      
      toast.success("Cart archived successfully");
      return true;
    } catch (error: any) {
      console.error("Error archiving cart:", error);
      toast.error(`Failed to archive cart: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const unarchiveCart = async (cartId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const cartIndex = abandonedCarts.findIndex(c => c.id === cartId);
      if (cartIndex === -1) throw new Error("Cart not found");
      
      const updatedCarts = [...abandonedCarts];
      updatedCarts[cartIndex] = {
        ...updatedCarts[cartIndex],
        isArchived: false
      };
      
      setAbandonedCarts(updatedCarts);
      
      toast.success("Cart unarchived successfully");
      return true;
    } catch (error: any) {
      console.error("Error unarchiving cart:", error);
      toast.error(`Failed to unarchive cart: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const sendBulkReminders = async (
    cartIds: string[], 
    templateId: string,
    method: ReminderMethod
  ): Promise<number> => {
    try {
      setLoading(true);
      
      const template = reminderTemplates.find(t => t.id === templateId);
      if (!template) throw new Error("Template not found");
      
      let successCount = 0;
      
      for (const cartId of cartIds) {
        try {
          const success = await sendReminder(cartId, templateId, method);
          if (success) successCount++;
        } catch (error) {
          console.error(`Error sending reminder to cart ${cartId}:`, error);
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully sent ${successCount} of ${cartIds.length} reminders`);
      } else {
        toast.error("Failed to send any reminders");
      }
      
      return successCount;
    } catch (error: any) {
      console.error("Error sending bulk reminders:", error);
      toast.error(`Failed to send bulk reminders: ${error.message}`);
      return 0;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    abandonedCarts: filteredCarts,
    followUps,
    loading,
    activeFilter,
    setActiveFilter,
    reminderTemplates,
    stats,
    sendReminder,
    offerDiscount,
    recoverCart,
    archiveCart,
    unarchiveCart,
    sendBulkReminders,
  };
}


import { Session, SessionDB } from "@/types";

// Session service interfaces
export interface SessionInput {
  name: string;
  type: string;
  startDate: Date;
  startTime: string;
  endTime?: string;
  duration: number;
  maxCapacity: number;
  isActive?: boolean;
  
  // Special date fields
  isSpecialDate?: boolean;
  specialDateName?: string;
  specialPricing?: number;
  specialAddOns?: string[];
  specialConditions?: string;
  restrictBookingToDate?: boolean;
  
  // Recurrence fields
  isRecurring?: boolean;
  recurringType?: string;
  recurringEndDate?: Date;
  skipSpecialDates?: boolean;
  overrideRecurrence?: boolean;
  
  // User info
  userId?: string;
  franchiseId?: string;
}

export interface SessionResponse {
  success: boolean;
  data?: any;
  error?: string;
  sessionId?: string;
}

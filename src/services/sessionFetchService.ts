
import { format } from "date-fns";
import { logAuditEvent } from "@/utils/auditLogger";
import { SessionDB } from "@/types";
import { mockSessionsDB, getSessionsState } from "@/utils/mockSessionsTable";
import { SessionResponse } from "./sessionTypes";
import { sampleSessions } from "@/data/sampleSessions";

/**
 * Fetches sessions - fully mocked implementation
 */
export const getSessions = async (): Promise<SessionResponse> => {
  try {
    console.log("Attempting to fetch sessions...");
    
    // First try to get from the mock database
    const result = await mockSessionsDB.select().execute();
    
    // If we have sessions from the mock database, return them
    if (result.data && result.data.length > 0) {
      console.log(`Retrieved ${result.data.length} sessions from mock database`);
      return {
        success: true,
        data: result.data
      };
    }
    
    // If no sessions were found in the mock database, try using getSessionsState
    console.log("No sessions in mock DB, trying getSessionsState...");
    const sessions = getSessionsState();
    
    if (sessions && sessions.length > 0) {
      console.log(`Retrieved ${sessions.length} sessions from session state`);
      
      // Convert to DB format for consistency
      const dbSessions = sessions.map(session => ({
        id: session.id,
        name: session.name,
        type: session.type,
        start_date: session.date,
        start_time: session.startTime,
        end_time: session.endTime || '',
        duration: session.duration,
        max_capacity: session.maxCapacity,
        booked_count: session.bookedCount,
        is_active: session.isActive,
        is_special_date: session.isSpecialDate,
        special_date_name: session.specialDateName,
        special_pricing: session.specialPricing,
        special_addons: session.specialAddOns,
        special_conditions: session.specialConditions,
        is_recurring: session.isRecurring,
        recurring_type: session.recurringType,
        franchise_id: 'default-franchise'
      }));
      
      return {
        success: true,
        data: dbSessions
      };
    }
    
    // As a last resort, use sample sessions
    console.log("No sessions found, falling back to sample sessions");
    return {
      success: true,
      data: sampleSessions.map(session => ({
        id: session.id,
        name: session.name,
        type: session.type,
        start_date: session.date,
        start_time: session.startTime,
        end_time: session.endTime || '',
        duration: session.duration,
        max_capacity: session.maxCapacity,
        booked_count: session.bookedCount || 0,
        is_active: session.isActive,
        is_special_date: session.isSpecialDate || false,
        special_date_name: session.specialDateName || '',
        special_pricing: session.specialPricing,
        special_addons: session.specialAddOns,
        special_conditions: session.specialConditions,
        franchise_id: 'default-franchise'
      }))
    };
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    // Fall back to sample sessions on error
    console.log("Error fetching sessions, falling back to sample sessions");
    return {
      success: true,
      data: sampleSessions.map(session => ({
        id: session.id,
        name: session.name,
        type: session.type,
        start_date: session.date,
        start_time: session.startTime,
        end_time: session.endTime || '',
        duration: session.duration,
        max_capacity: session.maxCapacity,
        booked_count: session.bookedCount || 0,
        is_active: session.isActive,
        is_special_date: session.isSpecialDate || false,
        special_date_name: session.specialDateName || '',
        special_pricing: session.specialPricing,
        special_addons: session.specialAddOns,
        special_conditions: session.specialConditions,
        franchise_id: 'default-franchise'
      }))
    };
  }
};

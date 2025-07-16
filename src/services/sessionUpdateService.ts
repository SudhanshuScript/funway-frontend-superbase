
import { format } from "date-fns";
import { logAuditEvent } from "@/utils/auditLogger";
import { SessionDB } from "@/types/franchise";
import { mockSessionsDB } from "@/utils/mockSessionsTable";
import { SessionResponse } from "./sessionTypes";

/**
 * Updates an existing session - fully mocked implementation
 */
export const updateSession = async (
  id: string,
  sessionData: Partial<SessionDB>,
  userId?: string,
  franchiseId?: string
): Promise<SessionResponse> => {
  try {
    // Format the date to be displayable if available
    const formattedDate = sessionData.start_date 
      ? format(new Date(sessionData.start_date), "MMMM d, yyyy")
      : '';
    
    // Use mock database instead of Supabase
    const result = await mockSessionsDB.update(sessionData).eq('id', id);
    
    if (!result.data) {
      return {
        success: false,
        error: 'Session not found'
      };
    }
    
    // Log the audit event
    await logAuditEvent(
      'session',
      id,
      'update',
      { 
        name: sessionData.name || 'unnamed',
        date: formattedDate,
        capacity: sessionData.max_capacity,
      },
      userId,
      franchiseId
    );
    
    return {
      success: true,
      data: result.data
    };
  } catch (error: any) {
    console.error("Error updating session:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

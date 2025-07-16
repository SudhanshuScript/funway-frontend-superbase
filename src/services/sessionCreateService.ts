
import { format } from "date-fns";
import { logAuditEvent } from "@/utils/auditLogger";
import { SessionDB } from "@/types/franchise";
import { mockSessionsDB } from "@/utils/mockSessionsTable";
import { SessionResponse } from "./sessionTypes";

/**
 * Creates a new session - fully mocked implementation
 */
export const createSession = async (
  sessionData: Omit<SessionDB, "id" | "created_at">,
  userId?: string,
  franchiseId?: string
): Promise<SessionResponse> => {
  try {
    // Format the date to be displayable
    const formattedDate = format(
      new Date(sessionData.start_date),
      "MMMM d, yyyy"
    );
    
    // Create a new session object with generated ID and timestamp
    const newSession = {
      ...sessionData,
      id: `SES-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    
    // Use mock database instead of Supabase
    const result = await mockSessionsDB.insert(newSession);
    
    // Log the audit event
    await logAuditEvent(
      'session',
      newSession.id, 
      'create',
      { 
        name: sessionData.name,
        date: formattedDate,
        capacity: sessionData.max_capacity,
      },
      userId,
      franchiseId
    );
    
    return {
      success: true,
      data: result
    };
  } catch (error: any) {
    console.error("Error creating session:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

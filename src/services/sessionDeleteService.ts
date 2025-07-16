
import { logAuditEvent } from "@/utils/auditLogger";
import { mockSessionsDB } from "@/utils/mockSessionsTable";
import { SessionResponse } from "./sessionTypes";

/**
 * Deletes a session - fully mocked implementation
 */
export const deleteSession = async (
  sessionId: string,
  userId?: string,
  franchiseId?: string
): Promise<SessionResponse> => {
  try {
    // Use mock database instead of Supabase
    const result = await mockSessionsDB.delete().eq('id', sessionId);
    
    // Log the event
    await logAuditEvent(
      'session',
      sessionId,
      'delete',
      { id: sessionId },
      userId,
      franchiseId
    );
    
    return {
      success: true,
      data: result.data
    };
  } catch (error: any) {
    console.error("Error deleting session:", error);
    return {
      success: false,
      error: error.message
    };
  }
};


import { format } from "date-fns";
import { mockSessionsDB } from "@/utils/mockSessionsTable";

/**
 * Checks for session conflicts - fully mocked implementation
 */
export const checkSessionConflicts = async (
  date: string,
  startTime: string,
  endTime: string,
  excludeSessionId?: string
): Promise<boolean> => {
  try {
    // Get all sessions for the given date
    const result = await mockSessionsDB.select().eq('start_date', date).execute();
    
    if (!result.data || result.data.length === 0) {
      return false; // No conflicts if no sessions on this date
    }
    
    // Filter out the session we're excluding (if updating)
    const otherSessions = excludeSessionId 
      ? result.data.filter(session => session.id !== excludeSessionId)
      : result.data;
    
    // Check for time conflicts
    const hasConflict = otherSessions.some(session => {
      // Convert times to minutes for easier comparison
      const sessionStartMinutes = timeToMinutes(session.start_time);
      const sessionEndMinutes = timeToMinutes(session.end_time || '');
      const newStartMinutes = timeToMinutes(startTime);
      const newEndMinutes = timeToMinutes(endTime);
      
      // Check if times overlap
      return (
        (newStartMinutes >= sessionStartMinutes && newStartMinutes < sessionEndMinutes) ||
        (newEndMinutes > sessionStartMinutes && newEndMinutes <= sessionEndMinutes) ||
        (newStartMinutes <= sessionStartMinutes && newEndMinutes >= sessionEndMinutes)
      );
    });
    
    return hasConflict;
  } catch (error) {
    console.error("Error checking for session conflicts:", error);
    return false; // Default to no conflicts on error
  }
};

// Helper function to convert time string to minutes
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

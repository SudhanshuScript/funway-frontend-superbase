
import { supabase } from "@/integrations/supabase/client";
import { Session, SessionDB } from "@/types";
import { toast } from "sonner";
import { trackFunction, trackRealtime } from "@/utils/supabaseUsageTracker";
import { mapSessionDBToSession } from "@/types/sessionTypes";

// Function to enable real-time updates for sessions
export const enableRealtimeUpdates = (onUpdate: (sessions: Session[]) => void) => {
  console.log("Enabling realtime updates for sessions");
  trackRealtime('subscription');
  
  // Subscribe to all changes on the sessions table
  const channel = supabase
    .channel('session-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sessions'
      },
      (payload) => {
        console.log("Real-time update received:", payload);
        trackRealtime('message');
        
        // Fetch all sessions to ensure we have a consistent state
        fetchLatestSessions().then(sessions => {
          if (sessions) {
            onUpdate(sessions);
          }
        });
      }
    )
    .subscribe();
    
  // Return unsubscribe function for cleanup
  return () => {
    console.log("Disabling realtime updates for sessions");
    supabase.removeChannel(channel);
  };
};

// Function to fetch latest sessions
export const fetchLatestSessions = async (): Promise<Session[] | null> => {
  try {
    // Use a generic query with 'any' type to avoid TypeScript errors
    const { data, error } = await supabase
      .from('sessions' as any)
      .select('*')
      .order('start_date', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    if (data) {
      // Convert DB format to application format with proper type assertion
      return data.map((session: any) => mapSessionDBToSession(session as SessionDB));
    }
    
    return null;
  } catch (error: any) {
    console.error("Error fetching latest sessions:", error);
    toast.error("Could not fetch updated sessions");
    return null;
  }
};

// Function to update a session with realtime updates
export const updateSessionWithRealtime = async (
  id: string,
  updates: Partial<SessionDB>,
  sessions: Session[],
  setSessionsCallback: (sessions: Session[]) => void
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('sessions' as any)
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      throw error;
    }
    
    if (data) {
      // Optimistically update the local sessions state
      const updatedSession = mapSessionDBToSession(data as unknown as SessionDB);
      const updatedSessions = sessions.map(s => 
        s.id === id ? { ...s, ...updatedSession } : s
      );
      
      setSessionsCallback(updatedSessions);
      toast.success("Session updated successfully");
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Error updating session:", error);
    toast.error("Failed to update session");
    return false;
  }
};

// Function to get a session by ID
export const getSessionById = async (id: string): Promise<Session | null> => {
  try {
    // Use generic query with 'any' type
    const { data, error } = await supabase
      .from('sessions' as any)
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    return mapSessionDBToSession(data as unknown as SessionDB);
  } catch (error: any) {
    console.error("Error fetching session by ID:", error);
    toast.error("Could not fetch session details");
    return null;
  }
};

// Invoke edge function (for analytics tracking etc)
export const invokeSessionFunction = async (
  functionName: string, 
  payload: any
): Promise<any> => {
  try {
    trackFunction(functionName);
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload,
    });

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error(`Error invoking ${functionName}:`, error);
    // Don't show toast errors for analytics functions - fail silently
    return null;
  }
};


import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Session } from '@/types';
import { setupSessionsTable } from '@/utils/addSessions';
import { getSessions } from '@/services';
import { sampleSessions } from '@/data/sampleSessions';
import { supabase } from '@/integrations/supabase/client';

export function useSessionFetcher() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTableReady, setIsTableReady] = useState(false);
  
  // Function to load sessions
  const loadSessions = async () => {
    setIsLoading(true);
    try {
      // Try to fetch sessions from service
      const fetchedSessionsResponse = await getSessions();
      console.log("Loaded sessions:", fetchedSessionsResponse);
      
      if (fetchedSessionsResponse.success && fetchedSessionsResponse.data && fetchedSessionsResponse.data.length > 0) {
        // Convert the response data into Session objects
        const convertedSessions = (fetchedSessionsResponse.data || []).map((session: any) => ({
          id: session.id || '',
          name: session.name || '',
          type: session.type || '',
          date: session.start_date || '',
          startTime: session.start_time || '',
          endTime: session.end_time || '',
          duration: session.duration || 0,
          maxCapacity: session.max_capacity || 0,
          bookedCount: session.booked_count || 0,
          isActive: session.is_active !== false, // default to true if not set
          isSpecialDate: session.is_special_date || false,
          specialDateName: session.special_date_name,
          specialPricing: session.special_pricing,
          specialAddOns: session.special_addons,
          specialConditions: session.special_conditions,
        }));
        
        setSessions(convertedSessions);
      } else {
        // Fallback to sample sessions if the response wasn't successful or empty
        console.log("Using sample sessions as fallback");
        setSessions(sampleSessions);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      toast.error("Failed to load sessions");
      
      // Fallback to sample sessions
      console.log("Using sample sessions after error");
      setSessions(sampleSessions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkSessionsTable = async () => {
      try {
        const exists = await setupSessionsTable();
        setIsTableReady(exists);
        
        // Load sessions regardless of table status
        await loadSessions();
      } catch (error) {
        console.error("Error checking sessions table:", error);
        setIsTableReady(false);
        
        // Fallback to sample sessions when there's an error
        console.log("Using sample sessions after table check error");
        setSessions(sampleSessions);
        setIsLoading(false);
      }
    };
    
    checkSessionsTable();
    
    // Set up real-time listener for session changes
    if (supabase) {
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
            loadSessions();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  return {
    sessions,
    setSessions,
    isLoading,
    isTableReady,
    refreshSessions: loadSessions
  };
}

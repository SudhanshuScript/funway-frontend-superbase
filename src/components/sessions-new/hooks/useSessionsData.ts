
import { useState, useCallback, useEffect } from 'react';
import { Session } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sampleSessions } from '../data/sampleSessionsData';
import { 
  enableRealtimeUpdates, 
  fetchLatestSessions, 
  updateSessionWithRealtime,
  invokeSessionFunction 
} from '@/services/sessionRealtimeService';
import { trackFunction } from '@/utils/supabaseUsageTracker';

export interface UseSessionsDataReturn {
  sessions: Session[];
  isLoading: boolean;
  error: Error | null;
  publishSession: (session: Partial<Session>) => Promise<boolean>;
  deactivateSession: (sessionId: string, reason: string, comments?: string) => Promise<boolean>;
  exportSessions: (format: "pdf" | "csv") => void;
  refreshSessions: () => void;
}

export const useSessionsData = (): UseSessionsDataReturn => {
  const [error, setError] = useState<Error | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  
  // Fetch sessions using React Query
  const { isLoading, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      try {
        console.log('Fetching sessions data...');
        
        // Try to fetch from real Supabase via our realtime service
        const fetchedSessions = await fetchLatestSessions();
        
        if (fetchedSessions && fetchedSessions.length > 0) {
          setSessions(fetchedSessions);
          return fetchedSessions;
        }
        
        // Fallback to sample data
        setSessions(sampleSessions);
        return sampleSessions;
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch sessions'));
        // Use sample data as fallback
        setSessions(sampleSessions);
        return sampleSessions;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Set up realtime updates
  useEffect(() => {
    // Subscribe to realtime updates
    const unsubscribe = enableRealtimeUpdates(updatedSessions => {
      setSessions(updatedSessions);
    });
    
    // Clean up subscription when component unmounts
    return unsubscribe;
  }, []);

  const refreshSessions = useCallback(() => {
    refetch();
    toast.success('Sessions refreshed');
  }, [refetch]);
  
  // Function to publish a new session or update existing one
  const publishSession = useCallback(async (sessionData: Partial<Session>): Promise<boolean> => {
    try {
      // Log and track the function call
      console.log('Publishing session:', sessionData);
      trackFunction('publishSession');
      
      if (sessionData.id) {
        // Update existing session
        const result = await updateSessionWithRealtime(
          sessionData.id,
          {
            name: sessionData.name,
            type: sessionData.type,
            start_date: sessionData.date,
            start_time: sessionData.startTime,
            duration: sessionData.duration,
            max_capacity: sessionData.maxCapacity,
            is_active: sessionData.isActive,
            is_special_date: sessionData.isSpecialDate,
            special_date_name: sessionData.specialDateName,
            special_pricing: sessionData.specialPricing,
            special_addons: sessionData.specialAddOns,
            special_conditions: sessionData.specialConditions,
            notes: sessionData.notes
          },
          sessions,
          setSessions
        );
        
        if (result) {
          // Track analytics event via edge function
          await invokeSessionFunction('session-analytics', {
            event: {
              eventType: 'session.update',
              sessionId: sessionData.id,
              metadata: {
                name: sessionData.name,
                type: sessionData.type
              }
            }
          });
        }
        
        return result;
      } else {
        // For now, fall back to the existing implementation for new sessions
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create a new session object
        const newSession: Session = {
          id: `SES-${Date.now()}`,
          name: sessionData.name || 'New Session',
          type: sessionData.type || 'regular',
          date: sessionData.date || new Date().toISOString().split('T')[0],
          startTime: sessionData.startTime || '09:00',
          endTime: sessionData.endTime || '',
          duration: sessionData.duration || 60,
          maxCapacity: sessionData.maxCapacity || 20,
          bookedCount: 0,
          isActive: true,
          isSpecialDate: sessionData.isSpecialDate || false,
          specialDateName: sessionData.specialDateName,
          specialPricing: sessionData.specialPricing,
          specialAddOns: sessionData.specialAddOns,
          specialConditions: sessionData.specialConditions,
          notes: sessionData.notes,
          createdAt: new Date().toISOString()
        };
        
        // Update state with new session
        setSessions(prev => [...prev, newSession]);
        
        // Track analytics event via edge function
        await invokeSessionFunction('session-analytics', {
          event: {
            eventType: 'session.create',
            sessionId: newSession.id,
            metadata: {
              name: newSession.name,
              type: newSession.type
            }
          }
        });
        
        toast.success('New session published successfully');
        
        return true;
      }
    } catch (error) {
      console.error('Error publishing session:', error);
      toast.error('Failed to publish session');
      return false;
    }
  }, [sessions]);
  
  // Function to deactivate a session
  const deactivateSession = useCallback(async (id: string, reason: string, comments?: string): Promise<boolean> => {
    try {
      // Log and track the function call
      console.log('Deactivating session:', id, 'Reason:', reason);
      trackFunction('deactivateSession');
      
      const result = await updateSessionWithRealtime(
        id,
        {
          is_active: false,
          deactivation_reason: reason,
          deactivated_at: new Date().toISOString(),
          notes: comments
        },
        sessions,
        setSessions
      );
      
      if (result) {
        // Track analytics event via edge function
        await invokeSessionFunction('session-analytics', {
          event: {
            eventType: 'session.deactivate',
            sessionId: id,
            metadata: {
              reason,
              comments
            }
          }
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error deactivating session:', error);
      toast.error('Failed to deactivate session');
      return false;
    }
  }, [sessions]);
  
  // Function to export sessions
  const exportSessions = useCallback((format: "pdf" | "csv") => {
    // Log and track the function call
    console.log(`Exporting sessions in ${format} format`);
    trackFunction('exportSessions');
    
    // Simulated export functionality
    toast.success(`Sessions exported as ${format.toUpperCase()}`);
  }, []);

  return {
    sessions,
    isLoading,
    error,
    publishSession,
    deactivateSession,
    exportSessions,
    refreshSessions,
  };
};

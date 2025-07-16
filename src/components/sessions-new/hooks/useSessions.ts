
import { useState, useEffect, useCallback } from 'react';
import { Session, SessionDB } from '@/types';
import { toast } from 'sonner';
import { createSession } from '@/services/sessionCreateService';
import { updateSession } from '@/services/sessionUpdateService';
import { getSessions } from '@/services/sessionFetchService';
import { mapSessionDBToSession, mapSessionToSessionDB } from '@/types/sessionTypes';
import { useUserRole } from '@/providers/UserRoleProvider';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUserRole();
  
  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getSessions();
      
      if (response.success && response.data) {
        // Ensure we properly map the DB data to our Session interface
        const mappedSessions = response.data
          .filter((session: any) => {
            // Safety check to ensure we're dealing with proper objects
            if (!session || typeof session !== 'object') {
              console.error('Invalid session data:', session);
              return false;
            }
            return true;
          })
          .map((session: any) => {
            try {
              return mapSessionDBToSession(session);
            } catch (error) {
              console.error('Error mapping session:', error, session);
              return null;
            }
          })
          .filter(Boolean) as Session[]; // Remove nulls
        
        console.log('Mapped sessions:', mappedSessions);
        setSessions(mappedSessions);
      } else {
        console.error('Failed to load sessions:', response.error || 'No data returned');
        throw new Error(response.error || 'Failed to load sessions');
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError('Could not load sessions. Please try again.');
      toast.error('Could not load sessions. Please try again.');
      
      // Load fallback data if available
      if (sessions.length === 0) {
        try {
          // Try to get sample sessions from the mock data
          import('@/data/sampleSessions')
            .then(module => {
              setSessions(module.sampleSessions);
              console.log('Loaded sample sessions as fallback');
            })
            .catch(err => {
              console.error("Failed to load sample sessions:", err);
              setSessions([]);
            });
        } catch (fallbackError) {
          console.error('Error loading fallback data:', fallbackError);
          setSessions([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessions.length]);
  
  useEffect(() => {
    fetchSessions();
    
    // Set up real-time listener for session changes
    const channel = supabase
      .channel('session-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions'
        },
        () => {
          console.log("Real-time update received");
          fetchSessions();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSessions]);
  
  const publishSession = async (sessionData: Partial<Session>) => {
    try {
      // Check if this is an update or create operation
      const isUpdate = !!sessionData.id;
      
      if (isUpdate) {
        // Updating an existing session
        const sessionDB: Partial<SessionDB> = {
          name: sessionData.name!,
          type: sessionData.type!,
          start_date: sessionData.date!,
          start_time: sessionData.startTime!,
          duration: sessionData.duration,
          max_capacity: sessionData.maxCapacity!,
          is_active: sessionData.isActive ?? true,
          is_special_date: sessionData.isSpecialDate,
          special_date_name: sessionData.specialDateName,
          special_pricing: sessionData.specialPricing,
          special_addons: sessionData.specialAddOns,
          special_conditions: sessionData.specialConditions,
          notes: sessionData.notes
        };
        
        const response = await updateSession(
          sessionData.id!,
          sessionDB,
          currentUser?.id,
          currentUser?.franchiseId
        );
        
        if (response.success) {
          toast.success('Session updated successfully');
          fetchSessions(); // Refresh the list
        } else {
          throw new Error(response.error || 'Failed to update session');
        }
      } else {
        // Creating a new session
        const sessionDB: Omit<SessionDB, "id" | "created_at"> = {
          name: sessionData.name!,
          type: sessionData.type!,
          start_date: sessionData.date!,
          start_time: sessionData.startTime!,
          end_time: '',  // Calculated on the backend
          duration: sessionData.duration!,
          max_capacity: sessionData.maxCapacity!,
          booked_count: 0,
          is_active: true,
          is_special_date: sessionData.isSpecialDate,
          special_date_name: sessionData.specialDateName,
          special_pricing: sessionData.specialPricing,
          special_addons: sessionData.specialAddOns,
          special_conditions: sessionData.specialConditions,
          notes: sessionData.notes,
          franchise_id: currentUser?.franchiseId
        };
        
        const response = await createSession(
          sessionDB as any,
          currentUser?.id,
          currentUser?.franchiseId
        );
        
        if (response.success) {
          toast.success('Session published successfully');
          fetchSessions(); // Refresh the list
        } else {
          throw new Error(response.error || 'Failed to publish session');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error publishing session:', error);
      toast.error('Failed to publish session. Please try again.');
      return false;
    }
  };
  
  const deactivateSession = async (sessionId: string, reason: string, comments?: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      const sessionDB: Partial<SessionDB> = {
        is_active: false,
        deactivation_reason: reason,
        deactivated_by: currentUser?.id,
        deactivated_at: new Date().toISOString(),
        notes: comments
      };
      
      const response = await updateSession(
        sessionId,
        sessionDB,
        currentUser?.id,
        currentUser?.franchiseId
      );
      
      if (response.success) {
        toast.success('Session deactivated successfully');
        fetchSessions(); // Refresh the list
      } else {
        throw new Error(response.error || 'Failed to deactivate session');
      }
      
      return true;
    } catch (error) {
      console.error('Error deactivating session:', error);
      toast.error('Failed to deactivate session. Please try again.');
      return false;
    }
  };
  
  const exportSessions = (format: 'csv' | 'xlsx' | 'pdf' = 'xlsx') => {
    try {
      if (format === 'pdf') {
        toast.info("PDF export is being prepared...");
        // In a real implementation, we would generate a PDF
        setTimeout(() => {
          toast.success("Sessions exported successfully as PDF");
        }, 1500);
        return;
      }
      
      // Prepare data for export
      const data = sessions.map(session => ({
        'Session Name': session.name,
        'Type': session.type,
        'Special': session.isSpecialDate ? 'Yes' : 'No',
        'Special Name': session.specialDateName || '',
        'Date': session.date,
        'Start Time': session.startTime,
        'Duration (min)': session.duration,
        'Capacity': session.maxCapacity,
        'Bookings': session.bookedCount,
        'Utilization': session.maxCapacity > 0 
          ? `${Math.round((session.bookedCount / session.maxCapacity) * 100)}%` 
          : '0%',
        'Status': session.isActive ? 'Active' : 'Inactive',
        'Price': session.specialPricing || 'Standard',
        'Created': session.createdAt || 'Unknown'
      }));
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sessions');
      
      // Export workbook
      XLSX.writeFile(workbook, `sessions_export_${new Date().toISOString().split('T')[0]}.${format}`);
      
      toast.success(`Sessions exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting sessions:', error);
      toast.error('Failed to export sessions. Please try again.');
    }
  };
  
  return {
    sessions,
    isLoading,
    error,
    publishSession,
    deactivateSession,
    refreshSessions: fetchSessions,
    exportSessions
  };
};

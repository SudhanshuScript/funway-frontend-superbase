
import { useState } from 'react';
import { toast } from 'sonner';
import { Session } from '@/types';

export function useSessionDeactivator(setSessions: React.Dispatch<React.SetStateAction<Session[]>>) {
  const [isDeactivating, setIsDeactivating] = useState(false);
  
  const deactivateSession = async (sessionId: string, reason: string, comment?: string) => {
    try {
      setIsDeactivating(true);
      
      // Find the session to update
      const sessionToUpdate = {} as Session; // This will be replaced with a DB call in a real app
      
      // Update the session in our local state
      const updatedSession = {
        ...sessionToUpdate,
        isActive: false,
        deactivationReason: reason,
        deactivatedAt: new Date().toISOString(),
        deactivatedBy: "current-user", // In a real app, get the current user ID
      };
      
      // In a real app, make the API call to update the session
      // For now, just update our local state
      setSessions(prev => 
        prev.map(s => s.id === sessionId ? {...s, isActive: false, deactivationReason: reason} : s)
      );
      
      toast.success("Session deactivated successfully");
      
      return true;
    } catch (error: any) {
      console.error("Error deactivating session:", error);
      toast.error(`Failed to deactivate session: ${error.message}`);
      throw error;
    } finally {
      setIsDeactivating(false);
    }
  };
  
  return {
    isDeactivating,
    deactivateSession
  };
}

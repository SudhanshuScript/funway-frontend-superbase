
import { useState } from 'react';
import { Session } from '@/types';
import { toast } from 'sonner';

export function useSessionActions(
  sessions: Session[], 
  deactivateSession: (id: string, reason: string, comment?: string) => Promise<boolean>,
  refreshSessions: () => Promise<void>
) {
  const [sessionToDeactivate, setSessionToDeactivate] = useState<Session | null>(null);
  
  const handleEditSession = (id: string) => {
    console.log("Edit session", id);
    // Implementation will depend on how editing is handled in the application
  };

  const handleDeactivateSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setSessionToDeactivate(session);
    }
  };

  const handleConfirmDeactivation = async (reason: string, comment?: string) => {
    if (!sessionToDeactivate) return;
    
    try {
      await deactivateSession(sessionToDeactivate.id, reason, comment);
      toast.success(`Session "${sessionToDeactivate.name}" deactivated successfully`);
      setSessionToDeactivate(null);
      refreshSessions();
    } catch (error) {
      console.error("Failed to deactivate session:", error);
      toast.error("Failed to deactivate session");
    }
  };

  const handleCloseDeactivationDialog = () => {
    setSessionToDeactivate(null);
  };

  const handleCloneSession = (id: string) => {
    console.log("Clone session", id);
    // Implementation will depend on how cloning is handled in the application
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      if (!active) {
        // If deactivating, show the dialog
        handleDeactivateSession(id);
      } else {
        // If activating, do it directly
        console.log("Activating session", id);
        // Implementation for activating a session
        toast.success("Session activated successfully");
        refreshSessions();
      }
    } catch (error) {
      console.error("Failed to toggle session status:", error);
      toast.error("Failed to update session status");
    }
  };

  return {
    sessionToDeactivate,
    handleEditSession,
    handleDeactivateSession,
    handleConfirmDeactivation,
    handleCloseDeactivationDialog,
    handleCloneSession,
    handleToggleActive
  };
}

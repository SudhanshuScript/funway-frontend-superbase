
import { useSessionFetcher } from './hooks/useSessionFetcher';
import { useSessionCreator } from './hooks/useSessionCreator';
import { useSessionDeactivator } from './hooks/useSessionDeactivator';
import { getCalendarSessions } from './utils/sessionConversionUtils';

export function useSessionManager() {
  const { 
    sessions, 
    setSessions, 
    isLoading, 
    isTableReady, 
    refreshSessions 
  } = useSessionFetcher();
  
  const { isCreating, createSession: createSessionHandler } = useSessionCreator(setSessions, refreshSessions);
  
  const { isDeactivating, deactivateSession } = useSessionDeactivator(setSessions);
  
  return {
    sessions,
    isLoading: isLoading || isCreating || isDeactivating,
    isTableReady,
    getCalendarSessions: () => getCalendarSessions(sessions),
    setSessions,
    createSession: createSessionHandler,
    deactivateSession,
    refreshSessions
  };
}

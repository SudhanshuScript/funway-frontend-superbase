
import React, { createContext, useContext, ReactNode } from 'react';
import { Session } from '@/types';
import { useSessionsData, UseSessionsDataReturn } from '../hooks/useSessionsData';

// Create the context with a default value
const SessionsContext = createContext<UseSessionsDataReturn>({
  sessions: [],
  isLoading: false,
  error: null,
  publishSession: async () => false,
  deactivateSession: async () => false,
  exportSessions: () => {},
  refreshSessions: () => {},
});

// Hook to use the sessions context
export const useSessionsContext = () => useContext(SessionsContext);

// Props for the provider
interface SessionsProviderProps {
  children: ReactNode;
}

// Provider component
export const SessionsProvider: React.FC<SessionsProviderProps> = ({ children }) => {
  // Use our custom hook to get all the sessions data and functionality
  const sessionsData = useSessionsData();
  
  return (
    <SessionsContext.Provider value={sessionsData}>
      {children}
    </SessionsContext.Provider>
  );
};

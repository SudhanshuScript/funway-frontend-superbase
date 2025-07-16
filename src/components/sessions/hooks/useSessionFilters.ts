
import { useState, useEffect } from 'react';
import { Session } from '@/types';
import { format, isAfter, parseISO } from 'date-fns';

export function useSessionFilters(
  sessions: Session[],
  activeTab: "active" | "inactive",
  selectedDate: Date,
  searchQuery: string,
  sortBy: string,
  filterType: string
) {
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [inactiveSessions, setInactiveSessions] = useState<Session[]>([]);
  const [dateSpecificSessions, setDateSpecificSessions] = useState<Session[]>([]);

  // Divide sessions into active and inactive
  useEffect(() => {
    const active = sessions.filter(session => {
      const sessionDate = parseISO(session.date);
      return isAfter(sessionDate, new Date()) || session.date === format(new Date(), "yyyy-MM-dd");
    });
    
    const inactive = sessions.filter(session => {
      const sessionDate = parseISO(session.date);
      return !isAfter(sessionDate, new Date()) && session.date !== format(new Date(), "yyyy-MM-dd");
    });
    
    setActiveSessions(active);
    setInactiveSessions(inactive);

    const dateSpecific = sessions.filter(session => 
      session.date === format(selectedDate, "yyyy-MM-dd")
    );
    setDateSpecificSessions(dateSpecific);
  }, [sessions, selectedDate]);

  // Filter based on current sessions list
  useEffect(() => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    let sessionsToFilter = activeTab === "active" ? activeSessions : inactiveSessions;
    
    const filtered = sessionsToFilter.filter(session => {
      const matchesDate = session.date === formattedDate;
      const matchesSearch = searchQuery === "" || 
        session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (session.specialDateName && session.specialDateName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === "all" || session.type === filterType;
      
      return matchesDate && matchesSearch && matchesType;
    });
    
    // Sort the sessions
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "type":
          return a.type.localeCompare(b.type);
        case "time":
          return a.startTime.localeCompare(b.startTime);
        case "date":
        default:
          return a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);
      }
    });
    
    setFilteredSessions(sorted);
  }, [selectedDate, activeSessions, inactiveSessions, activeTab, searchQuery, sortBy, filterType]);

  return {
    filteredSessions,
    activeSessions,
    inactiveSessions,
    dateSpecificSessions
  };
}

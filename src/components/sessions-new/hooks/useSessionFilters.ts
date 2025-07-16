
import { useState, useMemo } from 'react';
import { Session } from '@/types';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface FilterParams {
  sessionType: string;
  search: string;
  searchQuery: string; // Adding this property to fix errors
  dateRange: DateRange;
  staffAssigned?: string[];
  status?: string;
  performance?: string; // 'high', 'medium', 'low'
  duration?: string | { min?: number, max?: number }; // Allowing both string and object format
  sortBy?: string;
  franchise?: string;
  dateFilter?: string;
  showSpecial?: boolean;
  showRecurring?: boolean;
}

export interface UseSessionFiltersReturn {
  filterParams: FilterParams;
  setFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
  filteredSessions: Session[];
  activeTab: 'active' | 'inactive' | 'all';
  setActiveTab: (tab: 'active' | 'inactive' | 'all') => void;
  viewMode: 'table' | 'calendar';
  setViewMode: (view: 'table' | 'calendar') => void;
  sessionTypes: string[];
}

export const useSessionFilters = (sessions: Session[]): UseSessionFiltersReturn => {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive' | 'all'>('active');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [filterParams, setFilterParams] = useState<FilterParams>({
    sessionType: 'all',
    search: '',
    searchQuery: '',
    dateRange: {
      from: undefined,
      to: undefined,
    },
    staffAssigned: [],
    status: 'all',
    performance: 'all',
    duration: 'all',
    sortBy: 'date',
    franchise: 'all',
    dateFilter: 'upcoming',
    showSpecial: true,
    showRecurring: true
  });
  
  // Extract unique session types
  const sessionTypes = useMemo(() => {
    const types = new Set(sessions.map(session => session.type));
    return ['all', ...Array.from(types)];
  }, [sessions]);
  
  // Apply active tab filter
  const activeTabFilteredSessions = useMemo(() => {
    if (activeTab === 'all') return sessions;
    return sessions.filter(session => 
      activeTab === 'active' ? session.isActive : !session.isActive
    );
  }, [sessions, activeTab]);
  
  // Apply remaining filters
  const filteredSessions = useMemo(() => {
    return activeTabFilteredSessions.filter(session => {
      // Session type filter
      if (filterParams.sessionType !== 'all' && session.type !== filterParams.sessionType) {
        return false;
      }
      
      // Search filter
      const searchTerm = filterParams.search || filterParams.searchQuery || '';
      if (searchTerm && !session.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Date range filter
      if (filterParams.dateRange.from && filterParams.dateRange.to) {
        const sessionDate = new Date(session.date);
        const from = new Date(filterParams.dateRange.from);
        const to = new Date(filterParams.dateRange.to);
        
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        
        if (sessionDate < from || sessionDate > to) {
          return false;
        }
      }
      
      // Status filter
      if (filterParams.status && filterParams.status !== 'all') {
        const statusMatch = 
          (filterParams.status === 'active' && session.isActive) ||
          (filterParams.status === 'inactive' && !session.isActive);
        
        if (!statusMatch) return false;
      }
      
      // Performance filter (based on booking percentage)
      if (filterParams.performance && filterParams.performance !== 'all') {
        const bookingPercentage = (session.bookedCount / session.maxCapacity) * 100;
        
        const performanceMatch = 
          (filterParams.performance === 'high' && bookingPercentage >= 70) ||
          (filterParams.performance === 'medium' && bookingPercentage >= 40 && bookingPercentage < 70) ||
          (filterParams.performance === 'low' && bookingPercentage < 40);
        
        if (!performanceMatch) return false;
      }
      
      // Duration filter
      if (filterParams.duration && filterParams.duration !== 'all') {
        if (typeof filterParams.duration === 'string') {
          // Handle string format (like "30", "60", etc.)
          const durationValue = parseInt(filterParams.duration, 10);
          if (!isNaN(durationValue) && session.duration !== durationValue) {
            return false;
          }
        } else {
          // Handle object format with min/max
          if (filterParams.duration.min !== undefined && session.duration < filterParams.duration.min) {
            return false;
          }
          if (filterParams.duration.max !== undefined && session.duration > filterParams.duration.max) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [activeTabFilteredSessions, filterParams]);
  
  return {
    filterParams,
    setFilterParams,
    filteredSessions,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    sessionTypes
  };
};

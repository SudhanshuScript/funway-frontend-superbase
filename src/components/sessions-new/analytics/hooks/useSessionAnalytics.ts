
import { useMemo } from 'react';
import { Session } from '@/types';
import { format, subDays, differenceInDays, parseISO, isWithinInterval } from 'date-fns';

// Analytics filters types
interface AnalyticsFilters {
  timeRange: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  sessionType: 'all' | 'regular' | 'special';
}

// Stats type
export interface SessionStats {
  activeSessions: number;
  totalCapacity: number;
  totalBookings: number;
  utilizationRate: number;
  mostPopular: { type: string; rate: number };
  underperforming: number;
}

// Growth indicators type
export interface GrowthIndicators {
  bookings: number;
  utilization: number;
}

export const useSessionAnalytics = (
  sessions: Session[], 
  filters: AnalyticsFilters,
  franchiseId?: string
) => {
  // Filter sessions based on selected filters
  const filteredSessions = useMemo(() => {
    if (!sessions || !Array.isArray(sessions)) return [];
    
    let filtered = [...sessions];
    
    // Apply type filter
    if (filters.sessionType !== 'all') {
      const isSpecial = filters.sessionType === 'special';
      filtered = filtered.filter(session => Boolean(session.isSpecialDate) === isSpecial);
    }
    
    // Apply time range filter
    const today = new Date();
    let startDate: Date;
    
    switch (filters.timeRange) {
      case 'daily':
        startDate = subDays(today, 1);
        break;
      case 'weekly':
        startDate = subDays(today, 7);
        break;
      case 'monthly':
        startDate = subDays(today, 30);
        break;
      case 'quarterly':
        startDate = subDays(today, 90);
        break;
      default:
        startDate = subDays(today, 7); // Default to weekly
    }
    
    filtered = filtered.filter(session => {
      try {
        const sessionDate = parseISO(session.date);
        return isWithinInterval(sessionDate, { start: startDate, end: today });
      } catch (e) {
        // If date parsing fails, exclude this session
        return false;
      }
    });
    
    // If franchise filter is active, apply it
    if (franchiseId) {
      filtered = filtered.filter(session => session.franchise_id === franchiseId);
    }
    
    return filtered;
  }, [sessions, filters.timeRange, filters.sessionType, franchiseId]);
  
  // Calculate statistics from filtered sessions
  const stats = useMemo(() => {
    if (!filteredSessions.length) {
      return {
        activeSessions: 0,
        totalCapacity: 0,
        totalBookings: 0,
        utilizationRate: 0,
        mostPopular: { type: 'N/A', rate: 0 },
        underperforming: 0
      };
    }
    
    const activeSessions = filteredSessions.filter(s => s.isActive).length;
    
    // Get total capacity
    const totalCapacity = filteredSessions
      .filter(s => s.isActive)
      .reduce((sum, session) => sum + session.maxCapacity, 0);
    
    // Get total bookings
    const totalBookings = filteredSessions
      .filter(s => s.isActive)
      .reduce((sum, session) => sum + (session.bookedCount || 0), 0);
    
    // Calculate utilization rate
    const utilizationRate = totalCapacity > 0 
      ? Math.round((totalBookings / totalCapacity) * 100) 
      : 0;
    
    // Find most popular session types based on booking percentage
    const sessionTypes = new Map<string, { booked: number, capacity: number }>();
    
    filteredSessions.forEach(session => {
      const type = session.type;
      if (!sessionTypes.has(type)) {
        sessionTypes.set(type, { booked: 0, capacity: 0 });
      }
      
      const current = sessionTypes.get(type)!;
      current.booked += session.bookedCount || 0;
      current.capacity += session.maxCapacity;
      sessionTypes.set(type, current);
    });
    
    const popularityData = Array.from(sessionTypes.entries())
      .map(([type, data]) => ({
        type,
        bookingRate: data.capacity > 0 
          ? Math.round((data.booked / data.capacity) * 100) 
          : 0,
        booked: data.booked,
        capacity: data.capacity
      }))
      .sort((a, b) => b.bookingRate - a.bookingRate);
    
    // Find underperforming sessions (< 30% capacity)
    const underperformingSessions = filteredSessions
      .filter(session => {
        const rate = session.maxCapacity > 0 
          ? (session.bookedCount / session.maxCapacity) * 100 
          : 0;
        return rate < 30 && session.isActive;
      })
      .length;
    
    return {
      activeSessions,
      totalCapacity,
      totalBookings,
      utilizationRate,
      mostPopular: popularityData.length > 0 ? { 
        type: popularityData[0].type,
        rate: popularityData[0].bookingRate
      } : { type: 'N/A', rate: 0 },
      underperforming: underperformingSessions
    };
  }, [filteredSessions]);
  
  // Generate growth indicators based on previous period
  const growthIndicators = useMemo(() => {
    // We would compare current period with previous period
    // This is a simplified implementation
    if (!sessions || sessions.length === 0) return { bookings: 0, utilization: 0 };
    
    // Create a previous period based on current timeRange
    const today = new Date();
    let currentPeriodStart: Date;
    let previousPeriodStart: Date;
    
    switch (filters.timeRange) {
      case 'daily':
        currentPeriodStart = subDays(today, 1);
        previousPeriodStart = subDays(today, 2);
        break;
      case 'weekly':
        currentPeriodStart = subDays(today, 7);
        previousPeriodStart = subDays(today, 14);
        break;
      case 'monthly':
        currentPeriodStart = subDays(today, 30);
        previousPeriodStart = subDays(today, 60);
        break;
      case 'quarterly':
        currentPeriodStart = subDays(today, 90);
        previousPeriodStart = subDays(today, 180);
        break;
      default:
        currentPeriodStart = subDays(today, 7);
        previousPeriodStart = subDays(today, 14);
    }
    
    // Calculate current period bookings
    const currentPeriodSessions = sessions.filter(session => {
      try {
        const sessionDate = parseISO(session.date);
        return isWithinInterval(sessionDate, { 
          start: currentPeriodStart, 
          end: today 
        });
      } catch (e) {
        return false;
      }
    });
    
    const currentBookings = currentPeriodSessions.reduce(
      (sum, session) => sum + (session.bookedCount || 0), 
      0
    );
    
    // Calculate previous period bookings
    const previousPeriodSessions = sessions.filter(session => {
      try {
        const sessionDate = parseISO(session.date);
        return isWithinInterval(sessionDate, { 
          start: previousPeriodStart, 
          end: currentPeriodStart 
        });
      } catch (e) {
        return false;
      }
    });
    
    const previousBookings = previousPeriodSessions.reduce(
      (sum, session) => sum + (session.bookedCount || 0), 
      0
    );
    
    // Calculate booking growth
    const bookingGrowth = previousBookings > 0 
      ? Math.round(((currentBookings - previousBookings) / previousBookings) * 100)
      : (currentBookings > 0 ? 100 : 0);
    
    // Calculate utilization growth
    const currentUtilization = calculateUtilization(currentPeriodSessions);
    const previousUtilization = calculateUtilization(previousPeriodSessions);
    
    const utilizationGrowth = previousUtilization > 0
      ? Math.round(((currentUtilization - previousUtilization) / previousUtilization) * 100)
      : (currentUtilization > 0 ? 100 : 0);
    
    return {
      bookings: bookingGrowth,
      utilization: utilizationGrowth
    };
  }, [sessions, filters.timeRange]);
  
  const calculateUtilization = (sessions: Session[]): number => {
    const totalCapacity = sessions.reduce((sum, session) => sum + session.maxCapacity, 0);
    const totalBookings = sessions.reduce((sum, session) => sum + (session.bookedCount || 0), 0);
    
    return totalCapacity > 0 ? (totalBookings / totalCapacity) * 100 : 0;
  };
  
  // Create daily trends chart data
  const dailyTrendsData = useMemo(() => {
    if (!filteredSessions.length) return [];
    
    // Group sessions by date
    const dailyData = new Map<string, { 
      sessions: number, 
      bookings: number,
      date: Date,
      capacity: number 
    }>();
    
    // Get the earliest and latest dates
    let earliestDate = new Date();
    let latestDate = new Date(0);
    
    filteredSessions.forEach(session => {
      try {
        const date = parseISO(session.date);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        if (date < earliestDate) earliestDate = date;
        if (date > latestDate) latestDate = date;
        
        if (!dailyData.has(dateStr)) {
          dailyData.set(dateStr, { sessions: 0, bookings: 0, date, capacity: 0 });
        }
        
        const current = dailyData.get(dateStr)!;
        current.sessions += 1;
        current.bookings += session.bookedCount || 0;
        current.capacity += session.maxCapacity;
        dailyData.set(dateStr, current);
      } catch (e) {
        console.error('Error parsing date:', e);
      }
    });
    
    // Fill in any missing dates in the range
    const daysCount = differenceInDays(latestDate, earliestDate) + 1;
    const result: Array<{
      date: string;
      formattedDate: string;
      sessions: number;
      bookings: number;
      utilization: number;
    }> = [];
    
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(earliestDate);
      date.setDate(earliestDate.getDate() + i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const formattedDate = format(date, 'MMM d');
      
      const data = dailyData.get(dateStr) || { sessions: 0, bookings: 0, date, capacity: 0 };
      const utilization = data.capacity > 0 ? Math.round((data.bookings / data.capacity) * 100) : 0;
      
      result.push({
        date: dateStr,
        formattedDate,
        sessions: data.sessions,
        bookings: data.bookings,
        utilization
      });
    }
    
    return result;
  }, [filteredSessions]);
  
  // Session types data for pie chart
  const sessionTypesData = useMemo(() => {
    if (!filteredSessions.length) return [];
    
    const typeMap = new Map<string, number>();
    
    filteredSessions.forEach(session => {
      const type = session.type;
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });
    
    return Array.from(typeMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredSessions]);
  
  // Occupancy rate comparison data
  const occupancyComparisonData = useMemo(() => {
    if (!filteredSessions.length) return [];
    
    const typeMap = new Map<string, { booked: number, capacity: number }>();
    
    filteredSessions.forEach(session => {
      const type = session.type;
      
      if (!typeMap.has(type)) {
        typeMap.set(type, { booked: 0, capacity: 0 });
      }
      
      const current = typeMap.get(type)!;
      current.booked += session.bookedCount || 0;
      current.capacity += session.maxCapacity;
      typeMap.set(type, current);
    });
    
    return Array.from(typeMap.entries())
      .map(([name, data]) => ({
        name,
        occupancy: data.capacity > 0 ? Math.round((data.booked / data.capacity) * 100) : 0,
        booked: data.booked,
        capacity: data.capacity
      }))
      .sort((a, b) => b.occupancy - a.occupancy);
  }, [filteredSessions]);
  
  // Top performing vs underperforming sessions
  const performanceComparisonData = useMemo(() => {
    if (!filteredSessions.length) return { top: [], under: [] };
    
    const sessionsWithRate = filteredSessions.map(session => ({
      ...session,
      utilizationRate: session.maxCapacity > 0 
        ? Math.round((session.bookedCount / session.maxCapacity) * 100) 
        : 0
    }));
    
    const topPerforming = sessionsWithRate
      .sort((a, b) => b.utilizationRate - a.utilizationRate)
      .slice(0, 5)
      .map(session => ({
        name: session.name,
        type: session.type,
        utilization: session.utilizationRate,
        booked: session.bookedCount,
        capacity: session.maxCapacity
      }));
    
    const underPerforming = sessionsWithRate
      .filter(session => session.utilizationRate < 40 && session.isActive)
      .sort((a, b) => a.utilizationRate - b.utilizationRate)
      .slice(0, 5)
      .map(session => ({
        name: session.name,
        type: session.type,
        utilization: session.utilizationRate,
        booked: session.bookedCount,
        capacity: session.maxCapacity
      }));
    
    return {
      top: topPerforming,
      under: underPerforming
    };
  }, [filteredSessions]);

  return {
    filteredSessions,
    stats,
    growthIndicators,
    dailyTrendsData,
    sessionTypesData,
    occupancyComparisonData,
    performanceComparisonData
  };
};

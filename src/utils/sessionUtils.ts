
import { addDays, addMonths, addWeeks, format, isBefore } from "date-fns";
import { Session } from "@/types";

/**
 * Generates recurring dates for sessions based on the recurrence pattern
 */
export const generateRecurringDates = (
  startDate: Date, 
  recurringType: string, 
  endDate: Date
): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (isBefore(currentDate, endDate)) {
    dates.push(new Date(currentDate));
    
    switch (recurringType) {
      case 'daily':
        currentDate = addDays(currentDate, 1);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, 1);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, 1);
        break;
      default:
        // Stop the loop if the recurring type is not recognized
        return dates;
    }
  }
  
  return dates;
};

/**
 * Determines if a session is active based on date and status
 */
export const isSessionActive = (session: Session): boolean => {
  if (!session.isActive) return false;
  
  const sessionDate = new Date(`${session.date}T${session.startTime}`);
  const now = new Date();
  
  // Session is active if it's today or in the future
  return sessionDate >= now;
};

/**
 * Returns predefined session names based on session type
 */
export const getSessionNamesByType = (type: string): string[] => {
  switch (type) {
    case 'regular':
      return [
        "Breakfast",
        "Brunch",
        "Joyride",
        "Breeze",
        "Lunch",
        "Nimbus",
        "Horizon",
        "Sundowner",
        "Twilight",
        "Eclipse",
        "Feast",
        "Zenith",
        "Dinner",
        "Aurora"
      ];
    case 'special':
      return [
        "New Year's Eve Dinner",
        "Valentine's Day Special",
        "Easter Brunch",
        "Halloween Night Dinner",
        "Christmas Eve Feast",
        "Thanksgiving Dinner",
        "Diwali Celebration Dinner",
        "Holi Festival Lunch",
        "Independence Day Brunch",
        "Mother's Day Lunch",
        "Father's Day Dinner",
        "Add Custom Name"
      ];
    default:
      return [];
  }
};

/**
 * Get valid deactivation reasons
 */
export const getDeactivationReasons = (): string[] => {
  return [
    "Maintenance",
    "Low Attendance",
    "Event Postponed",
    "Temporary Closure",
    "Other"
  ];
};

/**
 * Calculate session statistics from the provided sessions
 */
export const calculateSessionStats = (sessions: Session[]) => {
  if (!sessions.length) {
    return {
      mostPopular: [],
      bestPerforming: [],
      underutilized: []
    };
  }

  // Group sessions by name
  const sessionsByName = sessions.reduce((acc, session) => {
    const key = session.name;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  // Calculate session statistics
  const sessionStats = Object.keys(sessionsByName).map(name => {
    const sessionsGroup = sessionsByName[name];
    const totalBookings = sessionsGroup.reduce((sum, s) => sum + s.bookedCount, 0);
    const totalCapacity = sessionsGroup.reduce((sum, s) => sum + s.maxCapacity, 0);
    const utilization = totalCapacity > 0 ? (totalBookings / totalCapacity) * 100 : 0;
    
    return {
      name,
      type: sessionsGroup[0].type,
      bookings: totalBookings,
      utilization: Math.round(utilization),
      count: sessionsGroup.length
    };
  });

  // Sort by bookings and utilization
  const mostPopular = [...sessionStats].sort((a, b) => b.bookings - a.bookings).slice(0, 5);
  const bestPerforming = [...sessionStats].sort((a, b) => b.utilization - a.utilization).slice(0, 5);
  const underutilized = [...sessionStats]
    .filter(s => s.utilization < 50) // Consider sessions with less than 50% utilization as underutilized
    .sort((a, b) => a.utilization - b.utilization)
    .slice(0, 5);

  return {
    mostPopular,
    bestPerforming,
    underutilized
  };
};

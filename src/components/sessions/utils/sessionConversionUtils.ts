
import { Session } from '@/types';

export const getCalendarSessions = (sessions: Session[]) => {
  return sessions.map(session => ({
    id: session.id,
    name: session.name,
    date: session.date,
    startTime: session.startTime,
    endTime: session.endTime,
    isSpecialDate: session.isSpecialDate,
    specialDateName: session.specialDateName,
  }));
};


import React from 'react';
import { CalendarSessionCard } from './CalendarSessionCard';
import { Session } from '@/types/sessionTypes';
import { EmptyState } from '../EmptyState';

interface CalendarViewProps {
  sessions: Session[];
  onEditSession: (id: string) => void;
  onDeactivateSession: (id: string) => void;
  onCloneSession: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onAddSession: () => void;
}

export function CalendarView({
  sessions,
  onEditSession,
  onDeactivateSession,
  onCloneSession,
  onToggleActive,
  onAddSession
}: CalendarViewProps) {
  if (sessions.length === 0) {
    return <EmptyState activeTab="active" onAddSession={onAddSession} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      {sessions.map((session) => (
        <CalendarSessionCard
          key={session.id}
          session={session}
          onEditSession={onEditSession}
          onDeactivateSession={onDeactivateSession}
          onCloneSession={onCloneSession}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}

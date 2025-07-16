
import React from 'react';
import { Session } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDaysIcon, ListIcon } from 'lucide-react';
import SessionsTable from '../table/SessionsTable';
import SessionsCalendarView from '../calendar/SessionsCalendarView';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionsViewProps {
  sessions: Session[];
  isLoading: boolean;
  viewMode: "table" | "calendar";
  setViewMode: (mode: "table" | "calendar") => void;
  onView: (session: Session) => void;
  onEdit: (session: Session) => void;
  onDeactivate: (session: Session) => void;
  onClone: (session: Session) => void;
  onCreateNew: () => void;
}

const SessionsView: React.FC<SessionsViewProps> = ({
  sessions,
  isLoading,
  viewMode,
  setViewMode,
  onView,
  onEdit,
  onDeactivate,
  onClone,
  onCreateNew
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "calendar")} className="w-auto">
          <TabsList className="inline-flex">
            <TabsTrigger value="table" className="flex items-center gap-1 w-20">
              <ListIcon className="w-4 h-4" />
              <span>List</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1 w-24">
              <CalendarDaysIcon className="w-4 h-4" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Show graceful loading states */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="table" className="mt-0">
            <SessionsTable
              sessions={sessions}
              isLoading={isLoading}
              onView={onView}
              onEdit={onEdit}
              onDeactivate={onDeactivate}
              onClone={onClone}
            />
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            <SessionsCalendarView
              sessions={sessions}
              onView={onView}
              onEdit={onEdit}
              onDeactivate={onDeactivate}
              onClone={onClone}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SessionsView;

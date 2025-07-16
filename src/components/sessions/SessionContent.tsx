
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Session } from "@/types";
import { SessionHeader } from './header/SessionHeader';
import { SessionFiltersBar } from './filters/SessionFiltersBar';
import { SessionList } from "./SessionList";
import { CalendarView } from './calendar/CalendarView';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from './LoadingSpinner';
import { format } from "date-fns";
import { Calendar, ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SessionContentProps {
  isLoading: boolean;
  dateSpecificSessions: Session[];
  filteredSessions: Session[];
  activeTab: "active" | "inactive";
  activeView: "calendar" | "list";
  selectedDate: Date;
  searchQuery: string;
  sortBy: string;
  filterType: string;
  setActiveTab: (tab: "active" | "inactive") => void;
  setActiveView: (view: "calendar" | "list") => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setFilterType: (filterType: string) => void;
  onEditSession: (id: string) => void;
  onDeactivateSession: (id: string) => void;
  onCloneSession: (id: string) => void;
  onAddSession: () => void;
  onViewCalendar: () => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export function SessionContent({
  isLoading,
  dateSpecificSessions,
  filteredSessions,
  activeTab,
  activeView,
  selectedDate,
  searchQuery,
  sortBy,
  filterType,
  setActiveTab,
  setActiveView,
  setSearchQuery,
  setSortBy,
  setFilterType,
  onEditSession,
  onDeactivateSession,
  onCloneSession,
  onAddSession,
  onViewCalendar,
  onToggleActive
}: SessionContentProps) {
  // Set activeTab to "active" by default on component mount
  useEffect(() => {
    setActiveTab("active");
  }, [setActiveTab]);
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    if (filteredSessions.length === 0) {
      return <EmptyState activeTab={activeTab} onAddSession={onAddSession} onViewCalendar={onViewCalendar} />;
    }
    
    return (
      <Tabs value={activeView} onValueChange={setActiveView} className="animate-fade-in">
        <TabsContent value="list" className="mt-0">
          <SessionList 
            sessions={filteredSessions}
            onEditSession={onEditSession}
            onDeleteSession={onDeactivateSession}
            onCloneSession={onCloneSession}
            onAddSession={onAddSession}
            onViewCalendar={onViewCalendar}
            onToggleActive={onToggleActive}
          />
        </TabsContent>
        <TabsContent value="calendar" className="mt-0">
          <CalendarView 
            sessions={filteredSessions}
            onEditSession={onEditSession}
            onDeactivateSession={onDeactivateSession}
            onCloneSession={onCloneSession}
            onToggleActive={onToggleActive}
            onAddSession={onAddSession}
          />
        </TabsContent>
      </Tabs>
    );
  };
  
  const activeSessions = filteredSessions.filter(session => session.isActive).length;
  const inactiveSessions = filteredSessions.filter(session => !session.isActive).length;
  const specialSessions = filteredSessions.filter(session => session.isSpecialDate).length;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="space-y-2">
          <SessionHeader 
            dateSpecificSessions={dateSpecificSessions}
            selectedDate={selectedDate}
            activeTab={activeTab}
            activeView={activeView}
            setActiveTab={setActiveTab}
            setActiveView={setActiveView}
          />

          <CardDescription className="flex flex-wrap gap-2 items-center">
            <span className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {format(selectedDate, "MMMM d, yyyy")}
            </span>
            <span className="flex items-center">
              <ListFilter className="mr-1 h-4 w-4" />
              {filterType !== "all" ? `Filtered by ${filterType}` : "All sessions"}
            </span>
            <div className="ml-auto flex gap-2">
              <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 transition-colors">
                {activeTab === "active" ? "Active" : "Inactive"}: {activeTab === "active" ? activeSessions : inactiveSessions}
              </Badge>
              {specialSessions > 0 && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 transition-colors">
                  Special: {specialSessions}
                </Badge>
              )}
            </div>
          </CardDescription>
        </div>
        
        <SessionFiltersBar
          searchQuery={searchQuery}
          sortBy={sortBy}
          filterType={filterType}
          setSearchQuery={setSearchQuery}
          setSortBy={setSortBy}
          setFilterType={setFilterType}
        />
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}

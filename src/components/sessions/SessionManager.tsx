
import React, { useState, useEffect } from "react";
import SessionCalendar from "./SessionCalendar"; 
import { toast } from "sonner";
import { useSessionManager } from "./useSessionManager";
import { SessionDialog } from "./SessionDialog";
import { DeactivateSessionDialog } from "./DeactivateSessionDialog";
import { SessionStats } from "./SessionStats";
import { SessionManagerHeader } from "./SessionManagerHeader";
import { SessionContent } from "./SessionContent";
import { useSessionFilters } from "./hooks/useSessionFilters";
import { useSessionActions } from "./hooks/useSessionActions";
import { LoadingSpinner } from "./LoadingSpinner";

interface SessionManagerProps {
  showStats?: boolean;
  onToggleStats?: () => void;
  onCreateSession?: () => void;
}

export default function SessionManager({ 
  showStats = true, 
  onToggleStats, 
  onCreateSession 
}: SessionManagerProps) {
  const { 
    sessions, 
    isLoading, 
    createSession: handleCreateSession,
    deactivateSession,
    refreshSessions
  } = useSessionManager();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<"calendar" | "list">("list");
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterType, setFilterType] = useState("all");
  
  // Force refresh sessions when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await refreshSessions();
      } catch (error) {
        console.error("Failed to load initial sessions:", error);
        toast.error("Failed to load sessions. Please try again.");
      }
    };
    
    loadInitialData();
  }, [refreshSessions]);
  
  // Use custom hooks for filtering and actions
  const { 
    filteredSessions, 
    activeSessions, 
    inactiveSessions, 
    dateSpecificSessions 
  } = useSessionFilters(
    sessions, 
    activeTab, 
    selectedDate, 
    searchQuery, 
    sortBy, 
    filterType
  );
  
  const {
    sessionToDeactivate,
    handleEditSession,
    handleDeactivateSession,
    handleConfirmDeactivation,
    handleCloseDeactivationDialog,
    handleCloneSession,
    handleToggleActive
  } = useSessionActions(sessions, deactivateSession, refreshSessions);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const openCreateSessionDialog = () => {
    if (onCreateSession) {
      onCreateSession();
    } else {
      setShowSessionDialog(true);
    }
  };
  
  const handleDialogClose = () => {
    setShowSessionDialog(false);
  };
  
  const handleViewCalendar = () => {
    setActiveView("calendar");
  };

  const handleViewChange = (view: "calendar" | "list") => {
    setActiveView(view);
  };

  const handleSessionSave = async (formData: any) => {
    try {
      await handleCreateSession(formData);
      setShowSessionDialog(false);
      refreshSessions();
      toast.success("Session published successfully");
    } catch (error) {
      console.error("Failed to save session:", error);
      toast.error("Failed to publish session");
    }
  };

  if (isLoading && sessions.length === 0) {
    return <LoadingSpinner message="Loading sessions..." />;
  }

  return (
    <div className="space-y-4">
      <SessionManagerHeader
        selectedDate={selectedDate}
        showStatsView={showStats}
        activeView={activeView}
        onToggleStats={onToggleStats || (() => {})}
        onCreateSession={openCreateSessionDialog}
        onViewChange={handleViewChange}
      />
      
      {showStats && <SessionStats sessions={sessions} />}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 lg:col-span-3">
          <SessionCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            events={sessions.map(session => ({
              date: new Date(session.date),
              sessions: 1,
              isSpecial: session.isSpecialDate
            }))}
          />
        </div>

        <div className="md:col-span-8 lg:col-span-9">
          <SessionContent
            isLoading={isLoading}
            dateSpecificSessions={dateSpecificSessions}
            filteredSessions={filteredSessions}
            activeTab={activeTab}
            activeView={activeView}
            selectedDate={selectedDate}
            searchQuery={searchQuery}
            sortBy={sortBy}
            filterType={filterType}
            setActiveTab={setActiveTab}
            setActiveView={setActiveView}
            setSearchQuery={setSearchQuery}
            setSortBy={setSortBy}
            setFilterType={setFilterType}
            onEditSession={handleEditSession}
            onDeactivateSession={handleDeactivateSession}
            onCloneSession={handleCloneSession}
            onAddSession={openCreateSessionDialog}
            onViewCalendar={handleViewCalendar}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>
      
      {!onCreateSession && (
        <SessionDialog 
          isOpen={showSessionDialog} 
          onClose={handleDialogClose}
          onSave={handleSessionSave}
          initialDate={selectedDate}
        />
      )}
      
      <DeactivateSessionDialog
        isOpen={!!sessionToDeactivate}
        onClose={handleCloseDeactivationDialog}
        onConfirm={handleConfirmDeactivation}
        session={sessionToDeactivate}
      />
    </div>
  );
}

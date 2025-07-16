
import React, { useState, useEffect } from "react";
import SessionsHeader from "./header/SessionsHeader";
import EnhancedSessionFilters from "./filters/EnhancedSessionFilters";
import { useSessionsContext } from "./context/SessionsContext";
import { useSessionFilters } from "./hooks/useSessionFilters";
import { Session } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import SessionsView from "./views/SessionsView";
import SessionModals from "./modals/SessionModals";
import SessionPerformanceInsights from "./insights/SessionPerformanceInsights";

const SessionsOverview = () => {
  const { 
    sessions, 
    isLoading, 
    error,
    publishSession,
    deactivateSession,
    exportSessions,
    refreshSessions
  } = useSessionsContext();
  
  const { 
    franchises,
    selectedFranchiseId, 
    handleFranchiseChange,
    isSuperAdmin
  } = useFranchiseSelector();
  
  // Automatically refresh sessions on mount
  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);
  
  const {
    filterParams,
    setFilterParams,
    filteredSessions,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    sessionTypes
  } = useSessionFilters(sessions);
  
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  
  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };
  
  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setIsPublishModalOpen(true);
  };
  
  const handleDeactivateSession = (session: Session) => {
    setSelectedSession(session);
    setIsDeactivateModalOpen(true);
  };
  
  const handleCloneSession = (session: Session) => {
    setSelectedSession({...session, id: undefined});
    setIsPublishModalOpen(true);
  };

  const handleCreateNewSession = () => {
    setSelectedSession(null);
    setIsPublishModalOpen(true);
  };

  // Filter sessions based on franchise selection for superadmins
  const franchiseFilteredSessions = isSuperAdmin && selectedFranchiseId !== 'all'
    ? filteredSessions.filter(session => session.franchise_id === selectedFranchiseId)
    : filteredSessions;
  
  // Show a warning if analytics couldn't be fetched
  const hasAnalyticsError = error && error.toString().includes("analytics");
  
  return (
    <div className="space-y-6 animate-fade-in">
      <SessionsHeader 
        onPublishSession={handleCreateNewSession} 
        onExport={exportSessions}
        onRefresh={() => {
          refreshSessions();
          return true;
        }}
      />
      
      {hasAnalyticsError && (
        <Alert variant="default" className="border-amber-400 bg-amber-50 text-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Analytics Temporarily Unavailable</AlertTitle>
          <AlertDescription>
            We couldn't fetch session analytics right now. Don't worry — your sessions are still running smoothly!
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <EnhancedSessionFilters 
              filterParams={filterParams} 
              setFilterParams={setFilterParams}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              sessionTypes={sessionTypes}
              franchiseOptions={franchises}
              selectedFranchiseId={selectedFranchiseId}
              onFranchiseChange={handleFranchiseChange}
              isSuperAdmin={isSuperAdmin}
            />
            
            <SessionsView
              sessions={franchiseFilteredSessions}
              isLoading={isLoading}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onView={handleViewSession}
              onEdit={handleEditSession}
              onDeactivate={handleDeactivateSession}
              onClone={handleCloneSession}
              onCreateNew={handleCreateNewSession}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Performance Insights Panel */}
      {franchiseFilteredSessions.length > 0 && !isLoading && (
        <SessionPerformanceInsights 
          sessions={franchiseFilteredSessions}
          selectedFranchiseId={selectedFranchiseId}
        />
      )}
      
      <SessionModals
        selectedSession={selectedSession}
        isDetailModalOpen={isDetailModalOpen}
        isDeactivateModalOpen={isDeactivateModalOpen}
        isPublishModalOpen={isPublishModalOpen}
        setIsDetailModalOpen={setIsDetailModalOpen}
        setIsDeactivateModalOpen={setIsDeactivateModalOpen}
        setIsPublishModalOpen={setIsPublishModalOpen}
        onEdit={handleEditSession}
        onDeactivate={handleDeactivateSession}
        onClone={handleCloneSession}
        publishSession={publishSession}
        deactivateSession={deactivateSession}
      />
    </div>
  );
};

export default SessionsOverview;

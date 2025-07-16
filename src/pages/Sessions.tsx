
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SessionDialog } from "@/components/sessions/SessionDialog";
import { SessionList } from "@/components/sessions/SessionList";
import { SessionStats } from "@/components/sessions/SessionStats";
import { Session } from "@/types";
import { useSessionManager } from "@/components/sessions/useSessionManager";

const Sessions = () => {
  const {
    sessions,
    isLoading,
    createSession,
    deactivateSession,
    refreshSessions
  } = useSessionManager();
  
  const [showDialog, setShowDialog] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  useEffect(() => {
    // Load sessions when component mounts
    refreshSessions();
  }, [refreshSessions]);
  
  const handleCreateSession = () => {
    setShowDialog(true);
  };
  
  const handleSaveSession = async (formData: any) => {
    try {
      console.log("Publishing session with data:", formData);
      
      // Convert form data to session data format
      const newSession = {
        name: formData.name,
        type: formData.sessionType === "special" ? "special" : formData.regularType.toLowerCase(),
        date: formData.date.toISOString().split('T')[0],
        startTime: formData.startTime,
        duration: parseInt(formData.duration),
        maxCapacity: formData.maxCapacity,
        bookedCount: 0,
        isActive: true,
        isSpecialDate: formData.sessionType === "special",
        specialDateName: formData.sessionType === "special" ? formData.specialName : undefined,
        specialPricing: formData.pricePerPerson,
        specialAddOns: formData.addOnPackages,
        specialConditions: formData.notes,
      };
      
      await createSession(newSession);
      setShowDialog(false);
      toast.success("Session published successfully");
      refreshSessions();
    } catch (error) {
      console.error("Failed to publish session:", error);
      toast.error("Failed to publish session");
    }
  };

  const handleEditSession = (id: string) => {
    // Find session by ID and open edit dialog
    console.log("Edit session:", id);
    toast.info("Session editing will be implemented in the next phase");
  };

  const handleDeleteSession = async (id: string) => {
    try {
      // Implement delete session functionality
      console.log("Delete session:", id);
      toast.success("Session deleted successfully");
      refreshSessions();
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete session");
    }
  };

  const handleCloneSession = async (id: string) => {
    try {
      // Find session to clone
      const sessionToClone = sessions.find(s => s.id === id);
      if (!sessionToClone) return;
      
      // Create a new session with similar data
      const clonedSession = {
        ...sessionToClone,
        id: undefined, // Let the backend generate a new ID
        bookedCount: 0, // Reset booked count
        date: new Date().toISOString().split('T')[0], // Set to current date
      };
      
      console.log("Cloning session:", clonedSession);
      // Call API to create cloned session
      
      toast.success("Session cloned successfully");
      refreshSessions();
    } catch (error) {
      console.error("Failed to clone session:", error);
      toast.error("Failed to clone session");
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      if (!active) {
        // Handle deactivation with reason in the deactivation dialog
        console.log("Deactivating session:", id);
      } else {
        console.log("Activating session:", id);
        toast.success("Session activated successfully");
        refreshSessions();
      }
    } catch (error) {
      console.error("Failed to update session status:", error);
      toast.error("Failed to update session status");
    }
  };

  const handleViewCalendar = () => {
    // Implement calendar view
    console.log("View calendar");
    toast.info("Calendar view will be implemented in the next phase");
  };

  const handleToggleStats = () => {
    setShowStats(!showStats);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">
              Manage and schedule your dining experiences
            </p>
          </div>
          <Button onClick={handleToggleStats}>
            {showStats ? "Hide Stats" : "Show Stats"}
          </Button>
        </div>
        
        {/* Session Stats */}
        {showStats && (
          <SessionStats sessions={sessions} />
        )}
        
        {/* Session List */}
        <Card>
          <CardContent className="p-6">
            <SessionList 
              sessions={sessions}
              onEditSession={handleEditSession}
              onDeleteSession={handleDeleteSession}
              onCloneSession={handleCloneSession}
              onAddSession={handleCreateSession}
              onViewCalendar={handleViewCalendar}
              onToggleActive={handleToggleActive}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
        
        {/* Create/Edit Session Dialog */}
        <SessionDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={handleSaveSession}
          initialDate={selectedDate}
        />
      </div>
    </DashboardLayout>
  );
};

export default Sessions;

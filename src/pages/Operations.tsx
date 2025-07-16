
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUserRole } from "@/providers/UserRoleProvider";
import { toast } from "sonner";

// Import our refactored components
import { OperationsHeader } from "@/components/operations/OperationsHeader";
import { QuickStats } from "@/components/operations/QuickStats";
import { ActiveSessionCard } from "@/components/operations/ActiveSessionCard";
import { SessionsTable } from "@/components/operations/SessionsTable";
import { StaffOnDutyCard } from "@/components/operations/StaffOnDutyCard";
import { GuestsTabs } from "@/components/operations/GuestsTabs";

// Import mock data
import { 
  sessions, 
  staffOnDuty, 
  upcomingGuests, 
  checkedInGuests 
} from "@/components/operations/mockData";

const Operations = () => {
  const { currentUser } = useUserRole();
  const [activeSession, setActiveSession] = useState(sessions[0]);
  const [progress, setProgress] = useState(45);
  const [savedProgress, setSavedProgress] = useState<Record<number, number>>({});

  // Initialize saved progress for each session
  useEffect(() => {
    const initialProgress: Record<number, number> = {};
    sessions.forEach(session => {
      initialProgress[session.id] = 45; // Default progress value
    });
    setSavedProgress(initialProgress);
  }, []);

  const handleSelectSession = (sessionId: number) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      // Load the saved progress for this session
      setProgress(savedProgress[sessionId] || 45);
    }
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
    // Save the progress for this session
    setSavedProgress(prev => ({
      ...prev,
      [activeSession.id]: newProgress
    }));
    
    // Notify user if session is complete
    if (newProgress === 100) {
      toast.success(`${activeSession.name} session is now complete!`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <OperationsHeader />
        
        {/* Quick Stats */}
        <QuickStats
          sessions={sessions}
          staffOnDuty={staffOnDuty}
          currentOccupancy={{ current: 20, total: 25, percentage: 80 }}
        />
        
        {/* Active Session Display */}
        <ActiveSessionCard 
          session={activeSession} 
          progress={progress} 
          onProgressUpdate={handleProgressUpdate} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Today's Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionsTable 
                sessions={sessions} 
                activeSessionId={activeSession.id} 
                onSelectSession={handleSelectSession} 
              />
            </CardContent>
          </Card>
          
          {/* Staff On Duty */}
          <Card>
            <CardHeader>
              <CardTitle>Staff On Duty</CardTitle>
            </CardHeader>
            <CardContent>
              <StaffOnDutyCard staff={staffOnDuty} />
            </CardContent>
          </Card>
        </div>
        
        {/* Guest Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Management</CardTitle>
          </CardHeader>
          <CardContent>
            <GuestsTabs 
              upcomingGuests={upcomingGuests} 
              checkedInGuests={checkedInGuests}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Operations;

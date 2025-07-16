
import React, { useState } from "react";
import { SessionCard } from "./SessionCard";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@/types";
import { SessionActions } from "./SessionActions";
import { SessionFilters } from "./SessionFilters";
import { DeleteSessionDialog } from "./DeleteSessionDialog";
import { DeactivateSessionDialog } from "./DeactivateSessionDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, List, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format, isAfter, parseISO } from "date-fns";

interface SessionListProps {
  sessions: Session[];
  onEditSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onCloneSession: (id: string) => void;
  onAddSession: () => void;
  onViewCalendar: () => void;
  onToggleActive: (id: string, active: boolean) => void;
  isLoading?: boolean;
}

export function SessionList({
  sessions,
  onEditSession,
  onDeleteSession,
  onCloneSession,
  onAddSession,
  onViewCalendar,
  onToggleActive,
  isLoading = false
}: SessionListProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [specialFilter, setSpecialFilter] = useState<string>("all");
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [deactivateSessionId, setDeactivateSessionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  
  const sessionToDelete = sessions.find(session => session.id === deleteSessionId);
  const sessionToDeactivate = sessions.find(session => session.id === deactivateSessionId);
  const specialSessionsCount = sessions.filter(s => s.isSpecialDate).length;
  
  // Get active and inactive sessions
  const activeSessions = sessions.filter(session => session.isActive);
  const inactiveSessions = sessions.filter(session => !session.isActive);

  // For specific status filter
  const getFilteredSessions = () => {
    return sessions
      .filter(session => {
        const searchFields = [
          session.name,
          session.type,
          session.specialDateName || ""
        ].map(field => field.toLowerCase());
        
        const includesSearch = searchFields.some(field => 
          field.includes(searchQuery.toLowerCase())
        );
        
        const matchesType = typeFilter === "all" || session.type === typeFilter;
        
        const matchesStatus = 
          statusFilter === "all" || 
          (statusFilter === "active" && session.isActive) ||
          (statusFilter === "inactive" && !session.isActive);
          
        const matchesSpecial = 
          specialFilter === "all" || 
          (specialFilter === "special" && session.isSpecialDate) ||
          (specialFilter === "regular" && !session.isSpecialDate);
        
        return includesSearch && matchesType && matchesStatus && matchesSpecial;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Get sessions to display based on current tab
  const filteredSessions = getFilteredSessions();
    
  const handleDeleteRequest = (id: string) => {
    setDeleteSessionId(id);
  };
  
  const handleConfirmDelete = () => {
    if (deleteSessionId) {
      onDeleteSession(deleteSessionId);
      toast({
        description: "Session successfully deleted.",
      });
      setDeleteSessionId(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteSessionId(null);
  };

  const handleDeactivateRequest = (id: string) => {
    setDeactivateSessionId(id);
  };
  
  const handleConfirmDeactivate = async (reason: string, comment?: string) => {
    if (deactivateSessionId) {
      onToggleActive(deactivateSessionId, false);
      toast({
        description: "Session successfully deactivated.",
      });
      setDeactivateSessionId(null);
    }
  };

  const handleCloseDeactivateDialog = () => {
    setDeactivateSessionId(null);
  };

  return (
    <div className="space-y-6">
      <SessionActions 
        sessionCount={filteredSessions.length}
        specialSessionCount={specialSessionsCount}
        onAddSession={onAddSession}
        onViewCalendar={onViewCalendar}
      />
      
      <div className="flex items-center justify-between">
        <SessionFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          specialFilter={specialFilter}
          setSpecialFilter={setSpecialFilter}
        />
        
        <div className="flex items-center p-1 border rounded-md bg-muted/20">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="gap-1"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            List
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            className="gap-1"
            onClick={() => setViewMode("calendar")}
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0 pt-6">
          <Tabs defaultValue="active" value={statusFilter} onValueChange={setStatusFilter}>
            <div className="px-6">
              <TabsList className="mb-4 w-full lg:w-auto">
                <TabsTrigger value="active">Active ({activeSessions.length})</TabsTrigger>
                <TabsTrigger value="inactive">Inactive ({inactiveSessions.length})</TabsTrigger>
                <TabsTrigger value="all">All ({sessions.length})</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="pt-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading sessions...</p>
                </div>
              ) : (
                <>
                  {filteredSessions.length > 0 ? (
                    <div className="space-y-0.5">
                      {filteredSessions.map((session) => (
                        <SessionCard
                          key={session.id}
                          {...session}
                          onEdit={() => onEditSession(session.id)}
                          onDelete={() => handleDeleteRequest(session.id)}
                          onDeactivate={() => handleDeactivateRequest(session.id)}
                          onClone={() => onCloneSession(session.id)}
                          onToggleActive={() => onToggleActive(session.id, !session.isActive)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-t">
                      <h3 className="text-lg font-medium">No sessions found</h3>
                      <p className="text-muted-foreground mt-1">
                        No sessions match your current filters
                      </p>
                      <Button onClick={onAddSession} className="mt-4">
                        Publish New Session
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      <DeleteSessionDialog
        isOpen={!!deleteSessionId}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        session={sessionToDelete}
      />
      
      <DeactivateSessionDialog
        isOpen={!!deactivateSessionId}
        onClose={handleCloseDeactivateDialog}
        onConfirm={handleConfirmDeactivate}
        session={sessionToDeactivate}
      />
    </div>
  );
}

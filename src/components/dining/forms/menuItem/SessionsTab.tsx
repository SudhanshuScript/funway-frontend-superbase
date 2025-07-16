
import React, { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarClock, Info, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface SessionsTabProps {
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  availableSessions: any[];
}

export function SessionsTab({
  selectedSessions,
  setSelectedSessions,
  availableSessions
}: SessionsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Group sessions by type for better organization
  const sessionsByType = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    availableSessions.forEach(session => {
      if (!session.type) return; // Skip sessions without type
      
      if (!grouped[session.type]) {
        grouped[session.type] = [];
      }
      grouped[session.type].push(session);
    });
    return grouped;
  }, [availableSessions]);

  // Filter sessions based on search
  const filteredSessionsByType = useMemo(() => {
    if (!searchQuery.trim()) return sessionsByType;
    
    const filtered: Record<string, any[]> = {};
    
    Object.entries(sessionsByType).forEach(([type, sessions]) => {
      const matchingSessions = sessions.filter(session => 
        session.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchingSessions.length > 0) {
        filtered[type] = matchingSessions;
      }
    });
    
    return filtered;
  }, [sessionsByType, searchQuery]);

  // Toggle session selection
  const toggleSession = (sessionId: string) => {
    setSelectedSessions(
      selectedSessions.includes(sessionId)
        ? selectedSessions.filter(id => id !== sessionId)
        : [...selectedSessions, sessionId]
    );
  };
  
  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Clear a selected session
  const removeSession = (sessionId: string) => {
    setSelectedSessions(selectedSessions.filter(id => id !== sessionId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <CalendarClock className="h-5 w-5 text-[#7B61FF]" />
        <h3 className="text-lg font-medium">Session Assignment</h3>
      </div>
      
      <Card className="border border-[#2E2E2E]">
        <div className="p-4 space-y-4">
          <Label className="block text-base">Assign To Sessions *</Label>
          
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search sessions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <ScrollArea className="h-[260px] pr-4">
            <div className="space-y-6">
              {Object.entries(filteredSessionsByType).length > 0 ? (
                Object.entries(filteredSessionsByType).map(([type, sessions]) => (
                  <div key={type} className="space-y-2">
                    <h4 className="text-sm font-medium text-[#7B61FF]">{type} Sessions</h4>
                    <div className="space-y-2">
                      {sessions.map(session => {
                        const isSelected = selectedSessions.includes(session.id);
                        return (
                          <div 
                            key={session.id}
                            className={cn(
                              "p-3 rounded-md flex items-center justify-between",
                              isSelected 
                                ? "bg-[#7B61FF]/10 border border-[#7B61FF]/30" 
                                : "hover:bg-[#7B61FF]/5 border border-[#2E2E2E]"
                            )}
                            data-testid={`session-option-${session.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`session-${session.id}`}
                                checked={isSelected}
                                onCheckedChange={() => toggleSession(session.id)}
                                className="h-5 w-5 text-[#7B61FF]"
                              />
                              <label 
                                htmlFor={`session-${session.id}`}
                                className="cursor-pointer flex-1"
                              >
                                {session.name}
                              </label>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <CalendarClock className="h-8 w-8 mb-2 opacity-50" />
                  {searchQuery ? (
                    <p>No sessions match your search</p>
                  ) : (
                    <p>No sessions available</p>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>
      
      {/* Selected sessions display */}
      {selectedSessions.length > 0 ? (
        <div className="mt-3 p-4 border border-[#7B61FF]/20 rounded-lg bg-[#7B61FF]/5">
          <h4 className="text-sm font-medium mb-2">Selected Sessions:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSessions.map(sessionId => {
              const session = availableSessions.find(s => s.id === sessionId);
              return session ? (
                <Badge 
                  key={sessionId} 
                  className="bg-[#7B61FF] hover:bg-[#6B51EF] flex items-center gap-1 pl-3 pr-2 py-1.5"
                >
                  {session.name}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSession(sessionId);
                    }}
                    className="ml-1 rounded-full hover:bg-[#6B51EF] p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      ) : (
        <Alert variant="destructive" className="mt-3">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please assign this menu item to at least one session before saving.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground mt-3 p-4 border rounded-lg bg-[#1D1D28]/20">
        <p>
          <span className="font-medium">Note:</span> Items must be assigned to at least one session.
          You can later control availability for each session individually.
        </p>
      </div>
    </div>
  );
}

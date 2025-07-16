
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, Coffee, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SessionOption {
  id: string;
  name: string;
  type: string;
}

interface MultiSelectSessionsCardProps {
  availableSessions: SessionOption[];
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
}

export function MultiSelectSessionsCard({
  availableSessions,
  selectedSessions,
  setSelectedSessions
}: MultiSelectSessionsCardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Group sessions by type
  const sessionsByType: Record<string, SessionOption[]> = {};
  availableSessions.forEach(session => {
    if (!sessionsByType[session.type]) {
      sessionsByType[session.type] = [];
    }
    sessionsByType[session.type].push(session);
  });

  // Toggle session selection
  const toggleSession = (sessionId: string) => {
    setSelectedSessions(
      selectedSessions.includes(sessionId)
        ? selectedSessions.filter(id => id !== sessionId)
        : [...selectedSessions, sessionId]
    );
  };

  // Filter sessions based on search query
  const filteredSessionTypes = Object.entries(sessionsByType).map(([type, sessions]) => {
    return {
      type,
      sessions: sessions.filter(session => 
        session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  }).filter(group => group.sessions.length > 0);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Card className="border border-[#2E2E2E]">
        <ScrollArea className="h-[240px] px-1">
          <div className="p-4 space-y-4">
            {filteredSessionTypes.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <Coffee className="h-8 w-8 mb-2 opacity-50" />
                <p>No sessions found</p>
              </div>
            )}
            
            {filteredSessionTypes.map(({ type, sessions }) => (
              <div key={type} className="space-y-2">
                <h3 className="font-medium text-sm text-[#7B61FF]">{type} Sessions</h3>
                <div className="space-y-1">
                  {sessions.map(session => {
                    const isSelected = selectedSessions.includes(session.id);
                    return (
                      <div 
                        key={session.id}
                        className={cn(
                          "p-2 rounded-md flex items-center justify-between cursor-pointer transition-colors",
                          isSelected 
                            ? "bg-[#7B61FF]/10 text-[#7B61FF]" 
                            : "hover:bg-[#7B61FF]/5"
                        )}
                        onClick={() => toggleSession(session.id)}
                      >
                        <div className="flex items-center">
                          <div 
                            className={cn(
                              "w-5 h-5 rounded-full border flex items-center justify-center mr-2",
                              isSelected 
                                ? "border-[#7B61FF] bg-[#7B61FF] text-white" 
                                : "border-muted-foreground"
                            )}
                          >
                            {isSelected && <CheckCircle className="h-3 w-3" />}
                          </div>
                          <span>{session.name}</span>
                        </div>
                        <span className="text-xs opacity-70">{type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

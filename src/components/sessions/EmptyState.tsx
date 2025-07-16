
import React from 'react';
import { CalendarX2, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  activeTab?: string;
  onAddSession?: () => void;
  onViewCalendar?: () => void;
}

export function EmptyState({ activeTab = "active", onAddSession, onViewCalendar }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-md">
      <CalendarX2 className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No sessions found</h3>
      <p className="text-muted-foreground mb-6">
        {activeTab === "active" 
          ? "There are no active sessions. Create a new session to get started."
          : "There are no sessions matching your filters."}
      </p>
      
      <div className="flex gap-3">
        {onAddSession && (
          <Button onClick={onAddSession}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Session
          </Button>
        )}
        
        {onViewCalendar && (
          <Button variant="outline" onClick={onViewCalendar}>
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        )}
      </div>
    </div>
  );
}

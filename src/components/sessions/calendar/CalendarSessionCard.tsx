
import React from 'react';
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, CalendarIcon } from "lucide-react";
import { Session } from "@/types/sessionTypes";

interface CalendarSessionCardProps {
  session: Session;
  onEditSession: (id: string) => void;
  onDeactivateSession: (id: string) => void;
  onCloneSession: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export function CalendarSessionCard({
  session,
  onEditSession,
  onDeactivateSession,
  onCloneSession,
  onToggleActive
}: CalendarSessionCardProps) {
  return (
    <Card className={`overflow-hidden ${!session.isActive ? 'opacity-70' : ''}`}>
      <div className="flex flex-col md:flex-row">
        <div className={`${session.isSpecialDate ? 'bg-amber-500/10' : 'bg-primary/10'} p-4 md:w-48 flex flex-col justify-center items-center`}>
          <div className="text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-lg font-medium">{session.startTime} - {session.endTime}</p>
            <p className="text-sm text-muted-foreground">{session.duration} min</p>
          </div>
        </div>
        
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{session.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{session.type}</p>
            </div>
            
            <div className="flex gap-1">
              {session.isSpecialDate && (
                <Badge className="bg-amber-500">
                  <Star className="h-3 w-3 mr-1" fill="currentColor" />
                  Special
                </Badge>
              )}
              {!session.isActive && <Badge variant="outline">Inactive</Badge>}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{session.bookedCount}/{session.maxCapacity}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{format(new Date(session.date), "MMM d")}</span>
            </div>
            
            {session.specialPricing && (
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">${session.specialPricing}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onEditSession(session.id)}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onCloneSession(session.id)}>
              Clone
            </Button>
            <Button 
              variant={session.isActive ? "destructive" : "default"} 
              size="sm"
              onClick={() => session.isActive ? 
                onDeactivateSession(session.id) : 
                onToggleActive(session.id, true)}
            >
              {session.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}


import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Utensils, Sunrise, Sunset, Coffee, MoonStar } from "lucide-react";
import { SessionType } from "./sessionTypes";

interface FeaturedSessionData {
  date: Date;
  session: string;
  time: string;
  remainingSeats: number;
}

interface FeaturedSessionTabProps {
  featuredSessions: FeaturedSessionData[];
  sessionData: Record<string, SessionType>;
  onSelectFeaturedSession: (session: FeaturedSessionData) => void;
}

export function FeaturedSessionTab({ featuredSessions, sessionData, onSelectFeaturedSession }: FeaturedSessionTabProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Quick-select from our popular sessions</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10 relative z-20">
        {featuredSessions.map((featuredSession, index) => {
          const SessionIcon = sessionData[featuredSession.session as keyof typeof sessionData]?.icon || Utensils;
          
          return (
            <Card 
              key={index}
              className="hover:border-primary hover:bg-muted/50 cursor-pointer transition-colors session-card"
              onClick={() => onSelectFeaturedSession(featuredSession)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-md mr-3">
                      <SessionIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-base">
                        {sessionData[featuredSession.session as keyof typeof sessionData]?.name || "Session"}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(featuredSession.date, "EEE, MMM d")}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {featuredSession.time}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {featuredSession.remainingSeats} seats left
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

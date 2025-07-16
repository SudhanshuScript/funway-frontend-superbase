
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, ClipboardList } from "lucide-react";

interface QuickStatsProps {
  sessions: Array<{
    id: number;
    status: string;
  }>;
  totalGuests?: number;
  vipGuests?: number;
  currentOccupancy?: {
    current: number;
    total: number;
    percentage: number;
  };
  staffOnDuty: Array<{
    id: number;
  }>;
}

export function QuickStats({
  sessions,
  totalGuests = 75,
  vipGuests = 12,
  currentOccupancy = { current: 20, total: 25, percentage: 80 },
  staffOnDuty
}: QuickStatsProps) {
  const activeSessionsCount = sessions.filter(s => s.status === "Active").length;
  const upcomingSessionsCount = sessions.filter(s => s.status === "Upcoming").length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            <div className="text-2xl font-bold">{sessions.length}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {activeSessionsCount} Active, {upcomingSessionsCount} Upcoming
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Expected Guests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            <div className="text-2xl font-bold">{totalGuests}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{vipGuests} VIP guests</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentOccupancy.current}/{currentOccupancy.total}</div>
          <Progress className="mt-2" value={currentOccupancy.percentage} />
          <p className="text-xs text-muted-foreground mt-1">{currentOccupancy.percentage}% occupancy</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Staff On Duty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-primary" />
            <div className="text-2xl font-bold">{staffOnDuty.length}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">All positions filled</p>
        </CardContent>
      </Card>
    </div>
  );
}


import React from 'react';
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Session } from "@/types";

interface SessionHeaderProps {
  dateSpecificSessions: Session[];
  selectedDate: Date;
  activeTab: "active" | "inactive";
  activeView: "calendar" | "list";
  setActiveTab: (tab: "active" | "inactive") => void;
  setActiveView: (view: "calendar" | "list") => void;
}

export function SessionHeader({
  dateSpecificSessions,
  selectedDate,
  activeTab,
  activeView,
  setActiveTab,
  setActiveView
}: SessionHeaderProps) {
  // Count special sessions for the selected date
  const specialSessions = dateSpecificSessions.filter(s => s.isSpecialDate).length;
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <CardTitle>Sessions for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
        <div className="flex items-center mt-1">
          <Badge variant="outline" className="mr-2">
            {dateSpecificSessions.length} sessions
          </Badge>
          {specialSessions > 0 && (
            <Badge className="bg-amber-500">
              <Star className="h-3 w-3 mr-1" fill="currentColor" />
              {specialSessions} special event{specialSessions > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-2 md:space-y-0 md:flex md:items-center md:space-x-2">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "inactive")} className="mr-4">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "calendar" | "list")}>
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}


import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart, Calendar, List, Clock, Filter, LayoutGrid } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SessionManagerHeaderProps {
  selectedDate: Date;
  showStatsView: boolean;
  activeView: "calendar" | "list";
  onToggleStats: () => void;
  onCreateSession: () => void;
  onViewChange: (view: "calendar" | "list") => void;
}

export function SessionManagerHeader({
  selectedDate,
  showStatsView,
  activeView,
  onToggleStats,
  onCreateSession,
  onViewChange
}: SessionManagerHeaderProps) {
  // Get today's date to check if selected date is today
  const today = new Date();
  const isToday = today.toDateString() === selectedDate.toDateString();
  
  // Check if date is in the past
  const isPastDate = selectedDate < today && !isToday;
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
      <div>
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Sessions</h2>
          {isPastDate && (
            <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-700">Past Date</Badge>
          )}
          {isToday && (
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-700">Today</Badge>
          )}
        </div>
        <p className="text-muted-foreground flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex border rounded-md overflow-hidden shadow-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeView === "calendar" ? "default" : "ghost"}
                  className="rounded-none"
                  onClick={() => onViewChange("calendar")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Calendar View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeView === "list" ? "default" : "ghost"}
                  className="rounded-none"
                  onClick={() => onViewChange("list")}
                >
                  <List className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>List View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={onToggleStats} className="shadow-sm">
                <BarChart className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{showStatsView ? 'Hide Stats' : 'Show Stats'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{showStatsView ? 'Hide session statistics' : 'Show session statistics'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onCreateSession} className="bg-green-600 hover:bg-green-700 text-white shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 w-3 bg-white opacity-10 transform -skew-x-[20deg] group-hover:animate-shine"></div>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Publish Session</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Publish a new session</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

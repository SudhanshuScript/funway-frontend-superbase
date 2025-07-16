
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Grid } from "lucide-react";

interface MainTabHeaderProps {
  activeTab: string;
}

export function MainTabHeader({ activeTab }: MainTabHeaderProps) {
  return (
    <TabsList className="grid grid-cols-3 w-full max-w-2xl">
      <TabsTrigger value="menu" className="flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        Menu Management
      </TabsTrigger>
      <TabsTrigger value="sessions" className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Dining Sessions
      </TabsTrigger>
      <TabsTrigger value="preferences" className="flex items-center gap-2">
        <Grid className="w-4 h-4" />
        Guest Preferences
      </TabsTrigger>
    </TabsList>
  );
}

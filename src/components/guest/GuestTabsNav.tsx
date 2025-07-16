
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Star, Clock3, AlertCircle, Zap, User } from "lucide-react";

interface GuestTabsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  guestCounts: {
    all: number;
    vip: number;
    new: number;
    regular: number;
    inactive: number;
    high_potential: number;
  };
}

const GuestTabsNav: React.FC<GuestTabsNavProps> = ({ 
  activeTab, 
  setActiveTab,
  guestCounts
}) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full">
        <TabsTrigger value="all" className="text-sm">
          <Users className="h-4 w-4 mr-1 sm:mr-2" /> 
          <span className="hidden sm:inline">All Guests</span>
          <span className="sm:hidden">All</span>
          <span className="ml-1 text-xs text-muted-foreground">({guestCounts.all})</span>
        </TabsTrigger>
        <TabsTrigger value="vip" className="text-sm">
          <Star className="h-4 w-4 mr-1 sm:mr-2" /> 
          VIP
          <span className="ml-1 text-xs text-muted-foreground">({guestCounts.vip})</span>
        </TabsTrigger>
        <TabsTrigger value="new" className="text-sm">
          <User className="h-4 w-4 mr-1 sm:mr-2" /> 
          New
          <span className="ml-1 text-xs text-muted-foreground">({guestCounts.new})</span>
        </TabsTrigger>
        <TabsTrigger value="regular" className="text-sm">
          <Clock3 className="h-4 w-4 mr-1 sm:mr-2" /> 
          Regular
          <span className="ml-1 text-xs text-muted-foreground">({guestCounts.regular})</span>
        </TabsTrigger>
        <TabsTrigger value="inactive" className="text-sm">
          <AlertCircle className="h-4 w-4 mr-1 sm:mr-2" /> 
          Inactive
          <span className="ml-1 text-xs text-muted-foreground">({guestCounts.inactive})</span>
        </TabsTrigger>
        <TabsTrigger value="high_potential" className="text-sm">
          <Zap className="h-4 w-4 mr-1 sm:mr-2" /> 
          <span className="hidden sm:inline">High Potential</span>
          <span className="sm:hidden">H.P.</span>
          <span className="ml-1 text-xs text-muted-foreground">({guestCounts.high_potential})</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default GuestTabsNav;

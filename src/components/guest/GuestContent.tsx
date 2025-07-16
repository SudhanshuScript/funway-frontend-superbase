
import React, { useEffect } from "react";
import GuestStatsCards from "@/components/guest/GuestStatsCards";
import GuestTabsNav from "@/components/guest/GuestTabsNav";
import GuestFiltersPanel from "@/components/guest/GuestFiltersPanel";
import GuestTable from "@/components/guest/GuestTable";
import { Guest, GuestStats, GuestType } from "@/types/guestTypes";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface GuestContentProps {
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
  stats: GuestStats;
  filteredGuests: Guest[];
  filters: any;
  updateFilters: (filters: any) => void;
  resetFilters: () => void;
  availablePreferences: string[];
  onAddGuest: () => void;
  onViewProfile: (guest: Guest) => void;
  onSendOffer: (guestId: string) => void;
}

const GuestContent: React.FC<GuestContentProps> = ({
  activeTab,
  setActiveTab,
  guestCounts,
  stats,
  filteredGuests,
  filters,
  updateFilters,
  resetFilters,
  availablePreferences,
  onAddGuest,
  onViewProfile,
  onSendOffer,
}) => {
  // Update filter when tab changes, mapping tab values to GuestType filter values
  useEffect(() => {
    const guestTypeMap: Record<string, string> = {
      all: "all",
      vip: "VIP",
      new: "New",
      regular: "Regular",
      inactive: "Inactive",
      high_potential: "High Potential"
    };
    
    const selectedGuestType = guestTypeMap[activeTab] || "all";
    updateFilters({ guestType: selectedGuestType });
  }, [activeTab, updateFilters]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <GuestStatsCards stats={stats} />
      
      {/* Guest Directory */}
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tabs Navigation */}
          <GuestTabsNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            guestCounts={guestCounts}
          />
          
          {/* Tab Content */}
          <TabsContent value={activeTab}>
            {/* Filters Panel */}
            <GuestFiltersPanel 
              filters={filters}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
              availablePreferences={availablePreferences}
            />
            
            {/* Guest Table */}
            <GuestTable 
              filteredGuests={filteredGuests}
              onAddGuest={onAddGuest}
              onViewProfile={onViewProfile}
              onSendOffer={onSendOffer}
              activeTab={activeTab}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuestContent;

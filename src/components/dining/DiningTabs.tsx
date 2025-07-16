
import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MenuItem } from "@/types/menuTypes";
import { MenuSummaryCards } from "./MenuSummary";
import { MenuItemModal } from "./MenuItemModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MainTabHeader } from "./tabs/MainTabHeader";
import { MenuTabs } from "./tabs/MenuTabs";
import { DiningSessionsTab } from "./DiningSessionsTab";
import { PreferencesTab } from "./PreferencesTab";
import { renderSessionBadges } from "./utils/sessionBadgeUtils";

interface DiningTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  menuItems: MenuItem[];
  selectedMenuItem: MenuItem | null;
  setSelectedMenuItem: (item: MenuItem | null) => void;
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  onSaveMenuItem: (menuItem: MenuItem) => void;
  onDeleteMenuItem?: (menuItemId: string) => void;
  getAvailableSessions: () => any[];
  renderSessionBadges: (sessions?: string[]) => any;
  isLoading: boolean;
  diningSchedule: any[];
  guestPreferences: any[];
  onAssignItemToSession: (itemId: string, sessionId: number) => void;
}

export function DiningTabs({
  activeTab,
  setActiveTab,
  menuItems,
  selectedMenuItem,
  setSelectedMenuItem,
  selectedSessions,
  setSelectedSessions,
  onSaveMenuItem,
  onDeleteMenuItem,
  getAvailableSessions,
  renderSessionBadges: getBadgeData,
  isLoading,
  diningSchedule,
  guestPreferences,
  onAssignItemToSession
}: DiningTabsProps) {
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);

  const openMenuItemModal = (menuItem: MenuItem | null = null) => {
    setSelectedMenuItem(menuItem);
    // Reset selectedSessions when opening modal for a new item
    if (!menuItem) {
      setSelectedSessions([]);
    }
    setIsMenuItemModalOpen(true);
  };

  const closeMenuItemModal = () => {
    setIsMenuItemModalOpen(false);
    setSelectedMenuItem(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <MainTabHeader activeTab={activeTab} />
          
          {activeTab === "menu" && (
            <Button onClick={() => openMenuItemModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          )}
        </div>
        
        {/* Menu Management Tab */}
        <TabsContent value="menu" className="space-y-6">
          {/* Menu Summary */}
          <MenuSummaryCards menuItems={menuItems} />
          
          {/* Secondary Menu Navigation */}
          <MenuTabs
            menuItems={menuItems}
            onSelectMenuItem={openMenuItemModal}
            renderSessionBadges={renderSessionBadges}
            isLoading={isLoading}
            diningSchedule={diningSchedule}
            onAssignItemToSession={onAssignItemToSession}
          />
          
          {/* Menu Item Modal */}
          <MenuItemModal
            isOpen={isMenuItemModalOpen}
            onClose={closeMenuItemModal}
            menuItem={selectedMenuItem || undefined}
            onSave={onSaveMenuItem}
            onDelete={onDeleteMenuItem}
            selectedSessions={selectedSessions}
            setSelectedSessions={setSelectedSessions}
            availableSessions={getAvailableSessions()}
          />
        </TabsContent>
        
        {/* Dining Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <DiningSessionsTab 
            sessions={diningSchedule} 
            menuItems={menuItems}
            selectedMenuItem={selectedMenuItem}
            setSelectedMenuItem={setSelectedMenuItem}
            onOpenMenuItemModal={openMenuItemModal}
          />
        </TabsContent>
        
        {/* Guest Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <PreferencesTab guestPreferences={guestPreferences} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

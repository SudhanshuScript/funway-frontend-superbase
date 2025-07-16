
import React, { useState } from "react";
import { MenuItem } from "@/types/menuTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MenuItemModal } from "../MenuItemModal";
import { DashboardMetrics } from "../dashboard/DashboardMetrics";
import { MenuItemsView } from "../menu/MenuItemsView";

interface MenuTabContentProps {
  menuItems: MenuItem[];
  selectedMenuItem: MenuItem | null;
  setSelectedMenuItem: (item: MenuItem | null) => void;
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  onSaveMenuItem: (menuItem: MenuItem) => void;
  onDeleteMenuItem?: (menuItemId: string) => void;
  getAvailableSessions: () => any[];
  isLoading: boolean;
  refreshMenuItems: () => void;
  preselectedSessionId?: string;
  setPreselectedSessionId: (id?: string) => void;
}

export function MenuTabContent({
  menuItems,
  selectedMenuItem,
  setSelectedMenuItem,
  selectedSessions,
  setSelectedSessions,
  onSaveMenuItem,
  onDeleteMenuItem,
  getAvailableSessions,
  isLoading,
  refreshMenuItems,
  preselectedSessionId,
  setPreselectedSessionId
}: MenuTabContentProps) {
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);

  const openMenuItemModal = (menuItem: MenuItem | null = null) => {
    setSelectedMenuItem(menuItem);
    setIsMenuItemModalOpen(true);
  };

  // Handle click on Add Menu Item button
  const handleAddMenuItem = () => {
    setSelectedMenuItem({} as MenuItem);
    setIsMenuItemModalOpen(true);
  };

  // Close the modal and reset states
  const handleCloseModal = () => {
    setIsMenuItemModalOpen(false);
    setSelectedMenuItem(null);
    setPreselectedSessionId(undefined);
  };

  // After successful save, refresh the list
  const handleSaveMenuItem = (menuItem: MenuItem) => {
    onSaveMenuItem(menuItem);
    refreshMenuItems();
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Metrics */}
      <DashboardMetrics 
        menuItems={menuItems} 
        onAddMenuItem={handleAddMenuItem}
      />
      
      {/* Menu Items Table */}
      <Card className="border-[#2A2A2A] shadow-md">
        <CardHeader className="bg-[#1A1F2C]/30 border-b border-[#2A2A2A]">
          <CardTitle>Menu Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MenuItemsView 
            menuItems={menuItems} 
            onSelectMenuItem={openMenuItemModal}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
      
      {/* Menu Item Modal */}
      <MenuItemModal
        isOpen={isMenuItemModalOpen}
        onClose={handleCloseModal}
        menuItem={selectedMenuItem || undefined}
        onSave={handleSaveMenuItem}
        onDelete={onDeleteMenuItem}
        selectedSessions={selectedSessions}
        setSelectedSessions={setSelectedSessions}
        availableSessions={getAvailableSessions()}
        preselectedSession={preselectedSessionId}
      />
    </div>
  );
}

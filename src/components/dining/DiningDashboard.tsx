
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MenuTabContent } from "@/components/dining/tabs/MenuTabContent";
import { SessionsTabContent } from "@/components/dining/tabs/SessionsTabContent";
import { PreferencesTabContent } from "@/components/dining/tabs/PreferencesTabContent";
import { MenuItem } from "@/types/menuTypes";
import { useDiningData } from "@/hooks/dining/useDiningData";
import { Utensils, CalendarClock, Users } from "lucide-react";

export function DiningDashboard() {
  const {
    menuItems,
    selectedMenuItem,
    setSelectedMenuItem,
    selectedSessions,
    setSelectedSessions,
    isLoading,
    diningSchedule,
    guestPreferences,
    handleSaveMenuItem,
    handleDeleteMenuItem,
    getAvailableSessions,
    handleAssignItemToSession,
    loadMenuItems,
  } = useDiningData();

  const [activeTab, setActiveTab] = useState("menu");
  const [preselectedSessionId, setPreselectedSessionId] = useState<string | undefined>();

  // Open menu item modal with preselected session
  const handleAddMenuItemToSession = (sessionId: string) => {
    setPreselectedSessionId(sessionId);
    setSelectedMenuItem({} as MenuItem);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Menu Items
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            Dining Sessions
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Guest Preferences
          </TabsTrigger>
        </TabsList>
        
        {/* Menu Items Tab */}
        <TabsContent value="menu" className="pt-4">
          <MenuTabContent
            menuItems={menuItems}
            selectedMenuItem={selectedMenuItem}
            setSelectedMenuItem={setSelectedMenuItem}
            selectedSessions={selectedSessions}
            setSelectedSessions={setSelectedSessions}
            onSaveMenuItem={handleSaveMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            getAvailableSessions={getAvailableSessions}
            isLoading={isLoading}
            refreshMenuItems={loadMenuItems}
            preselectedSessionId={preselectedSessionId}
            setPreselectedSessionId={setPreselectedSessionId}
          />
        </TabsContent>
        
        {/* Dining Sessions Tab */}
        <TabsContent value="sessions" className="pt-4">
          <SessionsTabContent
            sessions={diningSchedule}
            menuItems={menuItems}
            onAddMenuItemToSession={handleAddMenuItemToSession}
            onEditMenuItem={setSelectedMenuItem}
          />
        </TabsContent>
        
        {/* Guest Preferences Tab */}
        <TabsContent value="preferences" className="pt-4">
          <PreferencesTabContent
            preferences={guestPreferences}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

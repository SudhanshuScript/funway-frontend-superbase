
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MenuItem } from "@/types/menuTypes";
import { MenuItemsTab } from "./MenuItemsTab";
import { MenuLibrary } from "../MenuLibrary";
import { SessionMenuMapping } from "../SessionMenuMapping";

interface MenuTabsProps {
  menuItems: MenuItem[];
  onSelectMenuItem: (item: MenuItem) => void;
  renderSessionBadges: (sessions?: string[]) => React.ReactNode;
  isLoading: boolean;
  diningSchedule: any[];
  onAssignItemToSession: (itemId: string, sessionId: number) => void;
}

export function MenuTabs({
  menuItems,
  onSelectMenuItem,
  renderSessionBadges,
  isLoading,
  diningSchedule,
  onAssignItemToSession
}: MenuTabsProps) {
  const [activeTab, setActiveTab] = React.useState("items");

  return (
    <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="items">Menu Items</TabsTrigger>
        <TabsTrigger value="library">Menu Library</TabsTrigger>
        <TabsTrigger value="mapping">Session Menu Mapping</TabsTrigger>
      </TabsList>
      
      <TabsContent value="items" className="pt-4">
        <MenuItemsTab 
          menuItems={menuItems}
          onSelectMenuItem={onSelectMenuItem}
          renderSessionBadges={renderSessionBadges}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="library" className="pt-4">
        <MenuLibrary
          menuItems={menuItems}
          diningSchedule={diningSchedule}
          onSelectMenuItem={onSelectMenuItem}
          renderSessionBadges={renderSessionBadges}
          onAssignItemToSession={onAssignItemToSession}
        />
      </TabsContent>
      
      <TabsContent value="mapping" className="pt-4">
        <SessionMenuMapping sessions={diningSchedule} />
      </TabsContent>
    </Tabs>
  );
}

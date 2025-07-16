
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SessionMenuItems } from "./SessionMenuItems";
import { MenuItem } from "@/types/menuTypes";
import { toast } from "sonner";
import { getSessionMenuItems, mapMenuItemToSessions } from "@/services/menuItemService";

interface DiningSession {
  id: number;
  name: string;
  days: string;
  time: string;
  capacity: number;
  menu: string;
}

interface DiningSessionsTabProps {
  sessions: DiningSession[];
  menuItems: MenuItem[];
  selectedMenuItem: MenuItem | null;
  setSelectedMenuItem: (item: MenuItem | null) => void;
  onOpenMenuItemModal: (item: MenuItem) => void;
}

export function DiningSessionsTab({ 
  sessions, 
  menuItems,
  selectedMenuItem, 
  setSelectedMenuItem,
  onOpenMenuItemModal
}: DiningSessionsTabProps) {
  // State to track menu items per session
  const [sessionMenuItems, setSessionMenuItems] = useState<Record<number, MenuItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu items for each session on mount
  useEffect(() => {
    const loadSessionMenuItems = async () => {
      setIsLoading(true);
      try {
        const sessionsMenuItems: Record<number, MenuItem[]> = {};
        
        // For each session, get the menu items
        for (const session of sessions) {
          // In a real app, this would be a database call
          // For now, we'll simulate it based on session menu name
          const sessionItems = menuItems.filter(item => 
            item.sessions?.includes(session.name) || 
            item.sessions?.includes(session.menu)
          );
          sessionsMenuItems[session.id] = sessionItems;
        }
        
        setSessionMenuItems(sessionsMenuItems);
      } catch (error) {
        console.error("Error loading session menu items:", error);
        toast.error("Failed to load menu items for sessions");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSessionMenuItems();
  }, [sessions, menuItems]);

  // Handle assigning menu items to a session
  const handleAssignItems = async (sessionId: number, menuItemIds: string[]) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    try {
      // Update local state first for immediate feedback
      const itemsToAdd = menuItems.filter(item => menuItemIds.includes(item.id.toString()));
      setSessionMenuItems(prev => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] || []), ...itemsToAdd]
      }));
      
      // For each menu item, update its sessions property
      for (const itemId of menuItemIds) {
        const menuItem = menuItems.find(item => item.id.toString() === itemId);
        if (menuItem) {
          // In a real app, this would call a function to update the database
          // For now, we're just updating the local state
          const updatedSessions = [...(menuItem.sessions || []), session.name];
          console.log(`Assigned menu item ${itemId} to session ${session.name}`);
          
          // This is where we'd call the API to update the menu item's sessions
          // await mapMenuItemToSessions(itemId, [session.id.toString()]);
        }
      }
      
      toast.success(`${menuItemIds.length} items assigned to ${session.name}`);
    } catch (error) {
      console.error("Error assigning menu items:", error);
      toast.error("Failed to assign menu items to session");
      
      // Revert local state on error
      setSessionMenuItems(prev => ({ ...prev }));
    }
  };

  // Handle removing a menu item from a session
  const handleRemoveItem = async (sessionId: number, menuItemId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    try {
      // Update local state first for immediate feedback
      setSessionMenuItems(prev => ({
        ...prev,
        [sessionId]: prev[sessionId]?.filter(item => item.id.toString() !== menuItemId) || []
      }));
      
      // In a real app, this would call a function to update the database
      console.log(`Removed menu item ${menuItemId} from session ${session.name}`);
      
      // This is where we'd call the API to update the menu item's sessions
      // const menuItem = menuItems.find(item => item.id.toString() === menuItemId);
      // if (menuItem && menuItem.sessions) {
      //   const updatedSessions = menuItem.sessions.filter(s => s !== session.name);
      //   await updateMenuItem(menuItemId, { ...menuItem, sessions: updatedSessions });
      // }
    } catch (error) {
      console.error("Error removing menu item:", error);
      toast.error("Failed to remove menu item from session");
      
      // Revert local state on error
      setSessionMenuItems(prev => ({ ...prev }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Dining Sessions</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Session
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="bg-background">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="font-medium">{session.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{session.days}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{session.capacity} capacity</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline">{session.menu}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Clone</Button>
                  </div>
                </div>
                
                {/* Menu items section for this session */}
                <SessionMenuItems
                  sessionId={session.id}
                  sessionName={session.name}
                  menuItems={sessionMenuItems[session.id] || []}
                  allMenuItems={menuItems}
                  onAssignItems={handleAssignItems}
                  onRemoveItem={handleRemoveItem}
                  onEditItem={onOpenMenuItemModal}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

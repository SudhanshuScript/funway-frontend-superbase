
import React, { useState, useEffect } from "react";
import { MenuItem } from "@/types/menuTypes";
import { DiningSession } from "@/types/diningTypes";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MenuTabContent } from "./tabs/MenuTabContent";
import { SessionsTabContent } from "./tabs/SessionsTabContent";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMenuSessionMap } from "@/hooks/useMenuSessionMap";

// Mock data for dining sessions
const mockDiningSessions: DiningSession[] = [
  {
    id: "1",
    name: "Breakfast",
    days: "Monday - Friday",
    time: "7:00 AM - 10:00 AM",
    capacity: 50,
    menu: "Breakfast Menu"
  },
  {
    id: "2",
    name: "Lunch",
    days: "Daily",
    time: "12:00 PM - 3:00 PM",
    capacity: 75,
    menu: "Lunch Menu"
  },
  {
    id: "3",
    name: "Dinner",
    days: "Daily",
    time: "6:00 PM - 10:00 PM",
    capacity: 100,
    menu: "Dinner Menu"
  },
  {
    id: "4",
    name: "Weekend Brunch",
    days: "Saturday - Sunday",
    time: "10:00 AM - 2:00 PM",
    capacity: 80,
    menu: "Special Brunch"
  }
];

// Mock data for guest preferences
const mockGuestPreferences = [
  {
    id: 1,
    name: "Vegetarian",
    percentage: 35,
    trendDirection: "up",
    change: 5
  },
  {
    id: 2,
    name: "Gluten-Free",
    percentage: 22,
    trendDirection: "up",
    change: 3
  },
  {
    id: 3,
    name: "Non-Alcoholic Drinks",
    percentage: 18,
    trendDirection: "up",
    change: 8
  },
  {
    id: 4,
    name: "Seafood",
    percentage: 42,
    trendDirection: "down",
    change: 2
  }
];

export function MenuItemsWithSessions() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState("menu");
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [diningSchedule, setDiningSchedule] = useState(mockDiningSessions);
  const { toast } = useToast();
  const [preselectedSessionId, setPreselectedSessionId] = useState<string | undefined>(undefined);

  const { 
    assignMenuItemToSession, 
    removeMenuItemFromSession 
  } = useMenuSessionMap();
  
  // Helper function to render session badges
  const renderSessionBadges = (sessions?: string[]) => {
    if (!sessions || sessions.length === 0) return null;
    
    return sessions.map(sessionName => {
      const sessionType = diningSchedule.find(s => s.name === sessionName)?.menu || "Default";
      return {
        name: sessionName,
        type: sessionType
      };
    });
  };
  
  // Fetch menu items
  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch sessions from Supabase
  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      // Map the session data to our DiningSession format
      const formattedSessions: DiningSession[] = (data || []).map(session => ({
        id: session.id,
        name: session.name,
        days: session.recurring_type || "Daily",
        time: `${session.start_time} - ${session.end_time}`,
        capacity: session.max_capacity,
        menu: session.type
      }));
      
      setDiningSchedule(formattedSessions.length > 0 ? formattedSessions : mockDiningSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Fallback to mock data
      setDiningSchedule(mockDiningSessions);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchMenuItems();
    fetchSessions();
  }, []);
  
  // Handle save menu item
  const handleSaveMenuItem = async (menuItem: MenuItem) => {
    try {
      // Determine if this is an update or create
      const isUpdate = !!menuItem.id;
      
      if (isUpdate) {
        // Update the menu item
        const { error } = await supabase
          .from('menu_items')
          .update({
            name: menuItem.name,
            category: menuItem.category,
            price: menuItem.price,
            description: menuItem.description,
            vegetarian: menuItem.vegetarian,
            popular: menuItem.popular,
            allergens: menuItem.allergens,
            gluten_free: menuItem.gluten_free,
            dairy_free: menuItem.dairy_free,
            image_url: menuItem.image_url
          })
          .eq('id', menuItem.id);
          
        if (error) throw error;
        
        // Update session mappings
        if (selectedSessions.length > 0) {
          // Clear existing mappings and create new ones
          for (const sessionId of selectedSessions) {
            await assignMenuItemToSession(
              menuItem.id.toString(), 
              sessionId, 
              menuItem.name, 
              diningSchedule.find(s => s.id === sessionId)?.name
            );
          }
        }
        
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
      } else {
        // Create a new menu item
        const { data, error } = await supabase
          .from('menu_items')
          .insert({
            name: menuItem.name,
            category: menuItem.category,
            price: menuItem.price,
            description: menuItem.description,
            vegetarian: menuItem.vegetarian,
            popular: menuItem.popular,
            allergens: menuItem.allergens,
            gluten_free: menuItem.gluten_free,
            dairy_free: menuItem.dairy_free,
            image_url: menuItem.image_url
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Handle session mappings for new item
        if (data && selectedSessions.length > 0) {
          for (const sessionId of selectedSessions) {
            await assignMenuItemToSession(
              data.id.toString(), 
              sessionId, 
              data.name,
              diningSchedule.find(s => s.id === sessionId)?.name
            );
          }
        }
        
        toast({
          title: "Success",
          description: "Menu item created successfully",
        });
      }
      
      // Refresh the menu items list
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive"
      });
    }
  };
  
  // Handle delete menu item
  const handleDeleteMenuItem = async (menuItemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', menuItemId);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
      
      // Refresh the menu items list
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
    }
  };
  
  // Handle assigning menu item to session via drag and drop
  const handleAssignItemToSession = async (menuItemId: string, sessionId: string) => {
    try {
      const menuItem = menuItems.find(item => item.id.toString() === menuItemId);
      const session = diningSchedule.find(s => s.id.toString() === sessionId);
      
      if (!menuItem || !session) {
        throw new Error("Menu item or session not found");
      }
      
      const success = await assignMenuItemToSession(
        menuItemId, 
        sessionId, 
        menuItem.name, 
        session.name
      );
      
      if (success) {
        // Update menu item sessions for UI
        const updatedItems = menuItems.map(item => {
          if (item.id.toString() === menuItemId) {
            const newSessions = [...(item.sessions || [])];
            if (!newSessions.includes(session.name)) {
              newSessions.push(session.name);
            }
            return { ...item, sessions: newSessions };
          }
          return item;
        });
        setMenuItems(updatedItems);
      }
    } catch (error) {
      console.error('Error assigning menu item to session:', error);
      toast({
        title: "Error",
        description: "Failed to assign menu item to session",
        variant: "destructive"
      });
    }
  };
  
  // Get available sessions for dropdown
  const getAvailableSessions = () => {
    return diningSchedule.map(session => ({
      id: session.id,
      name: session.name,
      type: session.menu
    }));
  };

  // Handle opening the menu item modal from sessions tab
  const handleOpenMenuItemModalFromSession = (sessionId: string) => {
    setPreselectedSessionId(sessionId);
    setSelectedMenuItem(null);
    setActiveTab("menu");
  };

  return (
    <Card className="bg-background border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Dining Management</CardTitle>
        <CardDescription>
          Manage your menu items and dining sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="sessions">Dining Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-6">
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
              refreshMenuItems={fetchMenuItems}
              preselectedSessionId={preselectedSessionId}
              setPreselectedSessionId={setPreselectedSessionId}
            />
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-6">
            <SessionsTabContent
              sessions={diningSchedule}
              menuItems={menuItems}
              onAddMenuItemToSession={handleOpenMenuItemModalFromSession}
              onEditMenuItem={setSelectedMenuItem}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

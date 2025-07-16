
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DiningSession } from "@/types/diningTypes";
import { MenuItem } from "@/types/menuTypes";
import { toast } from "sonner";
import { createMenuSessionMapper, executeRPC } from "@/utils/typeHelpers";

// Define proper session menu items result type
interface SessionMenuItemsResult {
  session_id: string;
  menu_item: MenuItem;
}

export const useDiningSessionData = () => {
  const [sessions, setSessions] = useState<DiningSession[]>([]);
  const [sessionMenuItems, setSessionMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Create menu-session mapper
  const menuSessionMapper = createMenuSessionMapper();

  // Load sessions from Supabase
  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      try {
        // Get sessions from Supabase
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("sessions")
          .select("*");

        if (sessionsError) {
          throw sessionsError;
        }

        // Format sessions to match our DiningSession type
        const formattedSessions: DiningSession[] = sessionsData.map(session => ({
          id: session.id,
          name: session.name,
          days: session.recurring_type || "Daily", // Using recurring_type as days
          time: `${session.start_time} - ${session.end_time}`,
          capacity: session.max_capacity,
          menu: session.type // Using type as menu
        }));

        setSessions(formattedSessions);

        // Now fetch the menu items for each session
        await loadMenuItemsForSessions(formattedSessions);
      } catch (error) {
        console.error("Error loading sessions:", error);
        toast.error("Failed to load dining sessions");
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Load menu items for each session using a safer approach
  const loadMenuItemsForSessions = async (loadedSessions: DiningSession[]) => {
    try {
      // Try RPC function first
      const { data, error } = await executeRPC<SessionMenuItemsResult[]>('get_all_menu_session_items');

      if (error || !data) {
        console.error("RPC function error:", error);
        
        // Fallback to a safer direct query approach
        const menuItemsBySession: Record<string, MenuItem[]> = {};
        
        // For each session, get menu items in separate queries
        for (const session of loadedSessions) {
          try {
            // Use our custom mapper to get the mappings
            const mappingsResult = await menuSessionMapper.selectBySessionId(session.id.toString());
              
            if (mappingsResult.error) {
              console.error(`Error fetching mappings for session ${session.id}:`, mappingsResult.error);
              menuItemsBySession[session.id.toString()] = [];
              continue;
            }

            const mappingsData = mappingsResult.data as { menu_id: string }[];
            
            if (!mappingsData || mappingsData.length === 0) {
              menuItemsBySession[session.id.toString()] = [];
              continue;
            }
            
            // Get the menu items for these IDs
            const menuIds = mappingsData.map(item => item.menu_id);
            
            const menuItemsResponse = await supabase
              .from('menu_items')
              .select('*')
              .in('id', menuIds);
              
            if (menuItemsResponse.error) {
              console.error(`Error fetching menu items for session ${session.id}:`, menuItemsResponse.error);
              menuItemsBySession[session.id.toString()] = [];
              continue;
            }
            
            menuItemsBySession[session.id.toString()] = menuItemsResponse.data || [];
          } catch (sessionError) {
            console.error(`Error processing session ${session.id}:`, sessionError);
            menuItemsBySession[session.id.toString()] = [];
          }
        }
        
        setSessionMenuItems(menuItemsBySession);
        return;
      }

      // Process data from RPC call
      const menuItemsBySession: Record<string, MenuItem[]> = {};
      
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const sessionId = item.session_id;
          const menuItem = item.menu_item;
          
          if (sessionId && menuItem) {
            if (!menuItemsBySession[sessionId]) {
              menuItemsBySession[sessionId] = [];
            }
            menuItemsBySession[sessionId].push(menuItem);
          }
        });
      }

      setSessionMenuItems(menuItemsBySession);
    } catch (error) {
      console.error("Error loading menu items for sessions:", error);
      toast.error("Failed to load menu items for sessions");
    }
  };

  // Assign a menu item to a session
  const handleAssignMenuItemToSession = async (menuId: string, sessionId: string, menuName?: string, sessionName?: string) => {
    setIsUpdating(true);
    try {
      // Check if mapping exists first
      const exists = await menuSessionMapper.checkExists(menuId, sessionId);
      
      if (exists) {
        // Already exists
        const displayMenuName = menuName || "Menu item";
        const displaySessionName = sessionName || "session";
        toast.success(`"${displayMenuName}" already assigned to ${displaySessionName}`);
        return true;
      }
      
      // Create new mapping
      const result = await menuSessionMapper.insert({
        menu_id: menuId,
        session_id: sessionId
      });
      
      if (result.error) {
        throw result.error;
      }
      
      // Update local state
      const menuItem = await getMenuItem(menuId);
      if (menuItem) {
        setSessionMenuItems(prev => ({
          ...prev,
          [sessionId]: [...(prev[sessionId] || []), menuItem]
        }));
      }
      
      const displayMenuName = menuName || "Menu item";
      const displaySessionName = sessionName || "session";
      toast.success(`"${displayMenuName}" assigned to ${displaySessionName}`);
      return true;
    } catch (error) {
      console.error("Error assigning menu item to session:", error);
      toast.error("Failed to assign menu item to session");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Remove a menu item from a session
  const handleRemoveMenuItemFromSession = async (menuId: string, sessionId: string, menuName?: string, sessionName?: string) => {
    setIsUpdating(true);
    try {
      const result = await menuSessionMapper.remove(menuId, sessionId);
      
      if (result.error) {
        throw result.error;
      }
      
      // Update local state
      setSessionMenuItems(prev => ({
        ...prev,
        [sessionId]: (prev[sessionId] || []).filter(item => item.id !== menuId)
      }));
      
      const displayMenuName = menuName || "Menu item";
      const displaySessionName = sessionName || "session";
      toast.success(`"${displayMenuName}" removed from ${displaySessionName}`);
      return true;
    } catch (error) {
      console.error("Error removing menu item from session:", error);
      toast.error("Failed to remove menu item from session");
      
      // Revert local state on error
      setSessionMenuItems(prev => ({ ...prev }));
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Get a menu item by ID
  const getMenuItem = async (menuId: string): Promise<MenuItem | null> => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("id", menuId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error getting menu item:", error);
      return null;
    }
  };

  // Refresh data after updates
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select("*");

      if (sessionsError) {
        throw sessionsError;
      }

      // Format sessions to match our DiningSession type
      const formattedSessions: DiningSession[] = sessionsData.map(session => ({
        id: session.id,
        name: session.name,
        days: session.recurring_type || "Daily", // Using recurring_type as days
        time: `${session.start_time} - ${session.end_time}`,
        capacity: session.max_capacity,
        menu: session.type // Using type as menu
      }));

      setSessions(formattedSessions);
      await loadMenuItemsForSessions(formattedSessions);
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sessions,
    sessionMenuItems,
    isLoading,
    isUpdating,
    handleAssignMenuItemToSession,
    handleRemoveMenuItemFromSession,
    refreshData
  };
};

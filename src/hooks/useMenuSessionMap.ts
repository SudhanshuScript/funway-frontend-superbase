
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types/menuTypes";
import { toast } from "sonner";

interface MenuSessionMapItem {
  id: string;
  menu_id: string;
  session_id: string;
  created_at?: string;
}

interface UseMenuSessionMapResult {
  isLoading: boolean;
  assignMenuItemToSession: (menuId: string, sessionId: string, menuName?: string, sessionName?: string) => Promise<boolean>;
  removeMenuItemFromSession: (menuId: string, sessionId: string, menuName?: string, sessionName?: string) => Promise<boolean>;
  getMenuItemsForSession: (sessionId: string) => Promise<MenuItem[]>;
  getSessionsForMenuItem: (menuId: string) => Promise<string[]>;
}

export function useMenuSessionMap(): UseMenuSessionMapResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Assign a menu item to a session
  const assignMenuItemToSession = async (
    menuId: string, 
    sessionId: string, 
    menuName?: string,
    sessionName?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // First check if this mapping already exists
      const { data: existingMapping } = await (supabase as any)
        .from('menu_session_map')
        .select('*')
        .eq('menu_id', menuId)
        .eq('session_id', sessionId)
        .maybeSingle();
      
      if (existingMapping) {
        // Already exists
        const displayMenuName = menuName || "Menu item";
        const displaySessionName = sessionName || "session";
        toast.success(`"${displayMenuName}" already assigned to ${displaySessionName}`);
        return true;
      }
      
      // Create new mapping
      const { error } = await (supabase as any)
        .from('menu_session_map')
        .insert({
          menu_id: menuId,
          session_id: sessionId
        });
      
      if (error) {
        console.error("Error assigning menu to session:", error);
        toast.error("Failed to assign menu item to session");
        return false;
      }
      
      const displayMenuName = menuName || "Menu item";
      const displaySessionName = sessionName || "session";
      toast.success(`"${displayMenuName}" assigned to ${displaySessionName}`);
      return true;
    } catch (error) {
      console.error("Error in assignMenuItemToSession:", error);
      toast.error("Failed to assign menu item to session");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove a menu item from a session
  const removeMenuItemFromSession = async (
    menuId: string, 
    sessionId: string,
    menuName?: string,
    sessionName?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('menu_session_map')
        .delete()
        .eq('menu_id', menuId)
        .eq('session_id', sessionId);
      
      if (error) {
        console.error("Error removing menu item from session:", error);
        toast.error("Failed to remove menu item from session");
        return false;
      }
      
      const displayMenuName = menuName || "Menu item";
      const displaySessionName = sessionName || "session";
      toast.success(`"${displayMenuName}" removed from ${displaySessionName}`);
      return true;
    } catch (error) {
      console.error("Error in removeMenuItemFromSession:", error);
      toast.error("Failed to remove menu item from session");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get menu items for a specific session
  const getMenuItemsForSession = async (sessionId: string): Promise<MenuItem[]> => {
    setIsLoading(true);
    try {
      // Get the menu IDs from the mapping table
      const { data: mappings, error: mappingError } = await (supabase as any)
        .from('menu_session_map')
        .select('menu_id')
        .eq('session_id', sessionId);
      
      if (mappingError || !mappings || mappings.length === 0) {
        return [];
      }
      
      // Extract menu IDs
      const menuIds = mappings.map(map => map.menu_id);
      
      // Get the menu items
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .in('id', menuIds);
      
      if (menuError) {
        console.error("Error fetching menu items:", menuError);
        return [];
      }
      
      return menuItems || [];
    } catch (error) {
      console.error("Error in getMenuItemsForSession:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get sessions for a specific menu item
  const getSessionsForMenuItem = async (menuId: string): Promise<string[]> => {
    setIsLoading(true);
    try {
      // Get the session IDs from the mapping table
      const { data: mappings, error: mappingError } = await (supabase as any)
        .from('menu_session_map')
        .select('session_id')
        .eq('menu_id', menuId);
      
      if (mappingError || !mappings) {
        return [];
      }
      
      // Extract session IDs
      return mappings.map(map => map.session_id);
    } catch (error) {
      console.error("Error in getSessionsForMenuItem:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    assignMenuItemToSession,
    removeMenuItemFromSession,
    getMenuItemsForSession,
    getSessionsForMenuItem
  };
}

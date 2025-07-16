
import { supabase } from "@/integrations/supabase/client";
import { MenuSessionMap, MenuSessionMapWithItems } from "@/types/menuSessionMapTypes";
import { MenuItem } from "@/types/menuTypes";
import { createMenuSessionMapper, executeRPC } from "@/utils/typeHelpers";

// Create reusable menu-session mapper
const menuSessionMapper = createMenuSessionMapper();

// Interface for session menu item results
interface SessionMenuItemsResult {
  session_id: string;
  menu_item: MenuItem;
}

// Fetch all menu-session mappings
export const fetchMenuSessionMappings = async () => {
  try {
    const result = await menuSessionMapper.select<MenuSessionMap>();
    
    if (result.error) {
      console.error("Error fetching menu-session mappings:", result.error);
      return [];
    }
    
    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch menu-session mappings:", error);
    return [];
  }
};

// Fetch menu items for a specific session
export const fetchMenuItemsForSession = async (sessionId: string) => {
  try {
    // Use RPC function
    const { data, error } = await executeRPC<SessionMenuItemsResult[]>('get_menu_items_by_session', { 
      session_id_param: sessionId 
    });

    if (error || !data) {
      console.error("Error fetching menu items for session:", error);
      
      // Fallback to a direct query approach
      const response = await supabase.from('menu_items')
        .select('*');
        
      if (response.error) {
        console.error("Fallback menu items error:", response.error);
        return [];
      }
      
      // Fetch mappings separately with a safer approach
      const mappingsResult = await menuSessionMapper.selectBySessionId<{menu_id: string}>(sessionId);
        
      if (mappingsResult.error) {
        console.error("Mappings error:", mappingsResult.error);
        return [];
      }
      
      const mappingsData = mappingsResult.data || [];
      
      // Filter items that are in the mapping
      const menuIds = mappingsData?.map(item => item.menu_id) || [];
      const filteredItems = response.data?.filter(item => 
        menuIds.includes(item.id.toString())
      ) || [];
      
      return filteredItems as MenuItem[];
    }

    // Process data from RPC call
    if (Array.isArray(data)) {
      return data.map(item => item.menu_item);
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch menu items for session:", error);
    return [];
  }
};

// Fetch sessions for a specific menu item
export const fetchSessionsForMenuItem = async (menuId: string) => {
  try {
    // Use RPC function
    const { data, error } = await executeRPC('get_sessions_by_menu_item', { 
      menu_id_param: menuId 
    });

    if (error) {
      console.error("Error fetching sessions for menu item:", error);
      
      // Fallback to direct query
      const response = await supabase.from('sessions')
        .select('*');
        
      if (response.error) {
        console.error("Fallback sessions error:", response.error);
        return [];
      }
      
      // Fetch mappings separately with a safer approach
      const mappingsResult = await menuSessionMapper.selectByMenuId<{session_id: string}>(menuId);
        
      if (mappingsResult.error) {
        console.error("Mappings error:", mappingsResult.error);
        return [];
      }
      
      const mappingsData = mappingsResult.data || [];
      
      // Filter sessions that are in the mapping
      const sessionIds = mappingsData?.map(item => item.session_id) || [];
      const filteredSessions = response.data?.filter(item => 
        sessionIds.includes(item.id.toString())
      ) || [];
      
      return filteredSessions;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch sessions for menu item:", error);
    return [];
  }
};

// Assign a menu item to a session
export const assignMenuItemToSession = async (menuId: string, sessionId: string) => {
  try {
    // Check if this mapping already exists
    const exists = await menuSessionMapper.checkExists(menuId, sessionId);

    if (exists) {
      // Already exists, no need to create it again
      return { 
        success: true, 
        message: "Menu item is already assigned to this session"
      };
    }

    // Create new mapping
    const result = await menuSessionMapper.insert({ 
      menu_id: menuId, 
      session_id: sessionId 
    });

    if (result.error) {
      throw result.error;
    }

    return { 
      success: true, 
      data: result.data && result.data[0] ? result.data[0] : null, 
      message: "Menu item assigned to session" 
    };
  } catch (error) {
    console.error("Failed to assign menu item to session:", error);
    return { success: false, message: "Failed to assign menu item to session", error };
  }
};

// Remove a menu item from a session
export const removeMenuItemFromSession = async (menuId: string, sessionId: string) => {
  try {
    const result = await menuSessionMapper.remove(menuId, sessionId);

    if (result.error) {
      throw result.error;
    }

    return { success: true, message: "Menu item removed from session" };
  } catch (error) {
    console.error("Failed to remove menu item from session:", error);
    return { success: false, message: "Failed to remove menu item from session", error };
  }
};

// Get all sessions with their assigned menu items
export const getSessionsWithMenuItems = async () => {
  try {
    // First get all sessions directly
    const sessionsResponse = await supabase.from("sessions").select("*");

    if (sessionsResponse.error) {
      console.error("Error fetching sessions:", sessionsResponse.error);
      throw sessionsResponse.error;
    }

    const sessions = sessionsResponse.data;
    
    // Get all menu items mapped to sessions using RPC
    const { data: mappingsData, error: mappingsError } = await executeRPC<SessionMenuItemsResult[]>('get_all_menu_session_items');

    if (mappingsError || !mappingsData) {
      console.error("Error fetching menu-session mappings:", mappingsError);
      
      // Fallback approach - get all mappings and menu items separately
      const mappingsResult = await menuSessionMapper.select<{menu_id: string, session_id: string}>();
        
      if (mappingsResult.error) {
        console.error("Fallback mappings error:", mappingsResult.error);
        // Return sessions without menu items
        return sessions.map(session => ({
          ...session,
          menuItems: []
        }));
      }
      
      const mappings = mappingsResult.data || [];
      
      // Get all menu items
      const menuItemsResponse = await supabase.from('menu_items').select('*');
      
      if (menuItemsResponse.error) {
        console.error("Fallback menu items error:", menuItemsResponse.error);
        // Return sessions without menu items
        return sessions.map(session => ({
          ...session,
          menuItems: []
        }));
      }
      
      // Group menu items by session
      const sessionMap: Record<string, MenuItem[]> = {};
      
      if (mappings) {
        mappings.forEach(mapping => {
          const sessionId = mapping.session_id;
          const menuItemId = mapping.menu_id;
          
          // Find the menu item
          const menuItem = menuItemsResponse.data.find(item => item.id === menuItemId);
          
          if (menuItem && sessionId) {
            if (!sessionMap[sessionId]) {
              sessionMap[sessionId] = [];
            }
            sessionMap[sessionId].push(menuItem);
          }
        });
      }
      
      const sessionsWithMenuItems = sessions.map(session => ({
        ...session,
        menuItems: sessionMap[session.id] || []
      }));
      
      return sessionsWithMenuItems;
    }

    // Process data from RPC call
    const sessionMap: Record<string, MenuItem[]> = {};
    
    if (mappingsData && Array.isArray(mappingsData)) {
      mappingsData.forEach((mapping) => {
        const sessionId = mapping.session_id;
        const menuItem = mapping.menu_item;
        
        if (sessionId && menuItem) {
          if (!sessionMap[sessionId]) {
            sessionMap[sessionId] = [];
          }
          sessionMap[sessionId].push(menuItem);
        }
      });
    }
    
    const sessionsWithMenuItems = sessions.map(session => ({
      ...session,
      menuItems: sessionMap[session.id] || []
    }));

    return sessionsWithMenuItems;
  } catch (error) {
    console.error("Failed to get sessions with menu items:", error);
    return [];
  }
};

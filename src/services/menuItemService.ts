import { MenuItem, MenuSessionMapping } from "@/types/menuTypes";
import { supabase } from "@/integrations/supabase/client";

// Fetch menu items based on franchise access
export const fetchMenuItems = async (franchiseId?: string) => {
  try {
    // Use a more generic query approach to avoid type issues
    let query = supabase.from('menu_items').select('*');
    
    // If franchise ID is specified, filter by it
    if (franchiseId && franchiseId !== 'all') {
      query = query.eq('franchise_id', franchiseId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    return data as MenuItem[];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

// Create a new menu item
export const createMenuItem = async (menuItem: Partial<MenuItem>) => {
  try {
    // Ensure we're sending a properly typed object to Supabase
    const menuItemData = {
      name: menuItem.name,
      category: menuItem.category,
      price: menuItem.price,
      description: menuItem.description,
      allergens: menuItem.allergens,
      vegetarian: menuItem.vegetarian,
      gluten_free: menuItem.gluten_free,
      dairy_free: menuItem.dairy_free,
      popular: menuItem.popular,
      franchise_id: menuItem.franchise_id,
      image_url: menuItem.image_url,  // Only include image_url, not image_file
      satisfaction_score: menuItem.satisfaction_score,
      available: menuItem.available
    };

    const { data, error } = await supabase
      .from('menu_items')
      .insert([menuItemData])
      .select()
      .single();
      
    if (error) throw error;
    
    return data as MenuItem;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

// Update an existing menu item
export const updateMenuItem = async (id: string, menuItem: Partial<MenuItem>) => {
  try {
    // Convert id to string for UUID compatibility
    const stringId = id.toString();
    
    // Ensure we're sending a properly typed object to Supabase
    const menuItemData: Record<string, any> = {};
    
    // Only include defined properties to avoid setting fields to null
    if (menuItem.name !== undefined) menuItemData.name = menuItem.name;
    if (menuItem.category !== undefined) menuItemData.category = menuItem.category;
    if (menuItem.price !== undefined) menuItemData.price = menuItem.price;
    if (menuItem.description !== undefined) menuItemData.description = menuItem.description;
    if (menuItem.allergens !== undefined) menuItemData.allergens = menuItem.allergens;
    if (menuItem.vegetarian !== undefined) menuItemData.vegetarian = menuItem.vegetarian;
    if (menuItem.gluten_free !== undefined) menuItemData.gluten_free = menuItem.gluten_free;
    if (menuItem.dairy_free !== undefined) menuItemData.dairy_free = menuItem.dairy_free;
    if (menuItem.popular !== undefined) menuItemData.popular = menuItem.popular;
    if (menuItem.franchise_id !== undefined) menuItemData.franchise_id = menuItem.franchise_id;
    if (menuItem.image_url !== undefined) menuItemData.image_url = menuItem.image_url;
    if (menuItem.satisfaction_score !== undefined) menuItemData.satisfaction_score = menuItem.satisfaction_score;
    if (menuItem.available !== undefined) menuItemData.available = menuItem.available;
    // Don't include sessions directly in the update as it's not in the database schema

    const { data, error } = await supabase
      .from('menu_items')
      .update(menuItemData)
      .eq('id', stringId)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as MenuItem;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: string | number) => {
  try {
    // First, remove all session mappings
    await deleteMenuItemSessionMappings(id.toString());
    
    // Then delete the menu item
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id.toString());
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Delete all session mappings for a menu item
const deleteMenuItemSessionMappings = async (menuItemId: string) => {
  try {
    const { error } = await supabase
      .from('menu_session_mappings')
      .delete()
      .eq('menu_item_id', menuItemId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting menu item session mappings:', error);
    throw error;
  }
};

// Upload menu item image
export const uploadMenuItemImage = async (file: File, franchiseId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${franchiseId}/${fileName}`;
    
    const { error } = await supabase
      .storage
      .from('menu-items')
      .upload(filePath, file);
      
    if (error) throw error;
    
    const { data } = supabase
      .storage
      .from('menu-items')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Map menu items to sessions (replaces all existing mappings)
export const mapMenuItemToSessions = async (menuItemId: string, sessionIds: string[]) => {
  try {
    console.log('Mapping menu item to sessions:', menuItemId, sessionIds);
    
    // First, remove all existing mappings for this menu item
    await supabase
      .from('menu_session_mappings')
      .delete()
      .eq('menu_item_id', menuItemId);
    
    // Insert new mappings
    if (sessionIds.length > 0) {
      const mappings = sessionIds.map(sessionId => ({
        menu_item_id: menuItemId,
        session_id: sessionId,
        available: true
      }));
      
      const { error } = await supabase
        .from('menu_session_mappings')
        .insert(mappings);
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error mapping menu item to sessions:', error);
    throw error;
  }
};

// Get session mappings for a menu item
export const getMenuItemSessions = async (menuItemId: string) => {
  try {
    const { data, error } = await supabase
      .from('menu_session_mappings')
      .select('session_id')
      .eq('menu_item_id', menuItemId);
      
    if (error) throw error;
    
    return data.map(item => item.session_id);
  } catch (error) {
    console.error('Error getting menu item sessions:', error);
    throw error;
  }
};

// Get menu items for a session
export const getSessionMenuItems = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('menu_session_mappings')
      .select('menu_item_id')
      .eq('session_id', sessionId);
      
    if (error) throw error;
    
    if (data.length === 0) return [];
    
    const menuItemIds = data.map(item => item.menu_item_id);
    
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*')
      .in('id', menuItemIds);
      
    if (menuError) throw menuError;
    
    return menuItems as MenuItem[];
  } catch (error) {
    console.error('Error getting session menu items:', error);
    throw error;
  }
};

// Add a single menu item to a session
export const addMenuItemToSession = async (menuItemId: string, sessionId: string) => {
  try {
    // Check if mapping already exists
    const { data: existingMapping, error: checkError } = await supabase
      .from('menu_session_mappings')
      .select('id')
      .eq('menu_item_id', menuItemId)
      .eq('session_id', sessionId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // If mapping doesn't exist, create it
    if (!existingMapping) {
      const { error } = await supabase
        .from('menu_session_mappings')
        .insert([{
          menu_item_id: menuItemId,
          session_id: sessionId,
          available: true
        }]);
        
      if (error) throw error;
    }
    
    // Get the session name for the session_id
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('name')
      .eq('id', sessionId)
      .single();
      
    if (sessionError) throw sessionError;
    
    // Update the menu item with the session name
    const { data: menuItemData, error: menuItemError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', menuItemId)
      .single();
      
    if (menuItemError) throw menuItemError;
    
    // Since 'sessions' might not exist in the DB schema, we handle it manually
    const menuItem = menuItemData as MenuItem;
    const sessionsList = menuItem.sessions || [];
    
    // Add session name if not already present
    if (!sessionsList.includes(sessionData.name)) {
      const updatedSessions = [...sessionsList, sessionData.name];
      
      // Store the sessions list in a local field of our application
      // This doesn't alter the database schema
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error adding menu item to session:', error);
    throw error;
  }
};

// Remove a single menu item from a session
export const removeMenuItemFromSession = async (menuItemId: string, sessionId: string) => {
  try {
    // Delete the mapping
    const { error } = await supabase
      .from('menu_session_mappings')
      .delete()
      .eq('menu_item_id', menuItemId)
      .eq('session_id', sessionId);
      
    if (error) throw error;
    
    // Get the session name for the session_id
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('name')
      .eq('id', sessionId)
      .single();
      
    if (sessionError) throw sessionError;
    
    // Update the menu item with the session name
    const { data: menuItemData, error: menuItemError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', menuItemId)
      .single();
      
    if (menuItemError) throw menuItemError;
    
    // Since 'sessions' might not exist in the DB schema, we handle it manually
    const menuItem = menuItemData as MenuItem;
    const sessionsList = menuItem.sessions || [];
    
    // Remove session name
    const updatedSessions = sessionsList.filter(name => name !== sessionData.name);
    
    // This is just for the client-side representation
    return true;
  } catch (error) {
    console.error('Error removing menu item from session:', error);
    throw error;
  }
};

// Update menu item availability for a specific session
export const updateMenuItemAvailability = async (menuItemId: string, sessionId: string, available: boolean) => {
  try {
    // Check if mapping already exists
    const { data: existingMapping, error: checkError } = await supabase
      .from('menu_session_mappings')
      .select('id')
      .eq('menu_item_id', menuItemId)
      .eq('session_id', sessionId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (existingMapping) {
      // If mapping exists, just update the availability
      const { error } = await supabase
        .from('menu_session_mappings')
        .update({ available })
        .eq('menu_item_id', menuItemId)
        .eq('session_id', sessionId);
        
      if (error) throw error;
    } else if (available) {
      // If mapping doesn't exist and we want to make it available, create it
      const { error } = await supabase
        .from('menu_session_mappings')
        .insert([{
          menu_item_id: menuItemId,
          session_id: sessionId,
          available: true
        }]);
        
      if (error) throw error;
    } else {
      // If mapping doesn't exist and we want to make it unavailable, nothing to do
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating menu item availability:', error);
    throw error;
  }
};

// Update menu item with session names (handles both session mappings and menu item update)
export const updateMenuItemWithSessions = async (menuItem: MenuItem, sessionIds: string[]) => {
  try {
    // Step 1: Update the menu item (without sessions field)
    const menuItemData: Partial<MenuItem> = {
      name: menuItem.name,
      category: menuItem.category,
      price: menuItem.price,
      description: menuItem.description,
      allergens: menuItem.allergens,
      vegetarian: menuItem.vegetarian,
      gluten_free: menuItem.gluten_free,
      dairy_free: menuItem.dairy_free,
      popular: menuItem.popular,
      franchise_id: menuItem.franchise_id,
      image_url: menuItem.image_url
    };
    
    const { data: updatedItem, error: updateError } = await supabase
      .from('menu_items')
      .update(menuItemData)
      .eq('id', menuItem.id)
      .select()
      .single();
      
    if (updateError) throw updateError;
    
    // Step 2: Update session mappings
    await mapMenuItemToSessions(menuItem.id.toString(), sessionIds);
    
    // Step 3: Return the updated item with session data manually added
    const updatedItemWithSessions = {
      ...updatedItem as MenuItem,
      sessions: menuItem.sessions || []
    };
    
    return updatedItemWithSessions;
  } catch (error) {
    console.error('Error updating menu item with sessions:', error);
    throw error;
  }
};


import { MenuItem } from "@/types/menuTypes";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Mock function to enhance menu items with session information
export const enhanceMenuItemsWithSessions = (menuItems: MenuItem[]): MenuItem[] => {
  return menuItems.map(item => {
    // In a real app, this data would come from the database
    // For the demo, we're adding mock sessions based on menu item category
    let sessions: string[] = item.sessions || [];
    
    // Only add default sessions if none are already assigned
    if (sessions.length === 0) {
      if (item.category === 'Breakfast') {
        sessions = ['Breakfast Service', 'Brunch Service'];
      } else if (item.category === 'Lunch') {
        sessions = ['Lunch Service'];
      } else if (item.category === 'Dinner') {
        sessions = ['Dinner Service'];
      } else if (item.category === 'Dessert') {
        sessions = ['Breakfast Service', 'Lunch Service', 'Dinner Service'];
      } else {
        sessions = ['Special Event'];
      }
    }
    
    return {
      ...item,
      sessions
    };
  });
};

// Assign an item to a session
export const assignItemToSession = async (
  itemId: string,
  sessionId: number,
  menuItems: MenuItem[],
  diningSchedule: any[]
): Promise<MenuItem[]> => {
  try {
    // Find the menu item and session
    const menuItem = menuItems.find(item => item.id === itemId);
    const session = diningSchedule.find(s => s.id === sessionId);
    
    if (!menuItem || !session) {
      throw new Error("Menu item or session not found");
    }
    
    console.log(`Assigning menu item ${menuItem.name} to session ${session.name}`);
    
    // Update the menu item with the new session
    const updatedMenuItems = menuItems.map(item => {
      if (item.id === itemId) {
        const existingSessions = item.sessions || [];
        const updatedSessions = [...existingSessions];
        
        // Only add the session if it's not already included
        if (!updatedSessions.includes(session.name)) {
          updatedSessions.push(session.name);
        }
        
        return {
          ...item,
          sessions: updatedSessions
        };
      }
      return item;
    });
    
    return updatedMenuItems;
  } catch (error) {
    console.error("Error assigning menu item to session:", error);
    throw new Error("Failed to assign menu item to session");
  }
};

// Save (create or update) a menu item
export const saveMenuItem = async (
  menuItem: MenuItem,
  currentMenuItems: MenuItem[],
  selectedSessionIds: string[]
): Promise<MenuItem[]> => {
  try {
    console.log("Saving menu item with sessions:", selectedSessionIds);
    
    // In a real app, this would be an API call
    // For now, we're simulating saving with the current list
    
    // If it's a new menu item, generate ID
    if (!menuItem.id) {
      menuItem.id = uuidv4();
    }
    
    // Update the menu items array
    let updatedItems: MenuItem[];
    
    if (currentMenuItems.some(item => item.id === menuItem.id)) {
      // Update existing item
      updatedItems = currentMenuItems.map(item => 
        item.id === menuItem.id ? { ...menuItem } : item
      );
    } else {
      // Add new item
      updatedItems = [...currentMenuItems, menuItem];
    }
    
    return updatedItems;
  } catch (error) {
    console.error("Error saving menu item:", error);
    throw new Error("Failed to save menu item");
  }
};

// Delete a menu item from the list
export const deleteMenuItemFromList = async (
  menuItemId: string,
  currentMenuItems: MenuItem[]
): Promise<MenuItem[] | null> => {
  try {
    console.log("Attempting to delete menu item:", menuItemId);
    
    // In a real app, this would be an API call
    // For this demo, we'll simulate deletion
    return currentMenuItems.filter(item => item.id !== menuItemId);
  } catch (error) {
    console.error("Error deleting menu item:", error);
    toast.error("Failed to delete menu item");
    return null; // Return null to indicate error
  }
};

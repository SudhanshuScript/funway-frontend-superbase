import { useState, useEffect } from "react";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import { MenuItem } from "@/types/menuTypes";
import { 
  fetchMenuItems, 
  updateMenuItemWithSessions, 
  createMenuItem, 
  uploadMenuItemImage, 
  deleteMenuItem, 
  addMenuItemToSession,
  getMenuItemSessions,
  updateMenuItemAvailability
} from "@/services/menuItemService";
import { toast } from "sonner";
import { useAuthRedirect } from "./useAuthRedirect";
import { diningSchedule, guestPreferences, sessionCategories } from "./data/diningMockData";
import { renderSessionBadges as renderSessionBadgesJSX } from "@/components/dining/utils/sessionBadgeUtils";

// Mock menu items for demo purposes
const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Breakfast",
    category: "Breakfast",
    price: 12.99,
    description: "Eggs, bacon, toast, and hash browns",
    allergens: ["eggs", "gluten", "dairy"],
    vegetarian: false,
    popular: true,
    sessions: ["Morning Breakfast", "Weekend Brunch"],
    franchise_id: "1",
    gluten_free: false,
    dairy_free: false,
    satisfaction_score: 4.8,
    available: true
  },
  {
    id: "2",
    name: "Vegetarian Omelette",
    category: "Breakfast",
    price: 10.99,
    description: "Three egg omelette with spinach, tomatoes, and feta cheese",
    allergens: ["eggs", "dairy"],
    vegetarian: true,
    popular: false,
    sessions: ["Morning Breakfast", "Weekend Brunch"],
    franchise_id: "1",
    gluten_free: true,
    dairy_free: false,
    satisfaction_score: 4.5,
    available: true
  },
  {
    id: "3",
    name: "Chicken Caesar Salad",
    category: "Lunch",
    price: 14.99,
    description: "Grilled chicken breast on romaine lettuce with Caesar dressing and croutons",
    allergens: ["gluten", "dairy"],
    vegetarian: false,
    popular: true,
    sessions: ["Lunch Special", "Dinner Service"],
    franchise_id: "1",
    gluten_free: false,
    dairy_free: false,
    satisfaction_score: 4.3,
    available: true
  },
  {
    id: "4",
    name: "Grilled Salmon",
    category: "Dinner",
    price: 22.99,
    description: "Wild-caught salmon with roasted vegetables and lemon herb butter",
    allergens: ["fish", "dairy"],
    vegetarian: false,
    popular: true,
    sessions: ["Dinner Service", "Special Events"],
    franchise_id: "1",
    gluten_free: true,
    dairy_free: false,
    satisfaction_score: 4.9,
    available: true
  },
  {
    id: "5",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 8.99,
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    allergens: ["gluten", "dairy", "eggs"],
    vegetarian: true,
    popular: true,
    sessions: ["Dinner Service", "Weekend Brunch", "Special Events"],
    franchise_id: "1",
    gluten_free: false,
    dairy_free: false,
    satisfaction_score: 5.0,
    available: true
  }
];

export const useDiningData = () => {
  const { currentUser } = useAuthRedirect();
  const { selectedFranchiseId, isSuperAdmin } = useFranchiseSelector();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  
  // Load menu items when franchise selection changes
  useEffect(() => {
    loadMenuItems();
  }, [selectedFranchiseId]);
  
  const loadMenuItems = async () => {
    setIsLoading(true);
    try {
      let franchiseFilter = selectedFranchiseId;
      
      // Non-superadmins can only see their own franchise
      if (!isSuperAdmin && currentUser?.franchiseId) {
        franchiseFilter = currentUser.franchiseId;
      }
      
      const items = await fetchMenuItems(franchiseFilter !== 'all' ? franchiseFilter : undefined);
      
      // If we have real data, use it
      if (items && items.length > 0) {
        setMenuItems(items);
        setUseMockData(false);
      } else {
        // Otherwise use mock data
        console.log("No menu items found in database or error occurred, using mock data");
        setMenuItems(mockMenuItems);
        setUseMockData(true);
      }
    } catch (error) {
      console.error("Error loading menu items:", error);
      toast.error("Failed to load real menu items, using demo data instead");
      setMenuItems(mockMenuItems);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMenuItem = async (menuItem: MenuItem) => {
    try {
      console.log("Starting save process for menu item:", menuItem);
      console.log("Selected sessions:", selectedSessions);

      if (useMockData) {
        // Mock implementation for demo
        const newMenuItem = { ...menuItem };
        if (menuItem.id) {
          // Update existing item
          setMenuItems(prevItems => 
            prevItems.map(item => item.id === menuItem.id ? { ...newMenuItem, sessions: selectedSessions } : item)
          );
          toast.success("Menu item updated successfully (demo)");
        } else {
          // Create new item
          const newId = Date.now().toString();
          setMenuItems(prevItems => [...prevItems, { ...newMenuItem, id: newId, sessions: selectedSessions }]);
          toast.success("Menu item created successfully (demo)");
        }
        return { ...menuItem, sessions: selectedSessions };
      }
      
      // Handle image upload if it's a File object
      if (menuItem.image_file) {
        const franchiseId = menuItem.franchise_id || selectedFranchiseId;
        if (franchiseId) {
          const imageUrl = await uploadMenuItemImage(menuItem.image_file, franchiseId);
          menuItem.image_url = imageUrl;
          delete menuItem.image_file; // Remove the File object after upload
        }
      }
      
      let savedMenuItem: MenuItem;
      
      if (menuItem.id) {
        // Update existing menu item
        savedMenuItem = await updateMenuItemWithSessions(
          menuItem, 
          selectedSessions
        );
      } else {
        // Create new menu item
        savedMenuItem = await createMenuItem({
          ...menuItem,
          franchise_id: menuItem.franchise_id || selectedFranchiseId,
        });
        
        // After creating, associate with selected sessions
        if (selectedSessions.length > 0) {
          await updateMenuItemWithSessions(
            savedMenuItem,
            selectedSessions
          );
        }
      }
      
      // Show success message
      toast.success(menuItem.id ? "Menu item updated successfully" : "Menu item created successfully");
      
      // Reload menu items to ensure we have the latest data
      await loadMenuItems();
      
      return savedMenuItem;
    } catch (error) {
      console.error("Error in handleSaveMenuItem:", error);
      toast.error("Failed to save menu item. Please try again.");
      throw error;
    }
  };

  // Handle deletion of a menu item
  const handleDeleteMenuItem = async (menuItemId: string) => {
    try {
      if (useMockData) {
        // Mock implementation for demo
        setMenuItems(prev => prev.filter(item => item.id !== menuItemId));
        toast.success("Menu item deleted successfully (demo)");
        return true;
      }

      await deleteMenuItem(menuItemId);
      
      // Show success message
      toast.success("Menu item deleted successfully");
      
      // Reload menu items
      await loadMenuItems();
      
      return true;
    } catch (error) {
      console.error("Error in handleDeleteMenuItem:", error);
      toast.error("Failed to delete menu item. Please try again.");
      throw error;
    }
  };

  const getAvailableSessions = () => {
    // Return the dining schedule entries in a format suitable for the SessionsTab
    return diningSchedule.map(session => ({
      id: session.id.toString(),
      name: session.name,
      type: session.menu.replace(' Menu', '')
    }));
  };

  // Function to handle assigning menu items to sessions via drag and drop or other UI
  const handleAssignItemToSession = async (itemId: string, sessionId: number) => {
    try {
      if (useMockData) {
        // Mock implementation for demo
        const sessionName = diningSchedule.find(s => s.id === sessionId)?.name || "";
        setMenuItems(prev => prev.map(item => {
          if (item.id === itemId) {
            const updatedSessions = [...(item.sessions || [])];
            if (!updatedSessions.includes(sessionName)) {
              updatedSessions.push(sessionName);
            }
            return { ...item, sessions: updatedSessions };
          }
          return item;
        }));
        return true;
      }

      await addMenuItemToSession(itemId, sessionId.toString());
      
      // Show success message
      toast.success("Menu item assigned to session successfully");
      
      // Reload menu items
      await loadMenuItems();
      
      return true;
    } catch (error) {
      console.error("Error in handleAssignItemToSession:", error);
      toast.error("Failed to assign menu item to session. Please try again.");
      throw error;
    }
  };

  // Function to handle toggling a session for a menu item
  const handleToggleSessionForMenuItem = async (itemId: string, sessionId: string) => {
    try {
      setIsLoading(true);

      if (useMockData) {
        // Mock implementation for demo
        const sessionName = diningSchedule.find(s => s.id.toString() === sessionId)?.name || "";
        setMenuItems(prev => prev.map(item => {
          if (item.id === itemId) {
            const sessions = [...(item.sessions || [])];
            const sessionIndex = sessions.indexOf(sessionName);
            
            if (sessionIndex >= 0) {
              // Remove session
              sessions.splice(sessionIndex, 1);
              toast.success(`Menu item removed from ${sessionName}`);
            } else {
              // Add session
              sessions.push(sessionName);
              toast.success(`Menu item added to ${sessionName}`);
            }
            return { ...item, sessions };
          }
          return item;
        }));
        return true;
      }

      // Get current sessions for this menu item
      const currentSessions = await getMenuItemSessions(itemId);
      const isAlreadyAssigned = currentSessions.includes(sessionId);

      if (isAlreadyAssigned) {
        // Remove from session
        await updateMenuItemAvailability(itemId, sessionId, false);
        toast.success("Menu item removed from session");
      } else {
        // Add to session
        await addMenuItemToSession(itemId, sessionId);
        toast.success("Menu item added to session");
      }

      // Reload menu items to refresh data
      await loadMenuItems();
      return true;
    } catch (error) {
      console.error("Error toggling session for menu item:", error);
      toast.error("Failed to update session assignment");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function that uses the utility function to render session badges
  const renderSessionBadges = (sessions?: string[]) => {
    return renderSessionBadgesJSX(sessions);
  };

  return {
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
    renderSessionBadges,
    handleAssignItemToSession,
    handleToggleSessionForMenuItem,
    loadMenuItems,
    useMockData
  };
};

// Export the static data for reuse in other components
export { diningSchedule, guestPreferences, sessionCategories };

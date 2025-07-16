
import { MenuItem } from "@/types/menuTypes";
import { toast } from "sonner";

export interface ValidationErrors {
  [key: string]: string;
}

export const validateMenuItemForm = (
  name: string,
  category: string,
  price: string,
  selectedFranchise: string | undefined,
  isSuperAdmin: boolean,
  selectedSessions: string[],
  visitedTabs: { [key: string]: boolean },
  allTabsVisited: boolean
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};
  
  if (!name.trim()) {
    errors.name = "Menu item name is required";
  }
  
  if (!category) {
    errors.category = "Category is required";
  }
  
  if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    errors.price = "Please enter a valid price";
  }
  
  if (isSuperAdmin && !selectedFranchise) {
    errors.franchise = "Please select a franchise";
  }

  // Validate sessions tab
  if (selectedSessions.length === 0) {
    errors.sessions = "Please assign the item to at least one session";
    toast.error("Please assign the menu item to at least one session");
  }
  
  // Warn about unvisited tabs if not all have been viewed
  if (!allTabsVisited) {
    const tabMessages = [];
    if (!visitedTabs.dietary) tabMessages.push("Dietary Info");
    if (!visitedTabs.sessions) tabMessages.push("Session Assignment");
    
    if (tabMessages.length > 0) {
      toast.error(`Please review the following tabs: ${tabMessages.join(", ")}`);
      errors.tabs = "Please review all tabs before submitting";
    }
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

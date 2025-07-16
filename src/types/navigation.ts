
import { LucideIcon } from "lucide-react";

export type UserRole = "superadmin" | "franchise_owner" | "franchise_manager" | "guest";

export interface NavItem {
  title: string;
  name: string;
  href: string;
  icon: LucideIcon;
  roles?: Array<UserRole>;
  category?: "dining" | string;
}

// For backward compatibility
export type NavigationItem = NavItem;

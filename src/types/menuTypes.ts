
import { Session } from "./sessionTypes";

export interface MenuItem {
  id: string; // Changed from string | number to just string to match UUID in database
  name: string;
  category: string;
  price: number;
  description: string;
  allergens: string[];
  vegetarian: boolean;
  popular: boolean;
  sessions?: string[];
  franchise_id?: string;
  image_url?: string;
  image_file?: File; // Add a separate property for File objects
  gluten_free?: boolean;
  dairy_free?: boolean;
  satisfaction_score?: number;
  available?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuSessionMapping {
  id: string;
  menu_item_id: string;
  session_id: string;
  available: boolean;
  created_at: string;
}

export interface SessionCategory {
  id: number;
  name: string;
  sessions: string[];
}

export interface MenuSummary {
  total_items: number;
  assigned_sessions: number;
  special_requests: number;
}

export type MenuItemCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Special';

export type DietaryRestriction = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Dairy-Free';

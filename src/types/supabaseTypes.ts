
import { Database } from '@/integrations/supabase/types';

// Define custom type for dynamic table access (when TypeScript types aren't available)
export type CustomSupabaseQueryBuilder = {
  select: (columns?: string) => {
    eq: (column: string, value: any) => {
      single: () => Promise<{ data: any; error: any }>;
      returns: <T>(transform?: (data: any) => T) => {
        data: T | null;
        error: any;
      };
    };
    in: (column: string, values: any[]) => {
      returns: <T>(transform?: (data: any) => T) => {
        data: T | null;
        error: any;
      };
    };
    returns: <T>(transform?: (data: any) => T) => Promise<{
      data: T | null;
      error: any;
    }>;
    maybeSingle: () => Promise<{ data: any; error: any }>;
    order: (column: string, options?: { ascending?: boolean }) => {
      returns: <T>(transform?: (data: any) => T) => Promise<{
        data: T | null;
        error: any;
      }>;
    };
  };
  insert: (values: any) => {
    select: () => {
      returns: <T>(transform?: (data: any) => T) => Promise<{
        data: T | null;
        error: any;
      }>;
    };
  };
  update: (values: any) => {
    eq: (column: string, value: any) => {
      returns: <T>(transform?: (data: any) => T) => Promise<{
        data: T | null;
        error: any;
      }>;
    };
    select: () => {
      returns: <T>(transform?: (data: any) => T) => Promise<{
        data: T | null;
        error: any;
      }>;
    };
  };
  delete: () => {
    eq: (column: string, value: any) => Promise<{ data: any; error: any }>;
    match: (criteria: Record<string, any>) => Promise<{ data: any; error: any }>;
  };
};

// Helper function to create a typed menu session map interface
export const getMenuSessionMap = (supabase: any): CustomSupabaseQueryBuilder => {
  return supabase.from('menu_session_map') as unknown as CustomSupabaseQueryBuilder;
};

// Define interfaces for menu session map
export interface MenuSessionMapRow {
  id: string;
  menu_id: string; 
  session_id: string;
  created_at?: string;
}

// Type for RPC function result with menu items by session
export interface SessionMenuItemsResult {
  session_id: string;
  menu_item: {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    allergens: string[];
    vegetarian: boolean;
    popular: boolean;
    image_url?: string;
    gluten_free?: boolean;
    dairy_free?: boolean;
    satisfaction_score?: number;
    available?: boolean;
    created_at?: string;
    updated_at?: string;
    franchise_id?: string;
  };
}

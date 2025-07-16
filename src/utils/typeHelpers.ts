
import { supabase } from "@/integrations/supabase/client";

// Generic interface for raw query results
interface RawQueryResult<T> {
  data: T[] | null;
  error: any;
}

// Execute RPC function with type safety
export const executeRPC = async <T = any>(
  functionName: string, 
  params: Record<string, any> = {}
): Promise<{ data: T | null; error: any }> => {
  try {
    // Use any type assertion to bypass TypeScript type checking for RPC calls
    const result = await (supabase as any).rpc(functionName, params);
    return { data: result.data as T, error: result.error };
  } catch (error) {
    console.error(`Error executing RPC function ${functionName}:`, error);
    return { data: null, error };
  }
};

// Create a reusable menu-session mapper
export const createMenuSessionMapper = () => {
  // Select all menu-session mappings
  const select = async <T = any>(): Promise<RawQueryResult<T>> => {
    try {
      // Use direct table access with type assertion
      const result = await (supabase as any)
        .from('menu_session_map')
        .select('*');
      
      return { data: result.data as T[] | null, error: result.error };
    } catch (error) {
      console.error("Error in select:", error);
      return { data: null, error };
    }
  };
  
  // Select mappings by session ID
  const selectBySessionId = async <T = any>(sessionId: string): Promise<RawQueryResult<T>> => {
    try {
      // Use direct table access with type assertion
      const result = await (supabase as any)
        .from('menu_session_map')
        .select('*')
        .eq('session_id', sessionId);
          
      return { 
        data: result.data as T[] | null, 
        error: result.error 
      };
    } catch (error) {
      console.error("Error in selectBySessionId:", error);
      return { data: null, error };
    }
  };
  
  // Select mappings by menu ID
  const selectByMenuId = async <T = any>(menuId: string): Promise<RawQueryResult<T>> => {
    try {
      // Use direct table access with type assertion
      const result = await (supabase as any)
        .from('menu_session_map')
        .select('*')
        .eq('menu_id', menuId);
          
      return { 
        data: result.data as T[] | null, 
        error: result.error 
      };
    } catch (error) {
      console.error("Error in selectByMenuId:", error);
      return { data: null, error };
    }
  };
  
  // Check if a mapping exists
  const checkExists = async (menuId: string, sessionId: string): Promise<boolean> => {
    try {
      const { data } = await (supabase as any)
        .from('menu_session_map')
        .select('id')
        .eq('menu_id', menuId)
        .eq('session_id', sessionId)
        .maybeSingle();
      
      return !!data;
    } catch (error) {
      console.error("Error in checkExists:", error);
      return false;
    }
  };
  
  // Insert a new mapping
  const insert = async (mapping: { menu_id: string; session_id: string }): Promise<RawQueryResult<any>> => {
    try {
      const result = await (supabase as any)
        .from('menu_session_map')
        .insert(mapping)
        .select();
      
      return { data: result.data, error: result.error };
    } catch (error) {
      console.error("Error in insert:", error);
      return { data: null, error };
    }
  };
  
  // Remove a mapping
  const remove = async (menuId: string, sessionId: string): Promise<RawQueryResult<any>> => {
    try {
      const result = await (supabase as any)
        .from('menu_session_map')
        .delete()
        .eq('menu_id', menuId)
        .eq('session_id', sessionId);
      
      return { data: result.data, error: result.error };
    } catch (error) {
      console.error("Error in remove:", error);
      return { data: null, error };
    }
  };
  
  // Return all mapper functions
  return {
    select,
    selectBySessionId,
    selectByMenuId,
    checkExists,
    insert,
    remove
  };
};

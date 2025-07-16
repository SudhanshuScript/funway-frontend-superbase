
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    // First try using the edge function
    const { data, error } = await supabase.functions.invoke('check-table-exists', {
      body: { tableName }
    });
    
    if (error) {
      console.error("Error checking if table exists using edge function:", error);
      
      // Fallback to checking manually by trying to query the table
      // Note: This will only work if the table has rows and the user has access
      try {
        const { count, error: countError } = await supabase
          .from(tableName as any)
          .select('*', { count: 'exact', head: true });
          
        if (countError) {
          console.error(`Error querying table ${tableName}:`, countError);
          return false;
        }
        
        return true; // If we get here, the table exists and is accessible
      } catch (queryError) {
        console.error("Error in fallback table check:", queryError);
        return false;
      }
    }
    
    return data?.exists || false;
  } catch (error) {
    console.error("Unexpected error checking if table exists:", error);
    return false;
  }
}

// React hook for checking table existence
export function useTableExists(tableName: string) {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const check = async () => {
      try {
        setIsLoading(true);
        const result = await checkTableExists(tableName);
        setExists(result);
      } catch (error) {
        console.error(`Error checking if table ${tableName} exists:`, error);
        setExists(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    check();
  }, [tableName]);
  
  return { exists, isLoading };
}

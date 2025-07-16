
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { tableName } = await req.json();
    
    if (!tableName) {
      return new Response(
        JSON.stringify({ error: "Missing tableName parameter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create a Supabase client with the Deno runtime
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Try to query for the table's existence using an RPC function
    try {
      const { data: rpcData, error: rpcError } = await supabaseClient.rpc(
        'check_table_exists', 
        { table_name: tableName }
      );
      
      if (!rpcError) {
        return new Response(
          JSON.stringify({ exists: !!rpcData, method: "rpc" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (rpcErr) {
      console.error("RPC check failed:", rpcErr);
    }
    
    // Fallback to information_schema query
    try {
      const { data, error } = await supabaseClient
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .maybeSingle();
        
      if (!error) {
        return new Response(
          JSON.stringify({ exists: !!data, method: "information_schema" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (infoErr) {
      console.error("Information schema check failed:", infoErr);
    }
    
    // Last resort - try direct query
    try {
      // Using a count query to just check existence without fetching data
      const { count, error } = await supabaseClient
        .from(tableName)
        .select('*', { count: 'exact', head: true });
        
      // If there's no error, the table exists (even if count is 0)
      return new Response(
        JSON.stringify({ exists: !error, count, method: "direct_query" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (directErr) {
      console.error("Direct query failed:", directErr);
      
      // If all methods fail, assume the table doesn't exist
      return new Response(
        JSON.stringify({ exists: false, method: "all_failed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: String(error), exists: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});


// Supabase Edge Function for Session Management
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: req.headers.get("Authorization")! } },
      }
    );

    // Get session data from database - this ensures the session fetch logic is consistent
    if (req.method === "GET") {
      const { data, error } = await supabaseClient
        .from("sessions")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Create a new session
    if (req.method === "POST") {
      const { session } = await req.json();

      // Make sure we have required fields
      if (!session.name || !session.type || !session.start_date || !session.start_time) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Missing required fields for session",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("sessions")
        .insert([
          {
            ...session,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        }
      );
    }

    // Update an existing session
    if (req.method === "PUT") {
      const { session, id } = await req.json();

      if (!id) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Session ID is required for updates",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("sessions")
        .update({
          ...session,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Deactivate a session
    if (req.method === "PATCH") {
      const { id, reason, deactivated_by } = await req.json();

      if (!id || !reason) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Session ID and reason are required for deactivation",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("sessions")
        .update({
          is_active: false,
          deactivation_reason: reason,
          deactivated_by,
          deactivated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Handle any other HTTP methods
    return new Response(
      JSON.stringify({
        success: false,
        error: `Method ${req.method} not allowed`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

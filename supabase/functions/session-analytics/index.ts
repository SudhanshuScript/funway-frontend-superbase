
// Supabase Edge Function for Session Analytics
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsEvent {
  eventType: string;
  sessionId?: string;
  userId?: string;
  franchiseId?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

interface SessionAnalyticsRequest {
  sessionIds?: string[];
  franchiseId?: string;
  startDate?: string;
  endDate?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    // Track analytics events
    if (req.method === "POST" && req.url.includes("/track")) {
      const { event } = await req.json() as { event: AnalyticsEvent };
      
      if (!event || !event.eventType) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid event data" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      // Log the event for debugging
      console.log("Received analytics event:", event);
      
      // Add timestamp if not provided
      if (!event.timestamp) {
        event.timestamp = new Date().toISOString();
      }
      
      // Store the event in Supabase (analytics events table would be created if needed)
      // This is just a stub for now, replace with actual implementation when a dedicated analytics table is created
      
      return new Response(
        JSON.stringify({ success: true, message: "Event tracked successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get analytics data in batch
    if (req.method === "POST" && req.url.includes("/batch")) {
      const params = await req.json() as SessionAnalyticsRequest;
      
      // This is where we'd fetch analytics data from Supabase based on the provided params
      // For now, return mock data
      
      const mockBatchResponse = {
        sessions: (params.sessionIds || []).map(id => ({
          sessionId: id,
          occupancy: Math.floor(Math.random() * 100),
          feedback: {
            averageRating: 3.5 + (Math.random() * 1.5),
            count: Math.floor(Math.random() * 30),
            highlights: [
              "Great service",
              "Amazing views",
              "Food was excellent"
            ],
            issues: [
              "Too windy",
              "Service was slow"
            ]
          },
          channelBreakdown: {
            website: Math.floor(Math.random() * 30),
            walkIn: Math.floor(Math.random() * 10),
            dashboard: Math.floor(Math.random() * 15),
            offers: Math.floor(Math.random() * 8)
          },
          offersRedeemed: Math.floor(Math.random() * 10),
          repeatGuests: Math.floor(Math.random() * 8),
          revenue: Math.floor(Math.random() * 20000) + 5000,
          trend: {
            lastWeek: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : -Math.floor(Math.random() * 20),
            lastMonth: Math.random() > 0.5 ? Math.floor(Math.random() * 50) : -Math.floor(Math.random() * 30)
          }
        }))
      };
      
      return new Response(
        JSON.stringify({ success: true, data: mockBatchResponse }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get general session analytics
    if (req.method === "GET" || req.method === "POST") {
      const url = new URL(req.url);
      const franchiseId = url.searchParams.get('franchiseId') || undefined;
      let startDate = url.searchParams.get('startDate');
      let endDate = url.searchParams.get('endDate');
      
      if (!startDate) {
        // Default to last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        startDate = thirtyDaysAgo.toISOString().split('T')[0];
      }
      
      if (!endDate) {
        // Default to today
        endDate = new Date().toISOString().split('T')[0];
      }
      
      // This would fetch analytics data from Supabase
      // For now, return mock data
      
      const mockAnalytics = {
        summary: {
          totalSessions: 123,
          activeSessions: 98,
          upcomingSessions: 45,
          totalBookings: 876,
          totalCancellations: 67,
          utilizationRate: 0.78, // 78%
          averageRating: 4.6,
        },
        topSessions: [
          { id: "1", name: "Morning Brunch", bookingRate: 0.92, revenue: 78500, guests: 156 },
          { id: "2", name: "Evening Special", bookingRate: 0.84, revenue: 92000, guests: 184 },
          { id: "3", name: "Lunch Express", bookingRate: 0.71, revenue: 45000, guests: 90 }
        ],
        underperforming: [
          { id: "4", name: "Late Night Dinner", bookingRate: 0.32, revenue: 18000, guests: 36 },
          { id: "5", name: "Afternoon Tea", bookingRate: 0.41, revenue: 12500, guests: 25 }
        ],
        trendData: Array.from({ length: 30 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 29 + i);
          return {
            date: date.toISOString().split('T')[0],
            bookings: Math.floor(Math.random() * 40 + 10),
            cancellations: Math.floor(Math.random() * 8),
            noShows: Math.floor(Math.random() * 5),
          };
        }),
        channelDistribution: {
          website: 45,
          walkIn: 15,
          dashboard: 30,
          offers: 10
        },
        repeatGuestRate: 0.32, // 32% of guests are repeat customers
        franchiseId: franchiseId || "all"
      };
      
      return new Response(
        JSON.stringify({ success: true, data: mockAnalytics }),
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

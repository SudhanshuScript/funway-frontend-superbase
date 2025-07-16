
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OfferAnalytics {
  id: string;
  name: string;
  code: string;
  sentCount: number;
  viewedCount: number;
  redeemedCount: number;
  conversionRate: number;
}

interface OfferAnalyticsRequest {
  offerIds: string[];
  franchiseId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

interface OfferAnalyticsResponse {
  analytics: OfferAnalytics[];
  summary: {
    totalSent: number;
    totalViewed: number;
    totalRedeemed: number;
    averageConversion: number;
  };
}

// Mock database for offer analytics data
const mockOfferAnalytics: Record<string, OfferAnalytics> = {
  "OFF-001": {
    id: "OFF-001",
    name: "Weekend Special",
    code: "WEEKEND20",
    sentCount: 100,
    viewedCount: 78,
    redeemedCount: 45,
    conversionRate: 45
  },
  "OFF-002": {
    id: "OFF-002",
    name: "Family Package",
    code: "FAMILY15",
    sentCount: 50,
    viewedCount: 48,
    redeemedCount: 32,
    conversionRate: 64
  },
  "OFF-003": {
    id: "OFF-003",
    name: "Birthday Special",
    code: "BIRTHDAY25",
    sentCount: 80,
    viewedCount: 45,
    redeemedCount: 28,
    conversionRate: 35
  },
  "OFF-004": {
    id: "OFF-004",
    name: "First-Time Guest",
    code: "FIRST30",
    sentCount: 100,
    viewedCount: 89,
    redeemedCount: 67,
    conversionRate: 67
  },
  "OFF-005": {
    id: "OFF-005",
    name: "Early Bird",
    code: "EARLY10",
    sentCount: 50,
    viewedCount: 30,
    redeemedCount: 22,
    conversionRate: 44
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Processing offer analytics request");
    
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    const requestData: OfferAnalyticsRequest = await req.json();
    console.log("Request data:", JSON.stringify(requestData));
    
    // Validate request
    if (!requestData.offerIds || !Array.isArray(requestData.offerIds)) {
      return new Response(
        JSON.stringify({ error: "Invalid request. offerIds array is required." }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Get analytics for requested offer IDs
    const analytics: OfferAnalytics[] = requestData.offerIds
      .filter(id => mockOfferAnalytics[id]) // Filter out IDs that don't exist
      .map(id => mockOfferAnalytics[id]);
    
    // Calculate summary statistics
    const summary = analytics.reduce((acc, offer) => {
      acc.totalSent += offer.sentCount;
      acc.totalViewed += offer.viewedCount;
      acc.totalRedeemed += offer.redeemedCount;
      return acc;
    }, {
      totalSent: 0,
      totalViewed: 0,
      totalRedeemed: 0,
      averageConversion: 0
    });
    
    // Calculate average conversion rate
    summary.averageConversion = summary.totalSent > 0 
      ? (summary.totalRedeemed / summary.totalSent) * 100 
      : 0;
    
    const response: OfferAnalyticsResponse = {
      analytics,
      summary
    };
    
    console.log("Sending response with analytics for", analytics.length, "offers");
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error processing offer analytics:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);

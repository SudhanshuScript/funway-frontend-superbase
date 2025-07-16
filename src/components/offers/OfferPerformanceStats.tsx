
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, BarChart3, Percent, CalendarClock, Award, AlertTriangle } from "lucide-react";
import { OfferAnalyticsData } from '@/types/offerTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface OfferPerformanceStatsProps {
  analytics: OfferAnalyticsData;
}

const OfferPerformanceStats = ({ analytics }: OfferPerformanceStatsProps) => {
  // Sample chart data
  const chartData = [
    { name: 'WEEKEND20', redemptions: 45, sent: 100 },
    { name: 'FAMILY15', redemptions: 32, sent: 50 },
    { name: 'BIRTHDAY25', redemptions: 28, sent: 80 },
    { name: 'FIRST30', redemptions: 67, sent: 100 },
    { name: 'EARLY10', redemptions: 22, sent: 50 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Ticket className="h-5 w-5 mr-2 text-primary" />
              <div className="text-2xl font-bold">{analytics.activeOffers}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Actively running promotions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Ticket className="h-5 w-5 mr-2 text-primary" />
              <div className="text-2xl font-bold">{analytics.totalRedemptions}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all offers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Percent className="h-5 w-5 mr-2 text-primary" />
              <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average across all offers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarClock className="h-5 w-5 mr-2 text-amber-500" />
              <div className="text-2xl font-bold">{analytics.expiringOffers}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Within next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-500" />
              <div className="text-xl font-bold truncate">{analytics.topOffer.name}</div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {analytics.topOffer.conversionRate.toFixed(1)}% conversion
              </Badge>
              <p className="text-xs font-mono">{analytics.topOffer.code}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              <div className="text-xl font-bold truncate">{analytics.lowestOffer.name}</div>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                  {analytics.lowestOffer.conversionRate.toFixed(1)}% conversion
                </Badge>
                <p className="text-xs font-mono">{analytics.lowestOffer.code}</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-amber-600">
                      View suggestion
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{analytics.lowestOffer.suggestion}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Offer Redemption Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip
                  formatter={(value, name) => {
                    if (name === 'redemptions') return [`${value} Redemptions`, 'Redeemed'];
                    return [`${value} Sent`, 'Total Sent'];
                  }}
                  labelFormatter={(name) => `Offer: ${name}`}
                />
                <Bar dataKey="sent" name="Sent" fill="#8884d8" opacity={0.4} />
                <Bar dataKey="redemptions" name="Redeemed" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferPerformanceStats;

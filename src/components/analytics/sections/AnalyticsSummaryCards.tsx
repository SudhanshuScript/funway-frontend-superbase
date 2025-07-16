
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Users, Calendar, Percent, Star, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';

const AnalyticsSummaryCards = () => {
  // This would typically come from your data store or API
  const metrics = [
    {
      title: "Total Revenue",
      value: "$92,436",
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign className="h-4 w-4" />,
      tooltip: "Total revenue for the selected period"
    },
    {
      title: "Total Guests",
      value: "2,846",
      change: "+8.4%",
      isPositive: true,
      icon: <Users className="h-4 w-4" />,
      tooltip: "Total number of guests in the selected period"
    },
    {
      title: "Sessions",
      value: "184",
      change: "+5.2%",
      isPositive: true,
      icon: <Calendar className="h-4 w-4" />,
      tooltip: "Total number of sessions held"
    },
    {
      title: "Avg. Satisfaction",
      value: "4.6",
      change: "+0.2",
      isPositive: true,
      icon: <Star className="h-4 w-4" />,
      tooltip: "Average guest satisfaction rating (out of 5)"
    },
    {
      title: "Conversion Rate",
      value: "48.2%",
      change: "-2.1%",
      isPositive: false,
      icon: <Percent className="h-4 w-4" />,
      tooltip: "Percentage of leads converted to bookings"
    },
    {
      title: "Avg. Duration",
      value: "1h 42m",
      change: "+8m",
      isPositive: true,
      icon: <Clock className="h-4 w-4" />,
      tooltip: "Average duration of guest stay"
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className={`absolute top-0 right-0 h-1 w-16 ${metric.isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {metric.icon}
                  <span>{metric.title}</span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0">
                      <span className="sr-only">Info</span>
                      <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{metric.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`flex items-center mt-1 text-xs ${
                metric.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default AnalyticsSummaryCards;

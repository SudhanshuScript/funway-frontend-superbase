
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Coffee, Clock, Users } from "lucide-react";

interface DiningMetric {
  id: number;
  name: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
}

const metrics: DiningMetric[] = [
  {
    id: 1,
    name: "Menu Items",
    value: 0,
    subtitle: "0 popular items",
    icon: Utensils,
  },
  {
    id: 2,
    name: "Dining Sessions",
    value: 0,
    subtitle: "Daily capacity: 0 guests",
    icon: Clock,
  },
  {
    id: 3,
    name: "Special Requests",
    value: 0,
    subtitle: "Vegetarian: 0% of guests",
    icon: Users,
  },
  {
    id: 4,
    name: "Guest Satisfaction",
    value: "0/5.0",
    subtitle: "Based on 0 reviews",
    icon: Coffee,
  },
];

export function DiningMetrics({ menuItems, diningSchedule, guestPreferences }: {
  menuItems: any[];
  diningSchedule: any[];
  guestPreferences: any[];
}) {
  const getMetrics = () => {
    return metrics.map(metric => {
      switch (metric.name) {
        case "Menu Items":
          return {
            ...metric,
            value: menuItems.length,
            subtitle: `${menuItems.filter(item => item.popular).length} popular items`,
          };
        case "Dining Sessions":
          return {
            ...metric,
            value: diningSchedule.length,
            subtitle: `Daily capacity: ${diningSchedule.reduce((sum, item) => sum + item.capacity, 0)} guests`,
          };
        case "Special Requests":
          return {
            ...metric,
            value: guestPreferences.reduce((sum, pref) => sum + pref.count, 0),
            subtitle: `${guestPreferences[0].preference}: ${guestPreferences[0].percentage}% of guests`,
          };
        case "Guest Satisfaction":
          return {
            ...metric,
            value: "4.8/5.0",
            subtitle: "Based on 320 reviews",
          };
        default:
          return metric;
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {getMetrics().map((metric) => (
        <Card key={metric.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <metric.icon className="h-5 w-5 mr-2 text-primary" />
              <div className="text-2xl font-bold">{metric.value}</div>
            </div>
            {metric.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

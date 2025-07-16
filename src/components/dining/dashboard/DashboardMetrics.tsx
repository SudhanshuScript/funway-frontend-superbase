
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed, Calendar, Award, Salad, ThumbsUp } from "lucide-react";
import { MenuItem } from "@/types/menuTypes";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard = ({ title, value, icon, description, trend }: MetricCardProps) => (
  <Card className="border-[#2A2A2A] shadow-md hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="rounded-full p-3 bg-[#7B61FF]/10">
          {icon}
        </div>
        
        {trend && (
          <div className={`text-xs font-medium flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

interface DashboardMetricsProps {
  menuItems: MenuItem[];
  onAddMenuItem: () => void;
}

export function DashboardMetrics({ menuItems, onAddMenuItem }: DashboardMetricsProps) {
  // Calculate metrics from menu items
  const totalMenuItems = menuItems.length;
  
  // Count unique sessions across all menu items
  const uniqueSessions = new Set<string>();
  menuItems.forEach(item => {
    if (item.sessions && item.sessions.length > 0) {
      item.sessions.forEach(session => uniqueSessions.add(session));
    }
  });
  
  // Count popular menu items
  const popularItems = menuItems.filter(item => item.popular).length;
  
  // Calculate average satisfaction score
  const scoresSum = menuItems.reduce((sum, item) => 
    sum + (item.satisfaction_score || 0), 0);
  const averageSatisfaction = totalMenuItems > 0 
    ? (scoresSum / totalMenuItems).toFixed(1) 
    : 'N/A';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dining Dashboard</h2>
        <Button onClick={onAddMenuItem} className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Menu Items"
          value={totalMenuItems}
          icon={<UtensilsCrossed className="h-5 w-5 text-[#7B61FF]" />}
          trend={{ value: 5, isPositive: true }}
        />
        
        <MetricCard
          title="Assigned Sessions"
          value={uniqueSessions.size}
          icon={<Calendar className="h-5 w-5 text-[#7B61FF]" />}
        />
        
        <MetricCard
          title="Popular Items"
          value={popularItems}
          icon={<Award className="h-5 w-5 text-amber-500" />}
          description={`${Math.round((popularItems / totalMenuItems) * 100) || 0}% of menu`}
        />
        
        <MetricCard
          title="Dietary Requests"
          value="24"
          icon={<Salad className="h-5 w-5 text-green-500" />}
          description="In past 7 days"
        />
        
        <MetricCard
          title="Satisfaction Score"
          value={averageSatisfaction}
          icon={<ThumbsUp className="h-5 w-5 text-blue-500" />}
          description="Based on guest feedback"
          trend={{ value: 2.5, isPositive: true }}
        />
      </div>
    </div>
  );
}

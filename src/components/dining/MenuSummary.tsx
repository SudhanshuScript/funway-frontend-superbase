
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem, MenuSummary } from "@/types/menuTypes";
import { Book, Calendar, Star } from "lucide-react";

interface MenuSummaryCardsProps {
  menuItems: MenuItem[];
}

export function MenuSummaryCards({ menuItems }: MenuSummaryCardsProps) {
  // Calculate summary statistics
  const totalItems = menuItems.length;
  
  // Count unique sessions across all menu items
  const uniqueSessions = new Set<string>();
  menuItems.forEach(item => {
    if (item.sessions && Array.isArray(item.sessions)) {
      item.sessions.forEach(session => uniqueSessions.add(session));
    }
  });
  const assignedSessions = uniqueSessions.size;
  
  // Count popular items
  const popularItems = menuItems.filter(item => item.popular).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard 
        title="Total Menu Items" 
        value={totalItems} 
        icon={<Book className="h-5 w-5" />}
        description="Active items in your menu"
        colorClass="text-blue-500 bg-blue-100 dark:bg-blue-950"
      />
      
      <SummaryCard 
        title="Assigned Sessions" 
        value={assignedSessions} 
        icon={<Calendar className="h-5 w-5" />}
        description="Sessions with menu items"
        colorClass="text-purple-500 bg-purple-100 dark:bg-purple-950"
      />
      
      <SummaryCard 
        title="Popular Items" 
        value={popularItems} 
        icon={<Star className="h-5 w-5" />}
        description="Featured and high-demand items"
        colorClass="text-amber-500 bg-amber-100 dark:bg-amber-950"
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  colorClass: string;
}

function SummaryCard({ title, value, icon, description, colorClass }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClass}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

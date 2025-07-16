
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/menuTypes";
import { CalendarClock, Plus, Edit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SessionCardProps {
  session: {
    id: number;
    name: string;
    time: string;
    days: string | string[];
    menu: string;
    description?: string;
  };
  menuItems: MenuItem[];
  onAddMenuItem: () => void;
  onEditMenuItem: (item: MenuItem) => void;
}

export function SessionCard({ session, menuItems, onAddMenuItem, onEditMenuItem }: SessionCardProps) {
  // Format days for display
  const formatDays = (days: string | string[]) => {
    // Handle string (already formatted) case
    if (typeof days === 'string') {
      return days;
    }
    
    // Handle array case
    if (Array.isArray(days)) {
      if (days.length === 0) return "Special events";
      if (days.length === 7) return "Every day";
      if (days.length >= 5 && days.includes("Monday") && days.includes("Friday")) {
        return "Weekdays";
      }
      if (days.length === 2 && days.includes("Saturday") && days.includes("Sunday")) {
        return "Weekends";
      }
      return days.join(", ");
    }
    
    // Fallback case
    return "Flexible schedule";
  };

  return (
    <Card className="border-[#2A2A2A] overflow-hidden hover:border-[#7B61FF]/30 transition-colors">
      <CardHeader className="bg-[#1A1F2C]/10 border-b border-[#2A2A2A] pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="h-4 w-4 text-[#7B61FF]" />
            {session.name}
            <Badge variant="outline" className="ml-2 bg-[#7B61FF]/10 text-xs">
              {session.menu}
            </Badge>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onAddMenuItem} className="h-8">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-col mt-1">
          <span className="text-xs text-muted-foreground">{formatDays(session.days)} · {session.time}</span>
          {session.description && (
            <p className="text-xs text-muted-foreground mt-1">{session.description}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {menuItems.length > 0 ? (
          <ScrollArea className="h-[120px]">
            <ul className="divide-y divide-[#2A2A2A]">
              {menuItems.map(item => (
                <li key={item.id} className="px-4 py-2 hover:bg-[#1A1F2C]/5">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">${item.price.toFixed(2)} · {item.category}</span>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEditMenuItem(item)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-[100px]">
            <p className="text-sm text-muted-foreground">No menu items assigned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

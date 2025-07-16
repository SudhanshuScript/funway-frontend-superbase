
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/menuTypes";
import { SessionCard } from "../sessions/SessionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

interface SessionsTabContentProps {
  sessions: any[]; // Using the existing diningSchedule type
  menuItems: MenuItem[];
  onAddMenuItemToSession: (sessionId: string) => void;
  onEditMenuItem: (item: MenuItem) => void;
}

export function SessionsTabContent({
  sessions,
  menuItems,
  onAddMenuItemToSession,
  onEditMenuItem
}: SessionsTabContentProps) {
  // Group menu items by session
  const menuItemsBySession = sessions.reduce((acc, session) => {
    const sessionItems = menuItems.filter(item => 
      item.sessions?.includes(session.name)
    );
    acc[session.id] = sessionItems;
    return acc;
  }, {} as Record<string, MenuItem[]>);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dining Sessions</h2>
        <Button className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Session
        </Button>
      </div>
      
      <Card className="border-[#2A2A2A] shadow-md">
        <CardHeader className="bg-[#1A1F2C]/30 border-b border-[#2A2A2A]">
          <CardTitle>Manage Sessions and Their Menu Items</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[680px] pr-4">
            <div className="space-y-6">
              {sessions.map((session) => (
                <SessionCard 
                  key={session.id}
                  session={session}
                  menuItems={menuItemsBySession[session.id] || []}
                  onAddMenuItem={() => onAddMenuItemToSession(session.id.toString())}
                  onEditMenuItem={onEditMenuItem}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

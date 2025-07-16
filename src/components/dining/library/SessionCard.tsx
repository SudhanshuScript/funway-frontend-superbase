
import React from "react";
import { Badge } from "@/components/ui/badge";

interface SessionCardProps {
  session: {
    id: number;
    name: string;
    days: string;
    time: string;
    menu: string;
  };
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, sessionId: number, sessionName: string) => void;
}

export function SessionCard({ session, onDragOver, onDrop }: SessionCardProps) {
  return (
    <div
      key={session.id}
      className="border rounded-md p-3 bg-muted/20 hover:bg-muted/30 transition-colors"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, session.id, session.name)}
    >
      <div className="font-medium">{session.name}</div>
      <div className="text-xs text-muted-foreground mt-1">{session.days} · {session.time}</div>
      
      <div className="mt-2 text-xs">
        <Badge variant="outline">
          {session.menu}
        </Badge>
      </div>
    </div>
  );
}

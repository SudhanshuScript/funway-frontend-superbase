
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, Calendar } from "lucide-react";
import { DiningSession } from "@/types/diningTypes";

interface SessionsListProps {
  diningSchedule: DiningSession[];
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, sessionId: string, sessionName: string) => void;
}

export function SessionsList({ 
  diningSchedule,
  handleDragOver,
  handleDrop
}: SessionsListProps) {
  return (
    <div>
      <Card className="border-[#2A2A2A]">
        <CardHeader className="bg-[#1A1F2C]/10 border-b border-[#2A2A2A] pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-[#7B61FF]" />
            Dining Sessions
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag & drop menu items to assign
          </p>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {diningSchedule.map(session => (
              <div
                key={session.id}
                className="border rounded-md p-4 bg-muted/5 hover:bg-muted/20 transition-colors border-[#2A2A2A] hover:border-[#7B61FF]/30 relative drop-target"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("bg-[#7B61FF]/10", "border-[#7B61FF]", "drag-over");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("bg-[#7B61FF]/10", "border-[#7B61FF]", "drag-over");
                }}
                onDrop={(e) => {
                  e.currentTarget.classList.remove("bg-[#7B61FF]/10", "border-[#7B61FF]", "drag-over");
                  handleDrop(e, session.id.toString(), session.name);
                }}
              >
                <div className="font-medium text-base mb-1">{session.name}</div>
                <div className="text-xs text-muted-foreground mb-2 flex items-center">
                  <Calendar className="h-3 w-3 mr-1 inline" />
                  {typeof session.days === 'string' ? session.days : Array.isArray(session.days) ? session.days.join(', ') : 'Flexible'} · {session.time}
                </div>
                
                <Badge variant="outline" className="bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/30 text-xs">
                  {session.menu}
                </Badge>
                
                <div className="absolute inset-0 rounded-md pointer-events-none border-2 border-dashed border-transparent drop-indicator">
                  <div className="flex items-center justify-center h-full opacity-0">
                    <span className="text-xs font-medium text-[#7B61FF]">Drop menu item here</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-[#7B61FF]/5 border border-[#7B61FF]/20 rounded-lg mt-4 text-sm">
        <div className="flex items-start">
          <InfoIcon className="h-4 w-4 text-[#7B61FF] mr-2 mt-0.5" />
          <div>
            <div className="font-medium text-[#7B61FF] mb-1">Pro Tip</div>
            <p className="text-xs text-[#7B61FF]/80">
              Drag menu items onto sessions to quickly assign them, or click on a menu item to edit and assign it to multiple sessions at once.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

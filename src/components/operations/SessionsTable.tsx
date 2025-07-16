
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Utensils, FerrisWheel } from "lucide-react";

interface SessionsTableProps {
  sessions: Array<{
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    capacity: number;
    booked: number;
    status: string;
    type: string;
  }>;
  activeSessionId: number;
  onSelectSession: (sessionId: number) => void;
}

export function SessionsTable({ sessions, activeSessionId, onSelectSession }: SessionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Booked</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow 
            key={session.id}
            className={activeSessionId === session.id ? "bg-muted/50" : ""}
          >
            <TableCell className="font-medium">
              <div className="flex items-center">
                {session.type === "airline" && <Plane className="h-4 w-4 mr-2 text-airline-light" />}
                {session.type === "dining" && <Utensils className="h-4 w-4 mr-2 text-dining" />}
                {session.type === "amusement" && <FerrisWheel className="h-4 w-4 mr-2 text-amusement" />}
                {session.name}
              </div>
            </TableCell>
            <TableCell>{session.startTime} - {session.endTime}</TableCell>
            <TableCell>{session.capacity}</TableCell>
            <TableCell>{session.booked}</TableCell>
            <TableCell>
              <Badge variant={session.status === "Active" ? "default" : "secondary"}>
                {session.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant={activeSessionId === session.id ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectSession(session.id)}
              >
                {activeSessionId === session.id ? "Selected" : "Select"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

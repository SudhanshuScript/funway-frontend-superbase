
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  shift: string;
}

interface StaffOnDutyCardProps {
  staff: StaffMember[];
}

export function StaffOnDutyCard({ staff }: StaffOnDutyCardProps) {
  return (
    <div className="space-y-4">
      {staff.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <Badge variant="outline">{member.shift} Shift</Badge>
        </div>
      ))}
    </div>
  );
}

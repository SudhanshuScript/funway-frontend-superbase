
import React from "react";
import { Users } from "lucide-react";
import { useUserRole } from "@/providers/UserRoleProvider";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

// Mock active users data - in a real app this would come from a backend service
const mockActiveUsers = [
  { email: "superadmin@flydining.com", role: "superadmin", franchise: null },
  { email: "franchise@flydining.com", role: "franchise_owner", franchise: "SkyBistro Central" },
  { email: "manager@flydining.com", role: "franchise_manager", franchise: "FunWay East" }
];

export function ActiveUserIndicator() {
  const { currentUser, isRole } = useUserRole();
  
  // Filter active users based on role permissions
  const visibleUsers = isRole("superadmin") 
    ? mockActiveUsers 
    : mockActiveUsers.filter(user => 
        user.email === currentUser?.email || 
        (isRole("franchise_owner") && user.franchise === currentUser?.franchiseId)
      );
  
  const formatUserDisplay = (user: typeof mockActiveUsers[0]) => {
    const emailPrefix = user.email.split('@')[0];
    const roleName = user.role.replace('_', ' ');
    
    if (user.franchise) {
      return `${roleName} (${user.franchise}) - ${user.email}`;
    }
    return `${roleName} - ${user.email}`;
  };
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-1 cursor-default border border-border/50 rounded-md px-3 py-1.5 shadow-sm" aria-label={`${visibleUsers.length} active users`} tabIndex={0}>
          <Users className="h-4 w-4 text-primary" aria-hidden="true" />
          <Badge variant="outline" className="px-1.5 py-0 text-xs">
            {visibleUsers.length}
          </Badge>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <h4 className="text-sm font-medium mb-3 border-b pb-2">Logged-in Users</h4>
        <ul className="space-y-2">
          {visibleUsers.map((user, index) => (
            <li key={index} className="text-xs flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true"></div>
              {formatUserDisplay(user)}
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}

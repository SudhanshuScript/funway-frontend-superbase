
import React from "react";
import { format } from "date-fns";
import { 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger
} from "@/components/ui/tooltip";
import { 
  User, MoreHorizontal, ClipboardEdit, 
  Calendar, UserCheck, MessageSquare,
  Mail, Phone
} from "lucide-react";
import { 
  StaffMember, 
  getAccessLevelColor, 
  getStatusColor,
  getDepartmentColor 
} from "@/types/staffTypes";

interface StaffTableRowProps {
  member: StaffMember;
  onViewProfile: (staff: StaffMember) => void;
  onEditStaff: (staffId: string) => void;
  handleStatusChange: (staffId: string, newStatus: string) => void;
}

const StaffTableRow: React.FC<StaffTableRowProps> = ({ 
  member, 
  onViewProfile, 
  onEditStaff, 
  handleStatusChange 
}) => {
  return (
    <TableRow 
      key={member.id}
      className="cursor-pointer hover:bg-muted"
      onClick={() => onViewProfile(member)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-primary/10 text-primary">
              {member.full_name.split(' ').map(name => name[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{member.full_name}</div>
            <div className="text-xs text-muted-foreground">
              Added {format(new Date(member.created_at), "MMM d, yyyy")}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div>{member.designation}</div>
          {member.department && (
            <Badge className={`${getDepartmentColor(member.department)} text-xs font-normal`}>
              {member.department}
            </Badge>
          )}
          <div className="flex items-center gap-1 mt-1">
            <Badge className={`${getAccessLevelColor(member.access_level)} text-xs`}>
              {member.access_level}
            </Badge>
            {member.telegram_access && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                      <MessageSquare className="h-3 w-3" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Telegram Access Enabled</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{member.contact_number}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{member.franchise_name}</span>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(member.status)}>
          {member.status === "active" ? "Active" : 
           member.status === "inactive" ? "Inactive" :
           member.status === "on_leave" ? "On Leave" : "Training"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onViewProfile(member);
            }}>
              <User className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEditStaff(member.id);
            }}>
              <ClipboardEdit className="h-4 w-4 mr-2" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                const newStatus = member.status === "active" ? "on_leave" : "active";
                handleStatusChange(member.id, newStatus);
              }}
            >
              {member.status === "active" ? (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Mark On Leave
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Mark Active
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default StaffTableRow;


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
  User, MoreHorizontal, ClipboardEdit, 
  Send, Mail, Phone, Tag
} from "lucide-react";
import { Guest, getGuestTypeColor } from "@/types/guestTypes";

interface GuestTableRowProps {
  guest: Guest;
  onViewProfile: (guest: Guest) => void;
  onSendOffer: (guestId: string) => void;
}

const GuestTableRow: React.FC<GuestTableRowProps> = ({ 
  guest, 
  onViewProfile, 
  onSendOffer
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <TableRow 
      key={guest.id}
      className="cursor-pointer hover:bg-muted"
      onClick={() => onViewProfile(guest)}
    >
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-primary/10 text-primary">
              {guest.name.split(' ').map(name => name[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{guest.name}</div>
            <div className="text-xs text-muted-foreground">
              {guest.guestId} • Added {formatDate(guest.createdAt)}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{guest.email}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{guest.phone}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <span className="text-sm">{guest.franchiseName}</span>
      </TableCell>
      <TableCell className="py-3">
        <Badge 
          variant="outline" 
          className={getGuestTypeColor(guest.guestType)}
        >
          {guest.guestType}
        </Badge>
      </TableCell>
      <TableCell className="text-center py-3">
        <span className="font-medium">{guest.totalVisits}</span>
      </TableCell>
      <TableCell className="py-3">
        {formatDate(guest.lastVisit)}
      </TableCell>
      <TableCell className="py-3">
        <div className="flex flex-wrap gap-1">
          {guest.preferences && guest.preferences.length > 0 ? (
            guest.preferences.slice(0, 2).map((pref, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {pref.preference}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">None</span>
          )}
          {guest.preferences && guest.preferences.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{guest.preferences.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="py-3">
        {guest.loyalty ? (
          <span className="font-medium">{guest.loyalty.availablePoints} pts</span>
        ) : (
          <span className="text-xs text-muted-foreground">0 pts</span>
        )}
      </TableCell>
      <TableCell className="py-3">
        {guest.upcomingBookings > 0 ? (
          <Badge variant="default" className="whitespace-nowrap">{guest.upcomingBookings} booking</Badge>
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )}
      </TableCell>
      <TableCell className="text-right py-3">
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
              onViewProfile(guest);
            }}>
              <User className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              // Edit guest logic would go here
            }}>
              <ClipboardEdit className="h-4 w-4 mr-2" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onSendOffer(guest.id);
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Offer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                // Add tag logic would go here
              }}
            >
              <Tag className="h-4 w-4 mr-2" />
              Add Tag
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default GuestTableRow;

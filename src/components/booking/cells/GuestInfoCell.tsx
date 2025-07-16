
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from 'lucide-react';
import { GuestType } from '@/types/bookingTypes';

interface GuestInfoCellProps {
  guestName: string;
  guestType: GuestType;
  contactDetails?: {
    email?: string;
    phone?: string;
  };
  onGuestClick?: () => void;
}

export function GuestInfoCell({ 
  guestName, 
  guestType, 
  contactDetails, 
  onGuestClick 
}: GuestInfoCellProps) {
  return (
    <>
      <div 
        className="text-sm font-medium cursor-pointer hover:text-primary"
        onClick={onGuestClick}
      >
        {guestName}
        
        {guestType !== 'Regular' && (
          <Badge variant="outline" className="ml-2">
            {guestType}
          </Badge>
        )}
      </div>
      <div className="text-xs text-muted-foreground mt-1 space-y-1">
        {contactDetails?.email && (
          <div className="flex items-center">
            <Mail className="w-3 h-3 mr-1" />
            <span className="truncate max-w-[200px]">{contactDetails.email}</span>
          </div>
        )}
        {contactDetails?.phone && (
          <div className="flex items-center">
            <Phone className="w-3 h-3 mr-1" />
            <span>{contactDetails.phone}</span>
          </div>
        )}
      </div>
    </>
  );
}

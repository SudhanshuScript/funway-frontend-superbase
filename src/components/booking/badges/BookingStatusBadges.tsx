
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Bell, Check, ChevronDown } from 'lucide-react';
import { BookingStatus, PaymentStatus, UpcomingBooking } from '@/types/bookingTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  switch (status) {
    case 'confirmed':
      return <Badge variant="default" className="bg-green-500">Confirmed</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="text-red-500 border-red-500">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  bookingId?: string;
  onStatusChange?: (bookingId: string, newStatus: PaymentStatus) => Promise<boolean>;
  booking?: UpcomingBooking;
  isEditable?: boolean;
}

export function PaymentStatusBadge({ 
  status, 
  bookingId, 
  onStatusChange,
  booking,
  isEditable = false
}: PaymentStatusBadgeProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getBadgeStyles = (paymentStatus: PaymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return "bg-green-500 hover:bg-green-600";
      case 'pending':
        return "text-amber-500 border-amber-500 hover:bg-amber-100 hover:text-amber-600";
      case 'partial':
        return "text-blue-500 border-blue-500 hover:bg-blue-100 hover:text-blue-600";
      case 'refunded':
        return "text-gray-500 border-gray-500 hover:bg-gray-100 hover:text-gray-600";
      default:
        return "";
    }
  };

  const handleStatusChange = async (newStatus: PaymentStatus) => {
    if (!bookingId || !onStatusChange) return;
    
    setIsUpdating(true);
    try {
      const success = await onStatusChange(bookingId, newStatus);
      if (success) {
        toast.success(`Payment status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update payment status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isEditable || !onStatusChange || !bookingId) {
    // Non-editable badge
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'partial':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Partially Paid</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  }

  // Editable dropdown version
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <Badge 
          variant={status === 'paid' ? "default" : "outline"} 
          className={`cursor-pointer flex items-center gap-1 ${getBadgeStyles(status)}`}
        >
          {status === 'paid' ? 'Paid' : 
           status === 'partial' ? 'Partially Paid' : 'Pending'}
          <ChevronDown className="h-3 w-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleStatusChange('pending')}
          className="text-amber-500 focus:text-amber-600 focus:bg-amber-50"
        >
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusChange('partial')}
          className="text-blue-500 focus:text-blue-600 focus:bg-blue-50"
        >
          Partially Paid
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusChange('paid')}
          className="text-green-500 focus:text-green-600 focus:bg-green-50"
        >
          <Check className="mr-1 h-4 w-4" />
          Paid
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ReminderStatusIndicatorProps {
  reminderStatus: 'sent' | 'not_sent' | 'responded' | 'no_response';
}

export function ReminderStatusIndicator({ reminderStatus }: ReminderStatusIndicatorProps) {
  if (reminderStatus === 'sent') {
    return (
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <Bell className="w-3 h-3 mr-1" />
        <span>Reminder sent</span>
      </div>
    );
  }
  return null;
}

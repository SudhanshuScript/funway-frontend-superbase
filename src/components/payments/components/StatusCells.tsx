
import React from 'react';
import { Check, Clock, AlertTriangle } from "lucide-react";
import { StatusBadge } from './StatusBadge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaymentStatusCellProps {
  status: string;
  id: string;
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export function PaymentStatusCell({ status, id, onStatusUpdate }: PaymentStatusCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <StatusBadge status={status} className="cursor-pointer hover:opacity-80" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onStatusUpdate(id, "Paid")}>
          <Check className="h-4 w-4 mr-2 text-green-600" />
          Mark as Paid
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusUpdate(id, "Partial")}>
          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
          Mark as Partial
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusUpdate(id, "Pending")}>
          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
          Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusUpdate(id, "Overdue")}>
          <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
          Mark as Overdue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface CheckInStatusCellProps {
  status: string | undefined;
  id: string;
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export function CheckInStatusCell({ status, id, onStatusUpdate }: CheckInStatusCellProps) {
  if (!status) {
    return (
      <StatusBadge status="Not Applicable" className="bg-gray-100 text-gray-700" />
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <StatusBadge status={status} className="cursor-pointer hover:opacity-80" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onStatusUpdate(id, "Checked-In")}>
          <Check className="h-4 w-4 mr-2 text-green-600" />
          Mark as Checked-In
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusUpdate(id, "Awaited")}>
          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
          Mark as Awaited
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

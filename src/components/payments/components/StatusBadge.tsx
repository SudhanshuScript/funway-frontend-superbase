
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertTriangle, X } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Paid":
      case "Checked-In":
        return "bg-green-100 border-green-500 text-green-700";
      case "Pending":
      case "Partial":
      case "Awaited":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "Overdue":
        return "bg-red-100 border-red-500 text-red-700";
      case "Refunded":
        return "bg-gray-100 border-gray-500 text-gray-700";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
      case "Paid":
      case "Checked-In":
        return <Check className="h-3 w-3 mr-1" />;
      case "Pending":
      case "Partial":
      case "Awaited":
        return <Clock className="h-3 w-3 mr-1" />;
      case "Overdue":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case "Refunded":
        return <X className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusColor(status)} flex items-center px-3 py-1 ${className}`}
    >
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
}

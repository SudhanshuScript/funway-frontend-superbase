
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface RevenueFilterDropdownProps {
  onViewTypeChange: (viewType: string) => void;
}

export function RevenueFilterDropdown({ onViewTypeChange }: RevenueFilterDropdownProps) {
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[120px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
            <span>Revenue</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onViewTypeChange("revenue")}>
            Revenue
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewTypeChange("bookings")}>
            Bookings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewTypeChange("occupancy")}>
            Occupancy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewTypeChange("guests")}>
            Guests
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

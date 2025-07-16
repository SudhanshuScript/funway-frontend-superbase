
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown } from "lucide-react";

interface DateFilterDropdownProps {
  onDateFilterChange: (dateFilter: string) => void;
}

export function DateFilterDropdown({ onDateFilterChange }: DateFilterDropdownProps) {
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[120px]">
            <Calendar className="h-4 w-4" />
            <span>Today</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onDateFilterChange("today")}>
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilterChange("week")}>
            This Week
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilterChange("month")}>
            This Month
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilterChange("quarter")}>
            This Quarter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilterChange("year")}>
            This Year
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilterChange("custom")}>
            Custom Range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

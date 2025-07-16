
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";

interface LocationFilterDropdownProps {
  onLocationChange: (location: string) => void;
}

export function LocationFilterDropdown({ onLocationChange }: LocationFilterDropdownProps) {
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[120px]">
            <Globe className="h-4 w-4" />
            <span>Global</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onLocationChange("global")}>
            Global
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLocationChange("franchise")}>
            By Franchise
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLocationChange("country")}>
            By Country
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLocationChange("city")}>
            By City
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

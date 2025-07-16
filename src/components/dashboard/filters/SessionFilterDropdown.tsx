
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Building, ChevronDown } from "lucide-react";

interface SessionFilterDropdownProps {
  onSessionTypeChange: (sessionType: string) => void;
}

export function SessionFilterDropdown({ onSessionTypeChange }: SessionFilterDropdownProps) {
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[120px]">
            <Building className="h-4 w-4" />
            <span>All Sessions</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onSessionTypeChange("all")}>
            All Sessions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSessionTypeChange("regular")}>
            Regular Sessions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSessionTypeChange("special")}>
            Special Events
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

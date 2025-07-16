
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ViewTypeTabsProps {
  onViewTypeChange: (viewType: string) => void;
}

export function ViewTypeTabs({ onViewTypeChange }: ViewTypeTabsProps) {
  return (
    <div className="bg-muted rounded-md flex">
      <Button 
        variant="ghost" 
        size="sm" 
        className="rounded-l-md hover:bg-muted-foreground/10 bg-primary/10"
        onClick={() => onViewTypeChange("overview")}
      >
        <Filter className="h-4 w-4 mr-1" />
        Overview
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="hover:bg-muted-foreground/10"
        onClick={() => onViewTypeChange("franchise")}
      >
        Franchise Specific
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="rounded-r-md hover:bg-muted-foreground/10"
        onClick={() => onViewTypeChange("operational")}
      >
        Operational
      </Button>
    </div>
  );
}

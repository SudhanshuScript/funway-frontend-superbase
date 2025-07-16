
import React from "react";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        className="h-8 w-8"
        onClick={() => setViewMode("list")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        className="h-8 w-8"
        onClick={() => setViewMode("grid")}
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  );
}

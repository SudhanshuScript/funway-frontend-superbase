
import React from "react";
import { LocationFilterDropdown } from "./filters/LocationFilterDropdown";
import { DateFilterDropdown } from "./filters/DateFilterDropdown";
import { RevenueFilterDropdown } from "./filters/RevenueFilterDropdown";
import { SessionFilterDropdown } from "./filters/SessionFilterDropdown";
import { ViewTypeTabs } from "./filters/ViewTypeTabs";
import { ActionButtons } from "./filters/ActionButtons";

interface CompactFilterBarProps {
  onLocationChange: (location: string) => void;
  onDateFilterChange: (dateFilter: string) => void;
  onViewTypeChange: (viewType: string) => void;
  onSessionTypeChange: (sessionType: string) => void;
  onExport: () => void;
  onGenerateReport: () => void;
}

export function CompactFilterBar({
  onLocationChange,
  onDateFilterChange,
  onViewTypeChange,
  onSessionTypeChange,
  onExport,
  onGenerateReport
}: CompactFilterBarProps) {
  return (
    <div className="w-full bg-background border rounded-lg p-4 mb-4 flex flex-wrap justify-between items-center gap-2">
      <div className="flex flex-wrap gap-2">
        <LocationFilterDropdown onLocationChange={onLocationChange} />
        <DateFilterDropdown onDateFilterChange={onDateFilterChange} />
        <RevenueFilterDropdown onViewTypeChange={onViewTypeChange} />
        <SessionFilterDropdown onSessionTypeChange={onSessionTypeChange} />
      </div>

      <div className="flex gap-2">
        <ViewTypeTabs onViewTypeChange={onViewTypeChange} />
        <ActionButtons 
          onExport={onExport}
          onGenerateReport={onGenerateReport}
        />
      </div>
    </div>
  );
}

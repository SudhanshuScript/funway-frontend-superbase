
import React from "react";
import SearchInput from "./filters/SearchInput";
import GuestTypeSelect from "./filters/GuestTypeSelect";
import FranchiseSelect from "./filters/FranchiseSelect";
import AdvancedFiltersPopover from "./filters/AdvancedFiltersPopover";
import { GuestFilters } from "@/types/guestTypes";

interface GuestFiltersPanelProps {
  filters: GuestFilters;
  updateFilters: (filters: Partial<GuestFilters>) => void;
  resetFilters: () => void;
  availablePreferences: string[];
}

const GuestFiltersPanel: React.FC<GuestFiltersPanelProps> = ({
  filters,
  updateFilters,
  resetFilters,
  availablePreferences
}) => {
  const activeFilterCount = 
    (filters.franchiseId !== "all" ? 1 : 0) +
    (filters.guestType !== "all" ? 1 : 0) +
    (filters.lastVisitRange !== null ? 1 : 0) +
    (filters.minBookings !== null || filters.maxBookings !== null ? 1 : 0) +
    (filters.preferences.length > 0 ? 1 : 0) +
    (filters.loyaltyRange?.min !== null || filters.loyaltyRange?.max !== null ? 1 : 0) +
    (filters.offerRedeemed !== null ? 1 : 0);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-2">
      <SearchInput 
        value={filters.search}
        onChange={(value) => updateFilters({ search: value })}
      />
      
      <GuestTypeSelect
        value={filters.guestType}
        onChange={(value) => updateFilters({ guestType: value })}
      />

      <FranchiseSelect
        value={filters.franchiseId}
        onChange={(value) => updateFilters({ franchiseId: value })}
      />

      <AdvancedFiltersPopover
        filters={filters}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
        availablePreferences={availablePreferences}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
};

export default GuestFiltersPanel;

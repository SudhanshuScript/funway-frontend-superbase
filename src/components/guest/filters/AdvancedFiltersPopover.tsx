
import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GuestFilters } from "@/types/guestTypes";
import DateRangeFilter from "./DateRangeFilter";
import VisitFrequencyFilter from "./VisitFrequencyFilter";
import LoyaltyRangeFilter from "./LoyaltyRangeFilter";
import PreferencesFilter from "./PreferencesFilter";
import OfferRedeemedFilter from "./OfferRedeemedFilter";
import FilterActions from "./FilterActions";

interface AdvancedFiltersPopoverProps {
  filters: GuestFilters;
  updateFilters: (filters: Partial<GuestFilters>) => void;
  resetFilters: () => void;
  availablePreferences: string[];
  activeFilterCount: number;
}

const AdvancedFiltersPopover: React.FC<AdvancedFiltersPopoverProps> = ({
  filters,
  updateFilters,
  resetFilters,
  availablePreferences,
  activeFilterCount,
}) => {
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>(
    filters.lastVisitRange || { from: null, to: null }
  );

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    setDateRange(range);
    updateFilters({ lastVisitRange: range });
  };

  const handleClearDateRange = () => {
    updateFilters({ lastVisitRange: null });
    setDateRange({ from: null, to: null });
  };

  const handleVisitsRangeChange = (values: number[]) => {
    updateFilters({ minBookings: values[0], maxBookings: values[1] });
  };

  const handleClearVisitsRange = () => {
    updateFilters({ minBookings: null, maxBookings: null });
  };

  const handleLoyaltyRangeChange = (values: number[]) => {
    updateFilters({
      loyaltyRange: {
        min: values[0],
        max: values[1],
      },
    });
  };

  const handleClearLoyaltyRange = () => {
    updateFilters({ loyaltyRange: { min: null, max: null } });
  };

  const handleTogglePreference = (preference: string) => {
    const newPreferences = filters.preferences.includes(preference)
      ? filters.preferences.filter((p) => p !== preference)
      : [...filters.preferences, preference];
    updateFilters({ preferences: newPreferences });
  };

  const handleClearPreferences = () => {
    updateFilters({ preferences: [] });
  };

  const handleOfferRedeemedChange = (value: string) => {
    updateFilters({
      offerRedeemed:
        value === "yes" ? true : value === "no" ? false : null,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="grid gap-4 p-4">
          <DateRangeFilter 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onClearDateRange={handleClearDateRange}
          />

          <VisitFrequencyFilter
            minBookings={filters.minBookings}
            maxBookings={filters.maxBookings}
            onVisitsRangeChange={handleVisitsRangeChange}
            onClearVisitsRange={handleClearVisitsRange}
          />

          <LoyaltyRangeFilter
            loyaltyRange={filters.loyaltyRange}
            onLoyaltyRangeChange={handleLoyaltyRangeChange}
            onClearLoyaltyRange={handleClearLoyaltyRange}
          />

          <PreferencesFilter
            preferences={filters.preferences}
            availablePreferences={availablePreferences}
            onTogglePreference={handleTogglePreference}
            onClearPreferences={handleClearPreferences}
          />

          <OfferRedeemedFilter
            offerRedeemed={filters.offerRedeemed}
            onOfferRedeemedChange={handleOfferRedeemedChange}
          />

          <FilterActions onResetFilters={resetFilters} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdvancedFiltersPopover;

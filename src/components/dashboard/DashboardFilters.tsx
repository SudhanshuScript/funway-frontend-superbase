import React, { useState } from "react";
import { Calendar, Filter, Map, FileText, Download, Globe, Building, MapPin, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserRole } from "@/providers/UserRoleProvider";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export type DateFilterType = "today" | "week" | "month" | "quarter" | "year" | "custom";
export type ViewType = "overview" | "franchise" | "operational";
export type LocationType = "global" | "country" | "city" | "franchise";

interface DashboardFiltersProps {
  onDateFilterChange: (dateFilter: DateFilterType, dateRange?: DateRange | undefined) => void;
  onViewTypeChange: (viewType: ViewType) => void;
  onLocationChange: (locationType: LocationType, locationId?: string, countryCode?: string, cityName?: string) => void;
  onExport?: (format: "pdf" | "csv" | "excel") => void;
  onGenerateReport?: () => void;
  onSortByChange?: (value: string) => void;
  onSessionTypeChange?: (value: string) => void;
  selectedSortBy?: string;
  selectedSessionType?: string;
  selectedCountry?: string;
  selectedCity?: string;
}

// Mock data for countries and cities - in a real application, this would come from an API
const countries = [
  { code: "us", name: "United States" },
  { code: "ca", name: "Canada" },
  { code: "uk", name: "United Kingdom" },
  { code: "in", name: "India" },
  { code: "au", name: "Australia" }
];

const cities = {
  us: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  ca: ["Toronto", "Montreal", "Vancouver", "Calgary", "Ottawa"],
  uk: ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool"],
  in: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"],
  au: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"]
};

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  onDateFilterChange,
  onViewTypeChange,
  onLocationChange,
  onExport,
  onGenerateReport,
  onSortByChange,
  onSessionTypeChange,
  selectedSortBy = "revenue",
  selectedSessionType = "all",
  selectedCountry,
  selectedCity
}) => {
  const { currentUser, isRole } = useUserRole();
  const [dateFilter, setDateFilter] = useState<DateFilterType>("today");
  const [viewType, setViewType] = useState<ViewType>("overview");
  const [locationType, setLocationType] = useState<LocationType>("global");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(selectedCountry);
  const [city, setCity] = useState<string | undefined>(selectedCity);
  
  const handleDateFilterChange = (value: string) => {
    const filter = value as DateFilterType;
    setDateFilter(filter);
    onDateFilterChange(filter, filter === "custom" ? dateRange : undefined);
  };
  
  const handleViewTypeChange = (value: string) => {
    const view = value as ViewType;
    setViewType(view);
    onViewTypeChange(view);
  };
  
  const handleLocationChange = (value: string) => {
    const location = value as LocationType;
    setLocationType(location);
    onLocationChange(location, undefined, country, city);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
      setDateFilter("custom");
      onDateFilterChange("custom", range);
    }
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity(undefined); // Reset city when country changes
    onLocationChange("country", undefined, value, undefined);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    onLocationChange("city", undefined, country, value);
  };

  const handleSortByChange = (value: string) => {
    if (onSortByChange) {
      onSortByChange(value);
    }
  };

  const handleSessionTypeChange = (value: string) => {
    if (onSessionTypeChange) {
      onSessionTypeChange(value);
    }
  };

  // Display only filters appropriate for user's role
  const canSelectLocation = isRole(["superadmin", "franchise_owner"]);
  const canSelectView = isRole(["superadmin"]);
  const canExport = isRole(["superadmin", "franchise_owner"]);
  const canSelectCountryCity = isRole(["superadmin"]);

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            {/* Location Filter - Only for superadmin and franchise owners */}
            {canSelectLocation && (
              <div className="flex items-center">
                <Map className="h-4 w-4 mr-2 text-muted-foreground" />
                <Select
                  value={locationType}
                  onValueChange={handleLocationChange}
                  disabled={!isRole("superadmin") && locationType !== "franchise"}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {isRole("superadmin") && (
                      <>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="country">By Country</SelectItem>
                        <SelectItem value="city">By City</SelectItem>
                      </>
                    )}
                    <SelectItem value="franchise">
                      {isRole("franchise_owner") ? currentUser?.franchiseId || "My Franchise" : "By Franchise"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Country Selector - Only for superadmin */}
            {canSelectCountryCity && locationType !== "global" && locationType !== "franchise" && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <Select value={country} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* City Selector - Only for superadmin and when country is selected */}
            {canSelectCountryCity && country && locationType === "city" && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <Select value={city} onValueChange={handleCityChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities[country as keyof typeof cities]?.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Time Filter - Available to all roles */}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              {dateFilter === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="ml-2">
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
            
            {/* Sort By Filter */}
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <Select value={selectedSortBy} onValueChange={handleSortByChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="bookings">Bookings</SelectItem>
                  <SelectItem value="guests">Guest Type</SelectItem>
                  <SelectItem value="occupancy">Occupancy</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Session Type Filter */}
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
              <Select value={selectedSessionType} onValueChange={handleSessionTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Session Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="regular">Regular Sessions</SelectItem>
                  <SelectItem value="special">Special Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            {/* View Type Toggle - Only for superadmin */}
            {canSelectView && (
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <Tabs value={viewType} onValueChange={handleViewTypeChange} className="w-fit">
                  <TabsList className="grid grid-cols-3 w-[360px]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="franchise">Franchise Specific</TabsTrigger>
                    <TabsTrigger value="operational">Operational</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </div>

          {/* Export Options */}
          {canExport && onExport && (
            <div className="flex items-center gap-2 md:ml-4 mt-4 md:mt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onExport("pdf")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport("excel")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport("csv")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {onGenerateReport && (
                <Button variant="default" size="sm" onClick={onGenerateReport}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};


import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useUserRole } from "../providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { DashboardFilters } from "../components/dashboard/DashboardFilters";
import { FranchiseMetrics } from "../components/dashboard/FranchiseMetrics";
import MetricsOverview from "../components/dashboard/MetricsOverview";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { 
  DateFilterType,
  ViewType,
  LocationType
} from "../services/dashboard/types";
import { AdvancedInsightsSection } from "../components/dashboard/AdvancedInsightsSection";
import { SmartAlertSection } from "../components/dashboard/SmartAlertSection";
import { SpotBookingButton } from "../components/dashboard/SpotBookingButton";
import { CompactFilterBar } from "../components/dashboard/CompactFilterBar";

const Dashboard = () => {
  const { currentUser, isRole } = useUserRole();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilterType>("today");
  const [viewType, setViewType] = useState<ViewType>("overview");
  const [locationType, setLocationType] = useState<LocationType>("global");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("revenue");
  const [sessionType, setSessionType] = useState<string>("all");
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }
  
  const handleDateFilterChange = (filter: DateFilterType, range?: DateRange) => {
    setDateFilter(filter);
    if (range) {
      setDateRange(range);
    }
  };
  
  const handleViewTypeChange = (type: ViewType) => {
    setViewType(type);
  };
  
  const handleLocationChange = (type: LocationType, locationId?: string, countryCode?: string, cityName?: string) => {
    setLocationType(type);
    if (countryCode) setCountry(countryCode);
    if (cityName) setCity(cityName);
  };
  
  const handleExport = (format: "pdf" | "csv" | "excel") => {
    toast.success(`Exporting dashboard data as ${format.toUpperCase()}`);
  };
  
  const handleGenerateReport = () => {
    toast.success("Generating comprehensive dashboard report");
  };

  const handleViewFranchises = () => {
    toast.info("Viewing all franchises");
  };

  const handleFranchiseChange = (id: string) => {
    console.log('Selected franchise:', id);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
  };

  const handleSessionTypeChange = (value: string) => {
    setSessionType(value);
  };

  const handleViewDetailedReport = () => {
    navigate("/analytics");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <SpotBookingButton />
          </div>
        </div>

        {/* Add Compact Filter Bar at the top */}
        <CompactFilterBar
          onLocationChange={(type) => handleLocationChange(type as LocationType)}
          onDateFilterChange={(filter) => handleDateFilterChange(filter as DateFilterType)}
          onViewTypeChange={handleViewTypeChange}
          onSessionTypeChange={handleSessionTypeChange}
          onExport={() => handleExport("pdf")}
          onGenerateReport={handleGenerateReport}
        />

        {/* Moving MetricsOverview component with summary cards to appear right after the heading */}
        <MetricsOverview
          dateFilter={dateFilter}
          viewType={viewType}
          location={locationType}
          onViewFranchises={handleViewFranchises}
        />

        {/* Keep existing detailed filters and other components */}
        <DashboardFilters
          onDateFilterChange={handleDateFilterChange}
          onViewTypeChange={handleViewTypeChange}
          onLocationChange={handleLocationChange}
          onExport={handleExport}
          onGenerateReport={handleGenerateReport}
          onSortByChange={handleSortByChange}
          onSessionTypeChange={handleSessionTypeChange}
          selectedSortBy={sortBy}
          selectedSessionType={sessionType}
          selectedCountry={country}
          selectedCity={city}
        />

        {isRole(["superadmin", "franchise_owner"]) && (
          <SmartAlertSection 
            franchiseId={currentUser.franchiseId}
            role={currentUser.role}
          />
        )}

        <FranchiseMetrics
          franchiseId={currentUser.franchiseId}
          onFranchiseChange={handleFranchiseChange}
        />

        <AdvancedInsightsSection 
          dateFilter={dateFilter} 
          viewType={viewType}
          locationType={locationType}
          sortBy={sortBy}
          sessionType={sessionType}
          country={country}
          city={city}
          onViewDetailedReport={handleViewDetailedReport}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

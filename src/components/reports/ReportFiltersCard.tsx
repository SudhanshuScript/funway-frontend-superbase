
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportType, ReportFormat, ReportDateRange } from "@/utils/reportUtils";

interface ReportFiltersCardProps {
  reportType: ReportType;
  setReportType: (value: ReportType) => void;
  dateRange: ReportDateRange;
  setDateRange: (value: ReportDateRange) => void;
  franchiseId: string;
  setFranchiseId: (value: string) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  isLoading: boolean;
  reportGenerated: boolean;
  handleGenerateReport: () => void;
  handleExport: (format: ReportFormat) => void;
  isSuperAdmin: boolean;
  franchises: Array<{ id: string; name: string }>;
  selectedFranchiseId: string;
  handleFranchiseChange: (value: string) => void;
}

const ReportFiltersCard: React.FC<ReportFiltersCardProps> = ({
  reportType,
  setReportType,
  dateRange,
  setDateRange,
  franchiseId,
  setFranchiseId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isLoading,
  reportGenerated,
  handleGenerateReport,
  handleExport,
  isSuperAdmin,
  franchises,
  selectedFranchiseId,
  handleFranchiseChange,
}) => {
  const reportTypes = [
    { value: "sales", label: "Sales Report" },
    { value: "bookings", label: "Booking Trends Report" },
    { value: "sessions", label: "Session Performance Report" },
    { value: "addons", label: "Add-on Revenue Report" },
    { value: "guests", label: "Guest Type Summary" },
    { value: "targets", label: "Revenue vs Target Report" }
  ];

  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" }
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Report Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Report Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select 
              value={reportType} 
              onValueChange={(value) => setReportType(value as ReportType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select 
              value={dateRange} 
              onValueChange={(value) => setDateRange(value as ReportDateRange)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Franchise Selector - Only show if user is superadmin */}
          {isSuperAdmin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Franchise</label>
              <Select
                value={selectedFranchiseId}
                onValueChange={(value) => {
                  handleFranchiseChange(value);
                  setFranchiseId(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select franchise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Franchises</SelectItem>
                  {franchises.map((franchise) => (
                    <SelectItem key={franchise.id} value={franchise.id}>
                      {franchise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Custom Date Range - Only show if custom is selected */}
          {dateRange === "custom" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => setStartDate(date as Date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => setEndDate(date as Date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <Button onClick={handleGenerateReport} disabled={isLoading} className="shadow-sm">
            {isLoading ? "Generating..." : "Generate Report"}
          </Button>
          <Button 
            variant="outline" 
            disabled={!reportGenerated}
            onClick={() => handleExport('excel' as ReportFormat)}
          >
            <Download className="mr-2 h-4 w-4" aria-label="Download Excel" />
            Export as Excel
          </Button>
          <Button 
            variant="outline" 
            disabled={!reportGenerated}
            onClick={() => handleExport('pdf' as ReportFormat)}
          >
            <FileText className="mr-2 h-4 w-4" aria-label="Download PDF" />
            Export as PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFiltersCard;

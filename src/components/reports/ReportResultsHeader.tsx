
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ReportType, ReportDateRange, getReportTypeLabel, getDateRangeLabel } from "@/utils/reportUtils";
import { format } from "date-fns";

interface ReportResultsHeaderProps {
  reportType: ReportType;
  dateRange: ReportDateRange;
  startDate: Date;
  endDate: Date;
  isSuperAdmin: boolean;
  selectedFranchiseId: string;
  franchises: Array<{ id: string; name: string }>;
}

const ReportResultsHeader: React.FC<ReportResultsHeaderProps> = ({
  reportType,
  dateRange,
  startDate,
  endDate,
  isSuperAdmin,
  selectedFranchiseId,
  franchises,
}) => {
  // Format date for display
  const formatDateRange = () => {
    if (dateRange === "custom") {
      return `${format(startDate, "MMM dd, yyyy")} - ${format(endDate, "MMM dd, yyyy")}`;
    }
    
    return getDateRangeLabel(dateRange);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <h2 className="text-xl font-semibold">Report Results</h2>
      <Badge variant="outline" className="ml-2">
        {formatDateRange()}
      </Badge>
      <Badge variant="outline">
        {getReportTypeLabel(reportType)}
      </Badge>
      {isSuperAdmin && selectedFranchiseId !== "all" && (
        <Badge variant="outline">
          {franchises.find(f => f.id === selectedFranchiseId)?.name}
        </Badge>
      )}
    </div>
  );
};

export default ReportResultsHeader;

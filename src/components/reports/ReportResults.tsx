
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportType, getReportTypeLabel } from "@/utils/reportUtils";
import { format } from "date-fns";
import ReportMetricCards from "./ReportMetricCards";
import ReportVisualization from "./ReportVisualization";
import ReportDataTable from "./ReportDataTable";

interface ReportResultsProps {
  reportGenerated: boolean;
  reportType: ReportType;
  dateRange: string;
  reportData: any[];
  franchiseInfo?: {
    isSuperAdmin: boolean;
    selectedFranchiseId: string;
    franchises: Array<{ id: string; name: string }>;
  };
  startDate?: Date;
  endDate?: Date;
}

const ReportResults: React.FC<ReportResultsProps> = ({
  reportGenerated,
  reportType,
  dateRange,
  reportData,
  franchiseInfo,
  startDate,
  endDate,
}) => {
  if (!reportGenerated) {
    return null;
  }

  // Format date for display
  const formatDateRange = () => {
    if (dateRange === "custom" && startDate && endDate) {
      return `${format(startDate, "MMM dd, yyyy")} - ${format(endDate, "MMM dd, yyyy")}`;
    }
    return dateRange.charAt(0).toUpperCase() + dateRange.slice(1);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Report Results</h2>
        <Badge variant="outline" className="ml-2">
          {formatDateRange()}
        </Badge>
        <Badge variant="outline">{getReportTypeLabel(reportType)}</Badge>
        {franchiseInfo && franchiseInfo.isSuperAdmin && franchiseInfo.selectedFranchiseId !== "all" && (
          <Badge variant="outline">
            {franchiseInfo.franchises.find((f) => f.id === franchiseInfo.selectedFranchiseId)?.name}
          </Badge>
        )}
      </div>

      {/* Metric Cards */}
      <ReportMetricCards reportType={reportType} data={reportData} />

      <Tabs defaultValue="visualization">
        <TabsList>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="visualization" className="space-y-4">
          <ReportVisualization reportType={reportType} data={reportData} />
        </TabsContent>
        <TabsContent value="table" className="space-y-4">
          <ReportDataTable reportType={reportType} data={reportData} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ReportResults;

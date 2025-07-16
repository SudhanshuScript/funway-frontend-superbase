
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import useReports from "@/hooks/useReports";
import { ReportType } from "@/utils/reportUtils";
import ReportFiltersCard from "@/components/reports/ReportFiltersCard";
import ReportResultsHeader from "@/components/reports/ReportResultsHeader";
import ReportMetricCards from "@/components/reports/ReportMetricCards";
import ReportContentTabs from "@/components/reports/ReportContentTabs";

const Reports = () => {
  const { currentUser } = useUserRole();
  const { franchises, selectedFranchiseId, handleFranchiseChange, isSuperAdmin } = useFranchiseSelector();
  
  const {
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
    reportData,
    reportGenerated,
    handleGenerateReport,
    handleExport
  } = useReports();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate detailed business reports across different time periods
            </p>
          </div>
        </div>

        <ReportFiltersCard
          reportType={reportType}
          setReportType={setReportType}
          dateRange={dateRange}
          setDateRange={setDateRange}
          franchiseId={franchiseId}
          setFranchiseId={setFranchiseId}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          isLoading={isLoading}
          reportGenerated={reportGenerated}
          handleGenerateReport={handleGenerateReport}
          handleExport={handleExport}
          isSuperAdmin={isSuperAdmin}
          franchises={franchises}
          selectedFranchiseId={selectedFranchiseId}
          handleFranchiseChange={handleFranchiseChange}
        />

        {reportGenerated && (
          <>
            <ReportResultsHeader
              reportType={reportType as ReportType}
              dateRange={dateRange}
              startDate={startDate}
              endDate={endDate}
              isSuperAdmin={isSuperAdmin}
              selectedFranchiseId={selectedFranchiseId}
              franchises={franchises}
            />

            {/* Metric Cards */}
            <ReportMetricCards reportType={reportType as ReportType} data={reportData} />

            <ReportContentTabs
              reportType={reportType as ReportType}
              data={reportData}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;

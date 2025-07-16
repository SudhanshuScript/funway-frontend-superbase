
import React from "react";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import useReports from "@/hooks/useReports";
import { ReportFormat } from "@/utils/reportUtils";

import ReportFilters from "@/components/reports/ReportFilters";
import ReportExportOptions from "@/components/reports/ReportExportOptions";
import ReportResults from "@/components/reports/ReportResults";
import ReportHistory from "@/components/reports/ReportHistory";
import ReportHistoryToggle from "@/components/reports/ReportHistoryToggle";

interface ReportsSectionProps {
  // Add any props needed
}

const ReportsSection: React.FC<ReportsSectionProps> = () => {
  const { franchises, selectedFranchiseId, handleFranchiseChange, isSuperAdmin } = useFranchiseSelector();

  // Reports state and hooks
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
    reportHistory,
    showReportHistory,
    setShowReportHistory,
    handleGenerateReport,
    handleExport,
    handleRedownload,
    handleDeleteReport,
    handleClearHistory
  } = useReports();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reports Dashboard</h2>
        <div className="flex gap-2">
          <ReportHistoryToggle 
            showReportHistory={showReportHistory}
            setShowReportHistory={setShowReportHistory}
            reportHistoryCount={reportHistory.length}
          />
        </div>
      </div>

      {showReportHistory && reportHistory.length > 0 && (
        <ReportHistory
          reportHistory={reportHistory}
          showReportHistory={showReportHistory}
          setShowReportHistory={setShowReportHistory}
          handleRedownload={handleRedownload}
          handleDeleteReport={handleDeleteReport}
          handleClearHistory={handleClearHistory}
        />
      )}

      <div className="flex flex-col space-y-4">
        <ReportFilters
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
          handleGenerateReport={handleGenerateReport}
          isSuperAdmin={isSuperAdmin}
          franchises={franchises}
          selectedFranchiseId={selectedFranchiseId}
          handleFranchiseChange={handleFranchiseChange}
        />
        
        <div className="flex ml-auto">
          <ReportExportOptions
            reportGenerated={reportGenerated}
            handleExport={handleExport}
          />
        </div>
      </div>

      <ReportResults
        reportGenerated={reportGenerated}
        reportType={reportType}
        dateRange={dateRange}
        reportData={reportData}
        franchiseInfo={{
          isSuperAdmin,
          selectedFranchiseId,
          franchises
        }}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default ReportsSection;

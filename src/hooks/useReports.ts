import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  ReportType, 
  ReportDateRange, 
  ReportFormat,
  ReportFilters,
  ReportData,
  ReportHistoryItem,
} from '@/utils/reports/types';
import { generateReport } from '@/utils/reports/generateReport';
import { exportReport } from '@/utils/reports/exportReport';
import { getReportHistory, clearReportHistory } from '@/utils/reports/reportHistory';

export const useReports = () => {
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [dateRange, setDateRange] = useState<ReportDateRange>('today');
  const [franchiseId, setFranchiseId] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([]);
  const [showReportHistory, setShowReportHistory] = useState<boolean>(false);

  // Load report history on component mount
  useEffect(() => {
    setReportHistory(getReportHistory());
  }, []);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    
    try {
      const filters: ReportFilters = {
        reportType,
        dateRange,
        franchiseId: franchiseId !== 'all' ? franchiseId : undefined,
        startDate: dateRange === 'custom' ? startDate : undefined,
        endDate: dateRange === 'custom' ? endDate : undefined
      };
      
      const data = await generateReport(filters);
      setReportData(data);
      setReportGenerated(true);
      setReportHistory(getReportHistory()); // Refresh history when generating new report
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: ReportFormat) => {
    const filters: ReportFilters = {
      reportType,
      dateRange,
      franchiseId: franchiseId !== 'all' ? franchiseId : undefined,
      startDate: dateRange === 'custom' ? startDate : undefined,
      endDate: dateRange === 'custom' ? endDate : undefined
    };
    
    exportReport(reportData, format, filters);
    
    // Refresh report history after export
    setReportHistory(getReportHistory());
    toast.success(`Report exported successfully as ${format.toUpperCase()}`);
  };
  
  const handleRedownload = (report: ReportHistoryItem) => {
    // For demonstration purposes, we'll just show a toast
    toast.info(`Redownloading ${report.name} as ${report.format.toUpperCase()}`);
    
    // In a real application, you would fetch the report data again
    // and then export it using the original parameters
  };
  
  const handleDeleteReport = (reportId: string) => {
    // Get current history
    const currentHistory = getReportHistory();
    // Filter out the deleted report
    const updatedHistory = currentHistory.filter(report => report.id !== reportId);
    // Update local storage
    localStorage.setItem('flydining_report_history', JSON.stringify(updatedHistory));
    // Update state
    setReportHistory(updatedHistory);
    
    toast.success("Report removed from history");
  };
  
  const handleClearHistory = () => {
    clearReportHistory();
    setReportHistory([]);
    toast.success("Report history cleared");
  };

  return {
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
  };
};

export default useReports;

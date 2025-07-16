
import { saveAs } from 'file-saver';
import { downloadCSVReport } from '../exportUtils';
import { ReportData, ReportFilters, ReportFormat, ReportHistoryItem } from './types';
import { getReportTypeLabel, getDateRangeLabel } from './labelUtils';
import { addToReportHistory } from './reportHistory';

export const exportReport = (data: ReportData[], format: ReportFormat, filters: ReportFilters) => {
  // Generate a suitable filename based on the report type and date
  const reportTypeLabel = getReportTypeLabel(filters.reportType);
  const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = `${reportTypeLabel.replace(/\s+/g, '-').toLowerCase()}-${dateStr}`;
  
  // Add to report history
  addToReportHistory({
    id: `report-${Date.now()}`,
    name: `${reportTypeLabel} - ${getDateRangeLabel(filters.dateRange)}`,
    reportType: filters.reportType,
    dateRange: filters.dateRange,
    franchiseId: filters.franchiseId,
    downloadedAt: new Date().toISOString(),
    format: format,
    customDateRange: filters.dateRange === 'custom' && filters.startDate && filters.endDate
      ? {
          from: filters.startDate.toISOString(),
          to: filters.endDate.toISOString()
        }
      : undefined
  });

  switch (format) {
    case 'csv':
    case 'excel':
      // For now, we'll use the existing CSV download utility
      downloadCSVReport();
      console.log(`Exporting ${format} report with filename: ${filename}.${format}`);
      break;
    case 'pdf':
      // In a real implementation, this would generate a PDF
      console.log(`PDF export (${filename}.pdf) not implemented in this demo`);
      break;
  }
};

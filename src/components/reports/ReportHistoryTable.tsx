
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  FileSpreadsheet,
  Clock,
  Download,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ReportHistoryItem, ReportFormat } from '@/utils/reportUtils';

interface ReportHistoryTableProps {
  reports: ReportHistoryItem[];
  onRedownload: (report: ReportHistoryItem) => void;
  onDelete: (reportId: string) => void;
}

const ReportHistoryTable: React.FC<ReportHistoryTableProps> = ({ 
  reports, 
  onRedownload,
  onDelete 
}) => {
  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No report history available.</p>
        <p className="text-sm">Generated reports will appear here.</p>
      </div>
    );
  }

  const getFormatIcon = (format: ReportFormat) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'excel':
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <TooltipProvider>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Report</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Downloaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium flex items-center gap-2">
                {getFormatIcon(report.format)}
                <span>{report.name}</span>
              </TableCell>
              <TableCell>{report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)}</TableCell>
              <TableCell>
                {report.customDateRange ? (
                  <Tooltip>
                    <TooltipTrigger>Custom Range</TooltipTrigger>
                    <TooltipContent>
                      {formatDate(report.customDateRange.from)} to {formatDate(report.customDateRange.to)}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  report.dateRange.charAt(0).toUpperCase() + report.dateRange.slice(1)
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{formatDate(report.downloadedAt)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onRedownload(report)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download again</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download again</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onDelete(report.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove from history</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove from history</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default ReportHistoryTable;

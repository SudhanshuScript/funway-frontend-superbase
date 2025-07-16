
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, FileText } from "lucide-react";
import { ReportFormat } from "@/utils/reportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReportExportOptionsProps {
  reportGenerated: boolean;
  handleExport: (format: ReportFormat) => void;
}

const ReportExportOptions: React.FC<ReportExportOptionsProps> = ({
  reportGenerated,
  handleExport,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={!reportGenerated}>
        <Button variant="outline" disabled={!reportGenerated}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleExport("excel" as ReportFormat)}>
          <FileText className="mr-2 h-4 w-4 text-green-500" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf" as ReportFormat)}>
          <FileText className="mr-2 h-4 w-4 text-red-500" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportExportOptions;

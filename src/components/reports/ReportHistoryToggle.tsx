
import React from "react";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface ReportHistoryToggleProps {
  showReportHistory: boolean;
  setShowReportHistory: (show: boolean) => void;
  reportHistoryCount: number;
}

const ReportHistoryToggle: React.FC<ReportHistoryToggleProps> = ({
  showReportHistory,
  setShowReportHistory,
  reportHistoryCount,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowReportHistory(!showReportHistory)}
      className="flex items-center gap-2 text-spotBooking border-spotBooking/30 hover:bg-spotBooking/10 hover:text-spotBooking"
    >
      <History className="h-4 w-4" />
      {showReportHistory ? "Hide History" : "Show History"}
      <span className="inline-flex items-center justify-center bg-spotBooking/10 text-xs font-medium rounded-full h-5 min-w-[20px] px-1">
        {reportHistoryCount}
      </span>
    </Button>
  );
};

export default ReportHistoryToggle;

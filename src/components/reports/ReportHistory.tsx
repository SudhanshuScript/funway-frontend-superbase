
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2 } from "lucide-react";
import { ReportHistoryItem } from "@/utils/reportUtils";
import ReportHistoryTable from "./ReportHistoryTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ReportHistoryProps {
  reportHistory: ReportHistoryItem[];
  showReportHistory: boolean;
  setShowReportHistory: (show: boolean) => void;
  handleRedownload: (report: ReportHistoryItem) => void;
  handleDeleteReport: (reportId: string) => void;
  handleClearHistory: () => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({
  reportHistory,
  showReportHistory,
  setShowReportHistory,
  handleRedownload,
  handleDeleteReport,
  handleClearHistory,
}) => {
  // Don't render if history shouldn't be shown
  if (!showReportHistory) {
    return null;
  }

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <History className="mr-2 h-5 w-5" />
            Report History
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={reportHistory.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear report history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all previously downloaded reports from your history.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Clear History
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        {reportHistory.length > 0 ? (
          <ReportHistoryTable
            reports={reportHistory}
            onRedownload={handleRedownload}
            onDelete={handleDeleteReport}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No report history found. Generate and export reports to see them here.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportHistory;

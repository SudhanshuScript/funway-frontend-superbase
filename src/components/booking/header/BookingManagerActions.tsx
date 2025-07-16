
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter, Search, Download, Calendar, UserPlus, MailPlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

interface BookingManagerActionsProps {
  showCustomData: boolean;
  toggleCustomData: () => void;
  showReminderHistory: boolean;
  toggleReminderHistory: () => void;
  handleSendBulkReminders: () => void;
}

export function BookingManagerActions({
  showCustomData,
  toggleCustomData,
  showReminderHistory,
  toggleReminderHistory,
  handleSendBulkReminders
}: BookingManagerActionsProps) {
  const handleExportData = (format: string) => {
    toast.success(`Exporting data as ${format.toUpperCase()}`);
    // In a real app, this would call an API to generate and download the file
  };

  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <Download className="h-4 w-4 mr-1" />
            <span>Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExportData('pdf')}>
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExportData('csv')}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExportData('excel')}>
            Export as Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="outline" 
        size="sm"
        onClick={toggleCustomData}
        className="flex items-center gap-1 h-10"
      >
        {showCustomData ? (
          <>
            <ChevronUp className="h-4 w-4" />
            <span>Hide Details</span>
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            <span>Show Details</span>
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={toggleReminderHistory}
        className="flex items-center gap-1 h-10"
      >
        {showReminderHistory ? (
          <>
            <ChevronUp className="h-4 w-4" />
            <span>Hide Reminder History</span>
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            <span>Show Reminder History</span>
          </>
        )}
      </Button>

      <Button
        size="sm"
        className="h-10"
        onClick={handleSendBulkReminders}
      >
        <MailPlus className="h-4 w-4 mr-1" />
        <span>Send Bulk Reminders</span>
      </Button>
    </div>
  );
}

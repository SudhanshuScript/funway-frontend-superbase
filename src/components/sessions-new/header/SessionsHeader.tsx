
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus, RefreshCw } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface SessionsHeaderProps {
  onPublishSession: () => void;
  onExport?: (format: 'csv' | 'pdf') => void;
  onRefresh?: () => boolean;
}

const SessionsHeader = ({ onPublishSession, onExport, onRefresh }: SessionsHeaderProps) => {
  const handleExport = (format: 'csv' | 'pdf') => {
    if (onExport) {
      onExport(format);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      return onRefresh();
    }
    return false;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh sessions">
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40" align="end">
            <div className="grid gap-2">
              <Button variant="ghost" onClick={() => handleExport('pdf')} className="justify-start">
                Export as PDF
              </Button>
              <Button variant="ghost" onClick={() => handleExport('csv')} className="justify-start">
                Export as CSV
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button onClick={onPublishSession} className="gap-1">
          <Plus className="h-4 w-4" />
          New Session
        </Button>
      </div>
    </div>
  );
};

export default SessionsHeader;

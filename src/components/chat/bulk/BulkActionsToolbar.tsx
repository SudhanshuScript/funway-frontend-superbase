
import React from 'react';
import { Button } from '@/components/ui/button';
import { Archive, Users, CheckCircle, Download } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { StatusTagIcon } from '../status/StatusTagDropdown';
import { ChatStatus } from '@/types/chatTypes';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onArchiveSelected: () => void;
  onAssignSelected: (franchiseId: string) => void;
  onMarkAsStatus: (status: ChatStatus) => void;
  onExportSelected: () => void;
  franchises: { id: string; name: string }[];
  onClose: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  onArchiveSelected,
  onAssignSelected,
  onMarkAsStatus,
  onExportSelected,
  franchises,
  onClose
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="border-b flex items-center justify-between p-2 bg-muted/30">
      <div>
        <span className="text-sm font-medium">{selectedCount} conversations selected</span>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onArchiveSelected}
        >
          <Archive className="h-4 w-4 mr-2" />
          Archive
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Assign to
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {franchises.map(franchise => (
              <DropdownMenuItem 
                key={franchise.id}
                onClick={() => onAssignSelected(franchise.id)}
              >
                {franchise.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onMarkAsStatus('new')}>
              <StatusTagIcon status="new" />
              <span className="ml-2">New</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMarkAsStatus('pending')}>
              <StatusTagIcon status="pending" />
              <span className="ml-2">Pending</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMarkAsStatus('resolved')}>
              <StatusTagIcon status="resolved" />
              <span className="ml-2">Resolved</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMarkAsStatus('escalated')}>
              <StatusTagIcon status="escalated" />
              <span className="ml-2">Escalated</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExportSelected}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

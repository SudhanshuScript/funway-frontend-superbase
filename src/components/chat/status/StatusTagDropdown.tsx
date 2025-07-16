
import React from 'react';
import { Check, Circle, AlertCircle, Clock } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChatStatus } from '@/types/chatTypes';
import { useUserRole } from "@/providers/UserRoleProvider";

interface StatusTagProps {
  status: ChatStatus;
  onStatusChange: (status: ChatStatus) => void;
  disabled?: boolean;
}

export const StatusTagIcon = ({ status }: { status: ChatStatus }) => {
  switch (status) {
    case 'new':
      return <Circle className="h-4 w-4 text-purple-500" fill="purple" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'resolved':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'escalated':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

export const StatusTag = ({ status }: { status: ChatStatus }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'new':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'escalated':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'new':
        return 'New';
      case 'pending':
        return 'Pending';
      case 'resolved':
        return 'Resolved';
      case 'escalated':
        return 'Escalated';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      <StatusTagIcon status={status} />
      <span className="ml-1">{getStatusText()}</span>
    </div>
  );
};

export const StatusTagDropdown: React.FC<StatusTagProps> = ({ status, onStatusChange, disabled = false }) => {
  const { currentUser } = useUserRole();
  const isSuperAdmin = currentUser?.role === 'superadmin';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="ghost" size="sm" className="p-0 h-auto">
          <StatusTag status={status} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onStatusChange('new')}>
          <Circle className="h-4 w-4 mr-2 text-purple-500" fill="purple" />
          <span>New</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('pending')}>
          <Clock className="h-4 w-4 mr-2 text-amber-500" />
          <span>Pending</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('resolved')}>
          <Check className="h-4 w-4 mr-2 text-green-500" />
          <span>Resolved</span>
        </DropdownMenuItem>
        {isSuperAdmin && (
          <DropdownMenuItem onClick={() => onStatusChange('escalated')}>
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            <span>Escalated</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import React from 'react';
import { Session } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Copy, 
  Power,
  Loader2,
  CalendarX,
  Star,
  TrendingUp,
  Flame
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format, parseISO } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SessionsTableProps {
  sessions: Session[];
  isLoading: boolean;
  onView: (session: Session) => void;
  onEdit: (session: Session) => void;
  onDeactivate: (session: Session) => void;
  onClone: (session: Session) => void;
}

const SessionsTable = ({
  sessions,
  isLoading,
  onView,
  onEdit,
  onDeactivate,
  onClone
}: SessionsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading sessions...</p>
      </div>
    );
  }
  
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CalendarX className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No Sessions Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          No sessions match your current filters or there are no sessions published yet.
        </p>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <Table className="border-collapse">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Session Name</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => {
            const isHighPerformer = session.bookedCount > (session.maxCapacity * 0.8);
            const hasGoodRating = Math.random() > 0.3;
            const isFullyBooked = session.bookedCount >= session.maxCapacity;
            const isTrending = Math.random() > 0.7;
            
            return (
              <TableRow key={session.id} className="group hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span>{session.name}</span>
                      {isHighPerformer && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Flame className="h-4 w-4 text-orange-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>High performer</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {hasGoodRating && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Star className="h-4 w-4 text-yellow-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rated 4.9 — Excellent Service!</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {session.isSpecialDate && (
                        <Badge variant="outline" className="w-fit bg-amber-500/10 text-amber-600 border-amber-200">
                          Special
                        </Badge>
                      )}
                      {isFullyBooked && (
                        <Badge variant="outline" className="w-fit bg-green-500/10 text-green-600 border-green-200">
                          Fully Booked
                        </Badge>
                      )}
                      {isTrending && (
                        <Badge variant="outline" className="w-fit bg-purple-500/10 text-purple-600 border-purple-200 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{format(parseISO(session.date), "MMM dd, yyyy")}</span>
                    <span className="text-xs text-muted-foreground">
                      {session.startTime} ({session.duration} min)
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {session.bookedCount || 0} / {session.maxCapacity}
                    </span>
                    <div className="w-full bg-muted h-1.5 rounded-full mt-1">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, Math.round(((session.bookedCount || 0) / session.maxCapacity) * 100))}%` 
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(((session.bookedCount || 0) / session.maxCapacity) * 100)}% booked
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={session.isSpecialDate ? "default" : "secondary"}>
                    {session.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={session.isActive} 
                      disabled 
                    />
                    <span className={session.isActive ? "text-green-600" : "text-muted-foreground"}>
                      {session.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(session)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(session)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Session
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onClone(session)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Clone Session
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDeactivate(session)} className="text-destructive">
                        <Power className="mr-2 h-4 w-4" />
                        {session.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default SessionsTable;

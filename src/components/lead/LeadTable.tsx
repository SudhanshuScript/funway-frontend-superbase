
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lead, LeadStatus, getSourceBadge, getStatusBadge, getInterestBadge } from "@/types/leadTypes";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal, MessageSquare, Calendar, Check, Archive, PhoneCall, ArrowUpDown, ChevronDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { franchiseOptions } from '@/hooks/lead/mockLeadData';
import { Checkbox } from "@/components/ui/checkbox";

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  selectedLeadId: string | null;
  onSelectLead: (leadId: string) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onFilterChange?: (filterKey: string, value: string) => void;
  onSortChange?: (column: string) => void;
  onExport?: () => void;
  selectedLeads?: string[];
  onSelectLeadForBulkAction?: (leadId: string, selected: boolean) => void;
  enableBulkActions?: boolean;
  currentFranchiseId?: string;
  userRole?: string;
}

export function LeadTable({ 
  leads, 
  isLoading, 
  selectedLeadId,
  onSelectLead,
  onUpdateStatus,
  onFilterChange,
  onSortChange,
  onExport,
  selectedLeads = [],
  onSelectLeadForBulkAction,
  enableBulkActions = false,
  currentFranchiseId,
  userRole
}: LeadTableProps) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    onSortChange && onSortChange(`${field}-${sortDirection === 'asc' ? 'desc' : 'asc'}`);
  };

  const getFranchiseName = (franchiseId: string) => {
    const franchise = franchiseOptions.find(f => f.id === franchiseId);
    return franchise ? franchise.name : 'Unknown Franchise';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground text-center mb-4">No leads found.</p>
        <Button variant="outline" size="sm">
          Add your first lead
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {enableBulkActions && selectedLeads.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedLeads.length} selected</span>
              <Button variant="outline" size="sm">Assign</Button>
              <Button variant="outline" size="sm">Mark as Contacted</Button>
              <Button variant="outline" size="sm">Schedule Follow-Up</Button>
            </div>
          )}
        </div>
        {userRole === 'superadmin' && (
          <Button variant="outline" size="sm" onClick={onExport} className="ml-auto">
            Export CSV
          </Button>
        )}
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            {enableBulkActions && (
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={leads.length > 0 && selectedLeads.length === leads.length}
                  onCheckedChange={(checked) => {
                    if (!onSelectLeadForBulkAction) return;
                    leads.forEach(lead => onSelectLeadForBulkAction(lead.id, !!checked));
                  }}
                />
              </TableHead>
            )}
            <TableHead className="min-w-[180px]">
              <div className="flex items-center gap-1">
                Name
                <button onClick={() => handleSort('name')} className="ml-1">
                  <ArrowUpDown className="h-4 w-4" />
                </button>
                {onFilterChange && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Filter className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Filter by Name</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <input 
                          className="w-full p-2 border rounded text-sm" 
                          placeholder="Search by name..."
                          onChange={(e) => onFilterChange('searchQuery', e.target.value)}
                        />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Source
                <button onClick={() => handleSort('source')} className="ml-1">
                  <ArrowUpDown className="h-4 w-4" />
                </button>
                {onFilterChange && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Filter className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'all')}>
                        All Sources
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'website')}>
                        Website
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'instagram')}>
                        Instagram
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'facebook')}>
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'phone')}>
                        Phone Call
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'whatsapp')}>
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'telegram')}>
                        Telegram
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'email')}>
                        Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'referral')}>
                        Referral
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('source', 'walk_in')}>
                        Walk-in
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Franchise
                {onFilterChange && userRole === 'superadmin' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Filter className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Filter by Franchise</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onFilterChange('franchise_id', 'all')}>
                        All Franchises
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {franchiseOptions.map(franchise => (
                        <DropdownMenuItem 
                          key={franchise.id}
                          onClick={() => onFilterChange('franchise_id', franchise.id)}
                        >
                          {franchise.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Interest
                {onFilterChange && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Filter className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Filter by Interest</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onFilterChange('interest', 'all')}>
                        All Interests
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onFilterChange('interest', 'session')}>
                        Dining Session
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('interest', 'offer')}>
                        Special Offer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('interest', 'franchise')}>
                        Franchise Inquiry
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('interest', 'gift_voucher')}>
                        Gift Voucher
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('interest', 'general')}>
                        General Inquiry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Status
                <button onClick={() => handleSort('status')} className="ml-1">
                  <ArrowUpDown className="h-4 w-4" />
                </button>
                {onFilterChange && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Filter className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onFilterChange('status', 'all')}>
                        All Statuses
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onFilterChange('status', 'new')}>
                        New
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('status', 'contacted')}>
                        Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('status', 'follow_up')}>
                        Follow-Up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('status', 'converted')}>
                        Converted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFilterChange('status', 'dropped')}>
                        Dropped
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Created
                <button onClick={() => handleSort('created_at')} className="ml-1">
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow 
              key={lead.id}
              className={selectedLeadId === lead.id ? "bg-muted" : ""}
              onClick={() => onSelectLead(lead.id)}
            >
              {enableBulkActions && (
                <TableCell onClick={(e) => e.stopPropagation()} className="w-[40px]">
                  <Checkbox 
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={(checked) => {
                      if (onSelectLeadForBulkAction) {
                        onSelectLeadForBulkAction(lead.id, !!checked);
                      }
                    }}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{lead.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {lead.email || lead.phone || 'No contact info'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className={getSourceBadge(lead.source).color}>
                        <span className="mr-1">{getSourceBadge(lead.source).icon}</span>
                        {lead.source.charAt(0).toUpperCase() + lead.source.slice(1).replace('_', ' ')}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Added via {lead.source} on {new Date(lead.created_at).toLocaleDateString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                {getFranchiseName(lead.franchise_id)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getInterestBadge(lead.interest).color}>
                  <span className="mr-1">{getInterestBadge(lead.interest).icon}</span>
                  {lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1).replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadge(lead.status).color}>
                  {getStatusBadge(lead.status).text}
                </Badge>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Created on {new Date(lead.created_at).toLocaleString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(lead.channel === 'whatsapp' || lead.channel === 'telegram') && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onSelectLead(lead.id);
                      }}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                      </DropdownMenuItem>
                    )}
                    {lead.channel === 'phone' && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        // Phone call action would go here
                        onSelectLead(lead.id);
                      }}>
                        <PhoneCall className="mr-2 h-4 w-4" /> Log Phone Call
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      // Schedule follow-up action would go here
                      onSelectLead(lead.id);
                    }}>
                      <Calendar className="mr-2 h-4 w-4" /> Schedule Follow-up
                    </DropdownMenuItem>
                    
                    {lead.status !== 'converted' && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(lead.id, "converted");
                      }}>
                        <Check className="mr-2 h-4 w-4" /> Convert to Booking
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(lead.id, "new");
                          }}>
                            New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(lead.id, "contacted");
                          }}>
                            Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(lead.id, "follow_up");
                          }}>
                            Follow-up
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(lead.id, "converted");
                          }}>
                            Converted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(lead.id, "dropped");
                          }}>
                            Dropped
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

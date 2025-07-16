
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { BarChart3, Check, ChevronDown, Download, Filter, InfoIcon, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SessionPerformanceTable = () => {
  const [sortBy, setSortBy] = useState<string>('revenue');
  
  // Mock data for session performance
  const sessionData = [
    {
      id: 1,
      name: "Sunset Dinner Experience",
      type: "Dinner",
      revenue: 18450,
      capacity: 95,
      rating: 4.8,
      growth: 12.5
    },
    {
      id: 2,
      name: "Executive Lunch Special",
      type: "Lunch",
      revenue: 12840,
      capacity: 82,
      rating: 4.6,
      growth: 8.2
    },
    {
      id: 3,
      name: "Weekend Brunch",
      type: "Breakfast",
      revenue: 9650,
      capacity: 78,
      rating: 4.7,
      growth: 15.3
    },
    {
      id: 4,
      name: "Private Dining Experience",
      type: "Special",
      revenue: 22350,
      capacity: 98,
      rating: 4.9,
      growth: 18.7
    },
    {
      id: 5,
      name: "Business Breakfast",
      type: "Breakfast",
      revenue: 7250,
      capacity: 65,
      rating: 4.5,
      growth: -2.1
    }
  ];
  
  const sortedData = [...sessionData].sort((a, b) => {
    if (sortBy === 'revenue') return b.revenue - a.revenue;
    if (sortBy === 'capacity') return b.capacity - a.capacity;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'growth') return b.growth - a.growth;
    return 0;
  });

  return (
    <TooltipProvider>
      <div className="bg-background rounded-md border">
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="text-lg font-medium">Session Performance</h3>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter sessions by type or date range</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Sort by
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('revenue')}>
                  {sortBy === 'revenue' && <Check className="h-4 w-4 mr-2" />}
                  Revenue
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('capacity')}>
                  {sortBy === 'capacity' && <Check className="h-4 w-4 mr-2" />}
                  Capacity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>
                  {sortBy === 'rating' && <Check className="h-4 w-4 mr-2" />}
                  Rating
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('growth')}>
                  {sortBy === 'growth' && <Check className="h-4 w-4 mr-2" />}
                  Growth
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export session data to CSV or Excel</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Session Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Capacity %</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Rating
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div><InfoIcon className="h-3 w-3 text-muted-foreground" /></div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average customer rating out of 5</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="text-right">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((session) => (
                <TableRow key={session.id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell className="font-medium">{session.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-muted">
                      {session.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">${session.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{session.capacity}%</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {session.rating}
                      <Star className="h-4 w-4 text-amber-500 ml-1 fill-amber-500" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`${session.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {session.growth >= 0 ? '+' : ''}{session.growth}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SessionPerformanceTable;

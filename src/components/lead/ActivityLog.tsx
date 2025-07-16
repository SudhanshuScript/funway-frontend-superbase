
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { mockLeadActivities } from "@/hooks/lead/mockLeadData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Sort activities by date (newest first)
  const sortedActivities = [...mockLeadActivities].sort(
    (a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
  );
  
  // Filter activities
  const filteredActivities = sortedActivities.filter(activity => {
    const activityDate = new Date(activity.performed_at);
    const matchesDate = activityDate >= dateRange.from && activityDate <= dateRange.to;
    
    const matchesSearch = !searchQuery || 
      activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.lead_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.performed_by.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDate && matchesSearch;
  });
  
  const getActivityBadge = (type: string) => {
    switch (type) {
      case "note":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Note</Badge>;
      case "contact":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Contact</Badge>;
      case "message":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Message</Badge>;
      case "status_change":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Status Change</Badge>;
      case "follow_up":
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">Follow Up</Badge>;
      case "conversion":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Conversion</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const handleExport = () => {
    // In a real application, this would generate a CSV or Excel file
    alert("Exporting activity log...");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Activity Log</h2>
          <p className="text-muted-foreground">Track all lead-related activities</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <CardTitle>Activity History</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {dateRange.from && dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range.to) {
                        setDateRange({ from: range.from, to: range.to });
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" className="flex items-center gap-1" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <Input
              placeholder="Search by lead, staff or activity details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Lead ID</TableHead>
                <TableHead>Activity Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      {format(new Date(activity.performed_at), "PPP p")}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{activity.lead_id}</span>
                    </TableCell>
                    <TableCell>{getActivityBadge(activity.activity_type)}</TableCell>
                    <TableCell className="max-w-xs truncate">{activity.details}</TableCell>
                    <TableCell>
                      <span className="text-sm">{activity.performed_by}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No activities found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

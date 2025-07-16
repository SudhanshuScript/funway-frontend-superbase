
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from 'date-fns';
import { Input } from "@/components/ui/input";
import { Calendar, Search, Filter, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Enhanced mock reminder history data with more entries
const mockReminderHistory = [
  {
    id: "RH-001",
    bookingId: "BK-001",
    guestName: "Michael Brown",
    method: "email",
    templateName: "Booking Reminder",
    sentAt: "2023-06-02T10:00:00Z",
    status: "delivered"
  },
  {
    id: "RH-002",
    bookingId: "BK-003",
    guestName: "Thomas Anderson",
    method: "email",
    templateName: "Pre-arrival Information",
    sentAt: "2023-06-06T10:00:00Z",
    status: "opened"
  },
  {
    id: "RH-003",
    bookingId: "BK-003",
    guestName: "Thomas Anderson",
    method: "sms",
    templateName: "Day Before Reminder",
    sentAt: "2023-06-07T14:30:00Z",
    status: "delivered"
  },
  {
    id: "RH-004",
    bookingId: "BK-004",
    guestName: "Emma Davis",
    method: "email",
    templateName: "Booking Reminder",
    sentAt: "2023-06-05T10:00:00Z",
    status: "responded"
  },
  {
    id: "RH-005",
    bookingId: "BK-002",
    guestName: "Jessica Wilson",
    method: "whatsapp",
    templateName: "Payment Reminder",
    sentAt: "2023-06-08T09:15:00Z",
    status: "delivered"
  },
  {
    id: "RH-006",
    bookingId: "BK-005",
    guestName: "Robert Smith",
    method: "email",
    templateName: "Special Requests Confirmation",
    sentAt: "2023-06-07T16:45:00Z",
    status: "opened"
  },
  {
    id: "RH-007",
    bookingId: "BK-001",
    guestName: "Michael Brown",
    method: "sms",
    templateName: "Day Before Reminder",
    sentAt: "2023-06-09T11:30:00Z",
    status: "delivered"
  }
];

interface BookingReminderHistoryProps {
  bookingIds: string[];
}

export function BookingReminderHistory({ bookingIds }: BookingReminderHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // Filter the reminders based on bookingIds and other filters
  const filteredReminderHistory = mockReminderHistory.filter(reminder => {
    // First filter by bookingIds
    if (bookingIds.length > 0 && !bookingIds.includes(reminder.bookingId)) {
      return false;
    }
    
    // Then apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesQuery = 
        reminder.bookingId.toLowerCase().includes(query) ||
        reminder.guestName.toLowerCase().includes(query) ||
        reminder.templateName.toLowerCase().includes(query);
      
      if (!matchesQuery) return false;
    }
    
    // Apply method filter if selected
    if (filterMethod && reminder.method !== filterMethod) {
      return false;
    }
    
    // Apply status filter if selected
    if (filterStatus && reminder.status !== filterStatus) {
      return false;
    }
    
    return true;
  });
  
  const handleResendReminder = (id: string) => {
    toast.success(`Reminder ${id} resent successfully`);
  };
  
  const handleViewDetails = (id: string) => {
    console.log("View details for reminder:", id);
  };
  
  const clearFilters = () => {
    setFilterMethod(null);
    setFilterStatus(null);
    setSearchQuery("");
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "responded":
        return <Badge variant="default">Responded</Badge>;
      case "opened":
        return <Badge variant="secondary">Opened</Badge>;
      case "delivered":
        return <Badge variant="outline">Delivered</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getMethodBadge = (method: string) => {
    switch (method) {
      case "email":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Email</Badge>;
      case "sms":
        return <Badge variant="outline" className="bg-green-100 text-green-800">SMS</Badge>;
      case "whatsapp":
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800">WhatsApp</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Recent Reminders</h3>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search reminders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Method
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterMethod(null)}>
                  All Methods
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterMethod("email")}>
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterMethod("sms")}>
                  SMS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterMethod("whatsapp")}>
                  WhatsApp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("delivered")}>
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("opened")}>
                  Opened
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("responded")}>
                  Responded
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("failed")}>
                  Failed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReminderHistory.length > 0 ? (
              filteredReminderHistory.map((reminder) => (
                <TableRow key={reminder.id}>
                  <TableCell>{reminder.bookingId}</TableCell>
                  <TableCell>{reminder.guestName}</TableCell>
                  <TableCell>{reminder.templateName}</TableCell>
                  <TableCell>
                    {getMethodBadge(reminder.method)}
                  </TableCell>
                  <TableCell>{format(parseISO(reminder.sentAt), 'MMM d, yyyy h:mm a')}</TableCell>
                  <TableCell>
                    {getStatusBadge(reminder.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-1 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResendReminder(reminder.id)}
                      >
                        Resend
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(reminder.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No reminder history found for these bookings
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

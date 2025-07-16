import React, { useState } from 'react';
import { useUpcomingBookings } from '@/hooks/useUpcomingBookings';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, User, Eye, AlertTriangle, Calendar, Coffee, Utensils } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock data for ongoing bookings
const mockOngoingBookings = [
  {
    id: "BK-001",
    guestName: "Michael Johnson",
    guestType: "VIP",
    totalGuests: 4,
    sessionName: "Lunch Special",
    startTime: "12:30 PM",
    duration: "2 hours",
    tableNumber: "T12",
    status: "Seated",
    specialRequests: "Window table preferred"
  },
  {
    id: "BK-002",
    guestName: "Sarah Williams",
    guestType: "Regular",
    totalGuests: 2,
    sessionName: "Afternoon Tea",
    startTime: "3:00 PM",
    duration: "1.5 hours",
    tableNumber: "T5",
    status: "Arrived",
    specialRequests: ""
  },
  {
    id: "BK-003",
    guestName: "Robert Chen",
    guestType: "First Timer",
    totalGuests: 6,
    sessionName: "Early Dinner",
    startTime: "5:30 PM",
    duration: "2.5 hours",
    tableNumber: "T20",
    status: "Seated",
    specialRequests: "Anniversary celebration, please prepare a cake"
  },
  {
    id: "BK-004",
    guestName: "Emma Davis",
    guestType: "Regular",
    totalGuests: 3,
    sessionName: "Lunch Special",
    startTime: "1:15 PM",
    duration: "1.5 hours",
    tableNumber: "T8",
    status: "Waiting",
    specialRequests: "One high chair needed"
  }
];

export function OngoingBookingsManager() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredBookings = mockOngoingBookings.filter(booking => {
    if (!searchQuery) return true;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      booking.id.toLowerCase().includes(lowerCaseQuery) ||
      booking.guestName.toLowerCase().includes(lowerCaseQuery) ||
      booking.sessionName.toLowerCase().includes(lowerCaseQuery) ||
      booking.status.toLowerCase().includes(lowerCaseQuery)
    );
  });
  
  const handleMarkSeated = (id: string) => {
    toast.success(`Booking ${id} marked as Seated`);
  };
  
  const handleMarkComplete = (id: string) => {
    toast.success(`Booking ${id} marked as Completed`);
  };
  
  const handleAddNotes = (id: string) => {
    toast.success(`Notes added to booking ${id}`);
  };
  
  const handleViewDetails = (id: string) => {
    console.log("View details for booking:", id);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Seated":
        return "bg-green-100 border-green-500 text-green-700";
      case "Arrived":
        return "bg-blue-100 border-blue-500 text-blue-700";
      case "Waiting":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Seated":
        return <Check className="h-3 w-3 mr-1" />;
      case "Arrived":
        return <User className="h-3 w-3 mr-1" />;
      case "Waiting":
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return <AlertTriangle className="h-3 w-3 mr-1" />;
    }
  };
  
  const getGuestTypeIcon = (type: string) => {
    switch (type) {
      case "VIP":
        return "bg-yellow-500 text-yellow-50";
      case "Regular":
        return "bg-blue-500 text-blue-50";
      case "First Timer":
        return "bg-green-500 text-green-50";
      default:
        return "bg-gray-500 text-gray-50";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>Ongoing Bookings</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Eye className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Filter Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Statuses</DropdownMenuItem>
                <DropdownMenuItem>Seated</DropdownMenuItem>
                <DropdownMenuItem>Arrived</DropdownMenuItem>
                <DropdownMenuItem>Waiting</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Special Requests</TableHead>
                  <TableHead className="text-right sticky right-0 bg-background/90 dark:bg-background/40 shadow-sm z-10">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">{booking.guestName}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Badge className={getGuestTypeIcon(booking.guestType)} variant="outline">
                              {booking.guestType}
                            </Badge>
                            <span>{booking.totalGuests} guests</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {booking.sessionName.includes("Lunch") ? (
                          <Coffee className="h-4 w-4 mr-1" />
                        ) : (
                          <Utensils className="h-4 w-4 mr-1" />
                        )}
                        {booking.sessionName}
                      </div>
                    </TableCell>
                    <TableCell>{booking.startTime}</TableCell>
                    <TableCell>{booking.duration}</TableCell>
                    <TableCell>{booking.tableNumber}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(booking.status)} flex items-center px-2 py-1`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={booking.specialRequests}>
                        {booking.specialRequests || "None"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right sticky right-0 bg-background/90 dark:bg-background/30">
                      <div className="flex space-x-1 justify-end bg-background/80 dark:bg-background/30 px-2 py-1 rounded-md">
                        {booking.status === "Arrived" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkSeated(booking.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Seat
                          </Button>
                        )}
                        {(booking.status === "Seated" || booking.status === "Arrived") && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkComplete(booking.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddNotes(booking.id)}
                        >
                          Add Notes
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(booking.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No ongoing bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

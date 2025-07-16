
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2 } from "lucide-react";

interface UpcomingGuest {
  id: number;
  name: string;
  time: string;
  guests: number;
  request: string;
  status: string;
}

interface CheckedInGuest {
  id: number;
  name: string;
  checkedIn: string;
  assigned: string;
  status: string;
}

interface GuestsTabsProps {
  upcomingGuests: UpcomingGuest[];
  checkedInGuests: CheckedInGuest[];
}

export function GuestsTabs({ upcomingGuests, checkedInGuests }: GuestsTabsProps) {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="mb-4">
        <TabsTrigger value="upcoming">
          <Calendar className="h-4 w-4 mr-2" />
          Upcoming
        </TabsTrigger>
        <TabsTrigger value="checkedIn">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Checked In
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest Name</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Party Size</TableHead>
              <TableHead>Special Requests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell>{guest.time}</TableCell>
                <TableCell>{guest.guests}</TableCell>
                <TableCell>
                  <span className="text-sm">{guest.request || "None"}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {guest.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Check-in</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      
      <TabsContent value="checkedIn">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest Name</TableHead>
              <TableHead>Check-in Time</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkedInGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell>{guest.checkedIn}</TableCell>
                <TableCell>{guest.assigned}</TableCell>
                <TableCell>
                  <Badge variant={guest.status === "Completed" ? "secondary" : "default"}>
                    {guest.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {guest.status !== "Completed" ? (
                    <Button variant="outline" size="sm">Complete</Button>
                  ) : (
                    <Button variant="ghost" size="sm">View Details</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}

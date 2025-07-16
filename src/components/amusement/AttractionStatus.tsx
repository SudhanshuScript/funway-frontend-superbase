
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FerrisWheel, Users, Clock, Wrench } from "lucide-react";
import { amusementData } from "@/data/mockData";

export default function AttractionStatus() {
  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return <Badge className="bg-green-500">Active</Badge>;
    } else if (status === "Maintenance") {
      return <Badge className="bg-amber-500">Maintenance</Badge>;
    } else if (status === "Closed") {
      return <Badge variant="destructive">Closed</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <FerrisWheel className="h-6 w-6 text-amusement mr-2" />
        <h2 className="text-2xl font-bold">Amusement Park Operations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="amusement-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Attractions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FerrisWheel className="h-5 w-5 text-amusement mr-2" />
              <div className="text-2xl font-bold">{amusementData.activeAttractions}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="amusement-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wrench className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-2xl font-bold">{amusementData.maintenanceAttractions}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="amusement-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-amusement mr-2" />
              <div className="text-2xl font-bold">{amusementData.totalVisitors.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="amusement-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amusement mr-2" />
              <div className="text-2xl font-bold">{amusementData.avgWaitTime} min</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attraction Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attraction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amusementData.popularAttractions.map((attraction) => (
                  <TableRow key={attraction.id}>
                    <TableCell className="font-medium">{attraction.name}</TableCell>
                    <TableCell>{getStatusBadge(attraction.status)}</TableCell>
                    <TableCell>{attraction.waitTime > 0 ? `${attraction.waitTime} min` : "N/A"}</TableCell>
                    <TableCell className="text-right">{attraction.capacity > 0 ? `${attraction.capacity}%` : "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Visitors</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={amusementData.hourlyVisitors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip labelFormatter={(value) => `Time: ${value}`} />
                <Area type="monotone" dataKey="visitors" stroke="#8B5CF6" fill="#C4B5FD" name="Visitors" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

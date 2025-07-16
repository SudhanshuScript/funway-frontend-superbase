
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Plane, PlaneTakeoff, PlaneLanding, Clock } from "lucide-react";
import { flightData } from "@/data/mockData";

export default function FlightStatus() {
  const getStatusBadge = (status: string) => {
    if (status === "On Time") {
      return <Badge className="bg-green-500">On Time</Badge>;
    } else if (status === "Delayed") {
      return <Badge className="bg-amber-500">Delayed</Badge>;
    } else if (status === "Cancelled") {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Plane className="h-6 w-6 text-airline mr-2" />
        <h2 className="text-2xl font-bold">Airline Operations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="airline-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PlaneTakeoff className="h-5 w-5 text-airline mr-2" />
              <div className="text-2xl font-bold">{flightData.activeFlights}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="airline-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delayed Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-2xl font-bold">{flightData.delayedFlights}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="airline-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cancelled Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-5 w-5 text-red-500 mr-2">✕</div>
              <div className="text-2xl font-bold">{flightData.cancelledFlights}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="airline-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On-Time Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flightData.onTimePerformance}%</div>
            <Progress value={flightData.onTimePerformance} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Departures</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flight</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Gate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flightData.upcomingDepartures.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                    <TableCell>{flight.destination}</TableCell>
                    <TableCell>{flight.departureTime}</TableCell>
                    <TableCell>{flight.gate}</TableCell>
                    <TableCell>{getStatusBadge(flight.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Flight Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flightData.monthlyFlightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" domain={[80, 100]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="flights" stroke="#1E3A8A" name="Total Flights" />
                <Line yAxisId="right" type="monotone" dataKey="onTimePercentage" stroke="#22C55E" name="On-Time %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

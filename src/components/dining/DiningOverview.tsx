
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Coffee, Clock, Users, Utensils } from "lucide-react";
import { diningData } from "@/data/mockData";

export default function DiningOverview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Coffee className="h-6 w-6 text-dining mr-2" />
        <h2 className="text-2xl font-bold">Dining Operations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dining-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-dining mr-2" />
              <div className="text-2xl font-bold">{diningData.activeReservations}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="dining-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Utensils className="h-5 w-5 text-dining mr-2" />
              <div className="text-2xl font-bold">{diningData.totalTables}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="dining-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diningData.occupancyRate}%</div>
            <Progress value={diningData.occupancyRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="dining-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Dining Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-dining mr-2" />
              <div className="text-2xl font-bold">{diningData.avgDiningTime} min</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Dishes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dish</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diningData.popularDishes.map((dish) => (
                  <TableRow key={dish.id}>
                    <TableCell className="font-medium">{dish.name}</TableCell>
                    <TableCell className="text-right">{dish.orders}</TableCell>
                    <TableCell className="text-right">${dish.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Reservations</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diningData.reservationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip labelFormatter={(value) => `Time: ${value}`} />
                <Bar dataKey="reservations" fill="#F97316" name="Reservations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

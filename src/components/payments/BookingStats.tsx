
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, BarChart3, Download, Trophy, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BookingStatsProps {
  onExport?: () => void;
}

// These would normally come from an API
const mockTopSessionData = [
  { name: 'Sunset Dinner', bookings: 45 },
  { name: 'Breakfast', bookings: 38 },
  { name: 'Lunch', bookings: 30 },
  { name: 'Special Event', bookings: 25 },
  { name: 'Dinner', bookings: 20 },
];

const mockFranchiseData = [
  { name: 'SkyBistro Central', bookings: 85 },
  { name: 'FunWay East', bookings: 75 },
  { name: 'SkyBistro North', bookings: 65 },
  { name: 'FunWay West', bookings: 45 },
];

const weeklyGrowthRate = 15; // percentage
const monthlyRepeatRate = 42; // percentage
const totalBookings = 389;

export function BookingStats({ onExport }: BookingStatsProps) {
  const motivationalMessages = [
    "Great job! Booking rates are up by 15% this week!",
    "Amazing work! You've had 42% repeat customers this month.",
    "You're doing fantastic! VIP bookings have increased by 28%.",
    "Excellent! Customer satisfaction rating is at 4.8/5 this month."
  ];

  const currentMessage = motivationalMessages[0]; // We'd rotate these in a real app

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Mock export functionality
      console.log('Exporting stats...');
      alert('Stats exported successfully!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Performance</h2>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Stats
        </Button>
      </div>
      
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center">
            <ArrowUpRight className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">{currentMessage}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">{weeklyGrowthRate}% </span>
              <span className="ml-1">this week</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repeat Customer Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRepeatRate}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Heart className="h-3 w-3 text-red-500 mr-1" />
              <span>Customers love your experience!</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VIP Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Trophy className="h-3 w-3 text-amber-500 mr-1" />
              <span className="text-amber-600 font-medium">28% </span>
              <span className="ml-1">increase from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <BarChart3 className="h-4 w-4 mr-2" />
              Top Performing Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTopSessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Users className="h-4 w-4 mr-2" />
              Top Franchise Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockFranchiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

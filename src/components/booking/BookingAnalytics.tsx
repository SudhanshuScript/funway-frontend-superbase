
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock analytics data - in a real app this would come from an API
const mockAnalyticsData = {
  bookingsByStatus: [
    { name: "Confirmed", value: 42 },
    { name: "Pending", value: 18 },
    { name: "Cancelled", value: 7 }
  ],
  bookingsBySession: [
    { name: "Sunset Dinner", value: 24 },
    { name: "Brunch Special", value: 15 },
    { name: "Lunch", value: 12 },
    { name: "Valentine's Day", value: 9 },
    { name: "Dinner", value: 7 }
  ],
  reminderEffectiveness: [
    { name: "Email", sent: 45, opened: 32, responded: 18 },
    { name: "SMS", sent: 30, opened: 28, responded: 22 },
    { name: "WhatsApp", sent: 15, opened: 14, responded: 10 }
  ],
  bookingTrends: [
    { month: "Jan", bookings: 32, cancellations: 4 },
    { month: "Feb", bookings: 38, cancellations: 3 },
    { month: "Mar", bookings: 35, cancellations: 5 },
    { month: "Apr", bookings: 40, cancellations: 6 },
    { month: "May", bookings: 45, cancellations: 4 },
    { month: "Jun", bookings: 50, cancellations: 7 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface BookingAnalyticsProps {
  stats: any; // In a real app, define a proper type for this
  onExportStats: () => void;
}

export function BookingAnalytics({ stats, onExportStats }: BookingAnalyticsProps) {
  // In a real app, use the stats prop instead of mockAnalyticsData
  const analyticsData = mockAnalyticsData;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Booking Analytics</h3>
        <Button variant="outline" onClick={onExportStats}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.bookingsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.bookingsBySession}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reminder Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.reminderEffectiveness}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#8884d8" />
                  <Bar dataKey="opened" fill="#82ca9d" />
                  <Bar dataKey="responded" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.bookingTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#8884d8" />
                  <Bar dataKey="cancellations" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

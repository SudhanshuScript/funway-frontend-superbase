
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Star, 
  Clock,
  ChevronDown,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

interface FranchisePerformanceProps {
  franchiseId: string;
}

// Mock data - in a real app, this would come from the API
const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 4500 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 3800 },
  { month: 'May', revenue: 4200 },
  { month: 'Jun', revenue: 5100 },
  { month: 'Jul', revenue: 5800 },
  { month: 'Aug', revenue: 6200 },
  { month: 'Sep', revenue: 5900 },
  { month: 'Oct', revenue: 7000 },
  { month: 'Nov', revenue: 7200 },
  { month: 'Dec', revenue: 8000 },
];

const bookingData = [
  { day: 'Mon', bookings: 12 },
  { day: 'Tue', bookings: 18 },
  { day: 'Wed', bookings: 15 },
  { day: 'Thu', bookings: 22 },
  { day: 'Fri', bookings: 32 },
  { day: 'Sat', bookings: 38 },
  { day: 'Sun', bookings: 28 },
];

const utilizationData = [
  { hour: '10AM', utilization: 40 },
  { hour: '11AM', utilization: 45 },
  { hour: '12PM', utilization: 68 },
  { hour: '1PM', utilization: 82 },
  { hour: '2PM', utilization: 78 },
  { hour: '3PM', utilization: 66 },
  { hour: '4PM', utilization: 55 },
  { hour: '5PM', utilization: 72 },
  { hour: '6PM', utilization: 85 },
  { hour: '7PM', utilization: 90 },
  { hour: '8PM', utilization: 95 },
  { hour: '9PM', utilization: 80 },
];

const seasonalData = [
  { name: 'Week 1', current: 4000, last: 3000 },
  { name: 'Week 2', current: 4200, last: 3100 },
  { name: 'Week 3', current: 5100, last: 4200 },
  { name: 'Week 4', current: 4800, last: 4000 },
];

const FranchisePerformance: React.FC<FranchisePerformanceProps> = ({ franchiseId }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Performance Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive analysis of the franchise performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted rounded-md">
            <Badge variant="outline" className="rounded-md bg-primary text-white">30d</Badge>
            <Badge variant="outline" className="rounded-md">90d</Badge>
            <Badge variant="outline" className="rounded-md">1y</Badge>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$82,435</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Session Fill Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="w-full h-2 bg-muted rounded-full mt-1">
              <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5.0</div>
            <div className="flex text-amber-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Chart */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar dataKey="revenue" name="Monthly Revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Split Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Weekly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#8884d8" 
                    name="Bookings" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Hourly Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                  <Area 
                    type="monotone" 
                    dataKey="utilization" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="Utilization %" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Seasonal Comparison */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Period Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={seasonalData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" name="Current Period" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="last" name="Last Period" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Top Performing Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Sunset Experience</p>
                  <p className="text-sm text-muted-foreground">7PM - 9PM</p>
                </div>
                <Badge className="bg-green-500">98% Fill</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Weekend Brunch</p>
                  <p className="text-sm text-muted-foreground">11AM - 1PM</p>
                </div>
                <Badge className="bg-green-500">95% Fill</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Dinner Delight</p>
                  <p className="text-sm text-muted-foreground">6PM - 8PM</p>
                </div>
                <Badge className="bg-green-500">92% Fill</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">City Lights</p>
                  <p className="text-sm text-muted-foreground">8PM - 10PM</p>
                </div>
                <Badge className="bg-amber-500">86% Fill</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Repeat Customers</p>
                  <p className="text-sm font-semibold">68%</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full mt-1">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Average Group Size</p>
                  <p className="text-sm font-semibold">4.2 people</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full mt-1">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Family Bookings</p>
                  <p className="text-sm font-semibold">42%</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full mt-1">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Operational Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Staff Productivity</p>
                  <p className="text-sm text-muted-foreground">avg. customers per staff</p>
                </div>
                <Badge className="bg-green-500">8.3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Preparation Time</p>
                  <p className="text-sm text-muted-foreground">avg. minutes</p>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">16.5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Service Duration</p>
                  <p className="text-sm text-muted-foreground">avg. minutes</p>
                </div>
                <Badge variant="outline" className="bg-amber-100 text-amber-800">120</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Cleanup Time</p>
                  <p className="text-sm text-muted-foreground">avg. minutes</p>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">22</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FranchisePerformance;

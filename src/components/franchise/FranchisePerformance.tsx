
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceStats } from "@/types/franchiseTypes";

// Performance metrics to display in the charts
const performanceData = [
  { month: "Jan", revenue: 2100, customers: 45 },
  { month: "Feb", revenue: 3400, customers: 52 },
  { month: "Mar", revenue: 2900, customers: 48 },
  { month: "Apr", revenue: 4100, customers: 63 },
  { month: "May", revenue: 4800, customers: 71 },
  { month: "Jun", revenue: 5300, customers: 84 },
  { month: "Jul", revenue: 6100, customers: 92 },
  { month: "Aug", revenue: 5700, customers: 87 },
  { month: "Sep", revenue: 6500, customers: 99 },
  { month: "Oct", revenue: 7100, customers: 103 },
  { month: "Nov", revenue: 8400, customers: 118 },
  { month: "Dec", revenue: 9200, customers: 126 },
];

interface FranchisePerformanceProps {
  franchiseId: string;
  stats: PerformanceStats;
}

const FranchisePerformance: React.FC<FranchisePerformanceProps> = ({ 
  franchiseId, 
  stats 
}) => {
  // Convert revenue trend to chart data
  const revenueData = stats.revenue_trend.map((value, index) => ({
    month: `Month ${index + 1}`,
    value
  }));
  
  // Convert booking trend to chart data
  const bookingData = stats.booking_trend.map((value, index) => ({
    month: `Month ${index + 1}`,
    value
  }));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthly_revenue}</div>
            <p className="text-xs text-muted-foreground">+{Math.round((stats.revenue_trend[11] / stats.revenue_trend[10] - 1) * 100)}% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customer_satisfaction}/5</div>
            <p className="text-xs text-muted-foreground">{stats.reviews_count} reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookings}</div>
            <p className="text-xs text-muted-foreground">Avg. ${stats.avg_booking_value} per booking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.retention_rate}%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="peak">Peak Hours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      name="Revenue ($)"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={bookingData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#82ca9d"
                      name="Bookings"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="peak" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.peak_hours}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={(hour) => `${hour}:00`} 
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(hour) => `Time: ${hour}:00`}
                      formatter={(value) => [`${value} bookings`, 'Volume']}
                    />
                    <Bar dataKey="value" name="Bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FranchisePerformance;

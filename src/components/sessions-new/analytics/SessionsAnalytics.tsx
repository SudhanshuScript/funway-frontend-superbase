
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Session } from '@/types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { CalendarCheck, Users, TrendingUp, TrendingDown } from 'lucide-react';

interface SessionsAnalyticsProps {
  sessions: Session[];
}

const SessionsAnalytics = ({ sessions }: SessionsAnalyticsProps) => {
  const activeSessions = sessions.filter(s => s.isActive).length;
  
  // Get total capacity
  const totalCapacity = sessions
    .filter(s => s.isActive)
    .reduce((sum, session) => sum + session.maxCapacity, 0);
  
  // Get total bookings
  const totalBookings = sessions
    .filter(s => s.isActive)
    .reduce((sum, session) => sum + (session.bookedCount || 0), 0);
  
  // Calculate utilization rate
  const utilizationRate = totalCapacity > 0 
    ? Math.round((totalBookings / totalCapacity) * 100) 
    : 0;
  
  // Find most popular session types based on booking percentage
  const sessionTypes = new Map<string, { booked: number, capacity: number }>();
  
  sessions.forEach(session => {
    const type = session.type;
    if (!sessionTypes.has(type)) {
      sessionTypes.set(type, { booked: 0, capacity: 0 });
    }
    
    const current = sessionTypes.get(type)!;
    current.booked += session.bookedCount || 0;
    current.capacity += session.maxCapacity;
    sessionTypes.set(type, current);
  });
  
  const popularityData = Array.from(sessionTypes.entries())
    .map(([type, data]) => ({
      type,
      bookingRate: data.capacity > 0 
        ? Math.round((data.booked / data.capacity) * 100) 
        : 0,
      booked: data.booked,
      capacity: data.capacity
    }))
    .sort((a, b) => b.bookingRate - a.bookingRate);
  
  // Find underperforming sessions (< 10% capacity)
  const underperformingSessions = sessions
    .filter(session => {
      const rate = session.maxCapacity > 0 
        ? (session.bookedCount / session.maxCapacity) * 100 
        : 0;
      return rate < 10 && session.isActive;
    })
    .length;
  
  // Create monthly booking chart data
  const monthlyData = new Map<string, { sessions: number, bookings: number }>();
  
  sessions.forEach(session => {
    const month = new Date(session.date).toLocaleString('default', { month: 'short' });
    
    if (!monthlyData.has(month)) {
      monthlyData.set(month, { sessions: 0, bookings: 0 });
    }
    
    const current = monthlyData.get(month)!;
    current.sessions += 1;
    current.bookings += session.bookedCount || 0;
    monthlyData.set(month, current);
  });
  
  const monthlyChartData = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      sessions: data.sessions,
      bookings: data.bookings
    }))
    .sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {activeSessions}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CalendarCheck className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {sessions.length} total sessions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {totalCapacity}
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {utilizationRate}% utilized overall
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Performing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {popularityData.length > 0 ? popularityData[0].type : 'N/A'}
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {popularityData.length > 0 ? `${popularityData[0].bookingRate}% booking rate` : 'No data'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Underperforming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {underperformingSessions}
              </div>
              <div className="p-2 bg-red-500/10 rounded-full">
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sessions below 10% capacity
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Sessions & Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {monthlyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sessions" name="Sessions" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="bookings" name="Bookings" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Session Type Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {popularityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={popularityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="bookingRate" 
                      name="Booking Rate (%)" 
                      stroke="#8884d8" 
                      fill="#8884d8"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionsAnalytics;

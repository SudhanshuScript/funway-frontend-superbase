
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Download, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionStatsProps {
  sessions: Session[];
  className?: string;
}

export function SessionStats({ sessions, className }: SessionStatsProps) {
  const [timeRange, setTimeRange] = React.useState("weekly");
  
  // Calculate session statistics
  const getMostPopularSessions = () => {
    return [...sessions]
      .filter(session => session.isActive)
      .sort((a, b) => (b.bookedCount / b.maxCapacity) - (a.bookedCount / a.maxCapacity))
      .slice(0, 5)
      .map(session => ({
        name: session.name,
        bookings: session.bookedCount,
        capacity: session.maxCapacity,
        percentage: Math.round((session.bookedCount / session.maxCapacity) * 100),
      }));
  };
  
  const getHighPerformingSessions = () => {
    return [...sessions]
      .filter(session => session.isActive && (session.bookedCount / session.maxCapacity) >= 0.7)
      .sort((a, b) => (b.bookedCount / b.maxCapacity) - (a.bookedCount / a.maxCapacity))
      .slice(0, 3)
      .map(session => ({
        name: session.name,
        bookings: session.bookedCount,
        capacity: session.maxCapacity,
        percentage: Math.round((session.bookedCount / session.maxCapacity) * 100),
      }));
  };
  
  const getUnderperformingSessions = () => {
    return [...sessions]
      .filter(session => session.isActive && (session.bookedCount / session.maxCapacity) <= 0.3)
      .sort((a, b) => (a.bookedCount / a.maxCapacity) - (b.bookedCount / b.maxCapacity))
      .slice(0, 3)
      .map(session => ({
        name: session.name,
        bookings: session.bookedCount,
        capacity: session.maxCapacity,
        percentage: Math.round((session.bookedCount / session.maxCapacity) * 100),
      }));
  };

  const mostPopularSessions = getMostPopularSessions();
  const highPerformingSessions = getHighPerformingSessions();
  const underperformingSessions = getUnderperformingSessions();
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <h2 className="text-lg font-medium">Session Performance Insights</h2>
        <div className="flex items-center gap-2">
          <Tabs 
            defaultValue="weekly"
            value={timeRange} 
            onValueChange={setTimeRange} 
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              Most Popular Sessions
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostPopularSessions.length > 0 ? (
              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mostPopularSessions}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={10} tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value} />
                    <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                    <Tooltip
                      formatter={(value, name) => [`${value}%`, 'Booking Rate']}
                      labelFormatter={(label) => label}
                    />
                    <Bar dataKey="percentage" name="Booking Rate" fill="#3b82f6">
                      {mostPopularSessions.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.percentage >= 90 ? '#ef4444' : 
                                entry.percentage >= 70 ? '#f59e0b' : 
                                entry.percentage >= 40 ? '#22c55e' : '#3b82f6'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-muted-foreground">No session data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              High-Performing Sessions
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {highPerformingSessions.length > 0 ? (
              <div className="space-y-4">
                {highPerformingSessions.map((session) => (
                  <div key={session.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{session.name}</span>
                      <span>{session.percentage}% booked</span>
                    </div>
                    <div className="bg-muted rounded-full h-2 w-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${session.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.bookings} of {session.capacity} seats booked
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No high-performing sessions yet</p>
                <p className="text-xs text-muted-foreground">Sessions with 70%+ booking rate will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              Underperforming Sessions
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {underperformingSessions.length > 0 ? (
              <div className="space-y-4">
                {underperformingSessions.map((session) => (
                  <div key={session.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{session.name}</span>
                      <span>{session.percentage}% booked</span>
                    </div>
                    <div className="bg-muted rounded-full h-2 w-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${session.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.bookings} of {session.capacity} seats booked
                    </div>
                  </div>
                ))}
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 mt-4">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700">
                    Consider adjusting pricing or promoting these underperforming sessions to increase bookings.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
                <TrendingDown className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No underperforming sessions</p>
                <p className="text-xs text-muted-foreground">Sessions with less than 30% booking rate will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

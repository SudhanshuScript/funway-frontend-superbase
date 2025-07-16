
import React from 'react';
import { Session } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Users, TrendingUp, Tag, CheckCircle, AlertCircle, ThumbsUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer 
} from 'recharts';

interface SessionPerformanceInsightsProps {
  sessions: Session[];
  selectedFranchiseId: string | 'all';
}

type SessionPerformanceStat = {
  id: string;
  name: string;
  occupancy: number;
  rating: number;
  repeatGuests: number;
  revenue: number;
  offerUsage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
};

const SessionPerformanceInsights: React.FC<SessionPerformanceInsightsProps> = ({ 
  sessions,
  selectedFranchiseId 
}) => {
  const [timeRange, setTimeRange] = React.useState<'7d' | '14d' | '30d'>('7d');
  
  // Mock data for demonstration - in a real implementation, this would come from the API
  const performanceData: SessionPerformanceStat[] = sessions.slice(0, 5).map(session => ({
    id: session.id,
    name: session.name,
    occupancy: Math.floor(80 * (session.bookedCount / session.maxCapacity)),
    rating: 4.2 + (Math.random() * 0.8),
    repeatGuests: Math.floor(Math.random() * 15),
    revenue: session.bookedCount * (session.specialPricing || 1500),
    offerUsage: Math.floor(Math.random() * 100),
    trend: Math.random() > 0.3 ? 'up' : 'down',
    trendValue: Math.floor(Math.random() * 20)
  }));
  
  // Mock booking trend data
  const bookingTrendData = Array.from({ length: 7 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - idx));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bookings: Math.floor(Math.random() * 40 + 10),
      cancellations: Math.floor(Math.random() * 10),
      noShows: Math.floor(Math.random() * 5),
    };
  });
  
  // Top performing sessions (sorted by occupancy)
  const topPerformers = [...performanceData]
    .sort((a, b) => b.occupancy - a.occupancy)
    .slice(0, 3);
  
  // Underperforming sessions
  const needsAttention = [...performanceData]
    .filter(s => s.occupancy < 40 || s.rating < 3.5)
    .slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Session Performance Insights</h2>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as '7d' | '14d' | '30d')} className="w-auto">
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="14d">14 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Session Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceData.slice(0, 3).map(session => (
          <Card key={session.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{session.name}</CardTitle>
              <CardDescription className="flex justify-between">
                <span>Occupancy</span>
                <Badge className={session.occupancy > 70 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                  {session.occupancy}%
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={session.occupancy} className="h-2" />
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="font-medium">{session.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Repeat Guests</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="font-medium">{session.repeatGuests}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="font-medium">₹{session.revenue.toLocaleString()}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Trend vs Last Week</span>
                  <div className="flex items-center">
                    {session.trend === 'up' ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="font-medium text-green-600">+{session.trendValue}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
                        <span className="font-medium text-red-600">-{session.trendValue}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {session.occupancy > 80 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" /> High Performer
                  </Badge>
                )}
                {session.rating > 4.7 && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Star className="h-3 w-3 mr-1" /> Top Rated
                  </Badge>
                )}
                {session.offerUsage > 50 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Tag className="h-3 w-3 mr-1" /> Popular Offers
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Booking Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
          <CardDescription>View bookings, cancellations and no-shows over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookingTrendData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="bookings" fill="#8b5cf6" name="Bookings" />
                <Bar dataKey="cancellations" fill="#ef4444" name="Cancellations" />
                <Bar dataKey="noShows" fill="#f59e0b" name="No Shows" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Two Column Layout for Top Performers and Sessions Needing Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performing Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ThumbsUp className="h-5 w-5 text-purple-500 mr-2" />
              Top Performing Sessions
            </CardTitle>
            <CardDescription>Ranked by occupancy, ratings and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map(session => (
                <div key={session.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                  <div>
                    <div className="font-medium">{session.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                      {session.rating.toFixed(1)} • ₹{session.revenue.toLocaleString()} revenue
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {session.occupancy}% full
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Sessions That Need Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              Sessions Needing Attention
            </CardTitle>
            <CardDescription>Sessions with lower occupancy or ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {needsAttention.length > 0 ? (
                needsAttention.map(session => (
                  <div key={session.id} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between">
                      <div className="font-medium">{session.name}</div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {session.occupancy}% occupancy
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <span className="font-medium">Issue:</span> {session.occupancy < 40 ? 'Low bookings' : 'Below average rating'}
                    </div>
                    <div className="mt-1 text-sm text-purple-600">
                      <span className="font-medium">Suggestion:</span> {
                        session.occupancy < 40 
                          ? 'Consider adding a special promotion or discount' 
                          : 'Review guest feedback and address common concerns'
                      }
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p className="font-medium">All sessions are performing well!</p>
                  <p className="text-sm">No sessions currently need attention.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Powered Suggestions */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">AI-Powered Suggestions</CardTitle>
          <CardDescription className="text-purple-700">Smart recommendations based on session performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceData.slice(0, 3).map((session, idx) => (
              <div key={session.id} className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                <h4 className="font-medium text-purple-800">{session.name}</h4>
                <p className="text-sm text-gray-600 my-2">{
                  idx === 0 ? "This session is popular! Consider duplicating it on Sundays at 7 PM." :
                  idx === 1 ? "Apply a ₹250-off coupon to boost occupancy for this time slot." :
                  "Rename this session to make it more appealing to guests."
                }</p>
                <div className="flex space-x-2 mt-3">
                  <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-md transition-colors">
                    ✅ Apply
                  </button>
                  <button className="text-xs bg-white border border-purple-300 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-50 transition-colors">
                    📅 Schedule
                  </button>
                  <button className="text-xs bg-white border border-purple-300 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-50 transition-colors">
                    ❌ Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionPerformanceInsights;

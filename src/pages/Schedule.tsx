import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, Star, Calendar as CalendarComponent, CalendarCheck, BarChart } from "lucide-react";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SessionManager from "@/components/sessions/SessionManager";
import { toast } from "sonner";
import { SessionDialog } from "@/components/sessions/SessionDialog";
import { useSessionManager } from "@/components/sessions/useSessionManager";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Schedule = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    upcoming: 0,
    special: 0,
    totalCapacity: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { sessions, createSession } = useSessionManager();
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    const loadSessionStats = async () => {
      setIsLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const upcoming = sessions.filter(s => s.date >= today).length;
        const special = sessions.filter(s => s.isSpecialDate).length;
        const totalCapacity = sessions.reduce((sum, s) => sum + s.maxCapacity, 0);
        
        setSessionStats({
          total: sessions.length,
          upcoming,
          special,
          totalCapacity
        });
      } catch (error) {
        console.error("Error loading session stats:", error);
        toast.error("Failed to load session statistics");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSessionStats();
  }, [currentUser, navigate, sessions]);

  if (!currentUser) {
    return null;
  }
  
  const handleCreateSession = () => {
    setShowSessionDialog(true);
  };
  
  const handleDialogClose = () => {
    setShowSessionDialog(false);
  };

  const handleSessionSave = async (data: any) => {
    await createSession(data);
    setShowSessionDialog(false);
  };

  const topPerformingSessions = [
    { name: 'Sunset Dinner', bookings: 45 },
    { name: 'Breakfast', bookings: 38 },
    { name: 'Lunch', bookings: 30 },
    { name: 'Special Event', bookings: 25 },
    { name: 'Dinner', bookings: 20 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2" />
            <h2 className="text-2xl font-bold">Schedule Management</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <CalendarComponent className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
            <Button onClick={handleCreateSession}>
              <Plus className="mr-2 h-4 w-4" /> Create Session
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  sessionStats.total
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoading ? "Loading..." : `${sessionStats.upcoming} upcoming sessions`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Special Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" fill="currentColor" />
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    sessionStats.special
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoading ? "Loading..." : (sessionStats.special > 0 ? "Next: Valentine's Day Special" : "No special dates")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  sessionStats.totalCapacity
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoading ? "Loading..." : "65% avg. utilization"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarCheck className="h-5 w-5 mr-2 text-green-500" />
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    sessionStats.upcoming
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoading ? "Loading..." : "Ready for booking"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Top Performing Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={topPerformingSessions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Session Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Most Popular Times</h4>
                  <p className="text-sm text-muted-foreground">
                    Evening sessions (6 PM - 8 PM) are showing highest booking rates
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Capacity Utilization</h4>
                  <p className="text-sm text-muted-foreground">
                    Weekend sessions are at 85% average capacity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <SessionManager />
        
        <SessionDialog 
          isOpen={showSessionDialog} 
          onClose={handleDialogClose}
          onSave={handleSessionSave}
        />
      </div>
    </DashboardLayout>
  );
};

export default Schedule;

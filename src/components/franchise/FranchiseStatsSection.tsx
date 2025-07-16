
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FranchiseFiltersState } from '@/types/franchiseManagement';
import { CalendarDays, Users, DollarSign, AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FranchiseStatsSectionProps {
  filters: FranchiseFiltersState;
  franchiseId?: string;
}

const FranchiseStatsSection: React.FC<FranchiseStatsSectionProps> = ({ filters, franchiseId }) => {
  const [stats, setStats] = useState({
    dailyBookings: 0,
    weeklyBookings: 0,
    monthlyBookings: 0,
    utilization: 0,
    earnings: 0,
    pendingDocuments: 0,
    inactiveAlerts: 0
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch this data from the backend
      // For now, we're simulating with randomized data
      
      // This simulates API call latency
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Generate random stats for demonstration
      const mockStats = {
        dailyBookings: Math.floor(Math.random() * 50) + 10,
        weeklyBookings: Math.floor(Math.random() * 300) + 100,
        monthlyBookings: Math.floor(Math.random() * 1000) + 500,
        utilization: Math.floor(Math.random() * 40) + 60, // 60-100%
        earnings: Math.floor(Math.random() * 50000) + 10000,
        pendingDocuments: Math.floor(Math.random() * 10),
        inactiveAlerts: Math.floor(Math.random() * 5)
      };
      
      setStats(mockStats);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching franchise stats:', error);
      toast.error('Failed to load franchise statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [franchiseId, filters]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Franchise Performance Statistics</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2" 
            onClick={fetchStats} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.dailyBookings)}</div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Today: {formatNumber(stats.dailyBookings)}</span>
              <span>Week: {formatNumber(stats.weeklyBookings)}</span>
              <span>Month: {formatNumber(stats.monthlyBookings)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilization}%</div>
            <div className="w-full bg-muted rounded-full h-2.5 mt-2">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${stats.utilization}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active sessions vs capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.earnings)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.earnings > 20000 ? '↑' : '↓'} {Math.round(Math.random() * 15 + 5)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attention Required</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded">
                <div className="font-medium text-amber-800 dark:text-amber-400 text-sm">Documents</div>
                <div className="flex items-center mt-1">
                  <FileText className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-500" />
                  <span className="text-sm">{stats.pendingDocuments} pending</span>
                </div>
              </div>
              
              <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded">
                <div className="font-medium text-red-800 dark:text-red-400 text-sm">Inactive</div>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1 text-red-600 dark:text-red-500" />
                  <span className="text-sm">{stats.inactiveAlerts} alerts</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FranchiseStatsSection;

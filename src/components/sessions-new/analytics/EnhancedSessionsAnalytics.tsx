
import React, { useState } from 'react';
import { Session } from '@/types';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import StatCardsSection from './components/StatCardsSection';
import DailyTrendsChart from './components/DailyTrendsChart';
import OccupancyRateChart from './components/OccupancyRateChart';
import SessionTypeDistribution from './components/SessionTypeDistribution';
import PerformanceComparison from './components/PerformanceComparison';
import { useSessionAnalytics } from './hooks/useSessionAnalytics';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

// Define Analytics filters types
interface AnalyticsFilters {
  timeRange: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  sessionType: 'all' | 'regular' | 'special';
}

interface EnhancedSessionsAnalyticsProps {
  sessions: Session[];
  loading?: boolean;
  franchiseId?: string;
  onExport?: (format: 'pdf' | 'csv') => void;
}

const EnhancedSessionsAnalytics = ({ 
  sessions, 
  loading = false,
  franchiseId,
  onExport 
}: EnhancedSessionsAnalyticsProps) => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    timeRange: 'weekly',
    sessionType: 'all'
  });
  
  const handleTimeRangeChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      timeRange: value as 'daily' | 'weekly' | 'monthly' | 'quarterly'
    }));
  };
  
  const handleSessionTypeChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      sessionType: value as 'all' | 'regular' | 'special'
    }));
  };

  const { 
    filteredSessions,
    stats,
    growthIndicators,
    dailyTrendsData,
    sessionTypesData,
    occupancyComparisonData,
    performanceComparisonData
  } = useSessionAnalytics(sessions, filters, franchiseId);
  
  // Handle export button click
  const handleExport = (format: 'pdf' | 'csv') => {
    if (onExport) {
      onExport(format);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold">Session Performance Analytics</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs 
            value={filters.timeRange} 
            onValueChange={handleTimeRangeChange} 
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select value={filters.sessionType} onValueChange={handleSessionTypeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Session Type</SelectLabel>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="grid gap-2">
                <Button variant="ghost" className="justify-start" onClick={() => handleExport('pdf')}>
                  Export as PDF
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleExport('csv')}>
                  Export as CSV
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <StatCardsSection 
        stats={stats} 
        growthIndicators={growthIndicators} 
        loading={loading} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DailyTrendsChart 
          data={dailyTrendsData} 
          loading={loading} 
        />
        
        <OccupancyRateChart 
          data={occupancyComparisonData} 
          loading={loading} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SessionTypeDistribution 
          data={sessionTypesData} 
          loading={loading} 
        />
        
        <div className="lg:col-span-2">
          <PerformanceComparison 
            data={performanceComparisonData} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedSessionsAnalytics;

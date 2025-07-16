
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { SessionStats, GrowthIndicators } from '../hooks/useSessionAnalytics';

interface StatCardsSectionProps {
  stats: SessionStats;
  growthIndicators: GrowthIndicators;
  loading: boolean;
}

const StatCardsSection = ({ stats, growthIndicators, loading }: StatCardsSectionProps) => {
  // Animation variants for stats cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="overflow-hidden border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-[120px] mb-2" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.activeSessions}
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.activeSessions} active sessions in this period
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-[120px] mb-2" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.utilizationRate}%
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-full">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Badge variant={growthIndicators.utilization >= 0 ? "outline" : "destructive"} className="text-xs">
                    {growthIndicators.utilization >= 0 ? '↑' : '↓'} {Math.abs(growthIndicators.utilization)}%
                  </Badge>
                  <span className="text-muted-foreground">vs previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
        <Card className="overflow-hidden border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Performing</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-full mb-2" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold truncate max-w-[150px]" title={stats.mostPopular.type}>
                    {stats.mostPopular.type}
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.mostPopular.rate}% booking rate
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
        <Card className="overflow-hidden border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Underperforming</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-[120px] mb-2" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.underperforming}
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-full">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sessions below 30% capacity
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StatCardsSection;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface SessionPerformance {
  name: string;
  type: string;
  utilization: number;
  booked: number;
  capacity: number;
}

interface PerformanceData {
  top: SessionPerformance[];
  under: SessionPerformance[];
}

interface PerformanceComparisonProps {
  data: PerformanceData;
  loading: boolean;
}

const PerformanceComparison = ({ data, loading }: PerformanceComparisonProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-4 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Top Performing Sessions
            </h4>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : data.top.length > 0 ? (
              <div className="space-y-3">
                {data.top.map((session, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate max-w-[70%]" title={session.name}>{session.name}</span>
                      <span>{session.utilization}%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2 w-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${session.utilization}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${session.utilization}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No data available
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-4 flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Underutilized Sessions
            </h4>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : data.under.length > 0 ? (
              <div className="space-y-3">
                {data.under.map((session, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate max-w-[70%]" title={session.name}>{session.name}</span>
                      <span>{session.utilization}%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2 w-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${session.utilization}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${session.utilization}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No underutilized sessions
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceComparison;

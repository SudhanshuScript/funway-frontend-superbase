
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartData {
  date: string;
  formattedDate: string;
  sessions: number;
  bookings: number;
  utilization: number;
}

interface DailyTrendsChartProps {
  data: ChartData[];
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DailyTrendsChart = ({ data, loading }: DailyTrendsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily Booking Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="formattedDate" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="sessions" name="Sessions" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="bookings" name="Bookings" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available for the selected period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTrendsChart;

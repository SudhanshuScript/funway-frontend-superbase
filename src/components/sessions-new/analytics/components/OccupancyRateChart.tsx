
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
  Cell
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface OccupancyData {
  name: string;
  occupancy: number;
  booked: number;
  capacity: number;
}

interface OccupancyRateChartProps {
  data: OccupancyData[];
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          {`Occupancy Rate: ${payload[0].value}%`}
        </p>
        <p className="text-sm">
          {`Booked: ${payload[0].payload.booked}/${payload[0].payload.capacity}`}
        </p>
      </div>
    );
  }
  return null;
};

const OccupancyRateChart = ({ data, loading }: OccupancyRateChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Occupancy Rate by Session Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="occupancy" name="Occupancy Rate (%)" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.occupancy > 70 ? '#4ade80' : entry.occupancy > 40 ? '#facc15' : '#f87171'} 
                    />
                  ))}
                </Bar>
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

export default OccupancyRateChart;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  Tooltip,
  Cell,
  Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface TypeData {
  name: string;
  value: number;
}

interface SessionTypeDistributionProps {
  data: TypeData[];
  loading: boolean;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm">{`Sessions: ${payload[0].value}`}</p>
        <p className="text-sm">{`Percentage: ${payload[0].percent.toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

const SessionTypeDistribution = ({ data, loading }: SessionTypeDistributionProps) => {
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base">Session Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionTypeDistribution;

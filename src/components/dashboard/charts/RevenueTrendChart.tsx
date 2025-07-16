
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RevenueTrendChartProps {
  data: {
    name: string;
    revenue: number;
    lastPeriod: number;
  }[];
  dateFilter: string;
}

const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data, dateFilter }) => {
  // Only show 30 days for monthly view, 7 for weekly, 1 for daily
  const filteredData = dateFilter === "month" 
    ? data.slice(0, 30) 
    : dateFilter === "week" 
      ? data.slice(0, 7) 
      : data.slice(0, 1);
  
  // Custom tooltip for revenue chart
  const RevenueTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-lg">
          <p className="text-gray-200 font-medium">{label}</p>
          <p className="text-purple-300">
            Current: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-green-300">
            Previous: ${payload[1].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden bg-[#141727]/70 backdrop-blur-xl border-[#303650] shadow-xl">
      <CardHeader className="border-b border-[#303650]">
        <CardTitle className="text-lg font-medium text-white">REVENUE TRENDS</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[340px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              onMouseLeave={() => {}}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLastPeriod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#303650" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6b7280" tickLine={false} axisLine={{ stroke: '#303650' }} />
              <YAxis stroke="#6b7280" tickLine={false} axisLine={{ stroke: '#303650' }} 
                    tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<RevenueTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }} 
                formatter={(value) => <span className="text-gray-300">{value}</span>} 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Current Period" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "#141727" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#8b5cf6" }}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Line 
                type="monotone" 
                dataKey="lastPeriod" 
                name="Previous Period" 
                stroke="#4ade80" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, strokeWidth: 2, fill: "#141727" }}
                fillOpacity={1}
                fill="url(#colorLastPeriod)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendChart;

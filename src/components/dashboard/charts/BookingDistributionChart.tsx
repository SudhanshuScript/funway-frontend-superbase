
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BookingDistributionChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const BookingDistributionChart: React.FC<BookingDistributionChartProps> = ({ data }) => {
  // Calculate total booking value for percentage display
  const totalBookingValue = data.reduce((acc, item) => acc + item.value, 0);
  
  // Modern color palette for charts
  const BOOKING_COLORS = ['#4ade80', '#facc15', '#f87171'];
  
  return (
    <Card className="overflow-hidden bg-[#141727]/70 backdrop-blur-xl border-[#303650] shadow-xl">
      <CardHeader className="border-b border-[#303650]">
        <CardTitle className="text-lg font-medium text-white">BOOKING DISTRIBUTION</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex h-[300px] items-center justify-center">
          <div className="w-[300px] h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={BOOKING_COLORS[index % BOOKING_COLORS.length]} 
                      stroke="#141727"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => {
                    const percent = Number(value) / totalBookingValue * 100;
                    return [`${value} (${percent.toFixed(0)}%)`];
                  }}
                  contentStyle={{ background: '#141727', border: '1px solid #303650', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <h3 className="text-2xl font-bold text-white">{totalBookingValue}</h3>
              <p className="text-xs text-gray-400">Total Bookings</p>
            </div>
          </div>
          <div className="space-y-2 ml-4">
            {data.map((entry, index) => {
              const percent = Math.round((entry.value / totalBookingValue) * 100);
              return (
                <div key={entry.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: BOOKING_COLORS[index % BOOKING_COLORS.length] }} 
                  />
                  <span className="text-gray-300 text-sm">{entry.name}:</span>
                  <span className="ml-2 text-gray-300 font-medium">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingDistributionChart;


import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TopPerformingFranchisesChartProps {
  data: {
    name: string;
    revenue: number;
    satisfaction: number;
  }[];
}

const TopPerformingFranchisesChart: React.FC<TopPerformingFranchisesChartProps> = ({ data }) => {
  return (
    <Card className="overflow-hidden bg-[#141727]/70 backdrop-blur-xl border-[#303650] shadow-xl">
      <CardHeader className="border-b border-[#303650]">
        <CardTitle className="text-lg font-medium text-white">TOP PERFORMING FRANCHISES</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[340px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              barGap={0}
              barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#303650" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6b7280" tickLine={false} axisLine={{ stroke: '#303650' }} />
              <YAxis yAxisId="left" stroke="#6b7280" tickLine={false} axisLine={{ stroke: '#303650' }} 
                     tickFormatter={(value) => `$${value}`} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 5]} stroke="#6b7280" 
                     tickLine={false} axisLine={{ stroke: '#303650' }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === "revenue" ? `$${value.toLocaleString()}` : value, 
                  name === "revenue" ? "Revenue" : "Satisfaction"
                ]} 
                contentStyle={{ background: '#141727', border: '1px solid #303650', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }} 
                formatter={(value) => <span className="text-gray-300">{value}</span>} 
              />
              <Bar 
                yAxisId="left" 
                dataKey="revenue" 
                name="Revenue" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1000}
              />
              <Bar 
                yAxisId="right" 
                dataKey="satisfaction" 
                name="Satisfaction Score" 
                fill="#4ade80" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1000} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformingFranchisesChart;

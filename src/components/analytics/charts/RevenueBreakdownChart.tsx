
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface RevenueBreakdownChartProps {
  data: Array<{ name: string; value: number }>;
  tableData: Array<{
    category: string;
    revenue: string;
    growth: string;
    growthIsPositive: boolean;
  }>;
}

const RevenueBreakdownChart: React.FC<RevenueBreakdownChartProps> = ({ data, tableData }) => {
  const colors = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d"];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Category</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Growth</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className={index < tableData.length - 1 ? "border-b" : ""}>
                    <td className="py-2">{row.category}</td>
                    <td className="text-right">{row.revenue}</td>
                    <td className={`text-right ${row.growthIsPositive ? "text-green-600" : "text-red-600"}`}>
                      {row.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownChart;

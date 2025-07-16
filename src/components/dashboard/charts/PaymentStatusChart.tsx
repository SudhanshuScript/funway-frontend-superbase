
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PaymentData } from "./types";

interface PaymentStatusChartProps {
  data: PaymentData[];
}

const PaymentStatusChart: React.FC<PaymentStatusChartProps> = ({ data }) => {
  const colors = ["#3b82f6", "#fbbf24", "#ef4444", "#a855f7"];
  
  // Modify the tooltip formatter to return a string instead of number[]
  const tooltipFormatter = (value: number): string => {
    return `${value} bookings`;
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Payment Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                formatter={tooltipFormatter}
                labelStyle={{ color: "black" }}
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #e2e8f0" 
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                fill="#3b82f6"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatusChart;

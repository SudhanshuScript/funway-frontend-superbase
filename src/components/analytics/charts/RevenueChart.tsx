
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, ReferenceLine 
} from "recharts";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon,
  BarChart3, 
  LineChart as LineChartIcon
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RevenueChartProps {
  data: Array<{ name: string; value: number }>;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [showAverage, setShowAverage] = useState<boolean>(false);
  
  const avgRevenue = data.reduce((sum, item) => sum + item.value, 0) / data.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm text-primary">{`Revenue: $${payload[0].value.toLocaleString()}`}</p>
          <p className="text-xs text-muted-foreground mt-1">Click for detailed breakdown</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Revenue Trends</CardTitle>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <CalendarIcon className="mr-2 h-4 w-4" />
                View Options
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Chart Settings</h4>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={showAverage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowAverage(!showAverage)}
                    >
                      {showAverage ? "Hide Average" : "Show Average"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert("Compare with previous period")}
                    >
                      Compare Periods
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Data Range</h4>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">This Year</Button>
                    <Button variant="outline" size="sm">Last Year</Button>
                    <Button variant="outline" size="sm">Custom...</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {chartType === 'line' ? 
                  <LineChartIcon className="h-4 w-4" /> : 
                  <BarChart3 className="h-4 w-4" />
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setChartType('line')}>
                <LineChartIcon className="mr-2 h-4 w-4" />
                Line Chart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType('bar')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Bar Chart
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              name="Revenue"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            {showAverage && (
              <ReferenceLine
                y={avgRevenue}
                stroke="#FF8042"
                strokeDasharray="3 3"
                label={{ value: `Avg: $${Math.round(avgRevenue)}`, position: 'insideBottomRight' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;

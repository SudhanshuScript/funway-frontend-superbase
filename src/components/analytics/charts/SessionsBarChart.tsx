
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LabelList
} from "recharts";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  PieChart, 
  LineChart,
  ArrowDownUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SessionsBarChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
}

const SessionsBarChart: React.FC<SessionsBarChartProps> = ({ data, title }) => {
  const [chartType, setChartType] = useState<'bar' | 'horizontal'>('bar');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const colors = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981'];
  
  // Sort data based on sort order
  const sortedData = [...data].sort((a, b) => 
    sortOrder === 'desc' ? b.value - a.value : a.value - b.value
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary">
            {title.includes("Revenue") ? `$${payload[0].value.toLocaleString()}` : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="h-8"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <BarChart3 className="h-4 w-4 mr-2" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setChartType('bar')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Bar Chart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType('horizontal')}>
                <LineChart className="mr-2 h-4 w-4" />
                Horizontal Bar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Switching to Pie Chart")}>
                <PieChart className="mr-2 h-4 w-4" />
                Pie Chart
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={sortedData} 
            layout={chartType === 'horizontal' ? 'vertical' : 'horizontal'}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
            {chartType === 'horizontal' ? (
              <>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
              </>
            ) : (
              <>
                <XAxis dataKey="name" />
                <YAxis />
              </>
            )}
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]} 
              animationDuration={1000}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
              <LabelList 
                dataKey="value" 
                position={chartType === 'horizontal' ? 'right' : 'top'} 
                style={{ fill: '#888888', fontSize: 12 }} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SessionsBarChart;

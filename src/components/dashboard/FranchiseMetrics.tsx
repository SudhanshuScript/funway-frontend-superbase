
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { downloadCSVReport, generateFranchiseReport } from "../../utils/exportUtils";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface FranchiseMetricsProps {
  franchiseId?: string;
  onFranchiseChange?: (id: string) => void;
}

const mockData = {
  revenue: [
    { date: '2025-04-15', value: 1200 },
    { date: '2025-04-16', value: 1900 },
    { date: '2025-04-17', value: 1600 },
    { date: '2025-04-18', value: 2100 },
    { date: '2025-04-19', value: 2400 }
  ],
  occupancy: [
    { session: 'Morning', value: 75 },
    { session: 'Afternoon', value: 85 },
    { session: 'Evening', value: 95 },
    { session: 'Night', value: 65 }
  ]
};

export const FranchiseMetrics: React.FC<FranchiseMetricsProps> = ({
  franchiseId,
  onFranchiseChange
}) => {
  const handleExport = async () => {
    if (franchiseId) {
      try {
        await generateFranchiseReport(franchiseId);
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select 
          value={franchiseId} 
          onValueChange={onFranchiseChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select franchise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="f1">FlyDining Goa</SelectItem>
            <SelectItem value="f2">FlyDining Jaipur</SelectItem>
            <SelectItem value="f3">Puerto Rico</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleExport} disabled={!franchiseId}>
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy by Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.occupancy}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

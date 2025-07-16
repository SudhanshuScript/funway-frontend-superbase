
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FranchiseData {
  name: string;
  revenue: number;
  feedback: number;
  occupancy: number;
  growth: number;
}

interface FranchiseComparisonTableProps {
  data: FranchiseData[];
  onViewDetailedReport: () => void;
}

export const FranchiseComparisonTable: React.FC<FranchiseComparisonTableProps> = ({ 
  data, 
  onViewDetailedReport 
}) => {
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="franchise" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Franchise Performance Comparison</h3>
            <TabsList>
              <TabsTrigger value="country">Country View</TabsTrigger>
              <TabsTrigger value="franchise">Franchise View</TabsTrigger>
              <TabsTrigger value="city">City View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="franchise" className="mt-0">
            <div className="relative overflow-x-auto rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-3">Franchise</th>
                    <th className="px-6 py-3">Revenue</th>
                    <th className="px-6 py-3">Feedback</th>
                    <th className="px-6 py-3">Occupancy</th>
                    <th className="px-6 py-3">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((franchise, index) => (
                    <tr key={franchise.name} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <td className="px-6 py-4 font-medium">{franchise.name}</td>
                      <td className="px-6 py-4">${formatNumber(franchise.revenue)}</td>
                      <td className="px-6 py-4">{franchise.feedback}/5.0</td>
                      <td className="px-6 py-4">{franchise.occupancy}%</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {franchise.growth >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={franchise.growth >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {franchise.growth >= 0 ? '+' : ''}{franchise.growth}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="country" className="mt-0">
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Select a country to view detailed analytics</p>
            </div>
          </TabsContent>
          
          <TabsContent value="city" className="mt-0">
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Select a city to view detailed analytics</p>
            </div>
          </TabsContent>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={onViewDetailedReport}>
              View Detailed Performance Report
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

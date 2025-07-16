
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SessionOccupancyData {
  name: string;
  rate: number;
  capacity: number;
}

interface SessionOccupancyRatesProps {
  data: SessionOccupancyData[];
  averageRate: number;
}

export const SessionOccupancyRates: React.FC<SessionOccupancyRatesProps> = ({ data, averageRate }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Occupancy Rate by Session Type</h3>
          <Badge variant="secondary">
            Average: {averageRate}%
          </Badge>
        </div>
        
        <div className="space-y-4">
          {data.map((session) => (
            <div key={session.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{session.name}</span>
                <span className="font-medium">{session.rate}%</span>
              </div>
              <Progress value={session.rate} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  subText?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, value, change, icon, subText }) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
            
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-[#00C48C] mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-[#FF647C] mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-[#00C48C]' : 'text-[#FF647C]'}`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              {subText && <span className="ml-2 text-xs text-muted-foreground">{subText}</span>}
            </div>
          </div>
          
          <div className="bg-[#7B61FF]/10 p-3 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

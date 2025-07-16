
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface InsightCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'green' | 'red' | 'blue' | 'amber';
}

const InsightCard = ({ title, value, icon, description, trend, color }: InsightCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green': return "bg-green-500/10 text-green-500";
      case 'red': return "bg-red-500/10 text-red-500";
      case 'blue': return "bg-blue-500/10 text-blue-500";
      case 'amber': return "bg-amber-500/10 text-amber-500";
      default: return "bg-primary/10 text-primary";
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return "text-green-500";
    if (trend === 'down') return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-full ${getColorClasses()}`}>
            {icon}
          </div>
          <div className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
          </div>
        </div>
        <h3 className="font-medium text-lg mb-1">{title}</h3>
        <p className="text-3xl font-bold mb-2">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default InsightCard;

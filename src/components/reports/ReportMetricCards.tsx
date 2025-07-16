
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReportData, ReportType } from '@/utils/reportUtils';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign } from 'lucide-react';

interface ReportMetricCardsProps {
  reportType: ReportType;
  data: ReportData[];
}

const ReportMetricCards: React.FC<ReportMetricCardsProps> = ({ reportType, data }) => {
  // Calculate metrics based on report type and data
  const calculateMetrics = () => {
    switch (reportType) {
      case 'sales':
        return [
          {
            title: 'Total Sales',
            value: `$${data.reduce((sum, row) => sum + row.revenue, 0).toLocaleString()}`,
            icon: <DollarSign className="h-5 w-5" aria-label="Total Sales" />,
            trend: 'up'
          },
          {
            title: 'Average Booking Value',
            value: `$${Math.round(
              data.reduce((sum, row) => sum + row.revenue, 0) / 
              data.reduce((sum, row) => sum + row.bookings, 0)
            ).toLocaleString()}`,
            icon: <DollarSign className="h-5 w-5" aria-label="Average Booking Value" />,
            trend: 'up'
          },
          {
            title: 'Total Guests',
            value: data.reduce((sum, row) => sum + row.bookings, 0).toString(),
            icon: <Users className="h-5 w-5" aria-label="Total Guests" />,
            trend: 'up'
          },
          {
            title: 'Best Performing Day',
            value: getBestPerformingDay(data),
            icon: <Calendar className="h-5 w-5" aria-label="Best Day" />,
            trend: 'neutral'
          }
        ];
      case 'bookings':
        return [
          {
            title: 'Total Bookings',
            value: data.reduce((sum, row) => sum + row.bookings, 0).toString(),
            icon: <Users className="h-5 w-5" aria-label="Total Bookings" />,
            trend: 'up'
          },
          {
            title: 'Average Occupancy',
            value: `${Math.round(
              data.reduce((sum, row) => sum + row.occupancy, 0) / data.length
            )}%`,
            icon: <Users className="h-5 w-5" aria-label="Average Occupancy" />,
            trend: 'up'
          },
          {
            title: 'Regular Guests',
            value: data.reduce((sum, row) => sum + row.guestTypes.regular, 0).toString(),
            icon: <Users className="h-5 w-5" aria-label="Regular Guests" />,
            trend: 'neutral'
          },
          {
            title: 'First Time Guests',
            value: data.reduce((sum, row) => sum + row.guestTypes.firstTime, 0).toString(),
            icon: <Users className="h-5 w-5" aria-label="First Time Guests" />,
            trend: 'up'
          }
        ];
      case 'guests':
        return [
          {
            title: 'Total Guests',
            value: data.reduce((sum, row) => sum + row.bookings, 0).toString(),
            icon: <Users className="h-5 w-5" aria-label="Total Guests" />,
            trend: 'up'
          },
          {
            title: 'Regular Guests',
            value: data.reduce((sum, row) => sum + row.guestTypes.regular, 0).toString(),
            icon: <Users className="h-5 w-5" aria-label="Regular Guests" />,
            trend: 'neutral'
          },
          {
            title: 'VIP Guests',
            value: data.reduce((sum, row) => sum + row.guestTypes.vip, 0).toString(),
            icon: <Users className="h-5 w-5" aria-label="VIP Guests" />,
            trend: 'up'
          },
          {
            title: 'First Time Guests',
            value: data.reduce((sum, row) => sum + row.guestTypes.firstTime, 0).toString(),
            icon: <Users className="h-5 w-5" aria-label="First Time Guests" />,
            trend: 'up'
          }
        ];
      default:
        return [
          {
            title: 'Total Revenue',
            value: `$${data.reduce((sum, row) => sum + row.revenue, 0).toLocaleString()}`,
            icon: <DollarSign className="h-5 w-5" aria-label="Total Revenue" />,
            trend: 'up'
          },
          {
            title: 'Total Bookings',
            value: data.reduce((sum, row) => sum + row.bookings, 0).toString(),
            icon: <Users className="h-5 w-5" aria-label="Total Bookings" />,
            trend: 'up'
          }
        ];
    }
  };

  // Helper function to get the best performing day
  const getBestPerformingDay = (data: ReportData[]): string => {
    if (data.length === 0) return "N/A";
    
    const bestDay = data.reduce((best, current) => {
      return current.revenue > best.revenue ? current : best;
    }, data[0]);
    
    return bestDay.date;
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="transition-shadow hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <h4 className="text-2xl font-bold mt-1">{metric.value}</h4>
              </div>
              <div className={`rounded-full p-2 ${
                metric.trend === 'up' 
                  ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' 
                  : metric.trend === 'down' 
                  ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' 
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
              }`}>
                {metric.icon}
              </div>
            </div>
            {metric.trend && (
              <div className="flex items-center mt-4">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" aria-label="Trending Up" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" aria-label="Trending Down" />
                ) : null}
                <span className={`text-xs font-medium ${
                  metric.trend === 'up' 
                    ? 'text-green-500' 
                    : metric.trend === 'down' 
                    ? 'text-red-500' 
                    : 'text-blue-500'
                }`}>
                  {metric.trend === 'up' ? '+5% ' : metric.trend === 'down' ? '-3% ' : ''}
                  from previous period
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportMetricCards;

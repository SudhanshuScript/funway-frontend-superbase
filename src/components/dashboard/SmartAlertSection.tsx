
import React from 'react';
import { AlertTriangle, Info, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AlertItem {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  location?: string;
  timestamp: string;
}

interface SmartAlertSectionProps {
  franchiseId?: string;
  role: string;
}

export const SmartAlertSection: React.FC<SmartAlertSectionProps> = ({ franchiseId, role }) => {
  // Mock alerts - in a real implementation, these would come from an API
  const alerts: AlertItem[] = [
    {
      id: '1',
      type: 'warning',
      message: 'Franchise "SkyBistro Central" dropped 20% in bookings compared to last week.',
      location: 'SkyBistro Central',
      timestamp: '1 hour ago'
    },
    {
      id: '2',
      type: 'info',
      message: 'Occupancy under 50% for Morning Sessions in Riverside — consider a promo.',
      location: 'Riverside',
      timestamp: '2 hours ago'
    },
    {
      id: '3',
      type: 'success',
      message: 'Weekend sessions at Downtown location are fully booked for the next two weeks.',
      location: 'Downtown',
      timestamp: '3 hours ago'
    }
  ];

  // Filter alerts based on user role and franchise
  const filteredAlerts = role === 'superadmin' 
    ? alerts 
    : alerts.filter(alert => alert.location === franchiseId);

  // No alerts to show
  if (filteredAlerts.length === 0) {
    return null;
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Alert</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Insight</Badge>;
      case 'success':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Smart Alerts & Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start p-3 rounded-lg bg-muted/50">
            <div className="mr-3 mt-0.5">{getAlertIcon(alert.type)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                {getAlertBadge(alert.type)}
                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
              </div>
              <p className="text-sm">{alert.message}</p>
              {role === 'superadmin' && alert.location && (
                <span className="text-xs font-medium text-muted-foreground mt-1 block">
                  Location: {alert.location}
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

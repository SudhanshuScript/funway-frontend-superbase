
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionStats } from "@/types/sessionTypes";
import { Button } from "@/components/ui/button";
import { Download, BarChart, TrendingDown, Award } from "lucide-react";

interface SessionStatsViewProps {
  stats: SessionStats;
  onExport: (format: 'pdf' | 'csv') => void;
}

export function SessionStatsView({ stats, onExport }: SessionStatsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Stats & Analysis</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-amber-500" />
              Most Popular Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.mostPopular.map((session, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{session.name}</span>
                  <span className="text-muted-foreground ml-2">
                    ({session.bookings} bookings)
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-green-500" />
              Best Performing Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.bestPerforming.map((session, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{session.name}</span>
                  <span className="text-muted-foreground ml-2">
                    ({session.utilization}% utilization)
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
              Underutilized Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.underutilized.map((session, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{session.name}</span>
                  <span className="text-muted-foreground ml-2">
                    ({session.utilization}% utilization)
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

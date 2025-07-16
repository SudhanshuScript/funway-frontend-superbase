
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { LeadAnalytics as LeadAnalyticsType } from '@/types/leadTypes';

interface LeadAnalyticsProps {
  analytics: LeadAnalyticsType;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function LeadAnalytics({ analytics }: LeadAnalyticsProps) {
  // Prepare data for source chart
  const sourceData = Object.entries(analytics.by_source).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
    value
  }));

  // Prepare data for status chart
  const statusData = Object.entries(analytics.by_status).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
    value
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Lead Count Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
            <h3 className="text-3xl font-bold">{analytics.total}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.new_this_week} new this week
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Conversion Rate Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
            <h3 className="text-3xl font-bold">{analytics.conversion_rate}%</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Avg. response time: {analytics.average_response_time} min
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Source Distribution Chart */}
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-muted-foreground mb-4">Leads by Source</p>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.substring(0, 3)}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Status Distribution Chart */}
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-muted-foreground mb-4">Status Distribution</p>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Franchise Distribution */}
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-muted-foreground mb-4">Leads by Franchise</p>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(analytics.by_franchise).map(([key, value]) => ({
                  name: key === 'franchise-1' ? 'Bangalore' : 
                        key === 'franchise-2' ? 'Ooty' : 
                        key === 'franchise-3' ? 'Puerto Rico' : key,
                  value
                }))}
              >
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

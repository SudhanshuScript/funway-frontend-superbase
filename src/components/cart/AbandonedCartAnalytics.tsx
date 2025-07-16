
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Download, PieChart, BarChart3, LineChart, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AbandonedCartStats } from '@/types/bookingTypes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartPie, Pie, Cell, Legend, LineChart as RechartLine, Line } from 'recharts';

interface AbandonedCartAnalyticsProps {
  stats: AbandonedCartStats;
  onExportStats?: () => void;
}

const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#fbbf24'];

export function AbandonedCartAnalytics({ stats, onExportStats }: AbandonedCartAnalyticsProps) {
  const pieChartData = [
    { name: 'Recovered', value: stats.recoveredCarts },
    { name: 'Not Recovered', value: stats.totalCarts - stats.recoveredCarts }
  ];

  const methodData = stats.reminderEffectiveness.map(item => ({
    name: item.method === 'email' ? 'Email' : item.method === 'sms' ? 'SMS' : 'WhatsApp',
    sent: item.sentCount,
    successful: item.successCount,
    rate: item.successRate
  }));

  const trendData = stats.recoveryTrend.map(item => ({
    date: item.date,
    abandoned: item.abandonedCount,
    recovered: item.recoveredCount,
    rate: item.recoveredCount > 0 ? Math.round((item.recoveredCount / item.abandonedCount) * 100) : 0
  }));

  const handleExport = () => {
    if (onExportStats) {
      onExportStats();
    } else {
      console.log('Exporting stats...');
    }
  };

  const motivationalMessages = [
    `Great job! Your cart recovery rate is ${stats.recoveryRate.toFixed(1)}%!`,
    `You're doing well! Recovered ${stats.recoveredCarts} of ${stats.totalCarts} abandoned carts.`,
    `Excellent work! Your average recovery time is ${stats.averageRecoveryTime} hours.`,
    `Amazing! Your discount codes have a ${stats.discountImpact.redemptionRate.toFixed(1)}% redemption rate.`
  ];

  // Select a random motivational message
  const currentMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Abandoned Cart Analytics</h2>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Stats
        </Button>
      </div>
      
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center">
            <ArrowUpRight className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">{currentMessage}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <PieChart className="h-4 w-4 mr-2" />
              Total Abandoned Carts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCarts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Recovery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recoveryRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{stats.recoveredCarts} of {stats.totalCarts} carts recovered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Timer className="h-4 w-4 mr-2" />
              Average Recovery Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRecoveryTime} hours</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Discount Redemption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.discountImpact.redemptionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.discountImpact.redeemedCount} of {stats.discountImpact.offeredCount} codes used
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <PieChart className="h-4 w-4 mr-2" />
              Recovery Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPie>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </RechartPie>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reminder Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={methodData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sent" name="Sent" fill="#60a5fa" />
                  <Bar yAxisId="left" dataKey="successful" name="Successful" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Recovery Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartLine
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="abandoned" name="Abandoned" stroke="#f87171" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="recovered" name="Recovered" stroke="#4ade80" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="rate" name="Recovery Rate %" stroke="#fbbf24" strokeWidth={2} />
              </RechartLine>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

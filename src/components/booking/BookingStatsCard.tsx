
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingStatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export function BookingStatsCard({ title, value, description, icon }: BookingStatsCardProps) {
  return (
    <Card className="gyro-card gyro-card-hover border-gyro-border bg-gyro-card transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-normal uppercase tracking-wide text-gray-400">{title}</CardTitle>
        <div className="text-gyro-blue opacity-80">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{value}</div>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}


import React from "react";

interface DailySummaryEmailProps {
  data: {
    franchise: string;
    revenue: number;
    bookings: {
      online: number;
      walkIn: number;
    };
    occupancy: string;
    satisfaction: number;
    alerts: string[];
  };
}

export function DailySummaryEmail({ data }: DailySummaryEmailProps) {
  return (
    <div className="max-w-xl mx-auto bg-white text-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">
        📊 FlyDining Daily Summary
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">📍 Franchise</p>
          <p className="text-lg font-semibold">{data.franchise}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">💰 Revenue Today</p>
          <p className="text-xl font-bold text-green-600">₹{data.revenue.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">🪑 Bookings</p>
          <p className="text-lg">{data.bookings.online} Online / {data.bookings.walkIn} Walk-In</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">🔄 Occupancy Rate</p>
          <p className="text-lg">{data.occupancy}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">😃 Customer Satisfaction</p>
          <p className="text-lg">{data.satisfaction} / 5.0</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">⚠️ Alerts</p>
          <p className="text-md text-red-600">
            {data.alerts.length > 0 ? data.alerts.join(", ") : "None"}
          </p>
        </div>
      </div>

      <p className="text-xs text-center text-gray-400 mt-6">
        This is an automated report from FlyDining Dashboard. For queries, contact support@flydining.com
      </p>
    </div>
  );
}

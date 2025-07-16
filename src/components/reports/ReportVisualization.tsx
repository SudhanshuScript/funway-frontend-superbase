
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReportData, ReportType } from '@/utils/reportUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

interface ReportVisualizationProps {
  reportType: ReportType;
  data: ReportData[];
}

const ReportVisualization: React.FC<ReportVisualizationProps> = ({ reportType, data }) => {
  // Colors for charts - using a more modern palette
  const COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981'];
  
  // Helper function to prepare data for franchise revenue bar chart
  const prepareRevenueByFranchiseData = () => {
    const franchiseRevenue = data.reduce((acc: { [key: string]: number }, item) => {
      acc[item.franchise] = (acc[item.franchise] || 0) + item.revenue;
      return acc;
    }, {});
    
    return Object.entries(franchiseRevenue)
      .map(([franchise, revenue]) => ({ franchise, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Get top 5 franchises
  };
  
  // Helper function to prepare data for daily revenue trend
  const prepareDailyRevenueData = () => {
    // Create a map of date to total revenue
    const dateToRevenue = data.reduce((acc: { [key: string]: number }, item) => {
      acc[item.date] = (acc[item.date] || 0) + item.revenue;
      return acc;
    }, {});
    
    // Convert to array format for chart
    return Object.entries(dateToRevenue)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  // Helper function to prepare data for session type pie chart
  const prepareSessionTypeData = () => {
    const sessionRevenue = data.reduce((acc: { [key: string]: number }, item) => {
      acc[item.session] = (acc[item.session] || 0) + item.revenue;
      return acc;
    }, {});
    
    return Object.entries(sessionRevenue)
      .map(([name, value]) => ({ name, value }));
  };

  // Helper function to prepare guest type data
  const prepareGuestTypeData = () => {
    const guestTypes = data.reduce((acc: { [key: string]: number }, item) => {
      acc['regular'] = (acc['regular'] || 0) + item.guestTypes.regular;
      acc['vip'] = (acc['vip'] || 0) + item.guestTypes.vip;
      acc['firstTime'] = (acc['firstTime'] || 0) + item.guestTypes.firstTime;
      return acc;
    }, {});
    
    return Object.entries(guestTypes).map(([name, value]) => ({ 
      name: name === 'regular' ? 'Regular' : name === 'vip' ? 'VIP' : 'First Time',
      value 
    }));
  };

  // Create chart data based on report type
  const getChartData = () => {
    switch (reportType) {
      case 'sales':
      case 'revenue':
        return prepareDailyRevenueData();
      case 'bookings':
      case 'sessions':
        return prepareSessionTypeData();
      case 'guests':
        return prepareGuestTypeData();
      case 'franchises':
        return prepareRevenueByFranchiseData();
      default:
        return [];
    }
  };

  const chartData = getChartData();

  // Custom tooltip styles for a sleek look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-lg">
          <p className="text-gray-200">{label || payload[0].name}</p>
          <p className="text-purple-300 font-medium">
            {reportType === 'sales' || reportType === 'revenue' 
              ? `$${payload[0].value.toLocaleString()}` 
              : `${payload[0].value.toLocaleString()} ${reportType === 'guests' ? 'guests' : 'bookings'}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#141727]/70 backdrop-blur-xl border-[#303650] shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <Tabs defaultValue="chart" className="w-full">
          <div className="border-b border-[#303650]">
            <TabsList className="bg-transparent w-full justify-start rounded-none p-0">
              <TabsTrigger 
                value="chart" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:shadow-none rounded-none py-3 text-white"
              >
                Chart View
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:shadow-none rounded-none py-3 text-white"
              >
                Data View
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chart" className="p-0 mt-0">
            <div className="p-4 h-[400px]">
              {(reportType === 'sales' || reportType === 'revenue') ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#303650" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#6b7280" tickLine={false} />
                    <YAxis stroke="#6b7280" tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      dot={{ r: 4, strokeWidth: 2, fill: "#141727" }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#8b5cf6" }}
                      fill="url(#colorRevenue)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : reportType === 'guests' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="#141727"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => <span className="text-gray-300">{value}</span>}
                      iconType="circle" 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#303650" opacity={0.3} />
                    <XAxis 
                      dataKey={reportType === 'franchises' ? "franchise" : "name"} 
                      stroke="#6b7280"
                      tickLine={false}
                    />
                    <YAxis stroke="#6b7280" tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey={reportType === 'franchises' ? "revenue" : "value"} 
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]} 
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="p-0 mt-0">
            <div className="p-4 max-h-[400px] overflow-auto text-white">
              <table className="min-w-full divide-y divide-[#303650]">
                <thead className="bg-[#1f2438]">
                  <tr>
                    {(reportType === 'sales' || reportType === 'revenue') ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                      </>
                    ) : reportType === 'franchises' ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Franchise</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#303650]">
                  {chartData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-[#1f2437]' : 'bg-[#141727]'}>
                      {(reportType === 'sales' || reportType === 'revenue') ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${item.revenue.toLocaleString()}</td>
                        </>
                      ) : reportType === 'franchises' ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">{item.franchise}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${(item as any).revenue.toLocaleString()}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.value.toLocaleString()}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportVisualization;

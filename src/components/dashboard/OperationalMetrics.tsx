import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Calendar, Users, AlertTriangle, Download, ChevronRight, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUserRole } from "@/providers/UserRoleProvider";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface OperationalMetricsProps {
  viewType: string;
  bookings: {
    confirmed: number;
    pending: number;
    cancelled: number;
    total: number;
  };
  occupancy: {
    current: number;
    target: number;
    franchises?: Array<{
      name: string;
      rate: number;
      status: "high" | "medium" | "low";
    }>;
  };
  payments: {
    paid: number;
    pending: number;
    failed: number;
    total: number;
  };
  feedback: {
    average: number;
    positive: number;
    neutral: number;
    negative: number;
    total: number;
  };
  coinUsage?: {
    franchise: string;
    balance: number;
    used: number;
    status: "good" | "warning" | "critical";
  }[];
  realTimeMetrics?: {
    checkIns: number;
    staffPresent: number;
    alerts: {
      type: "warning" | "critical";
      message: string;
    }[];
  };
}

export const OperationalMetrics: React.FC<OperationalMetricsProps> = ({
  viewType,
  bookings,
  occupancy,
  payments,
  feedback,
  coinUsage,
  realTimeMetrics
}) => {
  const { isRole } = useUserRole();
  const isSuperAdmin = isRole("superadmin");
  const showRealTimeMetrics = isSuperAdmin || isRole("franchise_manager");
  
  const getStatusColor = (status: "high" | "medium" | "low") => {
    switch (status) {
      case "high": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "";
    }
  };
  
  const getCoinStatusColor = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "";
    }
  };

  const handleAlertAcknowledge = (alertIndex: number) => {
    toast.success(`Alert acknowledged`);
    // In a real app, we would update the alert status in the database
  };

  const handleTopUp = (franchiseId: string, franchiseName: string) => {
    toast.success(`Top-up initiated for ${franchiseName}`);
    // In a real app, we would initiate the top-up process
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Booking Status */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Booking Status</CardTitle>
          <Button variant="ghost" size="sm">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col p-3 border rounded-lg">
                <Badge className="mb-1 self-center bg-green-500">Confirmed</Badge>
                <span className="text-2xl font-bold">{bookings.confirmed}</span>
                <span className="text-xs text-muted-foreground">{((bookings.confirmed / bookings.total) * 100).toFixed(0)}%</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="mt-1 p-0 h-6">
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Successfully checked in: 65%</p>
                    <p className="text-xs">Awaiting arrival: 35%</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col p-3 border rounded-lg">
                <Badge className="mb-1 self-center bg-yellow-500">Pending</Badge>
                <span className="text-2xl font-bold">{bookings.pending}</span>
                <span className="text-xs text-muted-foreground">{((bookings.pending / bookings.total) * 100).toFixed(0)}%</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="mt-1 p-0 h-6">
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Payment pending: 80%</p>
                    <p className="text-xs">Confirmation awaited: 20%</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col p-3 border rounded-lg">
                <Badge className="mb-1 self-center bg-red-500">Cancelled</Badge>
                <span className="text-2xl font-bold">{bookings.cancelled}</span>
                <span className="text-xs text-muted-foreground">{((bookings.cancelled / bookings.total) * 100).toFixed(0)}%</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="mt-1 p-0 h-6">
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Guest no-show: 45%</p>
                    <p className="text-xs">Customer cancellation: 40%</p>
                    <p className="text-xs">Admin cancellation: 15%</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Today's Total:</span>
              <span className="font-medium">{bookings.total} bookings</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Occupancy Rate */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Occupancy Rate</CardTitle>
          {isSuperAdmin && (
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Current Occupancy</span>
                <span className="font-medium">{occupancy.current}% of target</span>
              </div>
              <Progress value={occupancy.current} className="h-2" />
            </div>
            
            {isSuperAdmin && occupancy.franchises && viewType === 'overview' && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Franchise Occupancy</h4>
                <div className="space-y-2">
                  {occupancy.franchises.slice(0, 3).map((franchise, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm">{franchise.name}</span>
                      <div className="flex items-center gap-1">
                        <Badge className={getStatusColor(franchise.status)}>
                          {franchise.rate}%
                        </Badge>
                        <span className={`text-xs ${
                          franchise.rate > 80 ? 'text-green-500' : 
                          franchise.rate > 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {franchise.rate > 80 ? '● Healthy' : 
                           franchise.rate > 60 ? '● Moderate' : '● Underperforming'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Breakdown */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Payment Breakdown</CardTitle>
          <Button variant="ghost" size="sm">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="flex flex-col p-3 border rounded-lg">
                <Badge className="mb-1 self-center bg-green-500">Paid</Badge>
                <span className="text-2xl font-bold">{payments.paid}</span>
                <span className="text-xs text-muted-foreground">{((payments.paid / payments.total) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex flex-col p-3 border rounded-lg">
                <Badge className="mb-1 self-center bg-yellow-500">Pending</Badge>
                <span className="text-2xl font-bold">{payments.pending}</span>
                <span className="text-xs text-muted-foreground">{((payments.pending / payments.total) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex flex-col p-3 border rounded-lg">
                <Badge className="mb-1 self-center bg-red-500">Failed</Badge>
                <span className="text-2xl font-bold">{payments.failed}</span>
                <span className="text-xs text-muted-foreground">{((payments.failed / payments.total) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex flex-col p-3 border rounded-lg">
                <Badge className="mb-1 self-center bg-gray-500">Refunded</Badge>
                <span className="text-2xl font-bold">3</span>
                <span className="text-xs text-muted-foreground">5%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Transactions:</span>
              {isSuperAdmin && (
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" /> Export Report
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Customer Feedback */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Customer Feedback</CardTitle>
          <Button variant="ghost" size="sm">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">{feedback.average.toFixed(1)}</span>
              <div className="flex items-center text-yellow-400">
                {"★".repeat(Math.floor(feedback.average))}
                {"☆".repeat(5 - Math.floor(feedback.average))}
              </div>
              <span className="text-sm text-muted-foreground">({feedback.total} reviews)</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Positive</span>
                <span className="text-green-500 font-medium">{((feedback.positive / feedback.total) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Neutral</span>
                <span className="text-blue-500 font-medium">{((feedback.neutral / feedback.total) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Negative</span>
                <span className="text-red-500 font-medium">{((feedback.negative / feedback.total) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Coin Usage Stats (Superadmin Only) */}
      {isSuperAdmin && coinUsage && (
        <Card>
          <CardHeader>
            <CardTitle>Coin Usage Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Franchise</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coinUsage.slice(0, 5).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.franchise}</TableCell>
                    <TableCell>{item.balance}</TableCell>
                    <TableCell>{item.used}</TableCell>
                    <TableCell>
                      <Badge className={getCoinStatusColor(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.status === 'warning' || item.status === 'critical' ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleTopUp(i.toString(), item.franchise)}
                        >
                          Send Top-up
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Real-Time Updates (Superadmin & Managers) */}
      {showRealTimeMetrics && realTimeMetrics && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Real-Time Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col p-3 border rounded-lg">
                  <span className="text-sm mb-1 text-muted-foreground">Current Check-ins</span>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-xl font-bold">{realTimeMetrics.checkIns}</span>
                  </div>
                </div>
                <div className="flex flex-col p-3 border rounded-lg">
                  <span className="text-sm mb-1 text-muted-foreground">Staff Present</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-xl font-bold">{realTimeMetrics.staffPresent}</span>
                  </div>
                </div>
              </div>
              
              {realTimeMetrics.alerts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Alerts</h4>
                  <div className="space-y-2">
                    {realTimeMetrics.alerts.map((alert, i) => (
                      <div key={i} className={`p-2 border rounded-md flex items-center justify-between ${
                        alert.type === 'critical' ? 'bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-800' : 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800'
                      }`}>
                        <div className="flex items-center">
                          <AlertTriangle className={`h-4 w-4 mr-2 ${
                            alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                          <span className="text-sm">{alert.message}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAlertAcknowledge(i)}
                          className="h-7 text-xs"
                        >
                          Acknowledge
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

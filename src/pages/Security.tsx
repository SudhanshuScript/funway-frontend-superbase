
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { Shield, Key, Lock, AlertTriangle, User, History, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for security logs
const securityLogs = [
  {
    id: "LOG-001",
    timestamp: "2023-05-20 14:32:45",
    user: "admin@skybistro.com",
    action: "Login",
    status: "Success",
    ip: "192.168.1.1"
  },
  {
    id: "LOG-002",
    timestamp: "2023-05-20 15:10:22",
    user: "manager@skybistro.com",
    action: "Password Change",
    status: "Success",
    ip: "192.168.1.2"
  },
  {
    id: "LOG-003",
    timestamp: "2023-05-20 15:45:18",
    user: "unknown@example.com",
    action: "Login",
    status: "Failed",
    ip: "203.0.113.42"
  },
  {
    id: "LOG-004",
    timestamp: "2023-05-20 16:22:05",
    user: "staff@skybistro.com",
    action: "User Creation",
    status: "Success",
    ip: "192.168.1.3"
  },
  {
    id: "LOG-005",
    timestamp: "2023-05-20 17:05:33",
    user: "admin@skybistro.com",
    action: "Permission Change",
    status: "Success",
    ip: "192.168.1.1"
  }
];

const Security = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "superadmin") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "superadmin") {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            <h2 className="text-2xl font-bold">Security Management</h2>
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" /> Generate Security Report
          </Button>
        </div>

        <Tabs defaultValue="access">
          <TabsList className="mb-4">
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="passwords">Password Policy</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="access">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Access Control Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Session Timeout</h3>
                      <p className="text-sm text-muted-foreground">Automatically log out after 30 minutes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">IP Restriction</h3>
                      <p className="text-sm text-muted-foreground">Limit access to whitelisted IP addresses</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Device Management</h3>
                      <p className="text-sm text-muted-foreground">Manage trusted devices for each user</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Role Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Superadmin</h3>
                      <p className="text-sm text-muted-foreground">Full access to all system features</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Permissions</Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Franchise Owner</h3>
                      <p className="text-sm text-muted-foreground">Manage specific franchise operations</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Permissions</Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Franchise Manager</h3>
                      <p className="text-sm text-muted-foreground">Day-to-day franchise management</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Permissions</Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Staff</h3>
                      <p className="text-sm text-muted-foreground">Limited access to assigned duties</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Permissions</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="passwords">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Minimum Length</h3>
                    <p className="text-sm text-muted-foreground">Require at least 8 characters</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Complexity Requirements</h3>
                    <p className="text-sm text-muted-foreground">Require uppercase, lowercase, numbers, and symbols</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Password Expiry</h3>
                    <p className="text-sm text-muted-foreground">Require password change every 90 days</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Previous Password Restrictions</h3>
                    <p className="text-sm text-muted-foreground">Prevent reuse of last 5 passwords</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Account Lockout</h3>
                    <p className="text-sm text-muted-foreground">Lock account after 5 failed login attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>Audit Logs</CardTitle>
                  <Button variant="outline" size="sm">
                    <History className="mr-2 h-4 w-4" /> View All Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Log ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.id}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === "Success" ? "default" : "destructive"}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800 dark:text-amber-300">Multiple Failed Login Attempts</h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        3 failed login attempts detected for user manager@skybistro.com from IP 203.0.113.42
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">Block IP</Button>
                        <Button size="sm" variant="outline">Lock Account</Button>
                        <Button size="sm" variant="ghost">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800 dark:text-red-300">Unusual Access Pattern Detected</h3>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        User admin@skybistro.com logged in from an unusual location (New York, US) at 2023-05-19 23:15:22
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">Review Activity</Button>
                        <Button size="sm" variant="outline">Force Logout</Button>
                        <Button size="sm" variant="ghost">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start">
                    <Key className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-300">API Key Usage</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        High volume of API requests from integration service detected in the last hour
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline">Rate Limit</Button>
                        <Button size="sm" variant="ghost">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Security;

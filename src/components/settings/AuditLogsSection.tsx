
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, Database } from "lucide-react";

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

const AuditLogsSection = () => {
  return (
    <>
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

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing 5 of 254 logs
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Database Access Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Database className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-lg font-medium">Database Access Analytics</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Advanced database access monitoring and analytics will be available in the next release.
              </p>
              <Button variant="outline" className="mt-4">Request Early Access</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AuditLogsSection;

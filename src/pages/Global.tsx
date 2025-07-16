import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Globe, Settings, Key, FileText, AlertCircle } from "lucide-react";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Logo } from "@/components/ui/Logo";

const auditLogs = [
  { id: 1, user: "admin@example.com", action: "User login", timestamp: "2023-05-15 10:23:45", ip: "192.168.1.1" },
  { id: 2, user: "admin@example.com", action: "Changed global settings", timestamp: "2023-05-15 10:45:12", ip: "192.168.1.1" },
  { id: 3, user: "john@example.com", action: "Added new franchise", timestamp: "2023-05-15 11:30:55", ip: "192.168.1.2" },
  { id: 4, user: "sarah@example.com", action: "Updated API keys", timestamp: "2023-05-14 15:22:10", ip: "192.168.1.3" },
  { id: 5, user: "admin@example.com", action: "System maintenance toggle", timestamp: "2023-05-14 16:45:33", ip: "192.168.1.1" },
];

const Global = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser && currentUser.role !== "superadmin") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "superadmin") {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center">
          <Globe className="h-6 w-6 mr-2" />
          <h2 className="text-2xl font-bold">Global Settings</h2>
        </div>
        
        <Tabs defaultValue="branding">
          <TabsList className="mb-4">
            <TabsTrigger value="branding">
              <Settings className="h-4 w-4 mr-2" />
              Branding & Settings
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API Integrations
            </TabsTrigger>
            <TabsTrigger value="legal">
              <FileText className="h-4 w-4 mr-2" />
              Legal & Compliance
            </TabsTrigger>
            <TabsTrigger value="logs">
              <AlertCircle className="h-4 w-4 mr-2" />
              System Logs
            </TabsTrigger>
          </TabsList>
          
          {/* Branding & Settings Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="FLY Dining Experience" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input id="supportEmail" defaultValue="support@flydining.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="w-64 h-32 flex items-center justify-center mb-4 bg-black p-4">
                      <Logo size="lg" />
                    </div>
                    <Button variant="outline" size="sm">Upload New Logo</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Brand Colors</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="primaryColor" className="text-xs">Primary Color</Label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-l-md bg-primary"></div>
                        <Input id="primaryColor" defaultValue="#8B5CF6" className="rounded-l-none" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="secondaryColor" className="text-xs">Secondary Color</Label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-l-md bg-blue-500"></div>
                        <Input id="secondaryColor" defaultValue="#3B82F6" className="rounded-l-none" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="accentColor" className="text-xs">Accent Color</Label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-l-md bg-pink-500"></div>
                        <Input id="accentColor" defaultValue="#EC4899" className="rounded-l-none" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="textColor" className="text-xs">Text Color</Label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-l-md bg-gray-900 dark:bg-gray-50"></div>
                        <Input id="textColor" defaultValue="#111827" className="rounded-l-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Default Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <Input id="defaultCurrency" defaultValue="USD" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                    <Input id="defaultTaxRate" type="number" defaultValue="7.5" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <Input id="defaultLanguage" defaultValue="English" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultTimeZone">Default Time Zone</Label>
                    <Input id="defaultTimeZone" defaultValue="UTC-5 (Eastern Time)" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Switch id="taxInclusive" />
                  <Label htmlFor="taxInclusive">Show prices with tax included by default</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* API Integrations Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication APIs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="whatsappApiKey" className="text-base font-medium">WhatsApp Business API</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="whatsappEnabled" defaultChecked />
                        <Label htmlFor="whatsappEnabled">Enable WhatsApp Integration</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="whatsappApiKey" className="text-xs">API Key</Label>
                        <Input id="whatsappApiKey" type="password" value="••••••••••••••••••••••" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="whatsappPhoneId" className="text-xs">Phone Number ID</Label>
                        <Input id="whatsappPhoneId" defaultValue="1234567890" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Label htmlFor="telegramApiKey" className="text-base font-medium">Telegram Bot API</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="telegramEnabled" defaultChecked />
                        <Label htmlFor="telegramEnabled">Enable Telegram Integration</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telegramApiKey" className="text-xs">Bot Token</Label>
                        <Input id="telegramApiKey" type="password" value="••••••••••••••••••••••" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telegramBotName" className="text-xs">Bot Username</Label>
                        <Input id="telegramBotName" defaultValue="@FlyDiningBot" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Label htmlFor="emailApiKey" className="text-base font-medium">Email Service API</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="emailEnabled" defaultChecked />
                        <Label htmlFor="emailEnabled">Enable Email Integration</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emailApiKey" className="text-xs">API Key</Label>
                        <Input id="emailApiKey" type="password" value="••••••••••••••••••••••" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emailSender" className="text-xs">Sender Email</Label>
                        <Input id="emailSender" defaultValue="noreply@flydining.com" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Analytics Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="googleAnalytics" className="text-base font-medium">Google Analytics</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="gaEnabled" defaultChecked />
                        <Label htmlFor="gaEnabled">Enable Google Analytics</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gaTrackingId" className="text-xs">Tracking ID</Label>
                        <Input id="gaTrackingId" defaultValue="UA-123456789-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Label htmlFor="facebookPixel" className="text-base font-medium">Facebook Pixel</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="fbEnabled" />
                        <Label htmlFor="fbEnabled">Enable Facebook Pixel</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fbPixelId" className="text-xs">Pixel ID</Label>
                        <Input id="fbPixelId" defaultValue="" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Legal & Compliance */}
          <TabsContent value="legal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>GDPR Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="cookieConsent" defaultChecked />
                    <Label htmlFor="cookieConsent">Enable Cookie Consent Banner</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="dataRetention" defaultChecked />
                    <Label htmlFor="dataRetention">Automatic Data Retention Policy</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="rightToForget" defaultChecked />
                    <Label htmlFor="rightToForget">Enable Right to be Forgotten Requests</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataRetentionPeriod">Data Retention Period (days)</Label>
                  <Input id="dataRetentionPeriod" type="number" defaultValue="365" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
                  <Input id="privacyPolicy" defaultValue="https://flydining.com/privacy-policy" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="termsConditions">Terms & Conditions URL</Label>
                  <Input id="termsConditions" defaultValue="https://flydining.com/terms-conditions" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Legal Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Privacy Policy</h4>
                        <p className="text-sm text-muted-foreground">Last updated: May 10, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Terms & Conditions</h4>
                        <p className="text-sm text-muted-foreground">Last updated: April 22, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Cookie Policy</h4>
                        <p className="text-sm text-muted-foreground">Last updated: April 22, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Waiver & Release Form</h4>
                        <p className="text-sm text-muted-foreground">Last updated: March 15, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* System Logs */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Audit Logs</CardTitle>
                <Button variant="outline" size="sm">Export Logs</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>System Maintenance</CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch id="maintenanceMode" />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                  <Input id="maintenanceMessage" defaultValue="We're currently performing system maintenance. Please check back later." />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceStart">Start Time</Label>
                    <Input id="maintenanceStart" type="datetime-local" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceEnd">End Time</Label>
                    <Input id="maintenanceEnd" type="datetime-local" />
                  </div>
                </div>
                
                <Button className="mt-2">Schedule Maintenance</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Global;

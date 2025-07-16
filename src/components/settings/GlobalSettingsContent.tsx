
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Building2, 
  Wallet, 
  BellRing, 
  Clock, 
  Mail, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const GlobalSettingsContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [globalTab, setGlobalTab] = useState("franchise");

  const handleSaveSettings = (section: string) => {
    setIsLoading(true);
    
    // Mock API save operation
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${section} settings updated successfully`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Global Settings</h2>
      </div>
      
      <Tabs value={globalTab} onValueChange={setGlobalTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="franchise" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden md:inline">Franchise</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden md:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden md:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Compliance</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Franchise Settings Tab */}
        <TabsContent value="franchise">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Franchise Configuration
              </CardTitle>
              <CardDescription>
                Configure global franchise settings that apply to all franchises.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Onboarding Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_approve">Auto-Approve New Franchises</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve new franchises without admin review.
                    </p>
                  </div>
                  <Switch id="auto_approve" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require_docs">Require All Documents</Label>
                    <p className="text-sm text-muted-foreground">
                      New franchises must upload all required documents before activation.
                    </p>
                  </div>
                  <Switch id="require_docs" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="welcome_email">Default Welcome Email</Label>
                  <Textarea 
                    id="welcome_email"
                    placeholder="Enter the default welcome email template..."
                    defaultValue="Welcome to FlyDining! We're excited to have you join our network of franchise partners..."
                    rows={4}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default Values</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default_currency">Default Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger id="default_currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default_timezone">Default Timezone</Label>
                    <Select defaultValue="UTC">
                      <SelectTrigger id="default_timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="Asia/Kolkata">India (UTC+5:30)</SelectItem>
                        <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default_tax">Default Tax Rate (%)</Label>
                    <Input 
                      id="default_tax" 
                      type="number" 
                      defaultValue="10" 
                      min="0" 
                      max="100" 
                      step="0.01" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default_language">Default Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="default_language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Documents</h3>
                
                <div className="grid grid-cols-1 gap-2">
                  {["Business License", "Tax ID Certificate", "Owner ID Proof", "FSSAI Certificate"].map((doc) => (
                    <div key={doc} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{doc}</span>
                      </div>
                      <Switch defaultChecked={["Business License", "Tax ID Certificate"].includes(doc)} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("Franchise")}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Payments Settings Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure global payment settings for all franchises.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Providers</h3>
                
                <div className="space-y-4">
                  {[
                    { name: "Stripe", enabled: true },
                    { name: "PayPal", enabled: true },
                    { name: "Square", enabled: false },
                    { name: "Razorpay", enabled: false }
                  ].map((provider) => (
                    <div key={provider.name} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={`provider_${provider.name}`}>{provider.name}</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable {provider.name} as a payment method.
                        </p>
                      </div>
                      <Switch 
                        id={`provider_${provider.name}`} 
                        defaultChecked={provider.enabled} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Transaction Fees</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform_fee">Platform Fee (%)</Label>
                    <Input 
                      id="platform_fee" 
                      type="number" 
                      defaultValue="2.5" 
                      min="0" 
                      max="100" 
                      step="0.01" 
                    />
                    <p className="text-xs text-muted-foreground">
                      Fee charged by the platform on each transaction.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min_transaction">Minimum Transaction (USD)</Label>
                    <Input 
                      id="min_transaction" 
                      type="number" 
                      defaultValue="5" 
                      min="0" 
                      step="0.01" 
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payout Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payout_schedule">Default Payout Schedule</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger id="payout_schedule">
                        <SelectValue placeholder="Select payout schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min_payout">Minimum Payout Amount (USD)</Label>
                    <Input 
                      id="min_payout" 
                      type="number" 
                      defaultValue="100" 
                      min="0" 
                      step="0.01" 
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_payouts">Automatic Payouts</Label>
                    <p className="text-sm text-muted-foreground">
                      Process payouts automatically according to schedule.
                    </p>
                  </div>
                  <Switch id="auto_payouts" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("Payment")}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide notification settings for all franchises.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="email_from">Sender Email</Label>
                  <Input 
                    id="email_from" 
                    type="email"
                    defaultValue="notifications@flydining.com" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email_name">Sender Name</Label>
                  <Input 
                    id="email_name" 
                    defaultValue="FlyDining Notifications" 
                  />
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "New Booking Notification", enabled: true },
                    { name: "Booking Cancellation", enabled: true },
                    { name: "Payment Confirmation", enabled: true },
                    { name: "Customer Feedback", enabled: false },
                    { name: "Daily Summary", enabled: true },
                    { name: "Weekly Revenue Report", enabled: true }
                  ].map((notification) => (
                    <div key={notification.name} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={`notification_${notification.name}`}>{notification.name}</Label>
                      </div>
                      <Switch 
                        id={`notification_${notification.name}`} 
                        defaultChecked={notification.enabled} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms_enabled">Enable SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send SMS notifications for important events.
                    </p>
                  </div>
                  <Switch id="sms_enabled" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sms_provider">SMS Provider</Label>
                  <Select defaultValue="twilio">
                    <SelectTrigger id="sms_provider">
                      <SelectValue placeholder="Select SMS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="aws_sns">AWS SNS</SelectItem>
                      <SelectItem value="messagebird">MessageBird</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4 pt-4">
                  {[
                    { name: "New Booking SMS", enabled: true },
                    { name: "Booking Cancellation SMS", enabled: true },
                    { name: "Payment Confirmation SMS", enabled: false }
                  ].map((notification) => (
                    <div key={notification.name} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={`sms_${notification.name}`}>{notification.name}</Label>
                      </div>
                      <Switch 
                        id={`sms_${notification.name}`} 
                        defaultChecked={notification.enabled} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push_enabled">Enable Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send push notifications to mobile apps and browsers.
                    </p>
                  </div>
                  <Switch id="push_enabled" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("Notification")}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Schedule Settings Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule Settings
              </CardTitle>
              <CardDescription>
                Configure global scheduling settings for all franchises.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default Operating Hours</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="opening_time">Default Opening Time</Label>
                    <Input 
                      id="opening_time" 
                      type="time"
                      defaultValue="09:00" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="closing_time">Default Closing Time</Label>
                    <Input 
                      id="closing_time" 
                      type="time"
                      defaultValue="22:00" 
                    />
                  </div>
                </div>
                
                <div className="space-y-4 pt-2">
                  {[
                    { day: "Monday", enabled: true },
                    { day: "Tuesday", enabled: true },
                    { day: "Wednesday", enabled: true },
                    { day: "Thursday", enabled: true },
                    { day: "Friday", enabled: true },
                    { day: "Saturday", enabled: true },
                    { day: "Sunday", enabled: true }
                  ].map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={`day_${day.day}`}>{day.day}</Label>
                      </div>
                      <Switch 
                        id={`day_${day.day}`} 
                        defaultChecked={day.enabled} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session_duration">Default Session Duration (minutes)</Label>
                    <Input 
                      id="session_duration" 
                      type="number"
                      defaultValue="60" 
                      min="15"
                      step="5"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min_capacity">Minimum Capacity</Label>
                    <Input 
                      id="min_capacity" 
                      type="number"
                      defaultValue="4" 
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_capacity">Maximum Capacity</Label>
                    <Input 
                      id="max_capacity" 
                      type="number"
                      defaultValue="12" 
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buffer_time">Buffer Time Between Sessions (minutes)</Label>
                    <Input 
                      id="buffer_time" 
                      type="number"
                      defaultValue="30" 
                      min="0"
                      step="5"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow_overlapping">Allow Overlapping Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow franchises to schedule overlapping sessions.
                    </p>
                  </div>
                  <Switch id="allow_overlapping" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Booking Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="advance_booking">Maximum Advance Booking (days)</Label>
                    <Input 
                      id="advance_booking" 
                      type="number"
                      defaultValue="30" 
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min_notice">Minimum Notice Period (hours)</Label>
                    <Input 
                      id="min_notice" 
                      type="number"
                      defaultValue="4" 
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require_payment">Require Payment at Booking</Label>
                    <p className="text-sm text-muted-foreground">
                      Require payment to complete booking.
                    </p>
                  </div>
                  <Switch id="require_payment" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("Schedule")}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Compliance Settings Tab */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Compliance Settings
              </CardTitle>
              <CardDescription>
                Configure global compliance and legal settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Document Expirations</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="doc_expiry_alerts">Document Expiry Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Send alerts for expiring documents.
                      </p>
                    </div>
                    <Switch id="doc_expiry_alerts" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiry_days">Days Before Expiry to Alert</Label>
                    <Input 
                      id="expiry_days" 
                      type="number"
                      defaultValue="30" 
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days before document expiry to send alerts.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Legal Documents</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                  <Textarea 
                    id="terms_conditions"
                    placeholder="Enter your terms and conditions..."
                    defaultValue="By using the FlyDining platform, all franchises agree to the following terms and conditions..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="privacy_policy">Privacy Policy</Label>
                  <Textarea 
                    id="privacy_policy"
                    placeholder="Enter your privacy policy..."
                    defaultValue="FlyDining is committed to protecting the privacy of all users..."
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require_acceptance">Require Acceptance</Label>
                    <p className="text-sm text-muted-foreground">
                      Require franchises to accept terms before operating.
                    </p>
                  </div>
                  <Switch id="require_acceptance" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Safety & Insurance</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="safety_certificate">Require Safety Certificate</Label>
                    <p className="text-sm text-muted-foreground">
                      Require franchises to upload safety certification.
                    </p>
                  </div>
                  <Switch id="safety_certificate" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="insurance_policy">Require Insurance Policy</Label>
                    <p className="text-sm text-muted-foreground">
                      Require franchises to upload insurance documentation.
                    </p>
                  </div>
                  <Switch id="insurance_policy" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min_insurance">Minimum Insurance Coverage (USD)</Label>
                  <Input 
                    id="min_insurance" 
                    type="number"
                    defaultValue="1000000" 
                    min="0"
                    step="10000"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("Compliance")}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlobalSettingsContent;

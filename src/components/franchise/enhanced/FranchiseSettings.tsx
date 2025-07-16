
import React, { useState } from 'react';
import { Franchise } from '@/types/franchise';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Building, Globe, CreditCard, Palette, Mail, MessageSquare, 
  Save, Clock, AlertTriangle, ShieldCheck, Braces, Upload
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';

interface FranchiseSettingsProps {
  franchise: Franchise;
  canEdit: boolean;
}

const FranchiseSettings: React.FC<FranchiseSettingsProps> = ({ 
  franchise,
  canEdit 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: franchise.company_name,
    address: franchise.address || '',
    city: franchise.city || '',
    state: franchise.state || '',
    country: franchise.country || '',
    email: franchise.email || '',
    contact_number: franchise.contact_number || '',
    tax_percentage: franchise.tax_percentage || 0,
    tax_inclusive: franchise.tax_inclusive || false,
    default_currency: franchise.default_currency || 'USD',
    timezone: franchise.timezone || 'America/New_York',
    language: franchise.language || 'English',
    welcome_message: franchise.welcome_message || '',
    theme_color: franchise.theme_color || '#7C3AED',
  });
  
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveChanges = async () => {
    if (!canEdit) {
      toast.error("You don't have permission to edit franchise settings");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('franchises')
        .update({
          company_name: formData.company_name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          email: formData.email,
          contact_number: formData.contact_number,
          tax_percentage: formData.tax_percentage,
          tax_inclusive: formData.tax_inclusive,
          default_currency: formData.default_currency,
          timezone: formData.timezone,
          language: formData.language,
          welcome_message: formData.welcome_message,
          theme_color: formData.theme_color,
          updated_at: new Date().toISOString()
        })
        .eq('id', franchise.id);
        
      if (error) throw error;
      
      toast.success("Franchise settings updated successfully");
    } catch (error: any) {
      console.error('Error updating franchise settings:', error);
      toast.error(`Failed to update settings: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Franchise Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage franchise configuration and preferences
          </p>
        </div>
        
        {canEdit && (
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="business-info">
        <TabsList>
          <TabsTrigger value="business-info">Business Info</TabsTrigger>
          <TabsTrigger value="regional">Regional Settings</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="business-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    placeholder="Enter company name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="Enter state/province"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Enter country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input
                    id="contact_number"
                    placeholder="Enter contact number"
                    value={formData.contact_number}
                    onChange={(e) => handleInputChange('contact_number', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Tax Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tax_percentage">Tax Percentage (%)</Label>
                    <Input
                      id="tax_percentage"
                      type="number"
                      placeholder="Enter tax percentage"
                      value={formData.tax_percentage.toString()}
                      onChange={(e) => handleInputChange('tax_percentage', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="tax_inclusive"
                      checked={formData.tax_inclusive}
                      onCheckedChange={(checked) => handleInputChange('tax_inclusive', checked)}
                      disabled={!canEdit}
                    />
                    <Label htmlFor="tax_inclusive">Tax inclusive pricing</Label>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-2">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Tax Settings Information</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Tax settings affect how prices are displayed and calculated across the platform.
                        If tax inclusive is enabled, all prices shown will include tax.
                        Please ensure your tax settings comply with local regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Regional Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.default_currency}
                    onValueChange={(value) => handleInputChange('default_currency', value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="SGD">SGD (S$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleInputChange('timezone', value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="Asia/Kolkata">India (UTC+5:30)</SelectItem>
                      <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                      <SelectItem value="Asia/Singapore">Singapore (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => handleInputChange('language', value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="welcome_message">Welcome Message</Label>
                <Textarea
                  id="welcome_message"
                  placeholder="Enter welcome message"
                  value={formData.welcome_message}
                  onChange={(e) => handleInputChange('welcome_message', e.target.value)}
                  disabled={!canEdit}
                />
                <p className="text-xs text-muted-foreground">
                  This message will be displayed to customers when they visit your franchise page.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Operating hours management will be available in a future update.
                  These settings will control your franchise's default operating hours and special schedules.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Brand Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="theme_color">Brand Color</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      id="theme_color"
                      value={formData.theme_color}
                      onChange={(e) => handleInputChange('theme_color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                      disabled={!canEdit}
                    />
                    <Input
                      value={formData.theme_color}
                      onChange={(e) => handleInputChange('theme_color', e.target.value)}
                      className="w-full"
                      disabled={!canEdit}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This color will be used as the primary brand color for your franchise.
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="logo">Brand Logo</Label>
                  <div className="border border-dashed rounded-md p-6 bg-muted">
                    <div className="flex flex-col items-center">
                      {franchise.logo_url ? (
                        <img 
                          src={franchise.logo_url} 
                          alt="Brand logo" 
                          className="w-32 h-32 object-contain mb-3" 
                        />
                      ) : (
                        <div className="w-32 h-32 bg-muted-foreground/10 rounded-md flex items-center justify-center mb-3">
                          <Building className="h-16 w-16 text-muted-foreground/40" />
                        </div>
                      )}
                      {canEdit && (
                        <Button variant="outline" size="sm" disabled={!canEdit}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 512x512px. PNG or JPG format.
                  </p>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Preview</Label>
                <div className="p-4 border rounded-md">
                  <div className="flex items-center space-x-4 mb-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: formData.theme_color }}
                    >
                      <span className="text-white font-bold">F</span>
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: formData.theme_color }}>
                        {formData.company_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.city}, {formData.state}, {formData.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mb-6">
                    <Button style={{ backgroundColor: formData.theme_color }}>
                      Book Now
                    </Button>
                    <Button variant="outline" style={{ borderColor: formData.theme_color, color: formData.theme_color }}>
                      View Sessions
                    </Button>
                  </div>
                  
                  {formData.welcome_message && (
                    <div className="bg-muted p-3 rounded-md text-sm">
                      <MessageSquare className="h-4 w-4 inline-block mr-1 text-muted-foreground" />
                      <span className="italic">{formData.welcome_message}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Advanced security settings, including IP restrictions and two-factor authentication,
                  will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Braces className="h-4 w-4 mr-2" />
                API Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  API keys and webhooks for external integrations will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FranchiseSettings;

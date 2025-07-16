import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Steps, Step } from "@/components/ui/steps";
import { 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  Settings, 
  UserPlus, 
  Check,
  Upload,
  Globe,
  MapPin
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { FranchiseFormData, OnboardingStep } from '@/types/franchiseManagement';
import { Label } from "@/components/ui/label";
import { useUserRole } from '@/providers/UserRoleProvider';
import { useAuditLogger } from '@/utils/auditLogger';

interface FranchiseOnboardingProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const FranchiseOnboarding: React.FC<FranchiseOnboardingProps> = ({ onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("franchise-identity");
  const [formData, setFormData] = useState<FranchiseFormData>({
    name: "",
    owner_name: "",
    owner_email: "",
    contact_number: "",
    company_name: "",
    tax_id: "",
    address: "",
    city: "",
    state: "",
    country: "",
    tax_percentage: 0,
    tax_inclusive: false,
    timezone: "America/New_York",
    currency: "USD",
    status: "pending_review"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useUserRole();
  const { logEvent } = useAuditLogger();

  const handleInputChange = (field: keyof FranchiseFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const moveToNextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    switch (currentStep) {
      case "franchise-identity":
        setCurrentStep("location-address");
        break;
      case "location-address":
        setCurrentStep("registration");
        break;
      case "registration":
        setCurrentStep("brand-appearance");
        break;
      case "brand-appearance":
        setCurrentStep("operational-setup");
        break;
      case "operational-setup":
        setCurrentStep("review");
        break;
      default:
        break;
    }
  };

  const moveToPreviousStep = () => {
    switch (currentStep) {
      case "location-address":
        setCurrentStep("franchise-identity");
        break;
      case "registration":
        setCurrentStep("location-address");
        break;
      case "brand-appearance":
        setCurrentStep("registration");
        break;
      case "operational-setup":
        setCurrentStep("brand-appearance");
        break;
      case "review":
        setCurrentStep("operational-setup");
        break;
      default:
        break;
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case "franchise-identity":
        if (!formData.owner_name) {
          toast.error("Owner name is required");
          return false;
        }
        if (!formData.owner_email) {
          toast.error("Owner email is required");
          return false;
        }
        if (!formData.contact_number) {
          toast.error("Contact number is required");
          return false;
        }
        return true;

      case "location-address":
        if (!formData.address) {
          toast.error("Address is required");
          return false;
        }
        if (!formData.city) {
          toast.error("City is required");
          return false;
        }
        if (!formData.state) {
          toast.error("State is required");
          return false;
        }
        if (!formData.country) {
          toast.error("Country is required");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "franchise-identity":
        return 25;
      case "location-address":
        return 50;
      case "operational-setup":
        return 75;
      case "review":
        return 100;
      default:
        return 0;
    }
  };

  const handleSubmit = async () => {
    if (currentStep !== "review") {
      moveToNextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('franchises')
        .insert({
          owner_name: formData.owner_name,
          email: formData.owner_email,
          contact_number: formData.contact_number,
          company_name: formData.company_name,
          name: formData.name || formData.company_name,
          tax_id: formData.tax_id,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          tax_percentage: formData.tax_percentage,
          tax_inclusive: formData.tax_inclusive,
          timezone: formData.timezone,
          default_currency: formData.currency,
          welcome_message: formData.welcome_message,
          theme_color: formData.theme_color,
          status: formData.status
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0] && currentUser) {
        logEvent("franchises", data[0].id, "created", {
          creator: currentUser.id,
          franchiseData: { ...formData, owner_id: currentUser.id }
        });
      }

      toast.success("Franchise created successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating franchise:", error);
      toast.error(`Failed to create franchise: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "franchise-identity":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Owner Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="owner_name">Owner Name*</Label>
                  <Input
                    id="owner_name"
                    placeholder="Enter owner's full name"
                    value={formData.owner_name}
                    onChange={(e) => handleInputChange("owner_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="owner_email">Email Address*</Label>
                  <Input
                    id="owner_email"
                    type="email"
                    placeholder="Enter owner's email address"
                    value={formData.owner_email}
                    onChange={(e) => handleInputChange("owner_email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_number">Contact Number*</Label>
                  <Input
                    id="contact_number"
                    placeholder="Enter contact number"
                    value={formData.contact_number}
                    onChange={(e) => handleInputChange("contact_number", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Franchise Name*</Label>
                  <Input
                    id="name"
                    placeholder="Enter franchise name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="id_proof" className="block mb-2">ID Proof</Label>
                  <div className="border border-input rounded-md p-4 bg-background">
                    <div className="flex items-center gap-4">
                      <Upload className="text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Upload ID proof document</p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG or PNG up to 5MB
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Document upload will be implemented in a future update
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "location-address":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Business Information
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company/Business Name*</Label>
                <Input
                  id="company_name"
                  placeholder="Enter company name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tax_id">Tax ID / GST Number*</Label>
                <Input
                  id="tax_id"
                  placeholder="Enter tax ID"
                  value={formData.tax_id}
                  onChange={(e) => handleInputChange("tax_id", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme_color">Brand Color</Label>
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="color"
                      id="theme_color"
                      value={formData.theme_color || "#7c3aed"}
                      onChange={(e) => handleInputChange("theme_color", e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={formData.theme_color || "#7c3aed"}
                      onChange={(e) => handleInputChange("theme_color", e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="brand_logo" className="block mb-2">Brand Logo</Label>
                  <div className="border border-input rounded-md p-4 bg-background">
                    <div className="flex items-center gap-4">
                      <Upload className="text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Upload logo</p>
                        <p className="text-xs text-muted-foreground">
                          PNG or JPG up to 2MB
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="welcome_message">Welcome Message</Label>
                <Textarea
                  id="welcome_message"
                  placeholder="Enter a welcome message for this franchise"
                  value={formData.welcome_message || ""}
                  onChange={(e) => handleInputChange("welcome_message", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case "operational-setup":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Operational Setup
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="address">Address*</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City*</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province*</Label>
                    <Input
                      id="state"
                      placeholder="Enter state/province"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country*</Label>
                    <Input
                      id="country"
                      placeholder="Enter country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleInputChange("timezone", value)}
                  >
                    <SelectTrigger>
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
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleInputChange("currency", value)}
                  >
                    <SelectTrigger>
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <Label htmlFor="tax_percentage">Tax Percentage (%)</Label>
                  <Input
                    id="tax_percentage"
                    type="number"
                    placeholder="Enter tax percentage"
                    min="0"
                    step="0.01"
                    value={formData.tax_percentage.toString()}
                    onChange={(e) => handleInputChange("tax_percentage", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-7">
                  <Switch
                    id="tax_inclusive"
                    checked={formData.tax_inclusive}
                    onCheckedChange={(checked) => handleInputChange("tax_inclusive", checked)}
                  />
                  <Label htmlFor="tax_inclusive">Tax inclusive pricing</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Check className="mr-2 h-5 w-5" />
              Review Information
            </h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Owner Details</h3>
                      <div className="mt-1 space-y-2">
                        <div className="flex">
                          <span className="font-medium w-24">Name:</span>
                          <span>{formData.owner_name}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-24">Email:</span>
                          <span>{formData.owner_email}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-24">Contact:</span>
                          <span>{formData.contact_number}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Business Information</h3>
                      <div className="mt-1 space-y-2">
                        <div className="flex">
                          <span className="font-medium w-24">Company:</span>
                          <span>{formData.company_name}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-24">Tax ID:</span>
                          <span>{formData.tax_id}</span>
                        </div>
                        {formData.theme_color && (
                          <div className="flex items-center">
                            <span className="font-medium w-24">Brand Color:</span>
                            <div 
                              className="w-4 h-4 rounded-full inline-block mr-1.5" 
                              style={{ backgroundColor: formData.theme_color }}
                            ></div>
                            <span>{formData.theme_color}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t pt-3 md:col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                      <div className="mt-1 flex items-start">
                        <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <span>
                          {formData.address}, {formData.city}, {formData.state}, {formData.country}
                        </span>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-3">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Regional Settings</h3>
                        <div className="mt-1 space-y-2">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium mr-1">Timezone:</span>
                            <span>{formData.timezone}</span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium mr-1">Currency:</span>
                            <span>{formData.currency}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Tax Setup</h3>
                        <div className="mt-1 space-y-2">
                          <div className="flex">
                            <span className="font-medium mr-1">Rate:</span>
                            <span>{formData.tax_percentage}%</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium mr-1">Inclusive:</span>
                            <span>{formData.tax_inclusive ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <div className="mt-1 space-y-2">
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300">
                            Pending Review
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Will be activated after admin review
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-muted/50 p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Important Note:</h4>
                <p className="text-sm text-muted-foreground">
                  By creating this franchise, you confirm that all information provided is accurate 
                  and you have the necessary authorization to register this business. The franchise 
                  will remain in "Pending Review" status until approved by an administrator.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">
            Step {getStepProgress() / 25} of 4: {currentStep.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <span className="text-sm text-muted-foreground">{getStepProgress()}% Complete</span>
        </div>
        <Progress value={getStepProgress()} className="h-2" />
        
        <div className="pt-4">
          <Steps currentStep={getStepProgress() / 25}>
            <Step>Owner Details</Step>
            <Step>Business Info</Step>
            <Step>Operational Setup</Step>
            <Step>Review</Step>
          </Steps>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        {renderStepContent()}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === "franchise-identity" ? onCancel : moveToPreviousStep}
        >
          {currentStep === "franchise-identity" ? "Cancel" : "Back"}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {currentStep === "review" ? (isSubmitting ? "Creating..." : "Create Franchise") : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default FranchiseOnboarding;

import React from 'react';
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Building2, MapPin, Mail, Phone, CreditCard, Settings, UserPlus, Check } from "lucide-react";
import { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuditLogger } from '@/utils/auditLogger';

// Import OnboardingStep and GovernmentIDType from franchiseTypes
// Add these types to franchiseTypes.ts if they don't exist
export type OnboardingStep = 
  | "business-details" 
  | "contact-info" 
  | "tax-payment" 
  | "settings" 
  | "review";

export type GovernmentIDType = "PAN" | "Aadhar" | "Passport" | "Other";

interface FranchiseOnboardingProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const FranchiseOnboarding: React.FC<FranchiseOnboardingProps> = ({ onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("business-details");
  const [formData, setFormData] = useState({
    company_name: "",
    owner_name: "",
    contact_number: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    tax_id: "",
    government_id_type: "Other" as GovernmentIDType,
    tax_percentage: 0,
    tax_inclusive: false,
    payment_gateway: "Stripe",
    default_currency: "USD",
    timezone: "America/New_York",
    language: "English"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logEvent } = useAuditLogger();

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const moveToNextStep = () => {
    switch (currentStep) {
      case "business-details":
        if (!formData.company_name) {
          toast.error("Company name is required");
          return;
        }
        setCurrentStep("contact-info");
        break;
      case "contact-info":
        if (!formData.email || !formData.contact_number) {
          toast.error("Email and contact number are required");
          return;
        }
        setCurrentStep("tax-payment");
        break;
      case "tax-payment":
        if (!formData.tax_id) {
          toast.error("Tax ID is required");
          return;
        }
        setCurrentStep("settings");
        break;
      case "settings":
        setCurrentStep("review");
        break;
      default:
        break;
    }
  };

  const moveToPreviousStep = () => {
    switch (currentStep) {
      case "contact-info":
        setCurrentStep("business-details");
        break;
      case "tax-payment":
        setCurrentStep("contact-info");
        break;
      case "settings":
        setCurrentStep("tax-payment");
        break;
      case "review":
        setCurrentStep("settings");
        break;
      default:
        break;
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "business-details":
        return 20;
      case "contact-info":
        return 40;
      case "tax-payment":
        return 60;
      case "settings":
        return 80;
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
        .from("franchises")
        .insert(formData)
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        logEvent("franchises", data[0].id, "created", formData);
        toast.success("Franchise created successfully!");
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating franchise:", error);
      toast.error("Failed to create franchise");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "business-details":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Business Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Company Name*</label>
                <Input
                  placeholder="Enter company name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Owner Name</label>
                <Input
                  placeholder="Enter owner name"
                  value={formData.owner_name}
                  onChange={(e) => handleInputChange("owner_name", e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case "contact-info":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Email Address*</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Contact Number*</label>
                <Input
                  placeholder="Enter contact number"
                  value={formData.contact_number}
                  onChange={(e) => handleInputChange("contact_number", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Address</label>
                <Textarea
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">City</label>
                  <Input
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">State</label>
                  <Input
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Country</label>
                <Input
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case "tax-payment":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Tax & Payment Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Tax ID*</label>
                <Input
                  placeholder="Enter tax ID"
                  value={formData.tax_id}
                  onChange={(e) => handleInputChange("tax_id", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Government ID Type</label>
                <Select
                  value={formData.government_id_type}
                  onValueChange={(value) => handleInputChange("government_id_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAN">PAN</SelectItem>
                    <SelectItem value="Aadhar">Aadhar</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Tax Percentage (%)</label>
                <Input
                  type="number"
                  placeholder="Enter tax percentage"
                  value={formData.tax_percentage.toString()}
                  onChange={(e) => handleInputChange("tax_percentage", parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Payment Gateway</label>
                <Select
                  value={formData.payment_gateway}
                  onValueChange={(value) => handleInputChange("payment_gateway", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stripe">Stripe</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Square">Square</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Regional Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Default Currency</label>
                <Select
                  value={formData.default_currency}
                  onValueChange={(value) => handleInputChange("default_currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Timezone</label>
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
                    <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Language</label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Business Details</h3>
                  <p className="mt-1"><span className="font-medium">Company:</span> {formData.company_name}</p>
                  <p><span className="font-medium">Owner:</span> {formData.owner_name || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                  <p className="mt-1"><span className="font-medium">Email:</span> {formData.email}</p>
                  <p><span className="font-medium">Phone:</span> {formData.contact_number}</p>
                  <p><span className="font-medium">Location:</span> {formData.city}, {formData.state}, {formData.country}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tax & Payment</h3>
                  <p className="mt-1"><span className="font-medium">Tax ID:</span> {formData.tax_id}</p>
                  <p><span className="font-medium">Tax Rate:</span> {formData.tax_percentage}%</p>
                  <p><span className="font-medium">Payment Gateway:</span> {formData.payment_gateway}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Regional Settings</h3>
                  <p className="mt-1"><span className="font-medium">Currency:</span> {formData.default_currency}</p>
                  <p><span className="font-medium">Timezone:</span> {formData.timezone}</p>
                  <p><span className="font-medium">Language:</span> {formData.language}</p>
                </div>
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
            Step {getStepProgress() / 20} of 5: {currentStep.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <span className="text-sm text-muted-foreground">{getStepProgress()}% Complete</span>
        </div>
        <Progress value={getStepProgress()} className="h-2" />
      </div>

      <Card>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === "business-details" ? onCancel : moveToPreviousStep}
        >
          {currentStep === "business-details" ? "Cancel" : "Back"}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {currentStep === "review" ? (isSubmitting ? "Creating..." : "Create Franchise") : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default FranchiseOnboarding;

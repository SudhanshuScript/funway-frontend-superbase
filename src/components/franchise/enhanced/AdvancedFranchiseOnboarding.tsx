import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  Settings, 
  UserCircle, 
  Check,
  Upload,
  Globe,
  MapPin,
  Calendar as CalendarIcon,
  Instagram,
  Palette,
  Users,
  FileText,
  FileCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { 
  FranchiseFormData, 
  OnboardingStep,
  TeamMember,
  TeamMemberRole
} from '@/types/franchiseManagement';
import { useUserRole } from '@/providers/UserRoleProvider';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LocationSelector from "./LocationSelector";
import { Steps, Step } from "@/components/ui/steps";

interface AdvancedFranchiseOnboardingProps {
  onSuccess: () => void;
  onCancel: () => void;
  existingFranchise?: any;
  isEditing?: boolean;
}

const DEFAULT_FORM_DATA: FranchiseFormData = {
  name: "",
  company_name: "", // Added for DB compatibility
  owner_name: "",
  owner_email: "",
  email: "", // Added for DB compatibility
  contact_number: "",
  address: "", // Added for DB compatibility
  city: "",
  state: "",
  country: "",
  tax_id: "",
  tax_percentage: 0,
  tax_inclusive: false,
  timezone: "America/New_York",
  currency: "USD",
  default_currency: "USD", // Added for DB compatibility
  status: "pending_review"
};

const AdvancedFranchiseOnboarding: React.FC<AdvancedFranchiseOnboardingProps> = ({ 
  onSuccess, 
  onCancel,
  existingFranchise,
  isEditing = false
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("franchise-identity");
  const [formData, setFormData] = useState<FranchiseFormData>(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(
    existingFranchise?.start_date ? new Date(existingFranchise.start_date) : undefined
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [availableManagers, setAvailableManagers] = useState<{id: string, name: string}[]>([]);
  const { currentUser } = useUserRole();

  useEffect(() => {
    if (existingFranchise && isEditing) {
      const initialData: FranchiseFormData = {
        name: existingFranchise.name || "",
        company_name: existingFranchise.company_name || "",
        legal_name: existingFranchise.legal_name || "",
        owner_name: existingFranchise.owner_name || "",
        owner_email: existingFranchise.owner_email || "",
        email: existingFranchise.email || "", // For DB compatibility
        contact_number: existingFranchise.contact_number || "",
        full_address: existingFranchise.full_address || "",
        address: existingFranchise.address || "", // For DB compatibility
        city: existingFranchise.city || "",
        state: existingFranchise.state || "",
        country: existingFranchise.country || "",
        timezone: existingFranchise.timezone || "America/New_York",
        currency: existingFranchise.currency || "USD",
        default_currency: existingFranchise.default_currency || "USD", // For DB compatibility
        tax_id: existingFranchise.tax_id || "",
        gst_number: existingFranchise.gst_number || "",
        tax_percentage: existingFranchise.tax_percentage || 0,
        tax_inclusive: existingFranchise.tax_inclusive || false,
        brand_color: existingFranchise.brand_color || existingFranchise.theme_color || "",
        website: existingFranchise.website || "",
        instagram: existingFranchise.instagram || "",
        welcome_message: existingFranchise.welcome_message || "",
        status: existingFranchise.status || "active"
      };

      setFormData(initialData);
      
      if (existingFranchise.logo_url) {
        setLogoPreview(existingFranchise.logo_url);
      }
      
      if (existingFranchise.team_members && existingFranchise.team_members.length > 0) {
        setTeamMembers(existingFranchise.team_members);
      }
    }
    
    fetchAvailableManagers();
  }, [existingFranchise, isEditing]);

  const fetchAvailableManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('role', 'franchise_manager');
        
      if (error) throw error;
      
      if (data) {
        setAvailableManagers(data);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleInputChange = (field: keyof FranchiseFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    if (field === 'name') {
      setFormData(prev => ({ ...prev, company_name: value }));
    } else if (field === 'company_name') {
      setFormData(prev => ({ ...prev, name: value }));
    } else if (field === 'owner_email') {
      setFormData(prev => ({ ...prev, email: value }));
    } else if (field === 'email') {
      setFormData(prev => ({ ...prev, owner_email: value }));
    } else if (field === 'full_address') {
      setFormData(prev => ({ ...prev, address: value }));
    } else if (field === 'address') {
      setFormData(prev => ({ ...prev, full_address: value }));
    } else if (field === 'currency') {
      setFormData(prev => ({ ...prev, default_currency: value }));
    } else if (field === 'default_currency') {
      setFormData(prev => ({ ...prev, currency: value }));
    }
  };

  const handleFileChange = async (field: 'brand_logo' | 'id_proof' | 'fssai_cert' | 'business_certificate' | 'insurance_document', file: File | null) => {
    if (!file) return;

    if (field === 'brand_logo') {
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }

    setFormData({
      ...formData,
      [field]: file
    });

    // Note: Actual file upload would happen on form submission
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      handleInputChange('start_date', format(date, 'yyyy-MM-dd'));
    } else {
      handleInputChange('start_date', undefined);
    }
  };

  const handleAddTeamMember = () => {
    const newTeamMember: TeamMember = {
      id: `temp-${Date.now()}`,
      name: "",
      email: "",
      role: "Staff",
      telegramAccess: false
    };
    
    setTeamMembers([...teamMembers, newTeamMember]);
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: any) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers[index] = {
      ...updatedTeamMembers[index],
      [field]: value
    };
    
    setTeamMembers(updatedTeamMembers);
    handleInputChange('team_members', updatedTeamMembers);
  };

  const handleRemoveTeamMember = (index: number) => {
    const updatedTeamMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedTeamMembers);
    handleInputChange('team_members', updatedTeamMembers);
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
        if (!formData.name) {
          toast.error("Franchise name is required");
          return false;
        }
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
        if (!formData.country) {
          toast.error("Country is required");
          return false;
        }
        if (!formData.state) {
          toast.error("State/Province is required");
          return false;
        }
        if (!formData.city) {
          toast.error("City is required");
          return false;
        }
        return true;

      case "registration":
        if (!formData.tax_id) {
          toast.error("Tax ID / GST Number is required");
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
        return 16;
      case "location-address":
        return 33;
      case "registration":
        return 50;
      case "brand-appearance":
        return 67;
      case "operational-setup":
        return 84;
      case "review":
        return 100;
      default:
        return 0;
    }
  };

  const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}/${Date.now()}.${fileExt}`;
      
      // For now, mocking file upload - in a real app, this would upload to Supabase Storage
      // const { data, error } = await supabase.storage.from('franchises').upload(fileName, file);
      // if (error) throw error;
      // return supabase.storage.from('franchises').getPublicUrl(fileName).data.publicUrl;
      
      // Mock response for demo purposes
      return `https://example.com/storage/${fileName}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (currentStep !== "review") {
      moveToNextStep();
      return;
    }

    setIsSubmitting(true);

    try {
      let logoUrl = formData.logo_url;
      
      if (formData.brand_logo && formData.brand_logo instanceof File) {
        logoUrl = await uploadFileToStorage(formData.brand_logo, 'logos');
      }

      const franchiseData = {
        company_name: formData.company_name || formData.name,
        owner_name: formData.owner_name,
        contact_number: formData.contact_number,
        email: formData.email || formData.owner_email,
        address: formData.address || formData.full_address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        tax_id: formData.tax_id,
        tax_percentage: Number(formData.tax_percentage),
        tax_inclusive: formData.tax_inclusive,
        logo_url: logoUrl,
        theme_color: formData.theme_color || formData.brand_color,
        welcome_message: formData.welcome_message,
        timezone: formData.timezone,
        default_currency: formData.default_currency || formData.currency,
        status: isEditing ? formData.status : "pending_review",
        updated_at: new Date().toISOString()
      };

      delete (franchiseData as any).brand_logo;
      delete (franchiseData as any).id_proof;
      delete (franchiseData as any).fssai_cert;
      delete (franchiseData as any).business_certificate;
      delete (franchiseData as any).insurance_document;

      if (isEditing && existingFranchise) {
        const { error } = await supabase
          .from('franchises')
          .update(franchiseData)
          .eq('id', existingFranchise.id);

        if (error) throw error;

        toast.success("Franchise updated successfully!");
      } else {
        const { error } = await supabase
          .from('franchises')
          .insert({
            ...franchiseData,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        
        toast.success("New franchise created successfully!");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving franchise:", error);
      toast.error(`Failed to save franchise: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "franchise-identity":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Building2 className="h-6 w-6" />
              <h2>Primary Franchise Identity</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Franchise Name<span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="Enter franchise name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This name will be displayed to customers</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="legal_name">Legal Business Name</Label>
                <Input
                  id="legal_name"
                  placeholder="Enter legal business name"
                  value={formData.legal_name || ""}
                  onChange={(e) => handleInputChange("legal_name", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Name as registered with tax authorities</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-base font-medium mb-4">Owner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner_name">Owner Name<span className="text-red-500">*</span></Label>
                    <Input
                      id="owner_name"
                      placeholder="Enter owner's name"
                      value={formData.owner_name}
                      onChange={(e) => handleInputChange("owner_name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="owner_email">Owner Email<span className="text-red-500">*</span></Label>
                    <Input
                      id="owner_email"
                      type="email"
                      placeholder="Enter owner's email"
                      value={formData.owner_email}
                      onChange={(e) => handleInputChange("owner_email", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Phone Number<span className="text-red-500">*</span></Label>
                    <Input
                      id="contact_number"
                      placeholder="Enter phone number with country code"
                      value={formData.contact_number}
                      onChange={(e) => handleInputChange("contact_number", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>ID Proof</Label>
                <div className="border border-input rounded-md p-4 bg-background">
                  <div className="flex items-center gap-4">
                    <Upload className="text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Upload ID proof document</p>
                      <p className="text-xs text-muted-foreground">
                        Passport, Aadhaar, or other valid government ID (PDF, JPG, PNG)
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('id_proof_input')?.click()}
                    >
                      Choose File
                    </Button>
                    <input
                      id="id_proof_input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('id_proof', e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "location-address":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <MapPin className="h-6 w-6" />
              <h2>Location & Address</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <LocationSelector 
                countryValue={formData.country}
                stateValue={formData.state}
                cityValue={formData.city}
                onCountryChange={(value) => handleInputChange("country", value)}
                onStateChange={(value) => handleInputChange("state", value)}
                onCityChange={(value) => handleInputChange("city", value)}
              />
              
              <div className="space-y-2">
                <Label htmlFor="full_address">Full Address</Label>
                <Textarea
                  id="full_address"
                  placeholder="Enter complete address"
                  value={formData.full_address || ""}
                  onChange={(e) => handleInputChange("full_address", e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
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
                
                <div className="space-y-2">
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
              
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date of Operations</Label>
                <div className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start_date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleStartDateChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        );

      case "registration":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <FileText className="h-6 w-6" />
              <h2>Registration & Compliance</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax_id">GST / Local Tax ID<span className="text-red-500">*</span></Label>
                  <Input
                    id="tax_id"
                    placeholder="Enter tax ID number"
                    value={formData.tax_id}
                    onChange={(e) => handleInputChange("tax_id", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gst_number">Additional Tax Reference</Label>
                  <Input
                    id="gst_number"
                    placeholder="Enter additional tax reference if applicable"
                    value={formData.gst_number || ""}
                    onChange={(e) => handleInputChange("gst_number", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>FSSAI License</Label>
                <div className="flex flex-col gap-2">
                  <div className="border border-input rounded-md p-4 bg-background">
                    <div className="flex items-center gap-4">
                      <FileCheck className="text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Upload FSSAI License</p>
                        <p className="text-xs text-muted-foreground">
                          Valid food safety certification (PDF, JPG, PNG)
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('fssai_cert_input')?.click()}
                      >
                        Choose File
                      </Button>
                      <input
                        id="fssai_cert_input"
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('fssai_cert', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Label htmlFor="fssai_expiry" className="min-w-24">Expiry Date:</Label>
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="fssai_expiry"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.fssai_expiry && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.fssai_expiry ? 
                              format(new Date(formData.fssai_expiry), "PPP") : 
                              <span>Select expiry date</span>
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.fssai_expiry ? new Date(formData.fssai_expiry) : undefined}
                            onSelect={(date) => 
                              handleInputChange("fssai_expiry", date ? format(date, 'yyyy-MM-dd') : undefined)
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Business Registration Certificate</Label>
                <div className="border border-input rounded-md p-4 bg-background">
                  <div className="flex items-center gap-4">
                    <FileCheck className="text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Upload Business Registration</p>
                      <p className="text-xs text-muted-foreground">
                        Business registration certificate (PDF, JPG, PNG)
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('business_cert_input')?.click()}
                    >
                      Choose File
                    </Button>
                    <input
                      id="business_cert_input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('business_certificate', e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Insurance or Safety Compliance (Optional)</Label>
                <div className="border border-input rounded-md p-4 bg-background">
                  <div className="flex items-center gap-4">
                    <FileCheck className="text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Upload Insurance Documents</p>
                      <p className="text-xs text-muted-foreground">
                        Insurance policy or safety compliance documentation (PDF)
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('insurance_doc_input')?.click()}
                    >
                      Choose File
                    </Button>
                    <input
                      id="insurance_doc_input"
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('insurance_document', e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
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
                
                <div className="flex items-center space-x-2 mt-8">
                  <Switch
                    id="tax_inclusive"
                    checked={formData.tax_inclusive}
                    onCheckedChange={(checked) => handleInputChange("tax_inclusive", checked)}
                  />
                  <Label htmlFor="tax_inclusive">Tax Inclusive Pricing</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case "brand-appearance":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Palette className="h-6 w-6" />
              <h2>Brand & Appearance</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <Label>Franchise Logo</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="border border-input rounded-md p-4 bg-background">
                    <div className="flex items-center gap-4">
                      <Upload className="text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Upload Logo</p>
                        <p className="text-xs text-muted-foreground">
                          PNG or JPG, recommended size 512x512px
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('logo_input')?.click()}
                      >
                        Choose File
                      </Button>
                      <input
                        id="logo_input"
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('brand_logo', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  
                  {logoPreview && (
                    <div className="flex justify-center">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden border border-input">
                        <img 
                          src={logoPreview} 
                          alt="Logo Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand_color">Primary Brand Color</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    id="brand_color"
                    value={formData.brand_color || "#7C3AED"}
                    onChange={(e) => handleInputChange("brand_color", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={formData.brand_color || "#7C3AED"}
                    onChange={(e) => handleInputChange("brand_color", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      placeholder="https://example.com"
                      value={formData.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Instagram className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="instagram"
                      placeholder="@yourhandle"
                      value={formData.instagram || ""}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="welcome_message">Welcome Message (Optional)</Label>
                <Textarea
                  id="welcome_message"
                  placeholder="Enter a welcome message for your customers"
                  value={formData.welcome_message || ""}
                  onChange={(e) => handleInputChange("welcome_message", e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">This message will be displayed to customers when they visit your franchise</p>
              </div>
            </div>
          </div>
        );

      case "operational-setup":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Settings className="h-6 w-6" />
              <h2>Operational Setup</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Operating Hours</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monday_start">Monday</Label>
                    <Input
                      id="monday_start"
                      type="time"
                      value={formData.monday_start || ""}
                      onChange={(e) => handleInputChange("monday_start", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monday_end">End</Label>
                    <Input
                      id="monday_end"
                      type="time"
                      value={formData.monday_end || ""}
                      onChange={(e) => handleInputChange("monday_end", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Tuesday</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tuesday_start">Start</Label>
                    <Input
                      id="tuesday_start"
                      type="time"
                      value={formData.tuesday_start || ""}
                      onChange={(e) => handleInputChange("tuesday_start", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tuesday_end">End</Label>
                    <Input
                      id="tuesday_end"
                      type="time"
                      value={formData.tuesday_end || ""}
                      onChange={(e) => handleInputChange("tuesday_end", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Wednesday</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wednesday_start">Start</Label>
                    <Input
                      id="wednesday_start"
                      type="time"
                      value={formData.wednesday_start || ""}
                      onChange={(e) => handleInputChange("wednesday_start", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wednesday_end">End</Label>
                    <Input
                      id="wednesday_end"
                      type="time"
                      value={formData.wednesday_end || ""}
                      onChange={(e) => handleInputChange("wednesday_end", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Thursday</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="thursday_start">Start</Label>
                    <Input
                      id="thursday_start"
                      type="time"
                      value={formData.thursday_start || ""}
                      onChange={(e) => handleInputChange("thursday_start", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thursday_end">End</Label>
                    <Input
                      id="thursday_end"
                      type="time"
                      value={formData.thursday_end || ""}
                      onChange={(e) => handleInputChange("thursday_end", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Friday</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="friday_start">Start</Label>
                    <Input
                      id="friday_start"
                      type="time"
                      value={formData.friday_start || ""}
                      onChange={(e) => handleInputChange("friday_start", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="friday_end">End</Label>
                    <Input
                      id="friday_end"
                      type="time"
                      value={formData.friday_end || ""}
                      onChange={(e) => handleInputChange("friday_end", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Saturday</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="saturday_start">Start</Label>
                    <Input
                      id="saturday_start"
                      type="time"
                      value={formData.saturday_start || ""}
                      onChange={(e) => handleInputChange("saturday_start", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="saturday_end">End</Label>
                    <Input
                      id="saturday_end"
                      type="time"
                      value={formData.saturday_end || ""}
                      onChange={(e) => handleInputChange("saturday_end", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Sunday</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sunday_start">Start</Label>
                    <Input
                      id="sunday_start"
                      type="time"
                      value={formData.sunday_start || ""}
                      onChange={(e) => handleInputChange("sunday_start", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sunday_end">End</Label>
                    <Input
                      id="sunday_end"
                      type="time"
                      value={formData.sunday_end || ""}
                      onChange={(e) => handleInputChange("sunday_end", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Check className="h-6 w-6" />
              <h2>Review</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Franchise Name</Label>
                <p className="text-sm text-muted-foreground">{formData.name}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Owner Name</Label>
                <p className="text-sm text-muted-foreground">{formData.owner_name}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Owner Email</Label>
                <p className="text-sm text-muted-foreground">{formData.owner_email}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <p className="text-sm text-muted-foreground">{formData.contact_number}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Address</Label>
                <p className="text-sm text-muted-foreground">{formData.address}</p>
              </div>
              
              <div className="space-y-2">
                <Label>City</Label>
                <p className="text-sm text-muted-foreground">{formData.city}</p>
              </div>
              
              <div className="space-y-2">
                <Label>State</Label>
                <p className="text-sm text-muted-foreground">{formData.state}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Country</Label>
                <p className="text-sm text-muted-foreground">{formData.country}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Tax ID</Label>
                <p className="text-sm text-muted-foreground">{formData.tax_id}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Website</Label>
                <p className="text-sm text-muted-foreground">{formData.website}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Instagram</Label>
                <p className="text-sm text-muted-foreground">{formData.instagram}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <p className="text-sm text-muted-foreground">{formData.welcome_message}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{isEditing ? "Edit Franchise" : "Add New Franchise"}</h1>
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
          
          <div className="relative">
            <Progress value={getStepProgress()} className="h-2" />
          </div>
          
          <Steps currentStep={[
            "franchise-identity", 
            "location-address", 
            "registration", 
            "brand-appearance", 
            "operational-setup", 
            "review"
          ].indexOf(currentStep)} 
          orientation="horizontal"
          className="justify-between mb-8">
            <Step>Identity</Step>
            <Step>Location</Step>
            <Step>Registration</Step>
            <Step>Brand</Step>
            <Step>Operations</Step>
            <Step>Review</Step>
          </Steps>
          
          <div className="min-h-[400px] py-4">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={moveToPreviousStep}
              disabled={currentStep === "franchise-identity"}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : currentStep === "review" ? "Submit" : "Next"}
              {currentStep !== "review" && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFranchiseOnboarding;


import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  ArrowRight,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Save,
  BadgeCheck,
  Upload,
  FileText,
  Users,
  UserCircle,
  UserCog
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  StaffDesignation, 
  StaffAccessLevel, 
  StaffStatus, 
  EmployeeDB,
  STAFF_DEPARTMENTS,
  shouldHaveTelegramAccess
} from "@/types/staffTypes";
import { useAuditLogger } from "@/utils/auditLogger";
import { MultiStepFormProgress } from "./MultiStepFormProgress";
import { FileUploadField } from "./FileUploadField";

type EnhancedFranchise = {
  id: string;
  company_name: string;
  name?: string;
};

const STEPS = [
  { id: "basic-info", label: "Basic Information" },
  { id: "role-department", label: "Role & Department" },
  { id: "communication", label: "Communication & Access" },
  { id: "documents", label: "Document Upload" },
  { id: "review", label: "Review & Submit" }
];

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "not_specified" }
];

const DESIGNATION_OPTIONS = [
  { label: "Chef", value: "Chef" },
  { label: "Host", value: "Host" },
  { label: "Flight Attendant", value: "Flight Attendant" },
  { label: "Server", value: "Server" },
  { label: "Bartender", value: "Bartender" },
  { label: "Photographer", value: "Photographer" },
  { label: "Safety Officer", value: "Safety Officer" },
  { label: "Maintenance Staff", value: "Maintenance Staff" },
  { label: "Ride Operator", value: "Ride Operator" }
];

const DEPARTMENT_OPTIONS = [
  { label: "Kitchen", value: "Kitchen" },
  { label: "Guest Relations", value: "Guest Relations" },
  { label: "Dining", value: "Dining" },
  { label: "Events", value: "Events" },
  { label: "Operations", value: "Operations" },
  { label: "Housekeeping", value: "Housekeeping" },
  { label: "Amusement", value: "Amusement" },
  { label: "Airline", value: "Airline" },
  { label: "Technical", value: "Technical" }
];

// Map designation to default department
const DESIGNATION_TO_DEPARTMENT: Record<string, string> = {
  "Chef": "Kitchen",
  "Host": "Guest Relations",
  "Flight Attendant": "Airline",
  "Server": "Dining",
  "Bartender": "Dining",
  "Photographer": "Events",
  "Safety Officer": "Operations",
  "Maintenance Staff": "Technical",
  "Ride Operator": "Amusement"
};

// Define which roles should have telegram access
const TELEGRAM_ACCESS_ROLES = ["Chef", "Photographer", "Manager"];

const staffSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  gender: z.string().optional(),
  contact_number: z.string().min(7, "Contact number must be valid"),
  email: z.string().email("Please enter a valid email address"),
  emergency_contact: z.string().optional(),
  telegram_id: z.string().optional(),
  hire_date: z.string().refine((date) => {
    const hireDate = new Date(date);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return hireDate >= oneYearAgo;
  }, "Hire date cannot be more than 1 year in the past"),
  franchise_id: z.string().min(1, "Franchise is required"),
  access_level: z.enum(["Admin", "Manager", "Staff", "Owner"]),
  status: z.enum(["active", "inactive", "on_leave", "training"]),
  telegram_access: z.boolean().default(false),
  whatsapp_access: z.boolean().default(false),
  // Document fields will be handled separately
  id_proof: z.any().optional(),
  experience_cert: z.any().optional(),
  police_verification: z.any().optional(),
  profile_image: z.any().optional(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

type StaffFormProps = {
  staffId?: string;
  franchiseId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function StaffForm({ staffId, franchiseId, onSuccess, onCancel }: StaffFormProps) {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [franchises, setFranchises] = useState<EnhancedFranchise[]>([]);
  const [displayName, setDisplayName] = useState("");
  const { logEvent } = useAuditLogger();

  // File state
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [experienceCertFile, setExperienceCertFile] = useState<File | null>(null);
  const [policeVerificationFile, setPoliceVerificationFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      full_name: "",
      designation: "",
      department: "",
      gender: "not_specified",
      contact_number: "",
      email: "",
      emergency_contact: "",
      hire_date: new Date().toISOString().split('T')[0],
      telegram_id: "",
      franchise_id: franchiseId || "",
      access_level: "Staff",
      status: "active",
      telegram_access: false,
      whatsapp_access: false
    },
  });

  const watchDesignation = form.watch("designation");

  useEffect(() => {
    if (watchDesignation) {
      // Auto-set department based on designation
      const defaultDepartment = DESIGNATION_TO_DEPARTMENT[watchDesignation];
      if (defaultDepartment) {
        form.setValue("department", defaultDepartment);
      }

      // Auto-set telegram access based on role
      const shouldEnableTelegram = TELEGRAM_ACCESS_ROLES.includes(watchDesignation);
      form.setValue("telegram_access", shouldEnableTelegram);
    }
  }, [watchDesignation, form]);
  
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "full_name" && value.full_name) {
        setDisplayName(value.full_name as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    const fetchFranchises = async () => {
      const { data, error } = await supabase
        .from("franchises")
        .select("id, company_name, status")
        .eq("status", "active")
        .order("company_name");
        
      if (!error && data) {
        setFranchises(data.map(f => ({
          id: f.id,
          company_name: f.company_name,
          name: f.company_name,
        })));
      }
    };
    
    if (currentUser?.role === "superadmin") {
      fetchFranchises();
    }
  }, [currentUser]);

  useEffect(() => {
    if (staffId) {
      fetchStaffData();
    }
  }, [staffId]);

  const fetchStaffData = async () => {
    if (!staffId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", staffId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const employee = data as EmployeeDB;
        setDisplayName(employee.name);

        form.reset({
          full_name: employee.name || "",
          designation: employee.role as StaffDesignation || "",
          department: employee.department || "",
          gender: "not_specified", // Default as this is a new field
          contact_number: employee.phone || "",
          email: employee.email || "",
          emergency_contact: employee.emergency_contact || "",
          hire_date: employee.hire_date || new Date().toISOString().split('T')[0],
          telegram_id: employee.telegram_id || "",
          franchise_id: employee.franchise_id || franchiseId || "",
          access_level: employee.access_level as StaffAccessLevel || "Staff",
          status: employee.status as StaffStatus || "active",
          telegram_access: Boolean(employee.telegram_access) || false,
          whatsapp_access: false // Default as this is a new field
        });
      }
    } catch (error) {
      console.error("Error fetching staff member data:", error);
      toast.error("Failed to load staff member data");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: StaffFormValues) => {
    // If we're not at the last step, move to the next step
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare files for upload - in a real implementation, you'd upload these to storage
      // and get back URLs to store in the database
      const mockFileUrls = {
        id_proof: idProofFile ? "mock-id-proof-url" : null,
        experience_cert: experienceCertFile ? "mock-experience-cert-url" : null,
        police_verification: policeVerificationFile ? "mock-police-verification-url" : null,
        image_url: profileImageFile ? "mock-profile-image-url" : null
      };
      
      const staffData = {
        name: values.full_name,
        role: values.designation,
        department: values.department,
        phone: values.contact_number,
        email: values.email,
        emergency_contact: values.emergency_contact,
        hire_date: values.hire_date,
        telegram_id: values.telegram_id,
        telegram_access: values.telegram_access,
        whatsapp_access: values.whatsapp_access,
        gender: values.gender,
        id_proof_url: mockFileUrls.id_proof,
        experience_cert_url: mockFileUrls.experience_cert,
        police_verification_url: mockFileUrls.police_verification,
        image_url: mockFileUrls.image_url,
        access_level: values.access_level,
        status: values.status,
        franchise_id: values.franchise_id,
        updated_at: new Date().toISOString()
      };
      
      // Get the franchise name for the success toast
      const franchise = franchises.find(f => f.id === values.franchise_id);
      const franchiseName = franchise?.company_name || 'franchise';
      
      if (staffId) {
        const { error } = await supabase
          .from("employees")
          .update(staffData)
          .eq("id", staffId);
          
        if (error) throw error;
        
        logEvent("employees", staffId, "updated", staffData);
        toast.success(`Staff member updated successfully at ${franchiseName}`);
      } else {
        const { data, error } = await supabase
          .from("employees")
          .insert({
            ...staffData,
            created_at: new Date().toISOString()
          })
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          logEvent("employees", data[0].id, "created", staffData);
        }
        
        toast.success(`Staff member added successfully to ${franchiseName}`);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/staff");
      }
    } catch (error: any) {
      console.error("Error saving staff member:", error);
      toast.error(`Failed to save staff member: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/staff");
    }
  };

  const nextStep = () => {
    // Validate the current step fields
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 0: // Basic Information
        fieldsToValidate = ['full_name', 'email', 'contact_number', 'hire_date', 'gender'];
        break;
      case 1: // Role & Department
        fieldsToValidate = ['franchise_id', 'designation', 'department', 'access_level'];
        break;
      case 2: // Communication & Access
        // No required fields in this step
        break;
      case 3: // Document Upload
        // No required fields in this step
        break;
      // No need for case 4 as that's the review step
    }
    
    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) {
        setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
      }
    });
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  if (!currentUser || (!["superadmin", "franchise_owner", "franchise_manager"].includes(currentUser.role) && !franchiseId)) {
    navigate("/login");
    return null;
  }

  const canAssignFranchise = currentUser.role === "superadmin";
  const isTelegramRoleEligible = TELEGRAM_ACCESS_ROLES.includes(form.watch("designation"));

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input placeholder="John Doe" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input placeholder="email@example.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input placeholder="+91 9876543210" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emergency_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input placeholder="+91 9876543210" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Contact number in case of emergency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hire_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hire Date<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue="not_specified"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENDER_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      
      case 1: // Role & Department
        return (
          <>
            <div className="space-y-4">
              {canAssignFranchise && (
                <FormField
                  control={form.control}
                  name="franchise_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Franchise<span className="text-destructive">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!canAssignFranchise}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              <SelectValue placeholder="Select franchise" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {franchises.map((franchise) => (
                            <SelectItem key={franchise.id} value={franchise.id}>
                              {franchise.company_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select which franchise this staff member belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation<span className="text-destructive">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DESIGNATION_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Staff member's role at the franchise
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department<span className="text-destructive">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEPARTMENT_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Department the staff member belongs to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="access_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Level<span className="text-destructive">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Access level determines what features staff can use
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status<span className="text-destructive">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="training">In Training</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current status of the staff member
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      
      case 2: // Communication & Access
        return (
          <>
            <div className="space-y-6">
              {isTelegramRoleEligible && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-md font-medium">Telegram Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable Telegram notifications for this staff member
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="telegram_access"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Telegram Notifications</FormLabel>
                          <FormDescription>
                            Allows real-time updates on guest preferences or requests
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("telegram_access") && (
                    <FormField
                      control={form.control}
                      name="telegram_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telegram Username or ID</FormLabel>
                          <FormControl>
                            <Input placeholder="@username or 12345678" {...field} />
                          </FormControl>
                          <FormDescription>
                            The Telegram username or ID for notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-md font-medium">WhatsApp Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable WhatsApp notifications for this staff member
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="whatsapp_access"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Enable WhatsApp Notifications</FormLabel>
                        <FormDescription>
                          Send operational updates via WhatsApp
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-md font-medium mb-2">Role-Based Access Preview</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Access Level:</div>
                    <div>{form.watch("access_level")}</div>
                    
                    <div className="font-medium">Designation:</div>
                    <div>{form.watch("designation")}</div>
                    
                    <div className="font-medium">Telegram Access:</div>
                    <div>{form.watch("telegram_access") ? "Enabled" : "Disabled"}</div>
                    
                    <div className="font-medium">WhatsApp Access:</div>
                    <div>{form.watch("whatsapp_access") ? "Enabled" : "Disabled"}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 3: // Document Upload
        return (
          <>
            <div className="space-y-6">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-md font-medium">Required Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Upload the necessary documents for staff onboarding
                </p>
              </div>
              
              <div className="space-y-4">
                <FileUploadField
                  label="ID Proof (Aadhaar/Passport)"
                  description="Upload a valid ID proof document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  onChange={setIdProofFile}
                  id="id-proof"
                />
                
                <FileUploadField
                  label="Experience Certificate"
                  description="Upload previous work experience certificate (if any)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={setExperienceCertFile}
                  id="experience-cert"
                />
                
                <FileUploadField
                  label="Police Verification Report"
                  description="Upload police verification document (if available)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={setPoliceVerificationFile}
                  id="police-verification"
                />
                
                <FileUploadField
                  label="Staff Profile Image"
                  description="Upload a professional photo for the staff directory"
                  accept=".jpg,.jpeg,.png"
                  onChange={setProfileImageFile}
                  id="profile-image"
                />
              </div>
            </div>
          </>
        );
      
      case 4: // Review & Submit
        return (
          <>
            <div className="space-y-6">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-md font-medium">Review Staff Information</h3>
                <p className="text-sm text-muted-foreground">
                  Please review all the information before submitting
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Basic Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="font-medium">Full Name:</div>
                    <div>{form.watch("full_name")}</div>
                    
                    <div className="font-medium">Email:</div>
                    <div>{form.watch("email")}</div>
                    
                    <div className="font-medium">Contact:</div>
                    <div>{form.watch("contact_number")}</div>
                    
                    <div className="font-medium">Emergency Contact:</div>
                    <div>{form.watch("emergency_contact") || "-"}</div>
                    
                    <div className="font-medium">Hire Date:</div>
                    <div>{form.watch("hire_date")}</div>
                    
                    <div className="font-medium">Gender:</div>
                    <div>{GENDER_OPTIONS.find(g => g.value === form.watch("gender"))?.label || "-"}</div>
                  </div>
                </div>
                
                {/* Role & Department */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Role & Department</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="font-medium">Franchise:</div>
                    <div>{franchises.find(f => f.id === form.watch("franchise_id"))?.company_name || form.watch("franchise_id")}</div>
                    
                    <div className="font-medium">Designation:</div>
                    <div>{form.watch("designation")}</div>
                    
                    <div className="font-medium">Department:</div>
                    <div>{form.watch("department")}</div>
                    
                    <div className="font-medium">Access Level:</div>
                    <div>{form.watch("access_level")}</div>
                    
                    <div className="font-medium">Status:</div>
                    <div>{form.watch("status")}</div>
                  </div>
                </div>
                
                {/* Communication & Access */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCog className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Communication & Access</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {isTelegramRoleEligible && (
                      <>
                        <div className="font-medium">Telegram Access:</div>
                        <div>{form.watch("telegram_access") ? "Enabled" : "Disabled"}</div>
                        
                        {form.watch("telegram_access") && (
                          <>
                            <div className="font-medium">Telegram ID:</div>
                            <div>{form.watch("telegram_id") || "-"}</div>
                          </>
                        )}
                      </>
                    )}
                    
                    <div className="font-medium">WhatsApp Access:</div>
                    <div>{form.watch("whatsapp_access") ? "Enabled" : "Disabled"}</div>
                  </div>
                </div>
                
                {/* Documents */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Uploaded Documents</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="font-medium">ID Proof:</div>
                    <div>{idProofFile ? idProofFile.name : "Not uploaded"}</div>
                    
                    <div className="font-medium">Experience Certificate:</div>
                    <div>{experienceCertFile ? experienceCertFile.name : "Not uploaded"}</div>
                    
                    <div className="font-medium">Police Verification:</div>
                    <div>{policeVerificationFile ? policeVerificationFile.name : "Not uploaded"}</div>
                    
                    <div className="font-medium">Profile Image:</div>
                    <div>{profileImageFile ? profileImageFile.name : "Not uploaded"}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6" />
              <CardTitle>{staffId ? "Edit Staff Member" : "Add Staff Member"}</CardTitle>
            </div>
            {displayName && <div className="text-sm text-muted-foreground">Editing {displayName}</div>}
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <MultiStepFormProgress steps={STEPS} currentStep={currentStep} />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 0 ? handleCancel : prevStep}
          >
            {currentStep === 0 ? "Cancel" : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Step
              </>
            )}
          </Button>
          <Button 
            type="button"
            onClick={currentStep < STEPS.length - 1 ? nextStep : form.handleSubmit(onSubmit)} 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStep < STEPS.length - 1 ? (
              <>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {staffId ? "Update Staff" : "Add Staff"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

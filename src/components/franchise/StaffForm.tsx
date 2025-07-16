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
  FormMessage 
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
  SelectValue 
} from "@/components/ui/select";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Loader2,
  User,
  Wifi,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StaffDesignation, StaffAccessLevel, StaffStatus, EmployeeDB } from "@/types/franchise";
import { useAuditLogger } from "@/utils/auditLogger";

const staffDesignations: StaffDesignation[] = ["Chef", "Host", "DJ", "Safety Officer", "Manager"];
const accessLevels: StaffAccessLevel[] = ["Admin", "Manager", "Staff"];

// Define the form schema with Zod
const staffSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  designation: z.enum(["Chef", "Host", "DJ", "Safety Officer", "Manager"]),
  contact_number: z.string().min(7, "Contact number must be valid"),
  email: z.string().email("Please enter a valid email address"),
  telegram_id: z.string().optional(),
  ip_restriction: z.string().optional(),
  access_level: z.enum(["Admin", "Manager", "Staff"]),
  status: z.enum(["active", "inactive"]),
});

type StaffFormValues = z.infer<typeof staffSchema>;

type StaffFormProps = {
  franchiseId: string;
  staffId?: string;
  onSuccess?: () => void;
};

export default function StaffForm({ franchiseId, staffId, onSuccess }: StaffFormProps) {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ipRestrictions, setIpRestrictions] = useState<string[]>([]);
  const [newIpAddress, setNewIpAddress] = useState("");
  const { logEvent } = useAuditLogger();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      full_name: "",
      designation: "Host",
      contact_number: "",
      email: "",
      telegram_id: "",
      ip_restriction: "",
      access_level: "Staff",
      status: "active",
    },
  });

  // Fetch staff member data if editing existing staff
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

        // Set form values, mapping from DB model to form fields
        form.reset({
          full_name: employee.name || "",
          designation: employee.role as StaffDesignation || "Host",
          contact_number: employee.phone || "",
          email: employee.email || "",
          telegram_id: employee.telegram_id || "",
          ip_restriction: "",
          access_level: employee.access_level as StaffAccessLevel || "Staff",
          status: employee.status as StaffStatus || "active",
        });
        
        // Set IP restrictions from staff member data
        if (employee.ip_restrictions) {
          setIpRestrictions(employee.ip_restrictions);
        }
      }
    } catch (error) {
      console.error("Error fetching staff member data:", error);
      toast.error("Failed to load staff member data");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: StaffFormValues) => {
    setIsLoading(true);
    
    try {
      const staffData = {
        name: values.full_name,
        role: values.designation,
        phone: values.contact_number,
        email: values.email,
        telegram_id: values.telegram_id,
        ip_restrictions: ipRestrictions,
        access_level: values.access_level,
        status: values.status,
        franchise_id: franchiseId,
      };
      
      if (staffId) {
        // Update existing staff member
        const { error } = await supabase
          .from("employees")
          .update(staffData)
          .eq("id", staffId);
          
        if (error) throw error;
        
        logEvent("employees", staffId, "updated", staffData);
        toast.success("Staff member updated successfully");
      } else {
        // Create new staff member
        const { data, error } = await supabase
          .from("employees")
          .insert(staffData)
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          logEvent("employees", data[0].id, "created", staffData);
        }
        
        toast.success("Staff member added successfully");
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/franchises/${franchiseId}`);
      }
    } catch (error) {
      console.error("Error saving staff member:", error);
      toast.error("Failed to save staff member");
    } finally {
      setIsLoading(false);
    }
  };

  const addIpRestriction = () => {
    if (!newIpAddress) return;
    
    // Basic IP validation
    const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    if (!ipRegex.test(newIpAddress)) {
      toast.error("Please enter a valid IP address or CIDR range");
      return;
    }
    
    setIpRestrictions((prev) => [...prev, newIpAddress]);
    setNewIpAddress("");
  };

  const removeIpRestriction = (ip: string) => {
    setIpRestrictions((prev) => prev.filter((item) => item !== ip));
  };

  if (!currentUser || !["superadmin", "franchise_owner"].includes(currentUser.role)) {
    navigate("/login");
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6" />
            <CardTitle>{staffId ? "Edit Staff Member" : "Add Staff Member"}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staffDesignations.map((designation) => (
                          <SelectItem key={designation} value={designation}>{designation}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
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
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Access Control</h3>
              
              <FormField
                control={form.control}
                name="telegram_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram ID</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="access_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Level*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accessLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ip_restriction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Restriction</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4" />
                      <FormControl>
                        <Input 
                          placeholder="192.168.1.1 or 10.0.0.0/24" 
                          value={newIpAddress} 
                          onChange={(e) => setNewIpAddress(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIpRestriction())}
                        />
                      </FormControl>
                      <Button type="button" onClick={addIpRestriction}>Add</Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {ipRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {ipRestrictions.map((ip) => (
                    <div key={ip} className="bg-secondary text-secondary-foreground py-1 px-2 rounded-md flex items-center text-sm">
                      {ip}
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2" onClick={() => removeIpRestriction(ip)}>
                        <span className="sr-only">Remove</span>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="staff-active"
                  checked={form.watch("status") === "active"}
                  onCheckedChange={(checked) => form.setValue("status", checked ? "active" : "inactive")}
                />
                <Label htmlFor="staff-active">Staff member is active</Label>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/franchises/${franchiseId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {staffId ? "Update Staff Member" : "Add Staff Member"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

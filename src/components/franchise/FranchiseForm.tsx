import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Franchise, FranchiseDB, PaymentGateway, mapDbToFranchise } from "@/types/franchise";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { useAuditLogger } from "@/utils/auditLogger";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Building2, Check, CreditCard, Loader2, Upload, X } from "lucide-react";

const paymentGateways: PaymentGateway[] = ["Stripe", "PayPal", "Square", "Other"];
const defaultCurrencies = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "JPY", "CNY"];
const timezoneOptions = [
  { value: "America/New_York", label: "Eastern Time (US & Canada)", offset: "UTC-5" },
  { value: "America/Chicago", label: "Central Time (US & Canada)", offset: "UTC-6" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)", offset: "UTC-7" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)", offset: "UTC-8" },
  { value: "Europe/London", label: "London", offset: "UTC+0" },
  { value: "Europe/Paris", label: "Paris", offset: "UTC+1" },
  { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
  { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
];
const languageOptions = ["English", "Spanish", "French", "German", "Chinese", "Japanese"];

const franchiseSchema = z.object({
  name: z.string().min(3, "Franchise name must be at least 3 characters"),
  owner_name: z.string().min(2, "Owner name must be at least 2 characters"),
  contact_number: z.string().min(7, "Contact number must be valid"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  tax_id: z.string().min(5, "Tax ID is required"),
  tax_percentage: z.coerce.number().min(0, "Tax percentage must be positive"),
  tax_inclusive: z.boolean(),
  payment_gateway: z.enum(["Stripe", "PayPal", "Square", "Other"]),
  payment_api_key: z.string().optional(),
  call_center_number: z.string().optional(),
  telegram_channel_id: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  default_currency: z.string(),
  timezone: z.string(),
  language: z.string(),
  welcome_message: z.string().optional(),
  theme_color: z.string().optional(),
  logo_url: z.string().optional(),
});

type FranchiseFormProps = {
  franchiseId?: string;
  onSuccess?: () => void;
};

export default function FranchiseForm({ franchiseId, onSuccess }: FranchiseFormProps) {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const { logEvent } = useAuditLogger();

  const form = useForm<z.infer<typeof franchiseSchema>>({
    resolver: zodResolver(franchiseSchema),
    defaultValues: {
      name: "",
      owner_name: "",
      contact_number: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "",
      tax_id: "",
      tax_percentage: 0,
      tax_inclusive: false,
      payment_gateway: "Stripe",
      payment_api_key: "",
      call_center_number: "",
      telegram_channel_id: "",
      status: "active",
      default_currency: "USD",
      timezone: "America/New_York",
      language: "English",
      welcome_message: "",
      theme_color: "#009688",
      logo_url: "",
    },
  });

  useEffect(() => {
    if (franchiseId) {
      fetchFranchiseData();
    }
  }, [franchiseId]);

  const fetchFranchiseData = async () => {
    if (!franchiseId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("franchises")
        .select("*")
        .eq("id", franchiseId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const franchiseData: Franchise = mapDbToFranchise(data as FranchiseDB);
        
        setFranchise(franchiseData);
        
        form.reset({
          name: franchiseData.company_name,
          owner_name: franchiseData.owner_name || "",
          contact_number: franchiseData.contact_number || "",
          email: franchiseData.email || "",
          address: franchiseData.address || "",
          city: franchiseData.city || "",
          state: franchiseData.state || "",
          country: franchiseData.country || "",
          tax_id: franchiseData.tax_id || "",
          tax_percentage: franchiseData.tax_percentage || 0,
          tax_inclusive: franchiseData.tax_inclusive || false,
          payment_gateway: franchiseData.payment_gateway as PaymentGateway || "Stripe",
          payment_api_key: franchiseData.payment_api_key || "",
          call_center_number: franchiseData.call_center_number || "",
          telegram_channel_id: franchiseData.telegram_channel_id || "",
          status: franchiseData.status as "active" | "inactive",
          default_currency: franchiseData.default_currency || "USD",
          timezone: franchiseData.timezone || "America/New_York",
          language: franchiseData.language || "English",
          welcome_message: franchiseData.welcome_message || "",
          theme_color: franchiseData.theme_color || "#009688",
          logo_url: franchiseData.logo_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching franchise:", error);
      toast.error("Failed to load franchise data");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof franchiseSchema>) => {
    setIsLoading(true);
    
    try {
      const dbValues = {
        company_name: values.name,
        owner_name: values.owner_name,
        contact_number: values.contact_number,
        email: values.email,
        address: values.address, 
        city: values.city,
        state: values.state,
        country: values.country,
        tax_id: values.tax_id,
        tax_percentage: values.tax_percentage,
        tax_inclusive: values.tax_inclusive,
        payment_gateway: values.payment_gateway,
        payment_api_key: values.payment_api_key,
        call_center_number: values.call_center_number,
        telegram_channel_id: values.telegram_channel_id,
        status: values.status,
        default_currency: values.default_currency,
        timezone: values.timezone,
        language: values.language,
        welcome_message: values.welcome_message,
        theme_color: values.theme_color,
        logo_url: values.logo_url,
      };
      
      if (franchiseId) {
        const { error } = await supabase
          .from("franchises")
          .update(dbValues)
          .eq("id", franchiseId);
          
        if (error) throw error;
        
        logEvent("franchises", franchiseId, "updated", values);
        toast.success("Franchise updated successfully");
      } else {
        const { data, error } = await supabase
          .from("franchises")
          .insert(dbValues)
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          logEvent("franchises", data[0].id, "created", values);
        }
        
        toast.success("Franchise created successfully");
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/franchises");
      }
    } catch (error) {
      console.error("Error saving franchise:", error);
      toast.error("Failed to save franchise");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!currentUser || currentUser.role !== "superadmin") {
    navigate("/login");
    return null;
  }

  const handleStatusChange = (checked: boolean) => {
    form.setValue("status", checked ? "active" : "inactive");
  };

  const handleTaxInclusiveChange = (checked: boolean) => {
    form.setValue("tax_inclusive", checked);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <CardTitle>{franchiseId ? "Edit Franchise" : "Add New Franchise"}</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/franchises")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Franchises
          </Button>
        </div>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Franchise Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter franchise name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="owner_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner/Partner Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owner name" {...field} />
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
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Address*</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City*</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province*</FormLabel>
                      <FormControl>
                        <Input placeholder="State/Province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country*</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Branding and Presentation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Franchise Logo</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          {field.value && (
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
                              <img
                                src={field.value}
                                alt="Logo preview"
                                className="max-w-full max-h-full"
                              />
                            </div>
                          )}
                          <Button type="button" variant="outline" className="flex-1">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="theme_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div
                            className="w-8 h-8 rounded-md border"
                            style={{ backgroundColor: field.value }}
                          />
                          <Input type="color" {...field} className="w-16 h-8" />
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#009688"
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="welcome_message"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Welcome Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Welcome message for customers"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Tax and Payment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID*</FormLabel>
                      <FormControl>
                        <Input placeholder="Tax ID/VAT Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tax_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Percentage*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tax-inclusive"
                    checked={form.watch("tax_inclusive")}
                    onCheckedChange={handleTaxInclusiveChange}
                  />
                  <Label htmlFor="tax-inclusive">Show prices with tax included</Label>
                </div>
                
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="payment_gateway"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Gateway*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment gateway" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentGateways.map((gateway) => (
                              <SelectItem key={gateway} value={gateway}>
                                {gateway}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="payment_api_key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key for Payment Partner</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="API Key"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Operational Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="call_center_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call Center Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (800) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telegram_channel_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram Channel ID</FormLabel>
                      <FormControl>
                        <Input placeholder="@channel_name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="franchise-status"
                  checked={form.watch("status") === "active"}
                  onCheckedChange={handleStatusChange}
                />
                <Label htmlFor="franchise-status">Franchise is active</Label>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Additional Configurations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="default_currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Currency*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {defaultCurrencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Zone*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timezoneOptions.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label} ({tz.offset})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language Preference*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languageOptions.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/franchises")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {franchiseId ? "Update Franchise" : "Create Franchise"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

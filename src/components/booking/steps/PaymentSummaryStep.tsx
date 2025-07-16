import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { BookingFormValues } from "../MultiStepBookingFormTypes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Banknote, Building, Wallet, QrCode, Landmark, Calendar, Clock, Users, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const calculatePricing = (values: BookingFormValues) => {
  const basePriceMap: Record<string, number> = {
    breakfast: 89,
    brunch: 99,
    lunch: 109,
    joyride: 79,
    dinner: 149,
    aurora: 179,
    twilight: 139
  };
  
  const basePrice = basePriceMap[values.sessionType] || 149;
  
  const addonPriceMap: Record<string, number> = {
    none: 0,
    celebration: 49,
    premium: 39,
    photography: 59,
    all_inclusive: 129
  };
  
  const addonPrice = addonPriceMap[values.addonPackage || "none"] || 0;
  
  const guestCount = values.totalGuests || values.numberOfGuests || 2;
  const subtotal = basePrice * guestCount;
  const addonTotal = addonPrice;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round((subtotal + addonTotal) * 0.18);
  const total = subtotal + addonTotal + serviceFee + tax;
  
  return {
    basePrice,
    addonPrice,
    subtotal,
    addonTotal,
    serviceFee,
    tax,
    total,
    perPersonPrice: basePrice
  };
};

const paymentMethods = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI Payment", icon: QrCode },
  { id: "netbanking", label: "Net Banking", icon: Building },
  { id: "wallet", label: "Digital Wallet", icon: Wallet },
  { id: "cash", label: "Cash on Arrival", icon: Banknote }
];

const walletProviders = [
  { id: "paytm", label: "Paytm" },
  { id: "phonepe", label: "PhonePe" },
  { id: "googlepay", label: "Google Pay" },
  { id: "amazon", label: "Amazon Pay" },
  { id: "other", label: "Other Wallet" }
];

const bankList = [
  { id: "hdfc", label: "HDFC Bank" },
  { id: "icici", label: "ICICI Bank" },
  { id: "sbi", label: "State Bank of India" },
  { id: "axis", label: "Axis Bank" },
  { id: "kotak", label: "Kotak Mahindra Bank" },
  { id: "yes", label: "Yes Bank" },
  { id: "other", label: "Other Bank" },
];

export function PaymentSummaryStep() {
  const { control, watch, setValue } = useFormContext<BookingFormValues>();
  const values = watch();
  const paymentMethod = watch("paymentMethod");
  const walletProvider = watch("walletProvider");
  const bankName = watch("bankName");
  
  const pricing = calculatePricing(values);
  
  React.useEffect(() => {
    if (!paymentMethod) {
      setValue("paymentMethod", "card");
    }
  }, [paymentMethod, setValue]);
  
  return (
    <div className="space-y-6">
      <div className="rounded-md border overflow-hidden">
        <div className="bg-muted/50 px-4 py-3 font-medium">
          Booking Summary
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Guest Information</h3>
              <div className="space-y-1">
                <p className="text-sm">{values.guestName}</p>
                <p className="text-sm">{values.email}</p>
                <p className="text-sm">{values.contactNumber}</p>
                <p className="text-sm">
                  {values.totalGuests || values.numberOfGuests} guests
                  {(values.vegCount !== undefined || values.nonVegCount !== undefined) && (
                    <span className="text-muted-foreground">
                      {" "}({values.vegCount || 0} veg, {values.nonVegCount || 0} non-veg)
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Experience Details</h3>
              <div className="space-y-1">
                <p className="text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  {values.bookingDate 
                    ? format(new Date(values.bookingDate), "EEEE, MMMM d, yyyy") 
                    : format(values.experienceDate, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  {values.bookingTime}
                </p>
                <p className="text-sm flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  {values.customSessionName || values.sessionName || 
                   (values.sessionType === "aurora" ? "Aurora Flight" : 
                    values.sessionType === "twilight" ? "Twilight" : 
                    values.sessionType.charAt(0).toUpperCase() + values.sessionType.slice(1))}
                </p>
                {values.addonPackage && values.addonPackage !== "none" && (
                  <p className="text-sm flex items-center">
                    <CircleDollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    {values.addonPackage === "celebration" ? "Celebration Package" :
                     values.addonPackage === "premium" ? "Premium Drinks" :
                     values.addonPackage === "photography" ? "Photography Package" :
                     values.addonPackage === "all_inclusive" ? "All Inclusive Package" : 
                     values.addonPackage}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Pricing Breakdown</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Base Price ({pricing.perPersonPrice} × {values.totalGuests || values.numberOfGuests})</span>
                <span>${pricing.subtotal}</span>
              </div>
              
              {values.addonPackage && values.addonPackage !== "none" && (
                <div className="flex justify-between text-sm">
                  <span>Add-on: {values.addonPackage === "celebration" ? "Celebration Package" :
                     values.addonPackage === "premium" ? "Premium Drinks" :
                     values.addonPackage === "photography" ? "Photography Package" :
                     values.addonPackage === "all_inclusive" ? "All Inclusive Package" : 
                     values.addonPackage}</span>
                  <span>${pricing.addonTotal}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Service Fee (5%)</span>
                <span>${pricing.serviceFee}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Tax (18%)</span>
                <span>${pricing.tax}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${pricing.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Payment Method</h2>
        
        <FormField
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
                >
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    
                    return (
                      <div key={method.id} className="relative">
                        <RadioGroupItem
                          value={method.id}
                          id={`payment-${method.id}`}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={`payment-${method.id}`}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <Icon className="mb-3 h-6 w-6" />
                          <div className="text-sm font-medium text-center">{method.label}</div>
                        </label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="mt-4">
          {paymentMethod === "upi" && (
            <div className="space-y-4 p-4 border rounded-md">
              <FormField
                control={control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPI ID</FormLabel>
                    <FormControl>
                      <Input placeholder="yourname@upi" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your UPI ID (e.g., name@bank or phonenumber@upi)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {paymentMethod === "card" && (
            <div className="space-y-4 p-4 border rounded-md">
              <FormField
                control={control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="cardExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="cardCvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="123" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          {paymentMethod === "netbanking" && (
            <div className="space-y-4 p-4 border rounded-md">
              <FormField
                control={control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Bank</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankList.map((bank) => (
                            <SelectItem key={bank.id} value={bank.id}>
                              {bank.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {bankName === "other" && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Account Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code</FormLabel>
                        <FormControl>
                          <Input placeholder="IFSC Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          )}
          
          {paymentMethod === "wallet" && (
            <div className="space-y-4 p-4 border rounded-md">
              <FormField
                control={control}
                name="walletProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Wallet</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          {walletProviders.map((wallet) => (
                            <SelectItem key={wallet.id} value={wallet.id}>
                              {wallet.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {walletProvider && (
                <FormField
                  control={control}
                  name="walletNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number / Wallet ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Linked Mobile Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
          
          {paymentMethod === "cash" && (
            <div className="p-4 border rounded-md flex items-start space-x-2 bg-amber-50">
              <Landmark className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Cash on Arrival</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Please arrive 15 minutes prior to your scheduled session time to complete your payment. 
                  We accept cash only at our venue. Your booking will be held for 15 minutes after the scheduled time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <FormField
        control={control}
        name="paymentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Status</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="bookingStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Booking Status</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select booking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

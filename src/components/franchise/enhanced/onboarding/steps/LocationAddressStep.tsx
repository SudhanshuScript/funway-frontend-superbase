
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboarding } from '../OnboardingContext';
import { containerVariants, itemVariants } from '../constants';

const LocationAddressStep: React.FC = () => {
  const { formData, handleInputChange } = useOnboarding();
  
  return (
    <motion.div
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 variants={itemVariants} className="text-xl font-semibold flex items-center">
        <MapPin className="mr-2 h-5 w-5 text-primary" />
        Location & Address
      </motion.h2>
      
      <motion.div variants={itemVariants}>
        <Label htmlFor="address">Primary Address*</Label>
        <div className="mt-1.5">
          <Textarea
            id="address"
            placeholder="Enter complete address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City*</Label>
          <div className="mt-1.5">
            <Input
              id="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="state">State/Province*</Label>
          <div className="mt-1.5">
            <Input
              id="state"
              placeholder="Enter state/province"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="country">Country*</Label>
          <div className="mt-1.5">
            <Input
              id="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <div className="mt-1.5">
            <Select
              value={formData.timezone}
              onValueChange={(value) => handleInputChange("timezone", value)}
            >
              <SelectTrigger className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20">
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
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <div className="mt-1.5">
            <Select
              value={formData.currency}
              onValueChange={(value) => handleInputChange("currency", value)}
            >
              <SelectTrigger className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20">
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
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-primary mr-2" />
          <p className="text-sm font-medium">Location Preview</p>
        </div>
        <div className="mt-3 h-40 bg-muted/40 rounded-md flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Map preview will be available in a future update
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LocationAddressStep;

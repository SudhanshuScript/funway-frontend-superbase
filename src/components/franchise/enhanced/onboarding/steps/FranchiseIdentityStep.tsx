
import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Upload, Building, Info, Badge, AtSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOnboarding } from '../OnboardingContext';
import { containerVariants, itemVariants } from '../constants';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FranchiseIdentityStep: React.FC = () => {
  const { formData, handleInputChange } = useOnboarding();
  
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Section Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-2 pb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Badge className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Franchise Identity</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Enter the basic information about your franchise. This information will be visible to customers.
        </p>
        <Separator />
      </motion.div>
      
      {/* Main Form Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5">
              <Badge className="h-4 w-4 text-primary" />
              Franchise Name*
            </Label>
            <Input
              id="name"
              placeholder="Enter franchise name"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-background transition-all duration-300 focus-visible:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground">This is the name customers will see when booking</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-sm font-medium flex items-center gap-1.5">
              <Building className="h-4 w-4 text-primary" />
              Legal Business Name
            </Label>
            <Input
              id="company_name"
              placeholder="Enter legal business name"
              value={formData.company_name || ""}
              onChange={(e) => handleInputChange("company_name", e.target.value)}
              className="bg-background transition-all duration-300 focus-visible:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground">Leave empty if same as franchise name</p>
          </div>
        </motion.div>
        
        {/* Right Column - Preview Card */}
        <motion.div variants={itemVariants} className="bg-muted/30 p-4 rounded-lg border h-fit">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Identity Preview</p>
          </div>
          
          <div className="bg-background rounded-md p-4 shadow-sm border border-border/60">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">
                  {(formData.name || "F").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{formData.name || "Your Franchise"}</h3>
                <p className="text-xs text-muted-foreground">
                  {formData.company_name ? `DBA: ${formData.company_name}` : "Enter business details"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Owner Section */}
      <motion.div variants={itemVariants} className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-medium">Owner Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-lg border p-4 bg-muted/5">
          <div className="space-y-2">
            <Label htmlFor="owner_name" className="text-sm font-medium">
              Owner Name*
            </Label>
            <Input
              id="owner_name"
              placeholder="Enter owner's full name"
              value={formData.owner_name || ""}
              onChange={(e) => handleInputChange("owner_name", e.target.value)}
              className="bg-background transition-all duration-300 focus-visible:ring-primary/30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner_email" className="text-sm font-medium">
              Email Address*
            </Label>
            <div className="flex">
              <div className="bg-muted flex items-center justify-center px-3 rounded-l-md border border-r-0 border-input">
                <AtSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="owner_email"
                type="email"
                placeholder="owner@example.com"
                value={formData.owner_email || ""}
                onChange={(e) => handleInputChange("owner_email", e.target.value)}
                className="rounded-l-none focus-visible:ring-primary/30"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_number" className="text-sm font-medium">
              Contact Number*
            </Label>
            <div className="flex">
              <div className="bg-muted flex items-center justify-center px-3 rounded-l-md border border-r-0 border-input">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="contact_number"
                placeholder="Enter contact number"
                value={formData.contact_number || ""}
                onChange={(e) => handleInputChange("contact_number", e.target.value)}
                className="rounded-l-none focus-visible:ring-primary/30"
              />
            </div>
            <p className="text-xs text-muted-foreground">Primary business contact number</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="id_proof" className="text-sm font-medium flex items-center gap-1.5">
              <Info className="h-4 w-4 text-primary" />
              ID Proof
            </Label>
            <div className="border border-input rounded-md overflow-hidden shadow-sm">
              <div className="p-3 bg-muted/10 hover:bg-accent/5 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Upload className="text-primary h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Upload ID proof document</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PDF, JPG or PNG up to 5MB
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 text-xs h-8">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FranchiseIdentityStep;

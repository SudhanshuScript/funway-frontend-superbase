
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useOnboarding } from '../OnboardingContext';
import { containerVariants, itemVariants } from '../constants';

const RegistrationStep: React.FC = () => {
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
        <Building2 className="mr-2 h-5 w-5 text-primary" />
        Registration & Compliance
      </motion.h2>
      
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <Label htmlFor="tax_id">Tax ID / GST Number*</Label>
          <div className="mt-1.5">
            <Input
              id="tax_id"
              placeholder="Enter tax ID"
              value={formData.tax_id}
              onChange={(e) => handleInputChange("tax_id", e.target.value)}
              className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tax_percentage">Tax Percentage (%)</Label>
            <div className="mt-1.5">
              <Input
                id="tax_percentage"
                type="number"
                placeholder="Enter tax percentage"
                min="0"
                step="0.01"
                value={formData.tax_percentage.toString()}
                onChange={(e) => handleInputChange("tax_percentage", parseFloat(e.target.value) || 0)}
                className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>
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
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-md font-medium mb-2">Required Documents</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="business_certificate" className="block mb-2">Business Certificate</Label>
            <div className="border border-input rounded-md p-4 bg-background hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Upload className="text-primary h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Upload Business Certificate</p>
                  <p className="text-xs text-muted-foreground">
                    PDF or image file format
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="fssai_cert" className="block mb-2">FSSAI Certificate</Label>
            <div className="border border-input rounded-md p-4 bg-background hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Upload className="text-primary h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Upload FSSAI Certificate</p>
                  <p className="text-xs text-muted-foreground">
                    PDF or image file format
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="insurance_document" className="block mb-2">Insurance Document</Label>
            <div className="border border-input rounded-md p-4 bg-background hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Upload className="text-primary h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Upload Insurance Document</p>
                  <p className="text-xs text-muted-foreground">
                    PDF or image file format
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegistrationStep;

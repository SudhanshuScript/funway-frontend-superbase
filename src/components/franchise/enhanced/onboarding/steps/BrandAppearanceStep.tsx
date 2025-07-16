
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOnboarding } from '../OnboardingContext';
import { containerVariants, itemVariants } from '../constants';

const BrandAppearanceStep: React.FC = () => {
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
        <Eye className="mr-2 h-5 w-5 text-primary" />
        Brand & Appearance
      </motion.h2>
      
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="theme_color">Brand Color</Label>
          <div className="flex gap-2 items-center mt-1.5">
            <input
              type="color"
              id="theme_color"
              value={formData.theme_color || "#7c3aed"}
              onChange={(e) => handleInputChange("theme_color", e.target.value)}
              className="w-10 h-10 rounded-md cursor-pointer"
            />
            <Input
              value={formData.theme_color || "#7c3aed"}
              onChange={(e) => handleInputChange("theme_color", e.target.value)}
              className="w-full bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            This color will be used for branding elements
          </p>
        </div>
        <div>
          <Label htmlFor="brand_logo" className="block mb-2">Brand Logo</Label>
          <div className="border border-input rounded-md p-4 bg-background hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Upload className="text-primary h-4 w-4" />
              </div>
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
      </motion.div>
      
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website URL</Label>
          <div className="mt-1.5">
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={formData.website || ""}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="instagram">Instagram Handle</Label>
          <div className="mt-1.5 flex">
            <div className="bg-muted p-2 rounded-l-md border border-r-0 border-input">
              @
            </div>
            <Input
              id="instagram"
              placeholder="yourbrand"
              value={(formData.instagram || "").replace("@", "")}
              onChange={(e) => handleInputChange("instagram", `@${e.target.value.replace("@", "")}`)}
              className="rounded-l-none bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Label htmlFor="welcome_message">Welcome Message</Label>
        <div className="mt-1.5">
          <Textarea
            id="welcome_message"
            placeholder="Enter a welcome message for this franchise"
            value={formData.welcome_message || ""}
            onChange={(e) => handleInputChange("welcome_message", e.target.value)}
            className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            rows={4}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          This message will be displayed to customers on the franchise's landing page
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-center">
          <Eye className="h-5 w-5 text-primary mr-2" />
          <p className="text-sm font-medium">Brand Preview</p>
        </div>
        
        <div className="mt-3 p-4 rounded-md flex flex-col items-center" 
          style={{ backgroundColor: formData.theme_color ? `${formData.theme_color}10` : '#7c3aed10' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: formData.theme_color || '#7c3aed' }}>
            <span className="text-white text-xl font-bold">
              {(formData.name || 'F').charAt(0)}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold" 
            style={{ color: formData.theme_color || '#7c3aed' }}>
            {formData.name || "Your Franchise"}
          </h3>
          <p className="text-sm text-center mt-1">
            {formData.welcome_message || "Welcome to our franchise!"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BrandAppearanceStep;

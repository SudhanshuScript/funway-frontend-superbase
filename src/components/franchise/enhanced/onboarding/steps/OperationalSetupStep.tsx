
import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboarding } from '../OnboardingContext';
import { containerVariants, itemVariants } from '../constants';

const OperationalSetupStep: React.FC = () => {
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
        <Settings className="mr-2 h-5 w-5 text-primary" />
        Operational Setup
      </motion.h2>
      
      <motion.div variants={itemVariants}>
        <Label htmlFor="payment_gateway" className="block mb-2">Payment Gateway</Label>
        <Select
          value={formData.payment_gateway}
          onValueChange={(value) => handleInputChange("payment_gateway", value as any)}
        >
          <SelectTrigger className="w-full bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder="Select payment gateway" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Stripe">Stripe</SelectItem>
            <SelectItem value="PayPal">PayPal</SelectItem>
            <SelectItem value="Square">Square</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Choose the payment gateway you want to integrate with this franchise
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="pt-4 border-t border-border">
        <h3 className="text-md font-medium mb-2">Initial Status</h3>
        <div className="flex space-x-2">
          <div
            className={`py-2 px-4 rounded-md border cursor-pointer transition-all ${
              formData.status === "active" 
                ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300" 
                : "border-muted bg-background hover:bg-muted/50"
            }`}
            onClick={() => handleInputChange("status", "active")}
          >
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                formData.status === "active" ? "bg-green-500" : "bg-muted-foreground"
              }`} />
              <span>Active</span>
            </div>
            <p className="text-xs mt-1 text-muted-foreground">
              Ready to accept bookings
            </p>
          </div>
          
          <div
            className={`py-2 px-4 rounded-md border cursor-pointer transition-all ${
              formData.status === "pending_review" 
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" 
                : "border-muted bg-background hover:bg-muted/50"
            }`}
            onClick={() => handleInputChange("status", "pending_review")}
          >
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                formData.status === "pending_review" ? "bg-amber-500" : "bg-muted-foreground"
              }`} />
              <span>Pending Review</span>
            </div>
            <p className="text-xs mt-1 text-muted-foreground">
              Will be reviewed before activation
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="pt-4 border-t border-border flex items-center space-x-2">
        <Switch
          id="telegramAccess"
          checked={formData.telegram_access || false}
          onCheckedChange={(checked) => handleInputChange("telegram_access", checked)}
        />
        <div>
          <Label htmlFor="telegramAccess">Enable Telegram Notifications</Label>
          <p className="text-xs text-muted-foreground">
            Receive booking notifications via Telegram
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OperationalSetupStep;

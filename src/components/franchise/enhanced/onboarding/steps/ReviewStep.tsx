
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOnboarding } from '../OnboardingContext';
import { containerVariants, itemVariants } from '../constants';

const ReviewStep: React.FC = () => {
  const { formData } = useOnboarding();
  
  return (
    <motion.div
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 variants={itemVariants} className="text-xl font-semibold flex items-center">
        <Check className="mr-2 h-5 w-5 text-primary" />
        Review & Submit
      </motion.h2>
      
      <motion.div variants={itemVariants} className="space-y-3">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium">Franchise Information</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Franchise Name:</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Legal Name:</span>
                <span className="font-medium">{formData.company_name || formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner:</span>
                <span className="font-medium">{formData.owner_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{formData.owner_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-medium">{formData.contact_number}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium">Location & Address</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span className="text-right font-medium max-w-[60%]">{formData.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">City, State:</span>
                <span className="font-medium">{formData.city}, {formData.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Country:</span>
                <span className="font-medium">{formData.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timezone:</span>
                <span className="font-medium">{formData.timezone.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span className="font-medium">{formData.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium">Business Details</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax ID:</span>
                <span className="font-medium">{formData.tax_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax Rate:</span>
                <span className="font-medium">{formData.tax_percentage}% ({formData.tax_inclusive ? 'Inclusive' : 'Exclusive'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Gateway:</span>
                <span className="font-medium">{formData.payment_gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={formData.status === 'active' ? 'default' : formData.status === 'inactive' ? 'destructive' : 'outline'}>
                  {formData.status === 'active' ? 'Active' : formData.status === 'inactive' ? 'Inactive' : 'Pending Review'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium">Operating Hours</h3>
            </div>
            <div className="p-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday:</span>
                <span className="font-medium">
                  {formData.monday_start === "Closed" ? "Closed" : `${formData.monday_start} - ${formData.monday_end}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tuesday:</span>
                <span className="font-medium">
                  {formData.tuesday_start === "Closed" ? "Closed" : `${formData.tuesday_start} - ${formData.tuesday_end}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wednesday:</span>
                <span className="font-medium">
                  {formData.wednesday_start === "Closed" ? "Closed" : `${formData.wednesday_start} - ${formData.wednesday_end}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thursday:</span>
                <span className="font-medium">
                  {formData.thursday_start === "Closed" ? "Closed" : `${formData.thursday_start} - ${formData.thursday_end}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Friday:</span>
                <span className="font-medium">
                  {formData.friday_start === "Closed" ? "Closed" : `${formData.friday_start} - ${formData.friday_end}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday:</span>
                <span className="font-medium">
                  {formData.saturday_start === "Closed" ? "Closed" : `${formData.saturday_start} - ${formData.saturday_end}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday:</span>
                <span className="font-medium">
                  {formData.sunday_start === "Closed" ? "Closed" : `${formData.sunday_start} - ${formData.sunday_end}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants} className="border-t border-border pt-4 text-muted-foreground text-sm">
        <p className="mb-2">
          By submitting this form, you confirm that all the information provided is accurate and complete. 
        </p>
        <p>
          Our team will review your application and may contact you for additional information if needed.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ReviewStep;

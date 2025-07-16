
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboarding } from '../OnboardingContext';
import { containerVariants, itemVariants, timeSlots } from '../constants';

const HoursSetupStep: React.FC = () => {
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
        <Clock className="mr-2 h-5 w-5 text-primary" />
        Operating Hours
      </motion.h2>
      
      <motion.p variants={itemVariants} className="text-muted-foreground">
        Set your regular business hours for each day of the week
      </motion.p>
      
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium mb-2">
          <div>Monday</div>
          <div>Tuesday</div>
          <div>Wednesday</div>
          <div>Thursday</div>
          <div>Friday</div>
          <div className="text-primary">Saturday</div>
          <div className="text-primary">Sunday</div>
        </div>
        
        <div className="border rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monday" className="block mb-1">Monday Hours</Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={formData.monday_start}
                  onValueChange={(value) => handleInputChange("monday_start", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`mon-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>-</span>
                <Select
                  value={formData.monday_end}
                  onValueChange={(value) => handleInputChange("monday_end", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`mon-end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="tuesday" className="block mb-1">Tuesday Hours</Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={formData.tuesday_start}
                  onValueChange={(value) => handleInputChange("tuesday_start", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`tue-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>-</span>
                <Select
                  value={formData.tuesday_end}
                  onValueChange={(value) => handleInputChange("tuesday_end", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`tue-end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wednesday" className="block mb-1">Wednesday Hours</Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={formData.wednesday_start}
                  onValueChange={(value) => handleInputChange("wednesday_start", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`wed-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>-</span>
                <Select
                  value={formData.wednesday_end}
                  onValueChange={(value) => handleInputChange("wednesday_end", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`wed-end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="thursday" className="block mb-1">Thursday Hours</Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={formData.thursday_start}
                  onValueChange={(value) => handleInputChange("thursday_start", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`thu-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>-</span>
                <Select
                  value={formData.thursday_end}
                  onValueChange={(value) => handleInputChange("thursday_end", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`thu-end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="friday" className="block mb-1">Friday Hours</Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={formData.friday_start}
                  onValueChange={(value) => handleInputChange("friday_start", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`fri-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>-</span>
                <Select
                  value={formData.friday_end}
                  onValueChange={(value) => handleInputChange("friday_end", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`fri-end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="saturday" className="block mb-1">
                <span className="text-primary">Saturday Hours</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={formData.saturday_start}
                  onValueChange={(value) => handleInputChange("saturday_start", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`sat-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>-</span>
                <Select
                  value={formData.saturday_end}
                  onValueChange={(value) => handleInputChange("saturday_end", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`sat-end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sunday" className="block mb-1">
                <span className="text-primary">Sunday Hours</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={formData.sunday_start}
                  onValueChange={(value) => handleInputChange("sunday_start", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`sun-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>-</span>
                <Select
                  value={formData.sunday_end}
                  onValueChange={(value) => handleInputChange("sunday_end", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`sun-end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-3 text-sm text-muted-foreground">
          <p>Tip: Set to "Closed" if not operating on specific days</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HoursSetupStep;

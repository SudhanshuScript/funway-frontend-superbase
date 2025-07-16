
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead, LeadSource, LeadInterest, LeadStatus, LeadChannel } from "@/types/leadTypes";
import { leadSourceOptions, leadInterestOptions, franchiseOptions } from "@/hooks/lead/mockLeadData";
import { useUserRole } from "@/providers/UserRoleProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MessageSquare } from "lucide-react";

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLead: (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Lead | null;
}

export function AddLeadDialog({
  open,
  onOpenChange,
  onAddLead
}: AddLeadDialogProps) {
  const { currentUser } = useUserRole();
  const [activeTab, setActiveTab] = useState<"phone" | "digital">("digital");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website" as LeadSource,
    interest: "session" as LeadInterest,
    franchise_id: currentUser?.franchiseId || "",
    status: "new" as LeadStatus,
    assigned_to: currentUser?.id || "",
    notes: "",
    channel: "none" as LeadChannel
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (field: string) => (value: string) => {
    if (field === 'source') {
      let channel: LeadChannel = 'none';
      if (value === 'whatsapp') channel = 'whatsapp';
      else if (value === 'telegram') channel = 'telegram';
      else if (value === 'email') channel = 'email';
      else if (value === 'phone') channel = 'phone';
      
      setFormData(prev => ({
        ...prev, 
        [field]: value as LeadSource,
        channel
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as "phone" | "digital");
    if (value === "phone") {
      setFormData(prev => ({
        ...prev,
        source: "phone",
        channel: "phone"
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onAddLead(formData);
    if (result) {
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        source: "website",
        interest: "session",
        franchise_id: currentUser?.franchiseId || "",
        status: "new" as LeadStatus,
        assigned_to: currentUser?.id || "",
        notes: "",
        channel: "none"
      });
      setActiveTab("digital");
      onOpenChange(false);
    }
  };
  
  const isSuperAdmin = currentUser?.role === "superadmin";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="digital" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Digital Lead
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone Call
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TabsContent value="digital">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source *</Label>
                <Select
                  value={formData.source}
                  onValueChange={handleSelectChange("source")}
                  required
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadSourceOptions
                      .filter(option => option.value !== 'phone')
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest">Interest *</Label>
                <Select
                  value={formData.interest}
                  onValueChange={handleSelectChange("interest")}
                  required
                >
                  <SelectTrigger id="interest">
                    <SelectValue placeholder="Select Interest" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadInterestOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="phone">
            <div className="space-y-2">
              <Label htmlFor="phone-name">Caller Name *</Label>
              <Input
                id="phone-name"
                name="name"
                placeholder="Caller's Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number *</Label>
              <Input
                id="phone-number"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone-email">Email (Optional)</Label>
              <Input
                id="phone-email"
                name="email"
                type="email"
                placeholder="Email Address (if available)"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone-interest">Inquiry About *</Label>
              <Select
                value={formData.interest}
                onValueChange={handleSelectChange("interest")}
                required
              >
                <SelectTrigger id="phone-interest">
                  <SelectValue placeholder="What are they interested in?" />
                </SelectTrigger>
                <SelectContent>
                  {leadInterestOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone-notes">Call Summary *</Label>
              <Textarea
                id="phone-notes"
                name="notes"
                placeholder="Brief summary of the phone conversation"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
          </TabsContent>
          
          {/* Common fields for both tabs */}
          {isSuperAdmin && (
            <div className="space-y-2">
              <Label htmlFor="franchise">Franchise *</Label>
              <Select
                value={formData.franchise_id}
                onValueChange={handleSelectChange("franchise_id")}
                required
              >
                <SelectTrigger id="franchise">
                  <SelectValue placeholder="Select Franchise" />
                </SelectTrigger>
                <SelectContent>
                  {franchiseOptions.map(franchise => (
                    <SelectItem key={franchise.id} value={franchise.id}>{franchise.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {activeTab === 'digital' && (
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any relevant notes about this lead"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

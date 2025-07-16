
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ChatFilter, ChatStatus, MessageTag, Platform } from "@/types/chatTypes";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserRole } from "@/providers/UserRoleProvider";

interface ChatFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ChatFilter;
  onApplyFilters: (filters: ChatFilter) => void;
  franchises: { id: string; name: string }[];
}

export function ChatFiltersDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  franchises
}: ChatFiltersDrawerProps) {
  const [localFilters, setLocalFilters] = useState<ChatFilter>({ ...filters });
  const { currentUser } = useUserRole();
  
  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };
  
  const handleResetFilters = () => {
    setLocalFilters({
      searchQuery: "",
      platform: "all",
      franchise_id: currentUser?.role === "superadmin" ? "all" : currentUser?.franchiseId || "all",
      status: "all",
      tags: [],
    });
  };
  
  const toggleTag = (tag: MessageTag) => {
    if (localFilters.tags.includes(tag)) {
      setLocalFilters({
        ...localFilters,
        tags: localFilters.tags.filter(t => t !== tag),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        tags: [...localFilters.tags, tag],
      });
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Conversations</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 py-2 space-y-4">
          <div className="space-y-2">
            <Label>Platform</Label>
            <RadioGroup 
              value={localFilters.platform} 
              onValueChange={(value) => setLocalFilters({ ...localFilters, platform: value as Platform | 'all' })}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="platform-all" />
                <Label htmlFor="platform-all">All Platforms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telegram" id="platform-telegram" />
                <Label htmlFor="platform-telegram">Telegram</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="platform-whatsapp" />
                <Label htmlFor="platform-whatsapp">WhatsApp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="web_chat" id="platform-web" />
                <Label htmlFor="platform-web">Web Chat</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          {currentUser?.role === "superadmin" && (
            <>
              <div className="space-y-2">
                <Label>Franchise Location</Label>
                <Select 
                  value={localFilters.franchise_id} 
                  onValueChange={(value) => setLocalFilters({ ...localFilters, franchise_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select franchise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Franchises</SelectItem>
                    {franchises.map(franchise => (
                      <SelectItem key={franchise.id} value={franchise.id}>
                        {franchise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
            </>
          )}
          
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup 
              value={localFilters.status} 
              onValueChange={(value) => setLocalFilters({ ...localFilters, status: value as ChatStatus | 'all' })}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="status-all" />
                <Label htmlFor="status-all">All Status</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unread" id="status-unread" />
                <Label htmlFor="status-unread">Unread</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="assigned" id="status-assigned" />
                <Label htmlFor="status-assigned">Assigned</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="responded" id="status-responded" />
                <Label htmlFor="status-responded">Responded</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resolved" id="status-resolved" />
                <Label htmlFor="status-resolved">Resolved</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Message Tags</Label>
            <div className="flex flex-wrap gap-2">
              {(["payment", "offer_inquiry", "reschedule", "complaint", "general"] as MessageTag[]).map((tag) => (
                <Badge
                  key={tag}
                  variant={localFilters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <DrawerFooter>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

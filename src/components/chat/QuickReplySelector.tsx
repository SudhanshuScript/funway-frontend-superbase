
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { QuickReply } from "@/types/chatTypes";
import { MessageSquarePlus, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuickReplySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReply: (reply: QuickReply) => void;
  quickReplies: QuickReply[];
}

export function QuickReplySelector({
  isOpen,
  onClose,
  onSelectReply,
  quickReplies
}: QuickReplySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredReplies = quickReplies.filter(
    reply => reply.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             reply.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelectReply = (reply: QuickReply) => {
    onSelectReply(reply);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Quick Replies</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quick replies..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="px-4 py-2 h-[400px]">
          {filteredReplies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No quick replies found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReplies.map((reply) => (
                <div
                  key={reply.id}
                  className="border rounded-md p-3 hover:bg-accent cursor-pointer"
                  onClick={() => handleSelectReply(reply)}
                >
                  <div className="font-medium mb-1">{reply.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {reply.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <DrawerFooter>
          <Button variant="outline" className="w-full">
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Create New Template
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

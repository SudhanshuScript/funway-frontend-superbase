
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lead, LeadActivity, FollowUp, LeadStatus, LeadMessage, LeadChannel } from "@/types/leadTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, MessageSquare, CalendarPlus, Check, FileText, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from 'date-fns';
import { AddFollowUpDialog } from "./AddFollowUpDialog";
import { ConvertToBookingDialog } from "./ConvertToBookingDialog";
import { ReassignLeadDialog } from "./ReassignLeadDialog";
import { LeadChat } from "./LeadChat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadDetailProps {
  lead: Lead | null;
  activities: LeadActivity[];
  followUps: FollowUp[];
  messages: LeadMessage[];
  onClose: () => void;
  onAddNote: (leadId: string, note: string) => Promise<boolean>;
  onAddFollowUp: (leadId: string, data: { notes: string, scheduled_for: string }) => Promise<boolean>;
  onCompleteFollowUp: (followUpId: string) => Promise<boolean>;
  onUpdateStatus: (leadId: string, status: LeadStatus) => Promise<boolean>;
  onConvertToBooking: (leadId: string, bookingId: string) => Promise<boolean>;
  onReassign: (leadId: string, assignedTo: string) => Promise<boolean>;
  onSendMessage: (leadId: string, message: string, channel: LeadChannel) => Promise<boolean>;
}

export function LeadDetail({
  lead,
  activities,
  followUps,
  messages,
  onClose,
  onAddNote,
  onAddFollowUp,
  onCompleteFollowUp,
  onUpdateStatus,
  onConvertToBooking,
  onReassign,
  onSendMessage
}: LeadDetailProps) {
  const [noteContent, setNoteContent] = useState("");
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('info');
  
  if (!lead) {
    return null;
  }
  
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (noteContent.trim()) {
      const result = await onAddNote(lead.id, noteContent);
      if (result) {
        setNoteContent("");
      }
    }
  };
  
  const handleStatusChange = async (status: string) => {
    await onUpdateStatus(lead.id, status as LeadStatus);
  };

  // Show chat tab by default if lead has a messaging channel
  React.useEffect(() => {
    if (lead.channel && (lead.channel === 'whatsapp' || lead.channel === 'telegram')) {
      setActiveTab('chat');
    } else {
      setActiveTab('info');
    }
  }, [lead.id, lead.channel]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <div>
          <CardTitle>{lead.name}</CardTitle>
          <div className="flex items-center mt-1 flex-wrap gap-1">
            <Badge variant="outline" className="mr-1">{lead.source}</Badge>
            <Badge variant="outline" className="mr-1">{lead.interest}</Badge>
            <Badge
              className={
                lead.status === "new" ? "bg-blue-500" :
                lead.status === "contacted" ? "bg-orange-400" :
                lead.status === "follow_up" ? "bg-purple-500" :
                lead.status === "converted" ? "bg-green-500" :
                "bg-red-500"
              }
            >
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
          <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
          <TabsTrigger value="followup" className="flex-1">Follow-ups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="p-4 space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Contact Info:</span>
            <span>{lead.email || 'No email'}</span>
            <span>{lead.phone || 'No phone'}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span><br />
              <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span><br />
              <Select defaultValue={lead.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 mt-1 w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setShowFollowUpDialog(true)}
            >
              <CalendarPlus className="h-4 w-4" /> Schedule Follow-up
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowConvertDialog(true)}
            >
              <Check className="h-4 w-4" /> Convert to Booking
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowReassignDialog(true)}
            >
              <UserCheck className="h-4 w-4" /> Reassign
            </Button>
          </div>
          
          <div className="space-y-2 pt-2">
            <span className="text-sm text-muted-foreground">Notes:</span>
            <Textarea
              placeholder="Add a note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={handleNoteSubmit} 
              size="sm"
              className="flex items-center gap-1"
              disabled={!noteContent.trim()}
            >
              <FileText className="h-4 w-4" /> Add Note
            </Button>
          </div>
          
          <div className="space-y-2 pt-2">
            <span className="text-sm font-medium">Recent Notes:</span>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {activities
                .filter(activity => activity.activity_type === "note")
                .map((activity) => (
                  <div key={activity.id} className="border-b pb-2 last:border-0">
                    <p className="text-sm">{activity.details}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.performed_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="chat">
          <LeadChat 
            lead={lead}
            messages={messages}
            onSendMessage={onSendMessage}
            onMakeNote={onAddNote}
          />
        </TabsContent>
        
        <TabsContent value="activity" className="p-4 space-y-4">
          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No activities yet.
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="border-l-2 pl-4 py-2 border-muted">
                  <p className="text-sm">{activity.details}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.performed_at), { addSuffix: true })}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {activity.activity_type}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="followup" className="p-4 space-y-4">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1 mb-4"
            onClick={() => setShowFollowUpDialog(true)}
          >
            <CalendarPlus className="h-4 w-4" /> Schedule New Follow-up
          </Button>
          
          <div className="max-h-[350px] overflow-y-auto space-y-4">
            {followUps.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No follow-ups scheduled.
              </div>
            ) : (
              followUps.map((followUp) => (
                <div
                  key={followUp.id}
                  className={`border p-3 rounded-lg ${
                    followUp.completed ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {format(new Date(followUp.scheduled_for), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    {!followUp.completed && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCompleteFollowUp(followUp.id)}
                        className="h-6 px-2"
                      >
                        Mark Done
                      </Button>
                    )}
                  </div>
                  <p className="text-sm mt-1">{followUp.notes}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {followUp.completed
                      ? `Completed ${formatDistanceToNow(new Date(followUp.completed_at || ""), { addSuffix: true })}`
                      : "Pending"}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <AddFollowUpDialog
        open={showFollowUpDialog}
        onOpenChange={setShowFollowUpDialog}
        leadId={lead.id}
        onAddFollowUp={onAddFollowUp}
      />
      
      <ConvertToBookingDialog
        open={showConvertDialog}
        onOpenChange={setShowConvertDialog}
        lead={lead}
        onConvert={onConvertToBooking}
      />
      
      <ReassignLeadDialog
        open={showReassignDialog}
        onOpenChange={setShowReassignDialog}
        lead={lead}
        onReassign={onReassign}
      />
    </Card>
  );
}

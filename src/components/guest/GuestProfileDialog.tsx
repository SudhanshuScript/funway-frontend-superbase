
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Guest } from '@/types/guestTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card, 
  CardContent
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  CalendarClock, Mail, Phone, Send, Building, 
  Award, Heart, Calendar, Clock, Tag, Edit, Save
} from "lucide-react";
import { getGuestTypeColor } from "@/types/guestTypes";

interface GuestProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
  onSendOffer: (guestId: string) => void;
}

export function GuestProfileDialog({ 
  open, 
  onOpenChange, 
  guest,
  onSendOffer
}: GuestProfileDialogProps) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState("booking-history");
  
  React.useEffect(() => {
    if (guest && open) {
      setNotes(guest.notes || '');
      setEditingNotes(false);
    }
  }, [guest, open]);
  
  if (!guest) return null;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Mock booking history for the guest
  const bookingHistory = [
    { 
      id: `booking-${guest.id}-1`, 
      sessionName: "Sunset Dinner Experience", 
      date: new Date(guest.lastVisit).toISOString(), 
      franchise: guest.franchiseName, 
      channel: "Web Booking" 
    },
    { 
      id: `booking-${guest.id}-2`, 
      sessionName: "Breakfast Above the Clouds", 
      date: new Date(new Date(guest.lastVisit).setDate(new Date(guest.lastVisit).getDate() - 30)).toISOString(), 
      franchise: guest.franchiseName, 
      channel: "Dashboard" 
    },
    { 
      id: `booking-${guest.id}-3`, 
      sessionName: "Corporate Event", 
      date: new Date(new Date(guest.lastVisit).setDate(new Date(guest.lastVisit).getDate() - 90)).toISOString(), 
      franchise: guest.franchiseName, 
      channel: "Offer Campaign" 
    }
  ].slice(0, guest.totalVisits);
  
  // Mock offers data
  const offers = [
    {
      id: "offer-1",
      name: "Birthday Special Discount",
      sentOn: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      redeemed: true,
      channel: "Email"
    },
    {
      id: "offer-2",
      name: "Valentine's Day Special",
      sentOn: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString(),
      redeemed: false,
      channel: "SMS"
    }
  ];
  
  // Mock loyalty activity
  const loyaltyActivity = [
    {
      id: "loyalty-1",
      points: 30,
      type: "earned",
      description: "Booking: Sunset Dinner Experience",
      date: new Date(guest.lastVisit).toISOString()
    },
    {
      id: "loyalty-2",
      points: 50,
      type: "earned",
      description: "Referral Bonus",
      date: new Date(new Date(guest.lastVisit).setDate(new Date(guest.lastVisit).getDate() - 15)).toISOString()
    },
    {
      id: "loyalty-3",
      points: -20,
      type: "redeemed",
      description: "Dessert Voucher",
      date: new Date(new Date(guest.lastVisit).setDate(new Date(guest.lastVisit).getDate() - 20)).toISOString()
    }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Guest Profile</DialogTitle>
          <DialogDescription>
            View and manage details for {guest.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Guest info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 border">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {guest.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{guest.name}</h3>
                <Badge 
                  variant="outline" 
                  className={getGuestTypeColor(guest.guestType)}
                >
                  {guest.guestType}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{guest.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{guest.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{guest.franchiseName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>{guest.loyalty?.availablePoints || 0} points available</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last Visit: {formatDate(guest.lastVisit)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Total Visits: {guest.totalVisits}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="flex items-center text-muted-foreground">
                  <Heart className="h-4 w-4 mr-1" /> Preferences:
                </span>
                {guest.preferences && guest.preferences.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {guest.preferences.map((pref, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {pref.preference}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">None recorded</span>
                )}
              </div>
              
              {guest.tags && guest.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="flex items-center text-muted-foreground">
                    <Tag className="h-4 w-4 mr-1" /> Tags:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {guest.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full" 
                onClick={() => onSendOffer(guest.id)}
              >
                <Send className="mr-2 h-4 w-4" /> Send Offer
              </Button>
            </div>
          </div>
          
          {/* Right side - Tabs */}
          <div className="md:col-span-2 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="booking-history">History</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="offers">Offers</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
              </TabsList>
              
              <TabsContent value="booking-history" className="pt-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h4 className="text-sm font-medium flex items-center">
                      <CalendarClock className="h-4 w-4 mr-2" /> 
                      Booking History
                    </h4>
                    {bookingHistory.length > 0 ? (
                      <div className="space-y-3">
                        {bookingHistory.map((booking) => (
                          <div key={booking.id} className="flex justify-between border-b pb-2">
                            <div>
                              <div className="font-medium">{booking.sessionName}</div>
                              <div className="text-xs text-muted-foreground">
                                {booking.franchise} • {booking.channel}
                              </div>
                            </div>
                            <div className="text-sm">{formatDate(booking.date)}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No booking history found.</p>
                    )}
                  </CardContent>
                </Card>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Notes</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        if (editingNotes) {
                          // Save notes logic would go here
                          setEditingNotes(false);
                        } else {
                          setEditingNotes(true);
                        }
                      }}
                    >
                      {editingNotes ? (
                        <>
                          <Save className="h-4 w-4 mr-1" /> Save
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </>
                      )}
                    </Button>
                  </div>
                  {editingNotes ? (
                    <Textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      placeholder="Add notes about this guest..."
                      className="min-h-[100px]"
                    />
                  ) : (
                    <div className="border rounded-md p-3 min-h-[100px] bg-muted/30 text-sm">
                      {notes || <span className="text-muted-foreground">No notes recorded for this guest.</span>}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="preferences" className="pt-4">
                <Card>
                  <CardContent className="p-4 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Current Preferences</h4>
                      <div className="flex flex-wrap gap-2">
                        {guest.preferences && guest.preferences.length > 0 ? (
                          guest.preferences.map((pref, index) => (
                            <Badge key={index} variant="secondary">
                              {pref.preference}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No preferences recorded.</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Add Preference</h4>
                      <div className="flex gap-2">
                        <Input placeholder="New preference..." />
                        <Button>Add</Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Common Preferences</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Window Seat", "Vegetarian", "Birthday Package", 
                          "Evening Sessions", "Special Assistance", "Kids Menu"].map((pref) => (
                          <Badge 
                            key={pref} 
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            + {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="offers" className="pt-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h4 className="text-sm font-medium flex items-center">
                      <Send className="h-4 w-4 mr-2" /> 
                      Offer History
                    </h4>
                    {offers.length > 0 ? (
                      <div className="space-y-3">
                        {offers.map((offer) => (
                          <div key={offer.id} className="flex justify-between border-b pb-2">
                            <div>
                              <div className="font-medium">{offer.name}</div>
                              <div className="text-xs text-muted-foreground">
                                Sent via {offer.channel}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge variant={offer.redeemed ? "success" : "secondary"}>
                                {offer.redeemed ? "Redeemed" : "Sent"}
                              </Badge>
                              <span className="text-xs text-muted-foreground mt-1">
                                {formatDate(offer.sentOn)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No offers have been sent to this guest yet.</p>
                    )}
                    
                    <div className="pt-2">
                      <Button onClick={() => onSendOffer(guest.id)}>
                        <Send className="mr-2 h-4 w-4" /> Send New Offer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="loyalty" className="pt-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium flex items-center">
                        <Award className="h-4 w-4 mr-2" /> 
                        Loyalty Points
                      </h4>
                      <div className="text-lg font-bold">
                        {guest.loyalty?.availablePoints || 0} 
                        <span className="text-xs text-muted-foreground ml-1">available</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Earned:</span>
                        <span>{guest.loyalty?.totalPoints || 0} points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Redeemed:</span>
                        <span>
                          {((guest.loyalty?.totalPoints || 0) - (guest.loyalty?.availablePoints || 0))} points
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium pt-2">Transaction History</h4>
                    <div className="space-y-3">
                      {loyaltyActivity.map((activity) => (
                        <div key={activity.id} className="flex justify-between border-b pb-2">
                          <div>
                            <div className="font-medium">{activity.description}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(activity.date)}
                            </div>
                          </div>
                          <div className={`font-bold ${activity.type === "earned" ? "text-green-500" : "text-amber-500"}`}>
                            {activity.type === "earned" ? "+" : "-"}{activity.points}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

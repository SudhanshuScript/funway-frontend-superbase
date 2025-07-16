
import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Mail, Phone, Star, User, Users, Search, Award, BookOpen, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GuestProfile, BookingHistory } from "@/types/bookingTypes";
import { toast } from "sonner";

interface GuestProfileViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestId: string;
}

export function GuestProfileView({ open, onOpenChange, guestId }: GuestProfileViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [specialNotes, setSpecialNotes] = useState("");
  
  // Mock guest data - would be fetched from API
  const guest: GuestProfile = {
    id: guestId,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1234567890",
    guestType: "VIP",
    foodPreference: "Non-Vegetarian",
    loyaltyPoints: 240,
    totalBookings: 8,
    specialNotes: "Prefers a table with a view. Allergic to nuts. Celebrating anniversary on next visit.",
    lastVisit: "2023-03-15",
    createdAt: "2022-01-10T09:30:00Z",
    updatedAt: "2023-03-15T18:45:00Z"
  };
  
  // Mock booking history - would be fetched from API
  const bookingHistory: BookingHistory[] = [
    {
      id: "BK-985",
      bookingDate: "2023-03-15",
      sessionName: "Twilight",
      guestCount: 2,
      vegCount: 0,
      nonVegCount: 2,
      paymentStatus: "paid",
      specialRequests: "Window seating",
      feedback: "Exceptional experience, loved the view!",
      bookingStatus: "confirmed"
    },
    {
      id: "BK-764",
      bookingDate: "2023-02-14",
      sessionName: "Aurora",
      guestCount: 2,
      vegCount: 0,
      nonVegCount: 2,
      paymentStatus: "paid",
      specialRequests: "Anniversary celebration",
      feedback: "Perfect evening for our anniversary.",
      bookingStatus: "confirmed"
    },
    {
      id: "BK-623",
      bookingDate: "2022-12-25",
      sessionName: "Christmas Special",
      guestCount: 4,
      vegCount: 1,
      nonVegCount: 3,
      paymentStatus: "paid",
      specialRequests: "Family gathering",
      feedback: "Great festive atmosphere!",
      bookingStatus: "confirmed"
    },
    {
      id: "BK-488",
      bookingDate: "2022-11-10",
      sessionName: "Dinner",
      guestCount: 2,
      vegCount: 0,
      nonVegCount: 2,
      paymentStatus: "paid",
      specialRequests: "",
      bookingStatus: "confirmed"
    },
    {
      id: "BK-329",
      bookingDate: "2022-09-05",
      sessionName: "Brunch",
      guestCount: 3,
      vegCount: 1,
      nonVegCount: 2,
      paymentStatus: "paid",
      specialRequests: "Birthday celebration",
      feedback: "Food was amazing!",
      bookingStatus: "confirmed"
    }
  ];
  
  // Filter bookings based on search query
  const filteredBookings = bookingHistory.filter(booking => 
    booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.bookingDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle saving special notes
  const handleSaveNotes = () => {
    // In a real app, this would be an API call
    toast.success("Guest notes updated successfully");
    setEditMode(false);
    // In real app, would update the guest object
  };
  
  // Initialize special notes from guest data
  React.useEffect(() => {
    if (guest.specialNotes) {
      setSpecialNotes(guest.specialNotes);
    }
  }, [guest.specialNotes]);
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl w-full overflow-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl flex items-center">
            <User className="mr-2 h-5 w-5" />
            Guest Profile
          </SheetTitle>
          <SheetDescription>
            Complete details for {guest.name}
          </SheetDescription>
        </SheetHeader>
        
        {/* Guest Header Information */}
        <div className="my-4 p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <h2 className="text-lg font-medium flex items-center">
                {guest.name}
                {guest.guestType === "VIP" && (
                  <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                    <Star className="h-3 w-3 mr-1" /> VIP
                  </Badge>
                )}
                {guest.guestType === "First Timer" && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    New Guest
                  </Badge>
                )}
              </h2>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`mailto:${guest.email}`} className="text-sm hover:underline">
                {guest.email}
              </a>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`tel:${guest.phone}`} className="text-sm hover:underline">
                {guest.phone}
              </a>
            </div>
            
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{guest.loyaltyPoints} loyalty points</span>
            </div>
            
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{guest.totalBookings} total bookings</span>
            </div>
          </div>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Food Preference</h3>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {guest.foodPreference || "Not specified"}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Visit</h3>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{guest.lastVisit || "No recent visits"}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h3>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{new Date(guest.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Special Notes</h3>
              <p className="text-sm">{guest.specialNotes || "No special notes available"}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Bookings</h3>
              {bookingHistory.slice(0, 3).map((booking) => (
                <div key={booking.id} className="mb-3 p-3 border rounded-md hover:bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{booking.sessionName}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" /> {booking.bookingDate}
                      </div>
                    </div>
                    <div>
                      <Badge variant={booking.paymentStatus === "paid" ? "default" : "outline"}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-sm">{booking.guestCount} guests</span>
                    {booking.feedback && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Has Feedback
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {bookingHistory.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 w-full text-primary"
                  onClick={() => setActiveTab("history")}
                >
                  View all {bookingHistory.length} bookings
                </Button>
              )}
            </div>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            </div>
            
            <div className="space-y-3">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="p-3 border rounded-md hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium flex items-center">
                          {booking.sessionName}
                          <span className="text-xs text-muted-foreground ml-2">({booking.id})</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" /> {booking.bookingDate}
                        </div>
                      </div>
                      <div>
                        <Badge variant={booking.paymentStatus === "paid" ? "default" : "outline"}>
                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-sm">{booking.guestCount} guests</span>
                      </div>
                      
                      {(booking.vegCount !== undefined || booking.nonVegCount !== undefined) && (
                        <div className="text-sm">
                          {booking.vegCount !== undefined && `${booking.vegCount} veg`}
                          {booking.vegCount !== undefined && booking.nonVegCount !== undefined && " / "}
                          {booking.nonVegCount !== undefined && `${booking.nonVegCount} non-veg`}
                        </div>
                      )}
                      
                      {booking.specialRequests && (
                        <div className="col-span-2 text-sm mt-1">
                          <span className="text-muted-foreground">Special requests:</span> {booking.specialRequests}
                        </div>
                      )}
                      
                      {booking.feedback && (
                        <div className="col-span-2 text-sm mt-1">
                          <span className="text-muted-foreground">Feedback:</span> {booking.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No matching bookings found" : "No booking history available"}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Special Notes & Preferences</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditMode(!editMode)}
              >
                <Edit className="h-4 w-4 mr-1" />
                {editMode ? "Cancel" : "Edit"}
              </Button>
            </div>
            
            {editMode ? (
              <div className="space-y-4">
                <Textarea 
                  placeholder="Enter special notes, preferences or dietary restrictions..." 
                  className="min-h-32"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                />
                <Button onClick={handleSaveNotes}>Save Notes</Button>
              </div>
            ) : (
              <div className="p-4 bg-muted/50 rounded-md min-h-[100px]">
                {specialNotes || "No special notes or preferences recorded."}
              </div>
            )}
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Food Preferences</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm text-muted-foreground">Preference</h4>
                  <p>{guest.foodPreference || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Dietary Restrictions</h4>
                  <p>None recorded</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Past Celebrations</h3>
              <div className="space-y-2">
                {bookingHistory.some(b => b.specialRequests?.toLowerCase().includes("anniversary") || 
                                         b.specialRequests?.toLowerCase().includes("birthday")) ? (
                  <>
                    {bookingHistory
                      .filter(b => b.specialRequests?.toLowerCase().includes("anniversary") || 
                                  b.specialRequests?.toLowerCase().includes("birthday"))
                      .map((booking, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-muted-foreground">{booking.bookingDate}:</span> {booking.specialRequests}
                        </div>
                      ))
                    }
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No celebration records found</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

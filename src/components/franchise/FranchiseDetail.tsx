import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Franchise, FranchiseDB, mapDbToFranchise } from "@/types/franchise";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, MapPin, Phone, Globe, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaffList from "./StaffList";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FranchiseDetailProps {
  franchiseId: string;
  onEdit?: () => void;
}

export default function FranchiseDetail({ franchiseId, onEdit }: FranchiseDetailProps) {
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFranchiseDetails();
  }, [franchiseId]);

  const fetchFranchiseDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("franchises")
        .select("*")
        .eq("id", franchiseId)
        .single();

      if (error) throw error;
      
      // Convert database schema to our frontend format
      const franchiseData: Franchise = mapDbToFranchise(data as FranchiseDB);
      
      setFranchise(franchiseData);
    } catch (error) {
      console.error("Error fetching franchise details:", error);
      toast.error("Failed to load franchise details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/franchises/edit/${franchiseId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!franchise) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Franchise not found</h3>
        <p className="text-muted-foreground mt-2">The requested franchise could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center">
                        <Building2 className="mr-2 h-5 w-5" />
                        {franchise.name}
                      </h2>
                      <p className="text-muted-foreground mt-1">{franchise.owner_name || "No owner specified"}</p>
                    </div>
                    <Badge variant={franchise.status === "active" ? "default" : "secondary"}>
                      {franchise.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <p>{franchise.address || "No address provided"}</p>
                        <p>
                          {franchise.city || ""}{franchise.city && franchise.state ? ", " : ""}
                          {franchise.state || ""}{(franchise.city || franchise.state) && franchise.country ? ", " : ""}
                          {franchise.country || ""}
                          {!franchise.city && !franchise.state && !franchise.country && "No location provided"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                      <p>{franchise.contact_number || "No contact number provided"}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                      <p>{franchise.email || "No email provided"}</p>
                    </div>
                    
                    {franchise.call_center_number && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                        <p>Call Center: {franchise.call_center_number}</p>
                      </div>
                    )}
                    
                    {franchise.telegram_channel_id && (
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-2 text-muted-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21.73 2.27a2 2 0 0 0-2.83 0L2.27 18.9a2 2 0 0 0 0 2.83l.8.8a2 2 0 0 0 2.83 0L21.73 5.1a2 2 0 0 0 0-2.83Z" />
                          <path d="M8.7 13.3a1 1 0 0 1 1.4-1.4" />
                          <path d="M15.3 16.7a1 1 0 0 1 1.4-1.4" />
                          <path d="M12 12a1 1 0 0 0 0-2" />
                          <path d="M12 12a1 1 0 0 1-2 0" />
                        </svg>
                        <p>Telegram: {franchise.telegram_channel_id}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Tax Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Tax ID:</span>
                          <span className="font-medium">{franchise.tax_id || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax Rate:</span>
                          <span className="font-medium">{franchise.tax_percentage ?? 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax Inclusive:</span>
                          <span className="font-medium">{franchise.tax_inclusive ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Payment Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Payment Gateway:</span>
                          <span className="font-medium">{franchise.payment_gateway || "Not set"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>API Key:</span>
                          <span className="font-medium">{franchise.payment_api_key ? "•••••••••••" : "Not set"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Currency:</span>
                          <span className="font-medium">{franchise.default_currency || "USD"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4 mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Regional Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Time Zone: {franchise.timezone || "Not set"}</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-2 text-muted-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          <line x1="9" y1="10" x2="15" y2="10" />
                        </svg>
                        <span>Language: {franchise.language || "English"}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Currency: {franchise.default_currency || "USD"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <div 
                    className="h-40 rounded-lg bg-muted flex items-center justify-center"
                    style={{
                      backgroundColor: franchise.theme_color || "#f3f4f6",
                      color: franchise.theme_color ? "#ffffff" : "inherit",
                    }}
                  >
                    {franchise.logo_url ? (
                      <img
                        src={franchise.logo_url}
                        alt={`${franchise.name} logo`}
                        className="max-w-full max-h-full p-4"
                      />
                    ) : (
                      <div className="text-center">
                        <Building2 className="h-16 w-16 mx-auto" />
                        <p className="font-medium mt-2">{franchise.name}</p>
                      </div>
                    )}
                  </div>
                  
                  {franchise.welcome_message && (
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h3 className="font-medium mb-1">Welcome Message:</h3>
                      <p className="text-sm">"{franchise.welcome_message}"</p>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    <Button onClick={handleEdit} className="w-full">
                      Edit Franchise Details
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="staff">
              <StaffList franchiseId={franchiseId} franchiseName={franchise.name || ""} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

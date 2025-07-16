
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedFranchise, mapDbToFranchise } from '@/types/franchiseManagement';
import { getFranchiseById } from '@/data/franchiseSampleData';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FranchiseDetailsProps {
  franchiseId: string;
  userRole?: string;
}

const FranchiseDetails: React.FC<FranchiseDetailsProps> = ({ franchiseId, userRole }) => {
  const [franchise, setFranchise] = useState<EnhancedFranchise | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFranchiseDetails = async () => {
      setLoading(true);
      
      try {
        // First try to get from Supabase
        const { data, error } = await supabase
          .from('franchises')
          .select('*')
          .eq('id', franchiseId)
          .single();
        
        if (error) {
          // If not found in database or other error, try sample data
          const sampleFranchise = getFranchiseById(franchiseId);
          
          if (sampleFranchise) {
            setFranchise(sampleFranchise);
          } else {
            throw error;
          }
        } else if (data) {
          // Use the mapDbToFranchise function to convert DB data to EnhancedFranchise type
          const mappedFranchise = mapDbToFranchise(data);
          setFranchise(mappedFranchise);
        }
      } catch (error) {
        console.error('Error fetching franchise details:', error);
        toast.error('Failed to load franchise details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFranchiseDetails();
  }, [franchiseId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!franchise) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Franchise not found</h3>
        <p className="text-muted-foreground mt-2">This franchise may have been removed or you don't have permission to view it.</p>
      </div>
    );
  }
  
  // Render the component with the franchise data
  // Rest of the component remains unchanged
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {franchise.logo_url ? (
                <img 
                  src={franchise.logo_url} 
                  alt={`${franchise.name} logo`}
                  className="w-16 h-16 rounded-md object-contain bg-muted/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                  <span className="text-xl font-bold text-muted-foreground">
                    {franchise.name?.substring(0, 2).toUpperCase() || 'F'}
                  </span>
                </div>
              )}
              <div>
                <CardTitle className="text-xl">{franchise.name || franchise.company_name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{franchise.city}, {franchise.state}, {franchise.country}</p>
              </div>
            </div>
            <Badge 
              className={
                franchise.status === 'active' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : franchise.status === 'inactive' 
                    ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300'
              }
            >
              {franchise.status === 'active' 
                ? 'Active' 
                : franchise.status === 'inactive' 
                  ? 'Inactive' 
                  : 'Pending Review'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Business Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Legal Name:</dt>
                        <dd>{franchise.legal_name || franchise.company_name || 'Not specified'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Tax ID:</dt>
                        <dd>{franchise.tax_id || 'Not specified'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Currency:</dt>
                        <dd>{franchise.currency || franchise.default_currency || 'USD'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Start Date:</dt>
                        <dd>{franchise.start_date ? new Date(franchise.start_date).toLocaleDateString() : 'Not specified'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Tax Rate:</dt>
                        <dd>{franchise.tax_percentage}% ({franchise.tax_inclusive ? 'Inclusive' : 'Exclusive'})</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Owner:</dt>
                        <dd>{franchise.owner_name || 'Not specified'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Email:</dt>
                        <dd>{franchise.owner_email || franchise.email || 'Not specified'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Phone:</dt>
                        <dd>{franchise.contact_number || 'Not specified'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Website:</dt>
                        <dd>{franchise.website || 'Not specified'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Instagram:</dt>
                        <dd>{franchise.instagram || 'Not specified'}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Address & Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p>{franchise.address || franchise.full_address || 'Address not specified'}</p>
                      <p>
                        {franchise.city ? franchise.city + ', ' : ''}
                        {franchise.state ? franchise.state + ', ' : ''}
                        {franchise.country || ''}
                      </p>
                      <div className="flex justify-between text-sm mt-2">
                        <div>
                          <span className="font-medium text-muted-foreground">Timezone:</span>{' '}
                          {franchise.timezone || 'Not specified'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="staff">
              {/* Staff tab content */}
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    Staff management features coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              {/* Documents tab content */}
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    Document management features coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              {/* Settings tab content */}
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    Franchise settings will be available here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FranchiseDetails;

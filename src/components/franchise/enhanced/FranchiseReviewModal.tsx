
import React, { useState } from 'react';
import { useUserRole } from '@/providers/UserRoleProvider';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  User, 
  Building2, 
  MapPin, 
  Calendar, 
  Shield
} from 'lucide-react';
import { 
  EnhancedFranchise, 
  FranchiseDocument,
  DocumentType,
  OnboardingStep
} from '@/types/franchiseManagement';
import { toast } from 'sonner';
import { FranchiseReviewConfirmationDialog } from './FranchiseReviewConfirmationDialog';
import { approveFranchise, declineFranchise } from '@/services/franchiseManagementService';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/utils/dateUtils';

interface FranchiseReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  franchise: EnhancedFranchise | null;
  onFranchiseStatusChange: (id: string, status: 'active' | 'inactive' | 'pending_review') => void;
}

export const FranchiseReviewModal: React.FC<FranchiseReviewModalProps> = ({
  open,
  onOpenChange,
  franchise,
  onFranchiseStatusChange
}) => {
  const { isRole } = useUserRole();
  const isSuperAdmin = isRole('superadmin');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [internalNotes, setInternalNotes] = useState(franchise?.shutdown_reason || '');
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!franchise) return null;

  // Calculate completion percentage for onboarding steps
  const onboardingSteps: OnboardingStep[] = [
    'franchise-identity',
    'location-address',
    'registration',
    'brand-appearance',
    'owner-details',
    'operational-setup',
  ];
  
  const completedSteps = onboardingSteps.filter(step => {
    // Logic to determine if step is completed based on franchise data
    switch(step) {
      case 'franchise-identity':
        return !!franchise.name && !!franchise.company_name;
      case 'location-address':
        return !!franchise.city && !!franchise.state && !!franchise.country;
      case 'registration':
        return !!franchise.tax_id;
      case 'brand-appearance':
        return !!franchise.logo_url || !!franchise.brand_color;
      case 'owner-details':
        return !!franchise.owner_name && !!franchise.owner_email;
      case 'operational-setup':
        return !!franchise.payment_gateway;
      default:
        return false;
    }
  }).length;
  
  const completionPercentage = Math.round((completedSteps / onboardingSteps.length) * 100);
  
  // Mock documents (in a real app, these would come from the database)
  const sampleDocuments: FranchiseDocument[] = [
    {
      id: 'd1',
      franchiseId: franchise.id,
      name: 'Business License',
      type: 'business_license',
      fileUrl: 'https://example.com/license.pdf',
      status: 'valid',
      uploadedBy: franchise.owner_name || 'Owner',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'd2',
      franchiseId: franchise.id,
      name: 'Tax Certificate',
      type: 'tax',
      fileUrl: 'https://example.com/tax.pdf',
      status: 'valid',
      uploadedBy: franchise.owner_name || 'Owner',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'd3',
      franchiseId: franchise.id,
      name: 'Identity Verification',
      type: 'kyc',
      fileUrl: 'https://example.com/kyc.pdf',
      status: 'pending',
      uploadedBy: franchise.owner_name || 'Owner',
      uploadedAt: new Date().toISOString(),
    }
  ];
  
  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      await approveFranchise(franchise.id, internalNotes);
      onFranchiseStatusChange(franchise.id, 'active');
      toast.success(`${franchise.name} franchise has been approved successfully!`);
      setIsApproveDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error approving franchise:', error);
      toast.error('Failed to approve franchise. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDecline = async (reason: string) => {
    try {
      setIsProcessing(true);
      await declineFranchise(franchise.id, reason, internalNotes);
      onFranchiseStatusChange(franchise.id, 'inactive');
      toast.success(`${franchise.name} franchise has been declined.`);
      setIsDeclineDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error declining franchise:', error);
      toast.error('Failed to decline franchise. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getDocumentTypeIcon = (type: DocumentType) => {
    switch(type) {
      case 'business_license':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'tax':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'kyc':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getDocumentStatusBadge = (status: string) => {
    switch(status) {
      case 'valid':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Valid</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Expired</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[900px] max-w-[95vw] max-h-[95vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <span>Franchise Review: {franchise.name || franchise.company_name}</span>
              <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300">
                Pending Review
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Application Completion</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="owner">Owner Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Internal Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="franchise-details">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>Franchise Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Company Name</p>
                        <p className="font-medium">{franchise.company_name || franchise.name || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Legal Name</p>
                        <p className="font-medium">{franchise.legal_name || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tax ID</p>
                        <p className="font-medium">{franchise.tax_id || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">{franchise.start_date ? formatDate(new Date(franchise.start_date)) : 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Currency</p>
                        <p className="font-medium">{franchise.currency || franchise.default_currency || 'USD'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tax Rate</p>
                        <p className="font-medium">{franchise.tax_percentage}% ({franchise.tax_inclusive ? 'Inclusive' : 'Exclusive'})</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="location">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{franchise.address || franchise.full_address || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">City</p>
                        <p className="font-medium">{franchise.city || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">State</p>
                        <p className="font-medium">{franchise.state || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p className="font-medium">{franchise.country || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timezone</p>
                        <p className="font-medium">{franchise.timezone || 'Not specified'}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="brand">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Brand Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4">
                      {franchise.logo_url && (
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground">Logo</p>
                          <div className="h-24 w-24 bg-muted rounded-md flex items-center justify-center mt-1 overflow-hidden">
                            <img 
                              src={franchise.logo_url} 
                              alt={`${franchise.name} logo`} 
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Brand Color</p>
                        {franchise.brand_color ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: franchise.brand_color }}
                            ></div>
                            <p className="font-medium">{franchise.brand_color}</p>
                          </div>
                        ) : (
                          <p className="font-medium">Not specified</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p className="font-medium">{franchise.website || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Instagram</p>
                        <p className="font-medium">{franchise.instagram || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Welcome Message</p>
                        <p className="font-medium">{franchise.welcome_message || 'Not specified'}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="owner">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{franchise.owner_name || 'Owner name not specified'}</h3>
                        <p className="text-sm text-muted-foreground">Franchise Owner</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium">{franchise.owner_email || franchise.email || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{franchise.contact_number || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">ID Verification</h4>
                      {sampleDocuments.find(doc => doc.type === 'kyc') ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Verification Submitted
                          </Badge>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Document
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          No ID Verification
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Submitted Documents</h3>
                {sampleDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {sampleDocuments.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getDocumentTypeIcon(doc.type)}
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded by {doc.uploadedBy} on {formatDate(new Date(doc.uploadedAt))}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getDocumentStatusBadge(doc.status)}
                          <Button variant="outline" size="sm" asChild className="ml-2 min-w-[80px] justify-center">
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium">No Documents Submitted</h3>
                    <p className="text-sm text-muted-foreground">This franchise hasn't uploaded any documents yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="px-2">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Internal Notes (Only visible to admins)</h3>
                <Textarea
                  placeholder="Add internal notes about this franchise application..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={8}
                  className="resize-none w-full"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {isSuperAdmin && (
            <DialogFooter className="flex gap-3 justify-end pt-6 border-t mt-6">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeclineDialogOpen(true)}
                disabled={isProcessing}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Decline Application
              </Button>
              <Button
                onClick={() => setIsApproveDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve Franchise
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      <FranchiseReviewConfirmationDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        franchise={franchise}
        type="approve"
        onConfirm={handleApprove}
        isProcessing={isProcessing}
        internalNotes={internalNotes}
      />
      
      <FranchiseReviewConfirmationDialog
        open={isDeclineDialogOpen}
        onOpenChange={setIsDeclineDialogOpen}
        franchise={franchise}
        type="decline"
        onConfirm={handleDecline}
        isProcessing={isProcessing}
        internalNotes={internalNotes}
      />
    </>
  );
};

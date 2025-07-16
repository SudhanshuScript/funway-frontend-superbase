
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Eye, 
  Edit2, 
  Power, 
  Flag, 
  MoreHorizontal, 
  Users,
  Loader2 
} from "lucide-react";
import { FranchiseFiltersState, EnhancedFranchise } from '@/types/franchiseManagement';
import { UserRole } from '@/types/navigation';
import { Badge } from "../ui/badge";
import { loadFranchiseData } from '@/utils/franchiseDataLoader';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import EnhancedFranchiseShutdownDialog from './enhanced/FranchiseShutdownDialog';
import { FranchiseReviewModal } from './enhanced/FranchiseReviewModal';

interface FranchiseOverviewPanelProps {
  filters: FranchiseFiltersState;
  onSelectFranchise: (id: string) => void;
  userRole: UserRole;
  userFranchiseId?: string;
}

const FranchiseOverviewPanel: React.FC<FranchiseOverviewPanelProps> = ({ 
  filters, 
  onSelectFranchise,
  userRole,
  userFranchiseId
}) => {
  const [franchises, setFranchises] = useState<EnhancedFranchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [shutdownDialogOpen, setShutdownDialogOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedFranchiseForShutdown, setSelectedFranchiseForShutdown] = useState<EnhancedFranchise | null>(null);
  const [selectedFranchiseForReview, setSelectedFranchiseForReview] = useState<EnhancedFranchise | null>(null);
  
  useEffect(() => {
    const fetchFranchises = async () => {
      setLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const loadedFranchises = await loadFranchiseData(filters, userRole, userFranchiseId);
        setFranchises(loadedFranchises);
      } catch (error) {
        console.error('Error fetching franchises:', error);
        toast.error('Failed to load franchises');
        setFranchises([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFranchises();
  }, [filters, userRole, userFranchiseId]);
  
  const handleShutdownClick = (franchise: EnhancedFranchise) => {
    setSelectedFranchiseForShutdown(franchise);
    setShutdownDialogOpen(true);
  };
  
  const handleShutdownSuccess = () => {
    if (!selectedFranchiseForShutdown) return;
    
    const updatedFranchises = franchises.map(f => 
      f.id === selectedFranchiseForShutdown.id 
        ? { ...f, status: 'inactive' as const } 
        : f
    );
    setFranchises(updatedFranchises);
  };

  const handleReviewClick = (franchise: EnhancedFranchise) => {
    setSelectedFranchiseForReview(franchise);
    setReviewModalOpen(true);
  };
  
  const handleFranchiseStatusChange = (franchiseId: string, newStatus: 'active' | 'inactive' | 'pending_review') => {
    const updatedFranchises = franchises.map(f => 
      f.id === franchiseId 
        ? { ...f, status: newStatus } 
        : f
    );
    setFranchises(updatedFranchises);
  };

  const renderStatusBadge = (status?: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300">Inactive</Badge>;
      case 'pending_review':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300">Pending Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg border">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading franchises...</p>
      </div>
    );
  }
  
  if (franchises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg border">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No franchises found</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          {filters.search || filters.status !== 'all' || filters.location.country || filters.location.state || filters.location.city
            ? 'No franchises match your current filters. Try changing your search criteria.'
            : 'No franchises have been added yet. Add your first franchise to get started.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[240px]">Franchise Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {franchises.map((franchise) => (
              <TableRow key={franchise.id} className="hover:bg-muted/40">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{franchise.name || franchise.company_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {[franchise.city, franchise.state, franchise.country]
                        .filter(Boolean)
                        .join(', ') || 'Location not specified'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {franchise.owner_name || 'Not assigned'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{formatDate(franchise.created_at)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {renderStatusBadge(franchise.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {franchise.status === 'pending_review' && userRole === 'superadmin' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-xs border-amber-200 text-amber-800 hover:bg-amber-50"
                        onClick={() => handleReviewClick(franchise)}
                      >
                        Review Application
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onSelectFranchise(franchise.id)}
                      >
                        <span className="sr-only">View details</span>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {(userRole === 'superadmin' || (userRole === 'franchise_owner' && userFranchiseId === franchise.id)) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onSelectFranchise(franchise.id)}
                      >
                        <span className="sr-only">Edit franchise</span>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {userRole === 'superadmin' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {franchise.status === 'pending_review' && (
                            <DropdownMenuItem onClick={() => handleReviewClick(franchise)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Review Application
                            </DropdownMenuItem>
                          )}
                          
                          {franchise.status === 'active' && (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleShutdownClick(franchise)}
                            >
                              <Power className="h-4 w-4 mr-2" />
                              Shutdown Franchise
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Manage Staff
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            Flag for Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedFranchiseForShutdown && (
        <EnhancedFranchiseShutdownDialog
          open={shutdownDialogOpen}
          onOpenChange={setShutdownDialogOpen}
          franchiseId={selectedFranchiseForShutdown.id}
          franchiseName={selectedFranchiseForShutdown.name || selectedFranchiseForShutdown.company_name || ''}
          onSuccess={handleShutdownSuccess}
        />
      )}
      
      {selectedFranchiseForReview && (
        <FranchiseReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          franchise={selectedFranchiseForReview}
          onFranchiseStatusChange={handleFranchiseStatusChange}
        />
      )}
    </div>
  );
};

export default FranchiseOverviewPanel;

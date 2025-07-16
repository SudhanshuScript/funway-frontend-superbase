
import { useState, useEffect } from 'react';
import { useUserRole } from '@/providers/UserRoleProvider';

export type Franchise = {
  id: string;
  name: string;
  company_name?: string;
};

export const useFranchiseSelector = () => {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useUserRole();
  
  const isSuperAdmin = currentUser?.role === 'superadmin';
  
  // Fetch franchises if user is superadmin
  useEffect(() => {
    const loadFranchises = async () => {
      if (!isSuperAdmin) {
        // For non-superadmins, we don't need to load all franchises
        if (currentUser?.franchiseId) {
          const franchiseName = currentUser.franchiseId ? 'My Franchise' : 'Unknown';
          
          setFranchises([{
            id: currentUser.franchiseId,
            name: franchiseName
          }]);
          setSelectedFranchiseId(currentUser.franchiseId);
        }
        return;
      }
      
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be an API call
        // For now, we'll use mock data for franchises
        const mockFranchises: Franchise[] = [
          { id: 'f1', name: 'Downtown Restaurant' },
          { id: 'f2', name: 'Skyline Dining' },
          { id: 'f3', name: 'Sunset Experience' },
          { id: 'f4', name: 'Mountain View' },
        ];
        
        setFranchises(mockFranchises);
      } catch (error) {
        console.error('Error loading franchises:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFranchises();
  }, [isSuperAdmin, currentUser]);
  
  const handleFranchiseChange = (franchiseId: string) => {
    setSelectedFranchiseId(franchiseId);
  };
  
  return {
    franchises,
    selectedFranchiseId,
    handleFranchiseChange,
    isLoading,
    isSuperAdmin
  };
};

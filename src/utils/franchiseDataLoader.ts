
import { supabase } from '@/integrations/supabase/client';
import { EnhancedFranchise, mapDbToFranchise, FranchiseFiltersState } from '@/types/franchiseManagement';
import { allSampleFranchises, activeFranchises, inactiveFranchises, pendingFranchises } from '@/data/franchiseSampleData';
import { toast } from 'sonner';

// Flag to toggle between using real data, sample data, or both
const DATA_SOURCE = {
  USE_REAL_DATA: true,
  USE_SAMPLE_DATA: true,
  MERGE_DATA: true, // If both real and sample are true, this determines if they're merged or only real is used
};

export const loadFranchiseData = async (
  filters: FranchiseFiltersState,
  userRole?: string,
  userFranchiseId?: string
): Promise<EnhancedFranchise[]> => {
  let realFranchises: EnhancedFranchise[] = [];
  
  if (DATA_SOURCE.USE_REAL_DATA) {
    try {
      let query = supabase.from('franchises').select('*');
      
      // Apply filters
      if (filters.search) {
        query = query.or(
          `company_name.ilike.%${filters.search}%,owner_name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,state.ilike.%${filters.search}%,country.ilike.%${filters.search}%`
        );
      }
      
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.location.country) {
        query = query.eq('country', filters.location.country);
      }
      
      if (filters.location.state) {
        query = query.eq('state', filters.location.state);
      }
      
      if (filters.location.city) {
        query = query.eq('city', filters.location.city);
      }
      
      // If not superadmin, restrict to their franchise
      if (userRole !== 'superadmin' && userFranchiseId) {
        query = query.eq('id', userFranchiseId);
      }
      
      // Add date range filter if present
      if (filters.dateRange.from) {
        const fromDate = filters.dateRange.from.toISOString().split('T')[0];
        query = query.gte('created_at', fromDate);
      }
      
      if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setDate(toDate.getDate() + 1); // Include the end date
        query = query.lt('created_at', toDate.toISOString().split('T')[0]);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        realFranchises = data.map(franchise => mapDbToFranchise(franchise));
      }
    } catch (error) {
      console.error('Error fetching real franchises:', error);
      if (DATA_SOURCE.USE_SAMPLE_DATA && !DATA_SOURCE.MERGE_DATA) {
        toast.error('Failed to load franchises from database, using sample data instead');
      } else {
        toast.error('Failed to load franchises');
      }
    }
  }
  
  // If we're not using sample data or we have real data and don't want to merge, return real data
  if (!DATA_SOURCE.USE_SAMPLE_DATA || (realFranchises.length > 0 && !DATA_SOURCE.MERGE_DATA)) {
    return realFranchises;
  }
  
  // Filter sample franchises based on the same filters
  let filteredSampleFranchises = [...allSampleFranchises];
  
  if (filters.status !== 'all') {
    filteredSampleFranchises = filteredSampleFranchises.filter(f => f.status === filters.status);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredSampleFranchises = filteredSampleFranchises.filter(f => 
      (f.name && f.name.toLowerCase().includes(searchLower)) ||
      (f.company_name && f.company_name.toLowerCase().includes(searchLower)) ||
      (f.owner_name && f.owner_name.toLowerCase().includes(searchLower)) ||
      (f.city && f.city.toLowerCase().includes(searchLower)) ||
      (f.state && f.state.toLowerCase().includes(searchLower)) ||
      (f.country && f.country.toLowerCase().includes(searchLower))
    );
  }
  
  if (filters.location.country) {
    filteredSampleFranchises = filteredSampleFranchises.filter(
      f => f.country && f.country.toLowerCase() === filters.location.country!.toLowerCase()
    );
  }
  
  if (filters.location.state) {
    filteredSampleFranchises = filteredSampleFranchises.filter(
      f => f.state && f.state.toLowerCase() === filters.location.state!.toLowerCase()
    );
  }
  
  if (filters.location.city) {
    filteredSampleFranchises = filteredSampleFranchises.filter(
      f => f.city && f.city.toLowerCase() === filters.location.city!.toLowerCase()
    );
  }
  
  // If we have real data and want to merge, combine them
  if (DATA_SOURCE.MERGE_DATA && realFranchises.length > 0) {
    // Use a Map to prevent duplicates by ID
    const franchiseMap = new Map<string, EnhancedFranchise>();
    
    // Add real franchises
    realFranchises.forEach(franchise => {
      franchiseMap.set(franchise.id, franchise);
    });
    
    // Add sample franchises (will overwrite any real franchises with the same ID)
    filteredSampleFranchises.forEach(franchise => {
      // Skip if real franchise with this ID exists
      if (!franchiseMap.has(franchise.id)) {
        franchiseMap.set(franchise.id, franchise);
      }
    });
    
    return Array.from(franchiseMap.values());
  }
  
  return filteredSampleFranchises;
};

export const getSampleFranchisesCount = () => ({
  active: activeFranchises.length,
  inactive: inactiveFranchises.length,
  pending: pendingFranchises.length,
  total: allSampleFranchises.length
});

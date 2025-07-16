
import { apiClient } from '../apiClient';

// Franchise types - updated to match expected data structure
export interface Franchise {
  id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive';
  staff: { id: string; name: string; role: string }[];
  taxDetails?: {
    gstNumber?: string;
    vatNumber?: string;
  };
  brandingAssets?: {
    logoUrl?: string;
    colorTheme?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FranchiseFilters {
  status?: 'active' | 'inactive';
  country?: string;
  state?: string;
  city?: string;
}

// Create franchise payload types
export interface CreateFranchisePayload {
  name: string;
  country: string;
  state: string;
  city: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  staff?: { id: string; name: string; role: string }[];
  taxDetails?: {
    gstNumber?: string;
    vatNumber?: string;
  };
  brandingAssets?: {
    logoUrl?: string;
    colorTheme?: string;
  };
}

export interface UpdateFranchisePayload {
  name?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  staff?: { id: string; name: string; role: string }[];
  taxDetails?: {
    gstNumber?: string;
    vatNumber?: string;
  };
  brandingAssets?: {
    logoUrl?: string;
    colorTheme?: string;
  };
}

// New API wrapper functions
export async function getFranchises(params?: { status?: 'active' | 'inactive' }) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.get('/franchises', { params });
    
    // Temporary mock implementation
    console.log('getFranchises - Using mock data', params);
    const mockFranchises: Franchise[] = [
      {
        id: 'franchise-1',
        name: 'Downtown FlyDining',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        address: '123 Market St, San Francisco, CA 94103',
        contactEmail: 'downtown@flydining.com',
        contactPhone: '+1-555-0101',
        status: 'active',
        staff: [
          { id: 'staff-1', name: 'John Doe', role: 'Manager' },
          { id: 'staff-2', name: 'Jane Smith', role: 'Chef' }
        ],
        taxDetails: {
          gstNumber: 'GST123456789',
          vatNumber: 'VAT987654321'
        },
        brandingAssets: {
          logoUrl: 'https://example.com/logo1.png',
          colorTheme: '#3B82F6'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'franchise-2',
        name: 'Riverside Experience',
        country: 'United States',
        state: 'New York',
        city: 'New York',
        address: '456 Broadway, New York, NY 10013',
        contactEmail: 'riverside@flydining.com',
        contactPhone: '+1-555-0102',
        status: 'active',
        staff: [
          { id: 'staff-3', name: 'Mike Johnson', role: 'Manager' },
          { id: 'staff-4', name: 'Sarah Wilson', role: 'Sous Chef' }
        ],
        taxDetails: {
          gstNumber: 'GST234567890',
          vatNumber: 'VAT876543210'
        },
        brandingAssets: {
          logoUrl: 'https://example.com/logo2.png',
          colorTheme: '#10B981'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'franchise-3',
        name: 'Mountain View',
        country: 'Canada',
        state: 'British Columbia',
        city: 'Vancouver',
        address: '789 Granville St, Vancouver, BC V6Z 1K3',
        contactEmail: 'mountain@flydining.com',
        contactPhone: '+1-555-0103',
        status: 'inactive',
        staff: [
          { id: 'staff-5', name: 'David Brown', role: 'Manager' }
        ],
        taxDetails: {
          gstNumber: 'GST345678901',
          vatNumber: 'VAT765432109'
        },
        brandingAssets: {
          logoUrl: 'https://example.com/logo3.png',
          colorTheme: '#F59E0B'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    // Filter by status if provided
    if (params?.status) {
      return mockFranchises.filter(franchise => franchise.status === params.status);
    }
    
    return mockFranchises;
  } catch (error) {
    console.error('Error fetching franchises:', error);
    throw error;
  }
}

export async function getFranchiseById(id: string) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.get(`/franchises/${id}`);
    
    // Temporary mock implementation
    console.log('getFranchiseById - Using mock data', id);
    const franchises = await getFranchises();
    return franchises.find(franchise => franchise.id === id) || null;
  } catch (error) {
    console.error('Error fetching franchise by ID:', error);
    throw error;
  }
}

export async function createFranchise(payload: CreateFranchisePayload) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.post('/franchises', payload);
    
    // Temporary mock implementation
    console.log('createFranchise - Using mock data', payload);
    const newFranchise: Franchise = {
      ...payload,
      id: `franchise-${Date.now()}`,
      status: 'active',
      staff: payload.staff || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newFranchise;
  } catch (error) {
    console.error('Error creating franchise:', error);
    throw error;
  }
}

export async function updateFranchise(id: string, payload: Partial<UpdateFranchisePayload>) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.put(`/franchises/${id}`, payload);
    
    // Temporary mock implementation
    console.log('updateFranchise - Using mock data', id, payload);
    const existing = await getFranchiseById(id);
    if (!existing) {
      throw new Error('Franchise not found');
    }
    
    const updatedFranchise: Franchise = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    
    return updatedFranchise;
  } catch (error) {
    console.error('Error updating franchise:', error);
    throw error;
  }
}

export async function deactivateFranchise(id: string, reason: string) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.post(`/franchises/${id}/deactivate`, { reason });
    
    // Temporary mock implementation
    console.log('deactivateFranchise - Using mock data', id, reason);
    
    // Return success indicator
    return { success: true, message: 'Franchise deactivated successfully' };
  } catch (error) {
    console.error('Error deactivating franchise:', error);
    throw error;
  }
}

// Legacy FranchiseService class for backward compatibility
export class FranchiseService {
  
  /**
   * Get all franchises with optional filtering
   */
  static async getFranchises(filters?: Partial<FranchiseFilters>): Promise<Franchise[]> {
    try {
      // Convert filters to API params format
      const params: any = {};
      if (filters?.status) {
        params.status = filters.status;
      }
      
      return await getFranchises(params);
    } catch (error) {
      console.error('Error fetching franchises:', error);
      throw error;
    }
  }

  /**
   * Create a new franchise
   */
  static async createFranchise(franchiseData: Omit<Franchise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Franchise> {
    // Convert legacy format to new API format
    const payload: CreateFranchisePayload = {
      name: franchiseData.name,
      country: franchiseData.country,
      state: franchiseData.state,
      city: franchiseData.city,
      address: franchiseData.address,
      contactEmail: franchiseData.contactEmail,
      contactPhone: franchiseData.contactPhone,
      staff: franchiseData.staff,
      taxDetails: franchiseData.taxDetails,
      brandingAssets: franchiseData.brandingAssets,
    };
    
    return await createFranchise(payload);
  }

  /**
   * Update franchise by ID
   */
  static async updateFranchise(id: string, updateData: Partial<Franchise>): Promise<Franchise> {
    const payload: Partial<UpdateFranchisePayload> = {
      name: updateData.name,
      country: updateData.country,
      state: updateData.state,
      city: updateData.city,
      address: updateData.address,
      contactEmail: updateData.contactEmail,
      contactPhone: updateData.contactPhone,
      staff: updateData.staff,
      taxDetails: updateData.taxDetails,
      brandingAssets: updateData.brandingAssets,
    };
    
    return await updateFranchise(id, payload);
  }
}

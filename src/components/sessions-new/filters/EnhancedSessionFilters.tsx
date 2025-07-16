
import React from 'react';
import { FilterParams } from "../hooks/useSessionFilters";
import { Franchise } from "@/hooks/useFranchiseSelector";
import FilterTabs from './components/FilterTabs';
import SearchInput from './components/SearchInput';
import AdvancedFiltersPopover from './components/AdvancedFiltersPopover';
import FranchiseSelector from './components/FranchiseSelector';

interface EnhancedSessionFiltersProps {
  filterParams: FilterParams;
  setFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
  activeTab: 'active' | 'inactive' | 'all';
  setActiveTab: React.Dispatch<React.SetStateAction<'active' | 'inactive' | 'all'>>;
  sessionTypes: string[];
  franchiseOptions: Franchise[];
  selectedFranchiseId: string | 'all';
  onFranchiseChange: (id: string) => void;
  isSuperAdmin: boolean;
}

const EnhancedSessionFilters = ({
  filterParams,
  setFilterParams,
  activeTab,
  setActiveTab,
  sessionTypes,
  franchiseOptions,
  selectedFranchiseId,
  onFranchiseChange,
  isSuperAdmin
}: EnhancedSessionFiltersProps) => {
  const handleSearchChange = (value: string) => {
    setFilterParams(prev => ({ 
      ...prev, 
      searchQuery: value,
      search: value 
    }));
  };
  
  const handleResetFilters = () => {
    setFilterParams({
      searchQuery: '',
      search: '',
      dateRange: {
        from: undefined,
        to: undefined,
      },
      sessionType: 'all',
      staffAssigned: [],
      status: 'all',
      performance: 'all',
      duration: 'all',
      dateFilter: 'upcoming',
      franchise: 'all',
      sortBy: 'date',
      showSpecial: true,
      showRecurring: true
    });
    setActiveTab('active');
  };
  
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <FilterTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <SearchInput 
        value={filterParams.searchQuery || filterParams.search || ''} 
        onChange={handleSearchChange} 
      />
      
      <AdvancedFiltersPopover 
        filterParams={filterParams}
        setFilterParams={setFilterParams}
        sessionTypes={sessionTypes}
        onResetFilters={handleResetFilters}
      />
      
      {isSuperAdmin && (
        <FranchiseSelector 
          selectedFranchiseId={selectedFranchiseId}
          onFranchiseChange={onFranchiseChange}
          franchiseOptions={franchiseOptions}
        />
      )}
    </div>
  );
};

export default EnhancedSessionFilters;

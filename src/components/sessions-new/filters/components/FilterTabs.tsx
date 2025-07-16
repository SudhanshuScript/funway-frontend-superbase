
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTabsProps {
  activeTab: 'active' | 'inactive' | 'all';
  setActiveTab: (tab: 'active' | 'inactive' | 'all') => void;
}

const FilterTabs = ({ activeTab, setActiveTab }: FilterTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'inactive' | 'all')} className="w-auto">
      <TabsList>
        <TabsTrigger value="active" className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span>Active</span>
        </TabsTrigger>
        <TabsTrigger value="inactive" className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400"></span>
          <span>Inactive</span>
        </TabsTrigger>
        <TabsTrigger value="all" className="flex items-center gap-1">
          <span>All</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default FilterTabs;

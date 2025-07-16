
import { useState, useEffect } from 'react';
import { StaffMember } from "@/types/staffTypes";

export const useStaffFiltering = (
  staff: StaffMember[],
  activeTab: string,
  searchTerm: string,
  selectedFranchise: string,
  selectedDepartment: string,
  selectedStatus: string,
  telegramFilter: string,
  sortBy: string,
  sortDirection: "asc" | "desc"
) => {
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>(staff);

  useEffect(() => {
    let result = [...staff];
    
    switch (activeTab) {
      case "on_duty":
        result = result.filter(member => member.status === "active");
        break;
      case "on_leave":
        result = result.filter(member => member.status === "on_leave");
        break;
      case "training":
        result = result.filter(member => member.status === "training");
        break;
      case "new":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        result = result.filter(member => {
          const createDate = new Date(member.created_at);
          return createDate >= thirtyDaysAgo;
        });
        break;
      case "expired":
        result = result.filter(member => {
          return (member.designation === "Safety Officer" || member.designation === "Chef") && 
                 Math.random() > 0.5;
        });
        break;
    }
    
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(member => 
        member.full_name.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.designation.toLowerCase().includes(search)
      );
    }
    
    if (selectedFranchise !== "all") {
      result = result.filter(member => member.franchise_id === selectedFranchise);
    }
    
    if (selectedDepartment !== "all") {
      result = result.filter(member => member.department === selectedDepartment);
    }
    
    if (selectedStatus !== "all") {
      result = result.filter(member => member.status === selectedStatus);
    }
    
    if (telegramFilter !== "all") {
      const hasAccess = telegramFilter === "yes";
      result = result.filter(member => member.telegram_access === hasAccess);
    }
    
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.full_name.localeCompare(b.full_name);
          break;
        case "date":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "role":
          comparison = a.designation.localeCompare(b.designation);
          break;
        case "franchise":
          comparison = (a.franchise_name || "").localeCompare(b.franchise_name || "");
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredStaff(result);
  }, [
    staff, 
    activeTab, 
    searchTerm, 
    selectedFranchise, 
    selectedDepartment, 
    selectedStatus, 
    telegramFilter, 
    sortBy, 
    sortDirection
  ]);

  return filteredStaff;
};

export default useStaffFiltering;

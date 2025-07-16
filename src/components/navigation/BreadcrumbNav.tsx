
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

// Define the structure for a breadcrumb item
interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

// Define props for the component
interface BreadcrumbNavProps {
  extraItems?: BreadcrumbItem[];
  currentPageLabel?: string;
}

// Map of route paths to their display names
const routeLabels: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/franchises": "Franchise Management",
  "/franchises/new": "Add New Franchise",
  "/franchises/edit": "Edit Franchise",
  "/franchises/view": "Franchise Details",
  "/bookings": "Bookings",
  "/sessions": "Sessions",
  "/sessions-new": "Sessions",
  "/dining": "Dining Management",
  "/analytics": "Analytics",
  "/reports": "Reports",
  "/guests": "Guests",
  "/staff": "Staff",
  "/payments": "Payments",
  "/offers": "Offers",
  "/lead-management": "Lead Management",
  "/settings": "Settings",
};

export function BreadcrumbNav({ extraItems = [], currentPageLabel }: BreadcrumbNavProps) {
  const location = useLocation();
  const { currentUser } = useUserRole();
  const { franchises, selectedFranchiseId } = useFranchiseSelector();
  
  // Check if we're on a mobile device
  const isMobile = window.innerWidth < 640;
  
  // Generate breadcrumb items based on the current path
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let currentPath = '';
    const items: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/dashboard', isActive: location.pathname === '/dashboard' }
    ];
    
    // Skip dashboard if we're already there
    if (location.pathname === '/dashboard') {
      return items;
    }
    
    // Process each path segment
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      
      // Skip adding dashboard again if it's in the path
      if (pathSegments[i] === 'dashboard' && i === 0) continue;
      
      // Handle franchise ID in the path
      if (pathSegments[i-1] === 'franchises' && (
          pathSegments[i] === 'edit' || 
          pathSegments[i] === 'view'
        ) && pathSegments[i+1]) {
        // This is a franchise ID, look up the franchise name
        const franchiseId = pathSegments[i+1];
        const franchise = franchises.find(f => f.id === franchiseId);
        if (franchise) {
          items.push({
            label: franchise.name,
            path: `/franchises/view/${franchiseId}`,
            isActive: false
          });
        }
        i++; // Skip the ID in the next iteration
        continue;
      }
      
      // Use route labels or capitalize the segment
      let label = routeLabels[currentPath] || pathSegments[i].charAt(0).toUpperCase() + pathSegments[i].slice(1);
      
      // Special case for 'edit', 'view', and 'new' at the end of a path
      if (['edit', 'view', 'new'].includes(pathSegments[i]) && pathSegments[i-1]) {
        label = `${pathSegments[i].charAt(0).toUpperCase() + pathSegments[i].slice(1)} ${routeLabels['/' + pathSegments[i-1]] || pathSegments[i-1]}`;
      }
      
      items.push({
        label,
        path: currentPath,
        isActive: i === pathSegments.length - 1
      });
    }
    
    // Add any extra items
    return [...items, ...extraItems];
  };
  
  const breadcrumbItems = generateBreadcrumbItems();
  
  // Truncate breadcrumbs for mobile
  const displayItems = isMobile && breadcrumbItems.length > 3
    ? [
        breadcrumbItems[0],
        { label: '...', path: '', isActive: false },
        breadcrumbItems[breadcrumbItems.length - 1]
      ]
    : breadcrumbItems;

  if (!currentUser) return null;
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {displayItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>}
            
            {item.label === '...' ? (
              <BreadcrumbEllipsis />
            ) : item.isActive || index === displayItems.length - 1 ? (
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPageLabel || item.label}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

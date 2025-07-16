
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "superadmin" | "franchise_owner" | "franchise_manager" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  franchiseId?: string;
  avatar?: string;
}

interface UserRoleContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isRole: (role: UserRole | UserRole[]) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

// Predefined users for authentication
export const predefinedUsers: User[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@flydining.com",
    role: "superadmin",
  },
  {
    id: "2",
    name: "Franchise Owner",
    email: "franchiseowner@flydining.com",
    role: "franchise_owner",
    franchiseId: "franchise-1",
  },
  {
    id: "3",
    name: "Manager",
    email: "manager@flydining.com",
    role: "franchise_manager",
    franchiseId: "franchise-1",
  },
];

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for saved user in local storage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Save user to local storage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const isRole = (role: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    
    return currentUser.role === role;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserRoleContext.Provider value={{ currentUser, setCurrentUser, isRole, logout, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};

// Export demo users for potential reuse elsewhere
export const demoUsers: Partial<User>[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@flydining.com",
    role: "superadmin",
  },
  {
    id: "2",
    name: "Franchise Owner",
    email: "franchiseowner@flydining.com",
    role: "franchise_owner",
    franchiseId: "franchise-1",
  },
  {
    id: "3",
    name: "Manager",
    email: "manager@flydining.com",
    role: "franchise_manager",
    franchiseId: "franchise-1",
  },
];

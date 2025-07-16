
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useUserRole } from "@/providers/UserRoleProvider";
import { ActiveUserIndicator } from "@/components/dashboard/ActiveUserIndicator";
import { UTCTimeDisplay } from "@/components/dashboard/UTCTimeDisplay";
import { Logo } from "@/components/ui/Logo";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentUser } = useUserRole();
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold flex items-center">
            {currentUser ? `Welcome, ${currentUser.name}` : 'Welcome'}
            <Logo size="sm" className="ml-2" />
          </h1>
          <div className="flex items-center gap-4">
            <ActiveUserIndicator />
            <UTCTimeDisplay />
            <ThemeToggle />
            {currentUser && (
              <div className="text-sm text-muted-foreground">
                {currentUser.role.replace('_', ' ').toUpperCase()}
              </div>
            )}
          </div>
        </header>
        <main className="p-6">
          <div className="px-1 py-2">
            <BreadcrumbNav />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

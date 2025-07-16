
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserRole } from "@/providers/UserRoleProvider";

type ProtectedRouteProps = {
  requiredRoles?: string[];
  redirectTo?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRoles,
  redirectTo = "/login",
}) => {
  const { currentUser, isLoading } = useUserRole();
  const location = useLocation();

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser) {
    // Redirect to login page with the return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has the required role(s), if specified
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(currentUser.role);
    if (!hasRequiredRole) {
      // Redirect to home page if user doesn't have the required role
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role, render the protected route
  return <Outlet />;
};


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { UserRoleProvider } from "@/providers/UserRoleProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Franchises from "./pages/Franchises";
import FranchiseEdit from "./pages/FranchiseEdit";
import FranchiseDetails from "./pages/FranchiseDetails";
import Operations from "./pages/Operations";
import Staff from "./pages/Staff";
import Schedule from "./pages/Schedule";
import LeadManagement from "./pages/LeadManagement";
import Settings from "./pages/Settings";
import Dining from "./pages/Dining";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import Offers from "./pages/Offers";
import Guests from "./pages/Guests";
import SessionsNew from "./pages/SessionsNew";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <UserRoleProvider>
        <TooltipProvider>
          <Sonner />
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Navigate to="/analytics" replace />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/dining" element={<Dining />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/sessions" element={<SessionsNew />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/guests" element={<Guests />} />
                <Route path="/lead-management" element={<LeadManagement />} />
              </Route>
              
              {/* Routes for superadmin only */}
              <Route element={<ProtectedRoute requiredRoles={["superadmin"]} />}>
                <Route path="/franchises" element={<Franchises />} />
                <Route path="/franchises/new" element={<FranchiseEdit />} />
                <Route path="/franchises/edit/:franchiseId" element={<FranchiseEdit />} />
                <Route path="/franchises/view/:franchiseId" element={<FranchiseDetails />} />
              </Route>
              
              {/* Routes for superadmin and franchise_owner */}
              <Route element={<ProtectedRoute requiredRoles={["superadmin", "franchise_owner"]} />}>
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* Routes for franchise_manager */}
              <Route element={<ProtectedRoute requiredRoles={["franchise_manager"]} />}>
                <Route path="/operations" element={<Operations />} />
              </Route>
              
              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserRoleProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

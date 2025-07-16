
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/providers/UserRoleProvider";
import { login as authLogin, LoginCredentials } from "@/services/authService";
import { toast } from "sonner";

export const useAuth = () => {
  const { setCurrentUser } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    try {
      const credentials: LoginCredentials = { email, password };
      const response = await authLogin(credentials);

      if (response.success && response.user) {
        setCurrentUser(response.user);
        toast.success(`Welcome, ${response.user.name}!`);
        
        // Get redirect path from location state or use default based on role
        const from = location.state?.from?.pathname || 
          (response.user.role === "franchise_manager" ? "/operations" : "/dashboard");
        navigate(from);
      } else {
        setError(response.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoggingIn,
    error,
    handleLogin
  };
};

// Export as both named and default export for backward compatibility
export default useAuth;

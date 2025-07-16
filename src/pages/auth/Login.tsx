
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LoginForm } from "@/components/auth/LoginForm";
import { DemoAccounts } from "@/components/auth/DemoAccounts";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { 
    email,
    setEmail,
    password, 
    setPassword,
    isLoggingIn,
    error,
    handleLogin
  } = useAuth();
  
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === "franchise_manager" ? "/operations" : "/dashboard");
    }
  }, [currentUser, navigate]);
  
  // Handle demo account selection
  const handleSelectAccount = (email: string) => {
    setEmail(email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">SkyBistro FunWay</CardTitle>
          <CardDescription>
            Sign in to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          isLoggingIn={isLoggingIn}
          onSubmit={handleLogin}
        />
        
        <CardFooter className="block pt-0">
          <DemoAccounts onSelectAccount={handleSelectAccount} />
        </CardFooter>
      </Card>
    </div>
  );
}


import React from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string | null;
  isLoggingIn: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoggingIn,
  onSubmit
}: LoginFormProps) => {
  return (
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoggingIn}
        >
          {isLoggingIn ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </CardContent>
  );
};

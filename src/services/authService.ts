
import { User, predefinedUsers } from "../providers/UserRoleProvider";

// Password map for predefined users
const userPasswords: Record<string, string> = {
  "superadmin@flydining.com": "superadmin@123",
  "franchiseowner@flydining.com": "franchise@123",
  "manager@flydining.com": "manager@123"
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Add a small delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if the email exists
  const user = predefinedUsers.find(u => u.email === credentials.email);

  if (!user) {
    return {
      success: false,
      error: "Invalid email or password"
    };
  }

  // Check if the password is correct
  const correctPassword = userPasswords[credentials.email];

  if (credentials.password !== correctPassword) {
    return {
      success: false,
      error: "Invalid email or password"
    };
  }

  // Return the user if authentication is successful
  return {
    success: true,
    user
  };
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

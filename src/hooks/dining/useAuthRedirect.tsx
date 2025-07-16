
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  // Mock authentication for demo
  const currentUser = {
    id: "user1",
    name: "Demo User",
    email: "demo@example.com",
    franchiseId: "1",
    role: "admin"
  };

  return { currentUser };
};


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/providers/UserRoleProvider";

export const useAuthRedirect = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  
  // Enforce authorization
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser && !["superadmin", "franchise_owner", "franchise_manager"].includes(currentUser.role)) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  
  return { currentUser };
};

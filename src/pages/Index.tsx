
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/providers/UserRoleProvider";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;

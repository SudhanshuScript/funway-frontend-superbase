
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useUserRole } from "@/providers/UserRoleProvider";
import FranchiseDetail from "@/components/franchise/FranchiseDetail";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";

const FranchiseDetails = () => {
  const { franchiseId } = useParams();
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const { franchises } = useFranchiseSelector();
  const [franchiseName, setFranchiseName] = useState<string>("");
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser && currentUser.role !== "superadmin") {
      navigate("/");
    }
    
    if (!franchiseId) {
      navigate("/franchises");
    }
    
    // Get franchise name if available
    if (franchiseId && franchises.length > 0) {
      const franchise = franchises.find(f => f.id === franchiseId);
      if (franchise) {
        setFranchiseName(franchise.name);
      }
    }
  }, [currentUser, navigate, franchiseId, franchises]);

  if (!currentUser || currentUser.role !== "superadmin" || !franchiseId) {
    return null;
  }

  const handleEdit = () => {
    navigate(`/franchises/edit/${franchiseId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex items-center"
          variants={itemVariants}
        >
          <Button 
            variant="ghost" 
            className="mr-4 hover:bg-primary/5 transition-all"
            onClick={() => navigate("/franchises")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Franchises
          </Button>
          <h1 className="text-2xl font-bold">Franchise Details: {franchiseName}</h1>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FranchiseDetail 
            franchiseId={franchiseId}
            onEdit={handleEdit}
          />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default FranchiseDetails;

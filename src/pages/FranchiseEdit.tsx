
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import FranchiseForm from "@/components/franchise/FranchiseForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";

const FranchiseEdit = () => {
  const { franchiseId } = useParams();
  const navigate = useNavigate();
  const { franchises } = useFranchiseSelector();
  const [franchiseName, setFranchiseName] = useState<string>("");
  
  useEffect(() => {
    if (franchiseId && franchises.length > 0) {
      const franchise = franchises.find(f => f.id === franchiseId);
      if (franchise) {
        setFranchiseName(franchise.name);
      }
    }
  }, [franchiseId, franchises]);
  
  const handleSuccess = () => {
    navigate("/franchises");
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
            className="mr-4 hover:bg-primary/5 transition-colors"
            onClick={() => navigate("/franchises")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Franchises
          </Button>
          <h1 className="text-2xl font-bold">{franchiseId ? `Edit Franchise: ${franchiseName}` : "Add New Franchise"}</h1>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FranchiseForm 
            franchiseId={franchiseId} 
            onSuccess={handleSuccess} 
          />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default FranchiseEdit;

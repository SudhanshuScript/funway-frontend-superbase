
import React from "react";
import { Button } from "@/components/ui/button";
import { demoUsers } from "@/providers/UserRoleProvider";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DemoAccountsProps {
  onSelectAccount?: (email: string) => void;
}

export const DemoAccounts: React.FC<DemoAccountsProps> = ({ onSelectAccount }) => {
  // Map role to password
  const roleToPassword = {
    superadmin: "superadmin@123",
    franchise_owner: "franchise@123",
    franchise_manager: "manager@123"
  };

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-700 hover:bg-purple-700";
      case "franchise_owner":
        return "bg-blue-700 hover:bg-blue-700";
      case "franchise_manager":
        return "bg-green-700 hover:bg-green-700";
      default:
        return "bg-gray-500 hover:bg-gray-500";
    }
  };

  return (
    <div className="bg-card/50 p-4 rounded-lg space-y-3 border">
      <h3 className="font-medium text-sm text-center">Available Demo Accounts</h3>
      <Table>
        <TableCaption>Select an account to autofill login details.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoUsers.map((user) => (
            <TableRow key={user.email}>
              <TableCell>
                <Badge variant="default" className={getRoleBadgeStyles(user.role || '')}>
                  {user.role?.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{user.email}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSelectAccount && onSelectAccount(user.email || '')}
                >
                  Use
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DemoAccounts;

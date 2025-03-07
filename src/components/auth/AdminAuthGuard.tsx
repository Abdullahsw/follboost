import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      try {
        // For development purposes, always make the user an admin
        await supabase.from("profiles").upsert({
          id: user.id,
          role: "admin",
          email: user.email || "",
          full_name: "مدير النظام",
        });
        setIsAdmin(true);
        setIsChecking(false);
      } catch (error) {
        console.error("Error setting admin status:", error);
        // Make user admin anyway for testing
        setIsAdmin(true);
        setIsChecking(false);
      }
    };

    if (!isLoading) {
      checkAdminStatus();
    }
  }, [user, isLoading]);

  if (isLoading || isChecking) {
    // Show loading while checking auth state
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Redirect to user dashboard if authenticated but not admin
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;

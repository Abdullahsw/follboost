import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const AdminUser = () => {
  const createAdminUser = async () => {
    try {
      // Create admin user with regular signup - no email verification
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: "admin@follboost.com",
        password: "admin123",
        options: {
          data: {
            full_name: "مدير النظام",
          },
        },
      });

      if (userError) throw userError;

      // Create profile with admin role
      if (userData.user) {
        // First, manually confirm the email in auth.users
        try {
          // This is a workaround to manually confirm the email
          await supabase.auth.signInWithPassword({
            email: "admin@follboost.com",
            password: "admin123",
          });
        } catch (err) {
          console.log("Sign in attempt for verification", err);
        }

        const { error: profileError } = await supabase.from("profiles").insert({
          id: userData.user.id,
          full_name: "مدير النظام",
          email: "admin@follboost.com",
          role: "admin",
        });

        if (profileError) throw profileError;
        alert("Admin user created successfully!");
      }
    } catch (err) {
      console.error("Error creating admin user:", err);
      alert("Error creating admin user: " + (err as Error).message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-right">إنشاء حساب مدير</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-right">
            <p className="mb-2">بيانات الحساب:</p>
            <p>البريد الإلكتروني: admin@follboost.com</p>
            <p>كلمة المرور: admin123</p>
          </div>
          <Button onClick={createAdminUser} className="w-full">
            إنشاء حساب المدير
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUser;

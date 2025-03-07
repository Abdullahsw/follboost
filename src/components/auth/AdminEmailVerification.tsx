import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

const AdminEmailVerification = () => {
  const [email, setEmail] = useState("admin@follboost.com");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendVerification = async () => {
    if (!email) {
      setMessage("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      // Get user by email first
      const { data: userData, error: userError } =
        await supabase.auth.admin.listUsers();

      if (userError) throw userError;

      const user = userData.users.find((u) => u.email === email);

      if (!user) {
        setMessage(`User with email ${email} not found`);
        return;
      }

      // Update user to confirm email
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true },
      );

      if (updateError) throw updateError;

      setIsSuccess(true);
      setMessage(`Email ${email} has been verified successfully!`);
    } catch (error: any) {
      setMessage(`Error: ${error.message || "An unknown error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">
          Admin Email Verification Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          {message && (
            <Alert
              className={
                isSuccess
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }
            >
              <AlertDescription
                className={isSuccess ? "text-green-800" : "text-red-800"}
              >
                {message}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSendVerification}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Verify Email"}
          </Button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Use this tool to manually verify user emails in the system. This
            bypasses the normal email verification process.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminEmailVerification;

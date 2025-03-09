import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface TransactionVerificationProps {
  transaction: any;
  onVerified: () => void;
}

const TransactionVerification: React.FC<TransactionVerificationProps> = ({
  transaction,
  onVerified,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const handleVerify = async (approved: boolean) => {
    setIsLoading(true);
    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      const adminId = userData.user?.id;

      if (!adminId) {
        throw new Error("لم يتم العثور على معرف المدير");
      }

      // Update transaction status
      const { error: updateError } = await supabase
        .from("transactions")
        .update({
          status: approved ? "completed" : "cancelled",
          payment_verified: approved,
          verification_date: new Date().toISOString(),
          verified_by: adminId,
          admin_notes: adminNotes || null,
        })
        .eq("id", transaction.id);

      if (updateError) throw updateError;

      // If approved, update user balance
      if (approved) {
        // Get current user balance
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("balance")
          .eq("id", transaction.user_id)
          .single();

        if (profileError) throw profileError;

        const currentBalance = profileData?.balance || 0;
        const newBalance = currentBalance + transaction.amount;

        // Update user balance
        const { error: balanceError } = await supabase
          .from("profiles")
          .update({ balance: newBalance })
          .eq("id", transaction.user_id);

        if (balanceError) throw balanceError;
      }

      // Notify parent component
      onVerified();
    } catch (error) {
      console.error("Error verifying transaction:", error);
      setError(error.message || "حدث خطأ أثناء التحقق من المعاملة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-right">
          التحقق من معاملة الدفع
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">خطأ</AlertTitle>
            <AlertDescription className="text-right">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 text-right">رقم المعاملة</p>
              <p className="font-medium text-right">{transaction.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 text-right">المستخدم</p>
              <p className="font-medium text-right">{transaction.user_id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 text-right">المبلغ</p>
              <p className="font-medium text-right">
                {transaction.amount.toFixed(2)} ر.س
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 text-right">طريقة الدفع</p>
              <p className="font-medium text-right">
                {transaction.payment_method}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 text-right">التاريخ</p>
              <p className="font-medium text-right">
                {new Date(transaction.created_at).toLocaleString("ar-SA")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 text-right">الحالة</p>
              <Badge
                className={
                  transaction.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : transaction.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {transaction.status === "completed"
                  ? "مكتمل"
                  : transaction.status === "pending"
                    ? "قيد الانتظار"
                    : "ملغي"}
              </Badge>
            </div>
          </div>

          {transaction.payment_proof_text && (
            <div className="space-y-2 bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-right">
                رقم العملية / نص الإثبات
              </p>
              <p className="text-right">{transaction.payment_proof_text}</p>
            </div>
          )}

          {transaction.payment_proof_image && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-right">صورة إثبات الدفع</p>
              <div className="relative">
                <img
                  src={transaction.payment_proof_image}
                  alt="إثبات الدفع"
                  className="max-h-64 rounded-md mx-auto"
                  onError={(e) => {
                    // If image fails to load, show a placeholder
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${transaction.id}&text=Payment`;
                    console.log("Image failed to load, using placeholder");
                  }}
                />
                <a
                  href={transaction.payment_proof_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-white p-1 rounded-md shadow-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-right">ملاحظات المدير</p>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="أدخل ملاحظات حول هذه المعاملة (اختياري)"
              className="text-right"
              rows={3}
            />
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <Button
              variant="destructive"
              onClick={() => handleVerify(false)}
              disabled={isLoading}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              رفض المعاملة
            </Button>
            <Button
              variant="default"
              onClick={() => handleVerify(true)}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              قبول وإضافة الرصيد
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionVerification;

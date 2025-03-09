import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface UserBalanceManagerProps {
  userId: string;
  onBalanceUpdated?: () => void;
}

const UserBalanceManager: React.FC<UserBalanceManagerProps> = ({
  userId,
  onBalanceUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<any[]>([]);

  // Form data for adding funds
  const [fundsData, setFundsData] = useState({
    amount: 0,
    notes: "",
    paymentMethod: "",
  });

  // Load user data and transactions on component mount
  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchUserTransactions();
      fetchPaymentOptions();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setError("");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("حدث خطأ أثناء جلب بيانات المستخدم");
    }
  };

  const fetchUserTransactions = async () => {
    try {
      setError("");
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("حدث خطأ أثناء جلب سجل المعاملات");
    }
  };

  const fetchPaymentOptions = async () => {
    try {
      setError("");
      const { data, error } = await supabase
        .from("payment_options")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      setPaymentOptions(data || []);
    } catch (error) {
      console.error("Error fetching payment options:", error);
      setError("حدث خطأ أثناء جلب خيارات الدفع");
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validate input
      if (fundsData.amount <= 0) {
        throw new Error("يجب أن يكون المبلغ أكبر من صفر");
      }

      if (!fundsData.paymentMethod) {
        throw new Error("يرجى اختيار طريقة الدفع");
      }

      // Start a transaction
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      const currentBalance = userData?.balance || 0;
      const newBalance = currentBalance + fundsData.amount;

      // Update user balance
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: userId,
            amount: fundsData.amount,
            type: "credit",
            payment_method: fundsData.paymentMethod,
            notes: fundsData.notes || "إضافة رصيد بواسطة المدير",
            status: "completed",
            admin_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ]);

      if (transactionError) throw transactionError;

      setSuccess(true);
      setFundsData({ amount: 0, notes: "", paymentMethod: "" });

      // Refresh user data and transactions
      fetchUserData();
      fetchUserTransactions();

      // Call the callback if provided
      if (onBalanceUpdated) {
        onBalanceUpdated();
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding funds:", error);
      setError(error.message || "حدث خطأ أثناء إضافة الرصيد");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeductFunds = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validate input
      if (fundsData.amount <= 0) {
        throw new Error("يجب أن يكون المبلغ أكبر من صفر");
      }

      // Start a transaction
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      const currentBalance = userData?.balance || 0;

      // Check if user has enough balance
      if (currentBalance < fundsData.amount) {
        throw new Error("رصيد المستخدم غير كافٍ لإجراء هذه العملية");
      }

      const newBalance = currentBalance - fundsData.amount;

      // Update user balance
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: userId,
            amount: fundsData.amount,
            type: "debit",
            payment_method: "admin",
            notes: fundsData.notes || "خصم رصيد بواسطة المدير",
            status: "completed",
            admin_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ]);

      if (transactionError) throw transactionError;

      setSuccess(true);
      setFundsData({ amount: 0, notes: "", paymentMethod: "" });

      // Refresh user data and transactions
      fetchUserData();
      fetchUserTransactions();

      // Call the callback if provided
      if (onBalanceUpdated) {
        onBalanceUpdated();
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error deducting funds:", error);
      setError(error.message || "حدث خطأ أثناء خصم الرصيد");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <Card className="w-full bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-gray-500">جاري تحميل بيانات المستخدم...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-right">
          إدارة رصيد المستخدم
        </CardTitle>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
            <AlertDescription className="text-right">
              تم تحديث رصيد المستخدم بنجاح.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">خطأ</AlertTitle>
            <AlertDescription className="text-right">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-right">
                  الرصيد الحالي
                </h3>
              </div>
              <p className="text-3xl font-bold text-center">
                {userData.balance?.toFixed(2) || "0.00"} ر.س
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-right">
                آخر المعاملات
              </h3>
              {transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
                    >
                      <div className="text-left">
                        <span
                          className={
                            transaction.type === "credit"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {transaction.amount.toFixed(2)} ر.س
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {transaction.payment_method}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.created_at).toLocaleString(
                            "ar-SA",
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  لا توجد معاملات سابقة لهذا المستخدم
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-right mb-4">
                إضافة رصيد
              </h3>
              <form onSubmit={handleAddFunds} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="add-amount" className="text-right block">
                    المبلغ (ر.س)
                  </Label>
                  <Input
                    id="add-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={fundsData.amount || ""}
                    onChange={(e) =>
                      setFundsData({
                        ...fundsData,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="text-right"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method" className="text-right block">
                    طريقة الدفع
                  </Label>
                  <Select
                    value={fundsData.paymentMethod}
                    onValueChange={(value) =>
                      setFundsData({
                        ...fundsData,
                        paymentMethod: value,
                      })
                    }
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">إضافة يدوية (مدير)</SelectItem>
                      {paymentOptions.map((option) => (
                        <SelectItem key={option.id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-notes" className="text-right block">
                    ملاحظات
                  </Label>
                  <Textarea
                    id="add-notes"
                    value={fundsData.notes}
                    onChange={(e) =>
                      setFundsData({
                        ...fundsData,
                        notes: e.target.value,
                      })
                    }
                    placeholder="أدخل أي ملاحظات إضافية هنا"
                    className="text-right"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "جاري التنفيذ..." : "إضافة الرصيد"}
                </Button>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-right mb-4">
                خصم رصيد
              </h3>
              <form onSubmit={handleDeductFunds} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deduct-amount" className="text-right block">
                    المبلغ (ر.س)
                  </Label>
                  <Input
                    id="deduct-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={userData.balance || 0}
                    value={fundsData.amount || ""}
                    onChange={(e) =>
                      setFundsData({
                        ...fundsData,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="text-right"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deduct-notes" className="text-right block">
                    سبب الخصم
                  </Label>
                  <Textarea
                    id="deduct-notes"
                    value={fundsData.notes}
                    onChange={(e) =>
                      setFundsData({
                        ...fundsData,
                        notes: e.target.value,
                      })
                    }
                    placeholder="أدخل سبب خصم الرصيد"
                    className="text-right"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري التنفيذ..." : "خصم الرصيد"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBalanceManager;

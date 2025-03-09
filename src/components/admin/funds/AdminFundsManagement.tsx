import React, { useState, useEffect } from "react";
import PaymentMethodForm from "./PaymentMethodForm";
import TransactionVerification from "./TransactionVerification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  Edit,
  Trash,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const AdminFundsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  const [isDeductFundsDialogOpen, setIsDeductFundsDialogOpen] = useState(false);
  const [isViewTransactionsDialogOpen, setIsViewTransactionsDialogOpen] =
    useState(false);
  const [isVerifyTransactionDialogOpen, setIsVerifyTransactionDialogOpen] =
    useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<any[]>([]);
  const [isAddPaymentOptionDialogOpen, setIsAddPaymentOptionDialogOpen] =
    useState(false);
  const [isEditPaymentOptionDialogOpen, setIsEditPaymentOptionDialogOpen] =
    useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<any>(null);

  // Form data for adding/deducting funds
  const [fundsData, setFundsData] = useState({
    amount: 0,
    notes: "",
    paymentMethod: "",
  });

  // Form data for payment options
  const [paymentOptionData, setPaymentOptionData] = useState({
    name: "",
    description: "",
    isActive: true,
    processingFee: 0,
    minAmount: 0,
    maxAmount: 0,
    instructions: "",
  });

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
    fetchPaymentOptions();
  }, []);

  const fetchUsers = async () => {
    try {
      setError("");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("حدث خطأ أثناء جلب بيانات المستخدمين");
    }
  };

  const fetchPaymentOptions = async () => {
    try {
      setError("");
      const { data, error } = await supabase
        .from("payment_options")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPaymentOptions(data || []);
    } catch (error) {
      console.error("Error fetching payment options:", error);
      setError("حدث خطأ أثناء جلب خيارات الدفع");
    }
  };

  const fetchUserTransactions = async (userId: string) => {
    try {
      setError("");
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("حدث خطأ أثناء جلب سجل المعاملات");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);
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
        .eq("id", selectedUser.id)
        .single();

      if (userError) throw userError;

      const currentBalance = userData?.balance || 0;
      const newBalance = currentBalance + fundsData.amount;

      // Update user balance
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", selectedUser.id);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: selectedUser.id,
            amount: fundsData.amount,
            type: "credit",
            payment_method: fundsData.paymentMethod,
            notes: fundsData.notes || "إضافة رصيد بواسطة المدير",
            status: "completed",
            admin_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ]);

      if (transactionError) throw transactionError;

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, balance: newBalance } : user,
        ),
      );

      setSuccess(true);
      setFundsData({ amount: 0, notes: "", paymentMethod: "" });
      setIsAddFundsDialogOpen(false);

      // Refresh user data
      fetchUsers();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding funds:", error);
      setError(error.message || "حدث خطأ أثناء إضافة الرصيد");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeductFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);
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
        .eq("id", selectedUser.id)
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
        .eq("id", selectedUser.id);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: selectedUser.id,
            amount: fundsData.amount,
            type: "debit",
            payment_method: "admin",
            notes: fundsData.notes || "خصم رصيد بواسطة المدير",
            status: "completed",
            admin_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ]);

      if (transactionError) throw transactionError;

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, balance: newBalance } : user,
        ),
      );

      setSuccess(true);
      setFundsData({ amount: 0, notes: "", paymentMethod: "" });
      setIsDeductFundsDialogOpen(false);

      // Refresh user data
      fetchUsers();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error deducting funds:", error);
      setError(error.message || "حدث خطأ أثناء خصم الرصيد");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPaymentOption = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      // Validate input
      if (!paymentOptionData.name) {
        throw new Error("يرجى إدخال اسم وسيلة الدفع");
      }

      // Add payment option
      const { error: insertError } = await supabase
        .from("payment_options")
        .insert([
          {
            name: paymentOptionData.name,
            description: paymentOptionData.description,
            is_active: paymentOptionData.isActive,
            processing_fee: paymentOptionData.processingFee,
            min_amount: paymentOptionData.minAmount,
            max_amount: paymentOptionData.maxAmount,
            instructions: paymentOptionData.instructions,
          },
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setPaymentOptionData({
        name: "",
        description: "",
        isActive: true,
        processingFee: 0,
        minAmount: 0,
        maxAmount: 0,
        instructions: "",
      });
      setIsAddPaymentOptionDialogOpen(false);

      // Refresh payment options
      fetchPaymentOptions();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding payment option:", error);
      setError(error.message || "حدث خطأ أثناء إضافة وسيلة الدفع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPaymentOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentOption) return;

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      // Validate input
      if (!paymentOptionData.name) {
        throw new Error("يرجى إدخال اسم وسيلة الدفع");
      }

      // Update payment option
      const { error: updateError } = await supabase
        .from("payment_options")
        .update({
          name: paymentOptionData.name,
          description: paymentOptionData.description,
          is_active: paymentOptionData.isActive,
          processing_fee: paymentOptionData.processingFee,
          min_amount: paymentOptionData.minAmount,
          max_amount: paymentOptionData.maxAmount,
          instructions: paymentOptionData.instructions,
        })
        .eq("id", selectedPaymentOption.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setPaymentOptionData({
        name: "",
        description: "",
        isActive: true,
        processingFee: 0,
        minAmount: 0,
        maxAmount: 0,
        instructions: "",
      });
      setIsEditPaymentOptionDialogOpen(false);

      // Refresh payment options
      fetchPaymentOptions();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating payment option:", error);
      setError(error.message || "حدث خطأ أثناء تحديث وسيلة الدفع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePaymentOption = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف وسيلة الدفع هذه؟")) return;

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      // Delete payment option
      const { error: deleteError } = await supabase
        .from("payment_options")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setSuccess(true);

      // Refresh payment options
      fetchPaymentOptions();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting payment option:", error);
      setError(error.message || "حدث خطأ أثناء حذف وسيلة الدفع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id?.includes(searchQuery),
      )
    : users;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إدارة الأرصدة والمدفوعات
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم تنفيذ العملية بنجاح.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-right">خطأ</AlertTitle>
          <AlertDescription className="text-right">{error}</AlertDescription>
        </Alert>
      )}

      <Dialog
        open={isVerifyTransactionDialogOpen}
        onOpenChange={(open) => {
          setIsVerifyTransactionDialogOpen(open);
          if (!open) {
            setSelectedTransaction(null);
          }
        }}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="text-right">
              التحقق من معاملة الدفع
            </DialogTitle>
            <DialogDescription className="text-right">
              مراجعة وتأكيد معاملة الدفع للمستخدم
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <TransactionVerification
              transaction={selectedTransaction}
              onVerified={() => {
                setIsVerifyTransactionDialogOpen(false);
                fetchUsers();
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="users" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="users">إدارة أرصدة المستخدمين</TabsTrigger>
          <TabsTrigger value="payment-options">خيارات الدفع</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <form onSubmit={handleSearch} className="w-full md:w-1/2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني..."
                      className="pl-10 pr-4 w-full text-right"
                      dir="rtl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
                <CardTitle className="text-xl font-bold text-right">
                  أرصدة المستخدمين
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المعرف</TableHead>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">
                        البريد الإلكتروني
                      </TableHead>
                      <TableHead className="text-right">
                        الرصيد الحالي
                      </TableHead>
                      <TableHead className="text-right">
                        تاريخ التسجيل
                      </TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{user.full_name || "غير محدد"}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                (user.balance || 0) > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {user.balance?.toFixed(2) || "0.00"} ر.س
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString(
                              "ar-SA",
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog
                                open={
                                  isAddFundsDialogOpen &&
                                  selectedUser?.id === user.id
                                }
                                onOpenChange={(open) => {
                                  setIsAddFundsDialogOpen(open);
                                  if (open) setSelectedUser(user);
                                  else setSelectedUser(null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    إضافة رصيد
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className="max-w-md max-h-[90vh] overflow-y-auto"
                                  dir="rtl"
                                >
                                  <DialogHeader>
                                    <DialogTitle className="text-right">
                                      إضافة رصيد للمستخدم
                                    </DialogTitle>
                                    <DialogDescription className="text-right">
                                      {user.full_name || user.email}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form
                                    onSubmit={handleAddFunds}
                                    className="space-y-4"
                                  >
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="amount"
                                        className="text-right block"
                                      >
                                        المبلغ (ر.س)
                                      </Label>
                                      <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={fundsData.amount || ""}
                                        onChange={(e) =>
                                          setFundsData({
                                            ...fundsData,
                                            amount:
                                              parseFloat(e.target.value) || 0,
                                          })
                                        }
                                        className="text-right"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="payment-method"
                                        className="text-right block"
                                      >
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
                                          <SelectItem value="admin">
                                            إضافة يدوية (مدير)
                                          </SelectItem>
                                          <SelectItem value="bank_transfer">
                                            تحويل بنكي
                                          </SelectItem>
                                          <SelectItem value="credit_card">
                                            بطاقة ائتمان
                                          </SelectItem>
                                          <SelectItem value="paypal">
                                            PayPal
                                          </SelectItem>
                                          <SelectItem value="other">
                                            أخرى
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="notes"
                                        className="text-right block"
                                      >
                                        ملاحظات
                                      </Label>
                                      <Textarea
                                        id="notes"
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
                                    <DialogFooter className="mt-4">
                                      <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                      >
                                        {isSubmitting
                                          ? "جاري التنفيذ..."
                                          : "إضافة الرصيد"}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>

                              <Dialog
                                open={
                                  isDeductFundsDialogOpen &&
                                  selectedUser?.id === user.id
                                }
                                onOpenChange={(open) => {
                                  setIsDeductFundsDialogOpen(open);
                                  if (open) setSelectedUser(user);
                                  else setSelectedUser(null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500"
                                  >
                                    خصم رصيد
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className="max-w-md max-h-[90vh] overflow-y-auto"
                                  dir="rtl"
                                >
                                  <DialogHeader>
                                    <DialogTitle className="text-right">
                                      خصم رصيد من المستخدم
                                    </DialogTitle>
                                    <DialogDescription className="text-right">
                                      {user.full_name || user.email}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form
                                    onSubmit={handleDeductFunds}
                                    className="space-y-4"
                                  >
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="amount"
                                        className="text-right block"
                                      >
                                        المبلغ (ر.س)
                                      </Label>
                                      <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={user.balance || 0}
                                        value={fundsData.amount || ""}
                                        onChange={(e) =>
                                          setFundsData({
                                            ...fundsData,
                                            amount:
                                              parseFloat(e.target.value) || 0,
                                          })
                                        }
                                        className="text-right"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="notes"
                                        className="text-right block"
                                      >
                                        سبب الخصم
                                      </Label>
                                      <Textarea
                                        id="notes"
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
                                    <DialogFooter className="mt-4">
                                      <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={isSubmitting}
                                      >
                                        {isSubmitting
                                          ? "جاري التنفيذ..."
                                          : "خصم الرصيد"}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>

                              <Dialog
                                open={
                                  isViewTransactionsDialogOpen &&
                                  selectedUser?.id === user.id
                                }
                                onOpenChange={(open) => {
                                  setIsViewTransactionsDialogOpen(open);
                                  if (open) {
                                    setSelectedUser(user);
                                    fetchUserTransactions(user.id);
                                  } else setSelectedUser(null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    سجل المعاملات
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className="max-w-4xl max-h-[90vh] overflow-y-auto"
                                  dir="rtl"
                                >
                                  <DialogHeader>
                                    <DialogTitle className="text-right">
                                      سجل معاملات المستخدم
                                    </DialogTitle>
                                    <DialogDescription className="text-right">
                                      {user.full_name || user.email}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="overflow-x-auto">
                                    <Table dir="rtl">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-right">
                                            المعرف
                                          </TableHead>
                                          <TableHead className="text-right">
                                            التاريخ
                                          </TableHead>
                                          <TableHead className="text-right">
                                            النوع
                                          </TableHead>
                                          <TableHead className="text-right">
                                            المبلغ
                                          </TableHead>
                                          <TableHead className="text-right">
                                            طريقة الدفع
                                          </TableHead>
                                          <TableHead className="text-right">
                                            الحالة
                                          </TableHead>
                                          <TableHead className="text-right">
                                            ملاحظات
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {transactions.length > 0 ? (
                                          transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                              <TableCell className="font-medium">
                                                {transaction.id.substring(0, 8)}
                                                ...
                                              </TableCell>
                                              <TableCell>
                                                {new Date(
                                                  transaction.created_at,
                                                ).toLocaleString("ar-SA")}
                                              </TableCell>
                                              <TableCell>
                                                <Badge
                                                  className={
                                                    transaction.type ===
                                                    "credit"
                                                      ? "bg-green-100 text-green-800"
                                                      : "bg-red-100 text-red-800"
                                                  }
                                                >
                                                  {transaction.type === "credit"
                                                    ? "إيداع"
                                                    : "سحب"}
                                                </Badge>
                                              </TableCell>
                                              <TableCell>
                                                {transaction.amount.toFixed(2)}{" "}
                                                ر.س
                                              </TableCell>
                                              <TableCell>
                                                {transaction.payment_method}
                                              </TableCell>
                                              <TableCell>
                                                <div className="flex items-center gap-2">
                                                  <Badge
                                                    className={
                                                      transaction.status ===
                                                      "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : transaction.status ===
                                                            "pending"
                                                          ? "bg-yellow-100 text-yellow-800"
                                                          : "bg-red-100 text-red-800"
                                                    }
                                                  >
                                                    {transaction.status ===
                                                    "completed"
                                                      ? "مكتمل"
                                                      : transaction.status ===
                                                          "pending"
                                                        ? "قيد الانتظار"
                                                        : "ملغي"}
                                                  </Badge>
                                                  {transaction.status ===
                                                    "pending" && (
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      className="h-7 px-2 text-xs"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedUser(user);
                                                        setSelectedTransaction(
                                                          transaction,
                                                        );
                                                        setIsVerifyTransactionDialogOpen(
                                                          true,
                                                        );
                                                      }}
                                                    >
                                                      تحقق
                                                    </Button>
                                                  )}
                                                </div>
                                              </TableCell>
                                              <TableCell>
                                                {transaction.notes || "-"}
                                              </TableCell>
                                            </TableRow>
                                          ))
                                        ) : (
                                          <TableRow>
                                            <TableCell
                                              colSpan={7}
                                              className="text-center py-4"
                                            >
                                              لا توجد معاملات لهذا المستخدم
                                            </TableCell>
                                          </TableRow>
                                        )}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          لا توجد نتائج مطابقة للبحث
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-options">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Dialog
                  open={isAddPaymentOptionDialogOpen}
                  onOpenChange={setIsAddPaymentOptionDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة وسيلة دفع جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="max-w-md max-h-[90vh] overflow-y-auto"
                    dir="rtl"
                  >
                    <DialogHeader>
                      <DialogTitle className="text-right">
                        إضافة وسيلة دفع جديدة
                      </DialogTitle>
                      <DialogDescription className="text-right">
                        أدخل بيانات وسيلة الدفع الجديدة
                      </DialogDescription>
                    </DialogHeader>
                    <PaymentMethodForm
                      onSuccess={() => {
                        setIsAddPaymentOptionDialogOpen(false);
                        fetchPaymentOptions();
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 3000);
                      }}
                      onCancel={() => setIsAddPaymentOptionDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <CardTitle className="text-xl font-bold text-right">
                  وسائل الدفع المتاحة
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">
                        رسوم المعالجة
                      </TableHead>
                      <TableHead className="text-right">الحد الأدنى</TableHead>
                      <TableHead className="text-right">الحد الأقصى</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentOptions.length > 0 ? (
                      paymentOptions.map((option) => (
                        <TableRow key={option.id}>
                          <TableCell className="font-medium">
                            {option.name}
                          </TableCell>
                          <TableCell>{option.description || "-"}</TableCell>
                          <TableCell>{option.processing_fee}%</TableCell>
                          <TableCell>{option.min_amount} ر.س</TableCell>
                          <TableCell>{option.max_amount} ر.س</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                option.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {option.is_active ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog
                                open={
                                  isEditPaymentOptionDialogOpen &&
                                  selectedPaymentOption?.id === option.id
                                }
                                onOpenChange={(open) => {
                                  setIsEditPaymentOptionDialogOpen(open);
                                  if (open) {
                                    setSelectedPaymentOption(option);
                                  } else setSelectedPaymentOption(null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className="max-w-md max-h-[90vh] overflow-y-auto"
                                  dir="rtl"
                                >
                                  <DialogHeader>
                                    <DialogTitle className="text-right">
                                      تعديل وسيلة الدفع
                                    </DialogTitle>
                                    <DialogDescription className="text-right">
                                      {option.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <PaymentMethodForm
                                    initialData={option}
                                    isEdit={true}
                                    onSuccess={() => {
                                      setIsEditPaymentOptionDialogOpen(false);
                                      fetchPaymentOptions();
                                      setSuccess(true);
                                      setTimeout(() => setSuccess(false), 3000);
                                    }}
                                    onCancel={() =>
                                      setIsEditPaymentOptionDialogOpen(false)
                                    }
                                  />
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() =>
                                  handleDeletePaymentOption(option.id)
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          لا توجد وسائل دفع متاحة. قم بإضافة وسيلة دفع جديدة.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFundsManagement;

import React, { useState, useEffect } from "react";
import PaymentProofUploader from "./PaymentProofUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, CreditCard, Wallet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const AddFundsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is logged in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
          إضافة رصيد
        </h1>
        <Card className="w-full bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="text-center py-4">
              <p className="text-gray-500">يرجى تسجيل الدخول أولاً</p>
              <Button className="mt-4" onClick={() => navigate("/login")}>
                تسجيل الدخول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [amount, setAmount] = useState(100);
  const [activeStep, setActiveStep] = useState(0);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paymentOptions, setPaymentOptions] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);

  // Fetch payment options on component mount
  useEffect(() => {
    fetchPaymentOptions();
  }, []);

  const fetchPaymentOptions = async () => {
    try {
      const { data, error } = await supabase
        .from("payment_options")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }
      setPaymentOptions(data || []);
    } catch (error) {
      console.error("Error fetching payment options:", error);
      setError("حدث خطأ أثناء جلب خيارات الدفع");
    }
  };

  const handleSelectPaymentMethod = (method: any) => {
    setSelectedPaymentMethod(method);
    setActiveStep(1);
  };

  const handleSubmitPayment = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      if (!selectedPaymentMethod) {
        throw new Error("يرجى اختيار طريقة دفع");
      }

      if (amount < (selectedPaymentMethod.min_amount || 0)) {
        throw new Error(
          `الحد الأدنى للمبلغ هو ${selectedPaymentMethod.min_amount} ر.س`,
        );
      }

      if (
        selectedPaymentMethod.max_amount > 0 &&
        amount > selectedPaymentMethod.max_amount
      ) {
        throw new Error(
          `الحد الأقصى للمبلغ هو ${selectedPaymentMethod.max_amount} ر.س`,
        );
      }

      // Calculate processing fee if any
      const processingFee =
        (amount * (selectedPaymentMethod.processing_fee || 0)) / 100;
      const totalAmount = amount + processingFee;

      // Create transaction record
      try {
        const { data: transaction, error: transactionError } = await supabase
          .from("transactions")
          .insert([
            {
              user_id: user.id,
              amount: amount,
              type: "credit",
              payment_method: selectedPaymentMethod.name,
              notes: `إضافة رصيد عبر ${selectedPaymentMethod.name}`,
              status: "pending",
              processing_fee: processingFee,
            },
          ])
          .select()
          .single();

        if (transactionError) {
          console.error("Transaction error:", transactionError);
          throw transactionError;
        }

        if (!transaction) {
          throw new Error("لم يتم إنشاء المعاملة بشكل صحيح");
        }

        setCurrentTransaction(transaction);
        setSuccess(true);
      } catch (txError) {
        console.error("Error in transaction creation:", txError);
        throw new Error(
          "فشل في إنشاء المعاملة: " + (txError.message || "خطأ غير معروف"),
        );
      }

      // If payment method requires proof, go to proof step, otherwise go to confirmation
      if (selectedPaymentMethod.requires_proof) {
        setActiveStep(3); // Move to proof upload step
      } else {
        setActiveStep(2); // Move to confirmation step
      }

      // Reset form
      setAmount(0);
    } catch (error) {
      console.error("Error submitting payment:", error);
      setError(error.message || "حدث خطأ أثناء إرسال طلب الدفع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const predefinedAmounts = [50, 100, 200, 500, 1000];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إضافة رصيد
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت إضافة الطلب بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم إنشاء طلب إضافة رصيد بقيمة {amount} ر.س بنجاح.
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

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            {activeStep === 0
              ? "اختر طريقة الدفع"
              : activeStep === 1
                ? "تفاصيل الدفع"
                : activeStep === 3
                  ? "إثبات الدفع"
                  : "تأكيد الطلب"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelectPaymentMethod(option)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {option.name.includes("بنك") ? (
                          <Wallet className="h-5 w-5 text-primary" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <h3 className="font-semibold text-right">
                        {option.name}
                      </h3>
                    </div>
                    {option.description && (
                      <p className="text-sm text-gray-500 text-right mb-2">
                        {option.description}
                      </p>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>
                        {option.processing_fee > 0
                          ? `رسوم: ${option.processing_fee}%`
                          : "بدون رسوم"}
                      </span>
                      <span>
                        {option.min_amount > 0
                          ? `الحد الأدنى: ${option.min_amount} ر.س`
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {paymentOptions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    لا توجد وسائل دفع متاحة حالياً. يرجى التواصل مع الإدارة.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-right block">اختر المبلغ</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {predefinedAmounts.map((predefinedAmount) => (
                    <Button
                      key={predefinedAmount}
                      type="button"
                      variant={
                        amount === predefinedAmount ? "default" : "outline"
                      }
                      onClick={() => setAmount(predefinedAmount)}
                    >
                      {predefinedAmount} ر.س
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="custom-amount" className="shrink-0">
                    مبلغ آخر:
                  </Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="10"
                    step="10"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="w-32"
                  />
                  <span>ر.س</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-semibold text-blue-800 mb-2 text-right">
                  تعليمات الدفع
                </h4>
                <div className="text-blue-700 text-right text-sm">
                  {selectedPaymentMethod?.instructions ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedPaymentMethod.instructions.replace(
                          /\n/g,
                          "<br />",
                        ),
                      }}
                    />
                  ) : (
                    <p>
                      يرجى اتباع تعليمات الدفع المرسلة إلى بريدك الإلكتروني.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveStep(0);
                    setSelectedPaymentMethod(null);
                  }}
                >
                  رجوع
                </Button>
                <Button
                  onClick={handleSubmitPayment}
                  disabled={isSubmitting || amount <= 0}
                >
                  {isSubmitting ? "جاري المعالجة..." : "متابعة"}
                </Button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  تم استلام طلب الدفع بنجاح
                </h3>
                <p className="text-green-700">
                  سيتم مراجعة طلبك وإضافة الرصيد إلى حسابك في أقرب وقت ممكن.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-semibold text-blue-800 mb-2 text-right">
                  تعليمات إتمام الدفع
                </h4>
                <div className="text-blue-700 text-right text-sm">
                  {selectedPaymentMethod?.instructions ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedPaymentMethod.instructions.replace(
                          /\n/g,
                          "<br />",
                        ),
                      }}
                    />
                  ) : (
                    <p>
                      يرجى اتباع تعليمات الدفع المرسلة إلى بريدك الإلكتروني.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveStep(0);
                    setSelectedPaymentMethod(null);
                    setSuccess(false);
                  }}
                >
                  العودة للبداية
                </Button>
                <Button
                  onClick={() => {
                    navigate("/dashboard/orders");
                  }}
                >
                  عرض المعاملات
                </Button>
              </div>
            </div>
          )}

          {activeStep === 3 && currentTransaction && selectedPaymentMethod && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <h3 className="font-semibold text-blue-800 mb-2 text-right">
                  إثبات الدفع
                </h3>
                <p className="text-blue-700 text-right text-sm">
                  يرجى إرفاق إثبات الدفع لإتمام عملية إضافة الرصيد
                </p>
              </div>

              <PaymentProofUploader
                paymentMethod={selectedPaymentMethod}
                transactionId={currentTransaction.id}
                onSuccess={() => {
                  setActiveStep(2); // Move to confirmation step after proof upload
                }}
              />

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setActiveStep(1); // Go back to payment method step
                }}
              >
                رجوع
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            سجل المعاملات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" dir="rtl">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    رقم العملية
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    التاريخ
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    المبلغ
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    طريقة الدفع
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">TRX-001</td>
                  <td className="py-3 px-4 text-gray-800">2023-06-15</td>
                  <td className="py-3 px-4 text-gray-800">100 ر.س</td>
                  <td className="py-3 px-4 text-gray-800">بطاقة ائتمان</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      مكتمل
                    </span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">TRX-002</td>
                  <td className="py-3 px-4 text-gray-800">2023-06-10</td>
                  <td className="py-3 px-4 text-gray-800">200 ر.س</td>
                  <td className="py-3 px-4 text-gray-800">تحويل بنكي</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      مكتمل
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">TRX-003</td>
                  <td className="py-3 px-4 text-gray-800">2023-06-05</td>
                  <td className="py-3 px-4 text-gray-800">50 ر.س</td>
                  <td className="py-3 px-4 text-gray-800">محفظة إلكترونية</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      مكتمل
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFundsPage;

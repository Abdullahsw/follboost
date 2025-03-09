import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

interface PaymentMethodFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isEdit = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    isActive: initialData?.is_active ?? true,
    processingFee: initialData?.processing_fee || 0,
    minAmount: initialData?.min_amount || 0,
    maxAmount: initialData?.max_amount || 0,
    instructions: initialData?.instructions || "",
    requiresProof: initialData?.requires_proof ?? true,
    proofInstructions:
      initialData?.proof_instructions ||
      "يرجى إرفاق صورة إيصال الدفع أو رقم العملية",
    proofType: initialData?.proof_type || "text",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validate input
      if (!formData.name) {
        throw new Error("يرجى إدخال اسم وسيلة الدفع");
      }

      const paymentMethodData = {
        name: formData.name,
        description: formData.description,
        is_active: formData.isActive,
        processing_fee: parseFloat(formData.processingFee.toString()) || 0,
        min_amount: parseFloat(formData.minAmount.toString()) || 0,
        max_amount: parseFloat(formData.maxAmount.toString()) || 0,
        instructions: formData.instructions,
        requires_proof: formData.requiresProof,
        proof_instructions: formData.proofInstructions,
        proof_type: formData.proofType,
      };

      if (isEdit && initialData?.id) {
        // Update existing payment method
        const { error: updateError } = await supabase
          .from("payment_options")
          .update(paymentMethodData)
          .eq("id", initialData.id);

        if (updateError) throw updateError;
      } else {
        // Add new payment method
        const { error: insertError } = await supabase
          .from("payment_options")
          .insert([paymentMethodData]);

        if (insertError) throw insertError;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error saving payment method:", error);
      setError(error.message || "حدث خطأ أثناء حفظ وسيلة الدفع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم {isEdit ? "تحديث" : "إضافة"} وسيلة الدفع بنجاح.
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

      <div className="space-y-2">
        <Label htmlFor="name" className="text-right block">
          اسم وسيلة الدفع
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="مثال: تحويل بنكي، بطاقة ائتمان"
          className="text-right"
          required
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-right block">
          وصف وسيلة الدفع
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="وصف مختصر لوسيلة الدفع"
          className="text-right"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="processingFee" className="text-right block">
            رسوم المعالجة (%)
          </Label>
          <Input
            id="processingFee"
            name="processingFee"
            type="number"
            step="0.01"
            min="0"
            value={formData.processingFee}
            onChange={handleChange}
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="isActive" className="text-right block">
            الحالة
          </Label>
          <div className="flex items-center justify-end space-x-2 space-x-reverse">
            <Label htmlFor="isActive" className="text-right">
              {formData.isActive ? "نشط" : "غير نشط"}
            </Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleSwitchChange("isActive", checked)
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minAmount" className="text-right block">
            الحد الأدنى للمبلغ
          </Label>
          <Input
            id="minAmount"
            name="minAmount"
            type="number"
            step="0.01"
            min="0"
            value={formData.minAmount}
            onChange={handleChange}
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxAmount" className="text-right block">
            الحد الأقصى للمبلغ
          </Label>
          <Input
            id="maxAmount"
            name="maxAmount"
            type="number"
            step="0.01"
            min="0"
            value={formData.maxAmount}
            onChange={handleChange}
            className="text-right"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requiresProof" className="text-right block">
          طلب إثبات الدفع
        </Label>
        <div className="flex items-center justify-end space-x-2 space-x-reverse">
          <Label htmlFor="requiresProof" className="text-right">
            {formData.requiresProof ? "مطلوب" : "غير مطلوب"}
          </Label>
          <Switch
            id="requiresProof"
            checked={formData.requiresProof}
            onCheckedChange={(checked) =>
              handleSwitchChange("requiresProof", checked)
            }
          />
        </div>
      </div>

      {formData.requiresProof && (
        <>
          <div className="space-y-2">
            <Label htmlFor="proofType" className="text-right block">
              نوع إثبات الدفع
            </Label>
            <Select
              value={formData.proofType}
              onValueChange={(value) => handleSelectChange("proofType", value)}
            >
              <SelectTrigger id="proofType" className="text-right">
                <SelectValue placeholder="اختر نوع الإثبات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">نص فقط (رقم العملية)</SelectItem>
                <SelectItem value="both">نص مع رابط صورة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proofInstructions" className="text-right block">
              تعليمات إثبات الدفع
            </Label>
            <Textarea
              id="proofInstructions"
              name="proofInstructions"
              value={formData.proofInstructions}
              onChange={handleChange}
              placeholder="تعليمات للمستخدم حول كيفية إثبات الدفع"
              className="text-right"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="instructions" className="text-right block">
          تعليمات الدفع
        </Label>
        <Textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          placeholder="تعليمات للمستخدم حول كيفية استخدام وسيلة الدفع"
          className="text-right"
        />
      </div>

      <div
        className="flex justify-end gap-2 mt-6"
        style={{
          position: "sticky",
          bottom: "0",
          background: "white",
          padding: "1rem 0",
        }}
      >
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            إلغاء
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "جاري الحفظ..."
            : isEdit
              ? "تحديث وسيلة الدفع"
              : "إضافة وسيلة الدفع"}
        </Button>
      </div>
    </form>
  );
};

export default PaymentMethodForm;

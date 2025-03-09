import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

interface PaymentProofUploaderProps {
  paymentMethod: any;
  transactionId: string;
  onSuccess: () => void;
}

const PaymentProofUploader: React.FC<PaymentProofUploaderProps> = ({
  paymentMethod,
  transactionId,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [proofText, setProofText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const proofType = paymentMethod?.proof_type || "text";
  const proofInstructions =
    paymentMethod?.proof_instructions || "يرجى إرفاق إثبات الدفع";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate based on proof type
      if (!proofText.trim()) {
        throw new Error("يرجى إدخال رقم العملية أو معلومات إثبات الدفع");
      }

      // Prepare update data
      const updateData: any = {
        payment_proof_text: proofText,
        status: "pending", // Set to pending for admin verification
      };

      // Only include image URL if provided and required by proof type
      if (proofType === "both" && previewUrl) {
        updateData.payment_proof_image = previewUrl;
      }

      // Update transaction with proof
      const { error: updateError } = await supabase
        .from("transactions")
        .update(updateData)
        .eq("id", transactionId);

      if (updateError) throw updateError;

      // Success
      onSuccess();
    } catch (error) {
      console.error("Error submitting payment proof:", error);
      setError(error.message || "حدث خطأ أثناء إرسال إثبات الدفع");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image URL input
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewUrl(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-right">خطأ</AlertTitle>
          <AlertDescription className="text-right">{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <h3 className="font-semibold text-blue-800 mb-2 text-right">
          تعليمات إثبات الدفع
        </h3>
        <p className="text-blue-700 text-right text-sm">{proofInstructions}</p>
      </div>

      {(proofType === "image" || proofType === "both") && (
        <div className="space-y-2">
          <Label htmlFor="image-url" className="text-right block">
            رابط صورة إثبات الدفع (اختياري)
          </Label>
          <Input
            id="image-url"
            type="url"
            placeholder="أدخل رابط الصورة هنا (اختياري)"
            value={previewUrl || ""}
            onChange={handleImageUrlChange}
            className="text-right"
            dir="ltr"
          />
          {previewUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-2">معاينة الصورة:</p>
              <img
                src={previewUrl}
                alt="معاينة إثبات الدفع"
                className="max-h-48 rounded-md border"
                onError={() => {
                  setError("تعذر تحميل الصورة من الرابط المدخل");
                  setPreviewUrl(null);
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="proof-text" className="text-right block">
          رقم العملية أو معلومات إضافية
        </Label>
        <Textarea
          id="proof-text"
          value={proofText}
          onChange={(e) => setProofText(e.target.value)}
          placeholder="أدخل رقم العملية أو أي معلومات إضافية عن الدفع"
          className="text-right"
          rows={3}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "جاري الإرسال..." : "إرسال إثبات الدفع"}
      </Button>
    </form>
  );
};

export default PaymentProofUploader;

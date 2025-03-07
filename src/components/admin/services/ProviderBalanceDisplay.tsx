import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { serviceProviderManager } from "@/lib/api/ServiceProviderManager";
import { BalanceService } from "@/lib/api/BalanceService";

interface ProviderBalanceDisplayProps {
  providerId: string;
  onBalanceUpdate?: (balance: number, currency: string) => void;
}

const ProviderBalanceDisplay: React.FC<ProviderBalanceDisplayProps> = ({
  providerId,
  onBalanceUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [provider, setProvider] = useState<any>(null);

  // Load provider details and fetch balance on component mount
  useEffect(() => {
    if (providerId) {
      try {
        loadProviderDetails(providerId);
        fetchBalance(providerId);
      } catch (error) {
        console.error("Error in ProviderBalanceDisplay effect:", error);
        setError("حدث خطأ أثناء تحميل بيانات المزود");
      }
    }
  }, [providerId]);

  const loadProviderDetails = (id: string) => {
    try {
      const providerDetails = serviceProviderManager.getProvider(id);
      setProvider(providerDetails);
    } catch (error) {
      console.error("Error loading provider details:", error);
      setError("حدث خطأ أثناء تحميل تفاصيل مزود الخدمة");
    }
  };

  const fetchBalance = async (id: string) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await BalanceService.fetchBalance(id);

      if (result.success && result.balance !== undefined) {
        setBalance(result.balance);
        setCurrency(result.currency || "USD");

        // Call the callback if provided
        if (onBalanceUpdate) {
          onBalanceUpdate(result.balance, result.currency || "USD");
        }
      } else {
        setError(result.error || "فشل في جلب الرصيد");
        setBalance(null);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("حدث خطأ أثناء جلب الرصيد");
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (providerId) {
      fetchBalance(providerId);
    }
  };

  if (!provider) {
    return null;
  }

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <h3 className="text-sm font-medium text-right">رصيد الحساب</h3>
        </div>

        {error ? (
          <Alert variant="destructive" className="py-2 text-xs">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-right text-xs">
              {error}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="text-center mt-1">
          <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-2 mb-2">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="text-lg font-bold">
            {isLoading ? (
              <span className="text-gray-400 text-sm">جاري التحميل...</span>
            ) : balance !== null ? (
              <span dir="ltr">
                {balance.toFixed(2)} {currency}
              </span>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderBalanceDisplay;

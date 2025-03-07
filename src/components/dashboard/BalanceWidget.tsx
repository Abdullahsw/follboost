import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { serviceProviderManager } from "@/lib/api/ServiceProviderManager";
import { BalanceService } from "@/lib/api/BalanceService";

interface BalanceWidgetProps {
  providerId?: string;
  onBalanceUpdate?: (balance: number, currency: string) => void;
}

const BalanceWidget: React.FC<BalanceWidgetProps> = ({
  providerId,
  onBalanceUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId || "");

  // Load providers on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  // Update selected provider when providerId prop changes
  useEffect(() => {
    if (providerId) {
      setSelectedProvider(providerId);
    }
  }, [providerId]);

  // Fetch balance when provider changes
  useEffect(() => {
    if (selectedProvider) {
      fetchBalance(selectedProvider);
    }
  }, [selectedProvider]);

  const loadProviders = () => {
    try {
      const providersList = serviceProviderManager.getProviders();
      setProviders(providersList);

      // Auto-select the first provider if none is provided and available
      if (!providerId && providersList.length > 0 && !selectedProvider) {
        setSelectedProvider(providersList[0].id);
      }
    } catch (error) {
      console.error("Error loading providers:", error);
      setError("حدث خطأ أثناء تحميل مزودي الخدمة");
    }
  };

  const fetchBalance = async (provId: string) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await BalanceService.fetchBalance(provId);
      console.log("Balance result:", result);

      if (result.success && result.balance !== undefined) {
        setBalance(result.balance);
        setCurrency(result.currency || "USD");

        // Call the callback if provided
        if (onBalanceUpdate) {
          onBalanceUpdate(result.balance, result.currency || "USD");
        }
      } else if (result.rawResponse && typeof result.rawResponse === "object") {
        // Try to extract balance from raw response for smmstone.com
        const rawResponse = result.rawResponse;

        // Check if there's a balance property in the raw response
        if (rawResponse.balance !== undefined) {
          const extractedBalance = parseFloat(rawResponse.balance);
          setBalance(extractedBalance);
          setCurrency(rawResponse.currency || "USD");

          // Call the callback if provided
          if (onBalanceUpdate) {
            onBalanceUpdate(extractedBalance, rawResponse.currency || "USD");
          }
        } else {
          setError(result.error || "فشل في جلب الرصيد");
          setBalance(null);
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
    if (selectedProvider) {
      fetchBalance(selectedProvider);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || !selectedProvider}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <h3 className="text-lg font-bold text-right">رصيد الحساب</h3>
        </div>

        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-right">{error}</AlertDescription>
          </Alert>
        ) : null}

        {!selectedProvider ? (
          <div className="text-center text-gray-500 py-4">
            يرجى اختيار مزود خدمة لعرض الرصيد
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-4 mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {isLoading ? (
                <span className="text-gray-400">جاري التحميل...</span>
              ) : balance !== null ? (
                <span dir="ltr">
                  {balance.toFixed(2)} {currency}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              {providers.find((p) => p.id === selectedProvider)?.name || ""}
            </p>
          </div>
        )}

        {providers.length > 1 && !providerId && (
          <div className="mt-4">
            <select
              className="w-full p-2 border rounded-md text-right"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>
                اختر مزود الخدمة
              </option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceWidget;

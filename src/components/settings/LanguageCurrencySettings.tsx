import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LanguageCurrencySettings = () => {
  const [currency, setCurrency] = useState("USD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSaveSettings = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const currencies = [
    { id: "USD", name: "US Dollar", symbol: "$", rate: 1 },
    { id: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
    { id: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Currency Settings
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Settings saved successfully!</AlertTitle>
          <AlertDescription>
            Your currency settings have been updated.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Currency Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Select payment currency</Label>
            <RadioGroup
              value={currency}
              onValueChange={setCurrency}
              className="space-y-3"
            >
              {currencies.map((curr) => (
                <div
                  key={curr.id}
                  className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                >
                  <RadioGroupItem value={curr.id} id={`curr-${curr.id}`} />
                  <span className="text-xl font-bold mr-2">{curr.symbol}</span>
                  <div className="flex-1">
                    <div className="font-medium">{curr.name}</div>
                    <div className="text-sm text-gray-500">
                      Exchange rate:{" "}
                      {curr.rate === 1
                        ? "Base currency"
                        : `1 USD = ${curr.rate} ${curr.symbol}`}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="bg-amber-50 p-4 rounded-md mt-4">
              <p className="text-sm text-amber-700">
                <strong>Important:</strong> When changing the currency, all
                prices and balances will be automatically converted according to
                the current exchange rate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Currency Conversion Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Service
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Price (USD)
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Price (EUR)
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Price (GBP)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                      1000 Instagram Followers
                    </td>
                    <td className="py-3 px-4 text-gray-800">$15.00</td>
                    <td className="py-3 px-4 text-gray-800">€13.80</td>
                    <td className="py-3 px-4 text-gray-800">£11.85</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                      5000 YouTube Views
                    </td>
                    <td className="py-3 px-4 text-gray-800">$25.00</td>
                    <td className="py-3 px-4 text-gray-800">€23.00</td>
                    <td className="py-3 px-4 text-gray-800">£19.75</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                      2000 TikTok Likes
                    </td>
                    <td className="py-3 px-4 text-gray-800">$20.00</td>
                    <td className="py-3 px-4 text-gray-800">€18.40</td>
                    <td className="py-3 px-4 text-gray-800">£15.80</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-gray-700">
                <strong>Note:</strong> Exchange rates are subject to change and
                are updated periodically by the site administration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSubmitting} size="lg">
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default LanguageCurrencySettings;

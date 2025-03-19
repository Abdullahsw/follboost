import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { serviceProviderManager } from "@/lib/api/ServiceProviderManager";
import { SmmApiTroubleshooter } from "@/lib/api/smm-api-troubleshooter";

interface AddServiceProviderProps {
  onProviderAdded?: () => void;
}

const AddServiceProvider: React.FC<AddServiceProviderProps> = ({
  onProviderAdded,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    apiKey: "",
    apiSecret: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return formData.name && formData.url && formData.apiKey;
  };

  const handleTestConnection = async () => {
    if (!formData.url || !formData.apiKey) {
      setError("Please enter API URL and API key at minimum");
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setError("");
    setSuggestions([]);

    try {
      // Get suggestions
      const fixSuggestions = SmmApiTroubleshooter.suggestFixes(
        formData.url,
        formData.apiKey,
      );
      setSuggestions(fixSuggestions);

      // Run diagnostics
      const diagnosticResult = await SmmApiTroubleshooter.diagnoseConnection(
        formData.url,
        formData.apiKey,
      );

      // If a fix was applied, update the URL
      if (
        diagnosticResult.success &&
        diagnosticResult.fixApplied &&
        diagnosticResult.details?.includes("using alternative format:")
      ) {
        // Extract the working URL from the details
        const match = diagnosticResult.details.match(/format: ([^ ]+) with/);
        if (match && match[1]) {
          setFormData((prev) => ({
            ...prev,
            url: match[1],
          }));
        }
      }

      setTestResult(diagnosticResult);
    } catch (error) {
      console.error("Error testing connection:", error);
      setTestResult({
        success: false,
        message: "An error occurred while testing the connection",
        details: error.message || "Unknown error",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.url || !formData.apiKey) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Add the provider
      const newProvider = serviceProviderManager.addProvider({
        name: formData.name,
        url: formData.url,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        status: "active",
      });

      console.log("Provider added successfully:", newProvider);
      setSuccess(true);

      // Reset form
      setFormData({
        name: "",
        url: "",
        apiKey: "",
        apiSecret: "",
      });

      // Notify parent component
      if (onProviderAdded) {
        onProviderAdded();
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding provider:", error);
      setError("An error occurred while adding the service provider");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-right">
          Add New Service Provider
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle className="text-right">
                Operation Successful!
              </AlertTitle>
              <AlertDescription className="text-right">
                Service provider has been added successfully.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-right">Error</AlertTitle>
              <AlertDescription className="text-right">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {testResult && (
            <Alert
              className={
                testResult.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }
            >
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription
                className={`text-right ${testResult.success ? "text-green-800" : "text-red-800"}`}
              >
                <p className="font-bold">{testResult.message}</p>
                {testResult.details && (
                  <p className="text-sm mt-1">{testResult.details}</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {suggestions.length > 0 && !testResult?.success && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-right">
                Suggestions to fix the issue:
              </h3>
              <ul className="space-y-1 text-right">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-yellow-800">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="provider-name" className="text-right block">
                Service Provider Name
              </Label>
              <Input
                id="provider-name"
                name="name"
                placeholder="Enter service provider name"
                className="text-right"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider-url" className="text-right block">
                API URL
              </Label>
              <Input
                id="provider-url"
                name="url"
                placeholder="https://api.example.com"
                dir="ltr"
                value={formData.url}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                URL must start with http:// or https://
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider-api-key" className="text-right block">
                API Key
              </Label>
              <Input
                id="provider-api-key"
                name="apiKey"
                type="password"
                placeholder="Enter API key"
                dir="ltr"
                value={formData.apiKey}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider-api-secret" className="text-right block">
                API Secret (Optional)
              </Label>
              <Input
                id="provider-api-secret"
                name="apiSecret"
                type="password"
                placeholder="Enter API secret if required"
                dir="ltr"
                value={formData.apiSecret}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting || !formData.url || !formData.apiKey}
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>Test Connection</>
              )}
            </Button>

            <Button
              type="submit"
              disabled={
                !!(
                  isLoading ||
                  (!testResult?.success && formData.url && formData.apiKey)
                )
              }
              className="flex items-center gap-2"
            >
              {isLoading ? "Adding..." : "Add Service Provider"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddServiceProvider;

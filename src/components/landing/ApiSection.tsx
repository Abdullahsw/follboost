import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const ApiSection = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 text-right">
          <h3 className="text-2xl font-bold">
            Application Programming Interface (API)
          </h3>
          <p className="text-gray-700">
            We provide a powerful and easy-to-use Application Programming
            Interface (API) that allows you to integrate our services directly
            into your applications and systems.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
            <li>Create new orders programmatically</li>
            <li>Query the status of current orders</li>
            <li>Import the list of available services and their prices</li>
            <li>Manage your account balance</li>
            <li>Detailed statistics and reports</li>
          </ul>
          <div className="pt-4">
            <Button onClick={() => navigate("/login")}>
              Login to Access API
            </Button>
          </div>
        </div>

        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <Tabs defaultValue="order" dir="rtl">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="order">Create Order</TabsTrigger>
                <TabsTrigger value="status">Order Status</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              <TabsContent value="order">
                <div
                  className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                  dir="ltr"
                >
                  <pre>{`POST /api/v1/order
Content-Type: application/json
API-Key: your_api_key

{
  "service": "SRV-001",
  "link": "https://instagram.com/username",
  "quantity": 1000
}`}</pre>
                </div>
              </TabsContent>

              <TabsContent value="status">
                <div
                  className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                  dir="ltr"
                >
                  <pre>{`GET /api/v1/order/ORD-123456
Content-Type: application/json
API-Key: your_api_key`}</pre>
                </div>
              </TabsContent>

              <TabsContent value="services">
                <div
                  className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                  dir="ltr"
                >
                  <pre>{`GET /api/v1/services
Content-Type: application/json
API-Key: your_api_key`}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-right">
        <h3 className="text-xl font-bold text-blue-800 mb-2">API Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-700">
          <div className="space-y-2">
            <h4 className="font-semibold">Ease of Use</h4>
            <p className="text-sm">
              Simple and fully documented programming interface
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">High Security</h4>
            <p className="text-sm">
              SSL encryption and advanced authentication systems
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Comprehensive Documentation</h4>
            <p className="text-sm">
              Code examples in multiple programming languages
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-lg mb-4">
          To get the complete API documentation and start using it, create an
          account or login.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button onClick={() => navigate("/register")}>
            Create New Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiSection;

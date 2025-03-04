import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminRevenueChart = () => {
  const dailyData = [
    { name: "السبت", revenue: 1200, orders: 24 },
    { name: "الأحد", revenue: 1400, orders: 28 },
    { name: "الإثنين", revenue: 1100, orders: 22 },
    { name: "الثلاثاء", revenue: 1700, orders: 34 },
    { name: "الأربعاء", revenue: 1500, orders: 30 },
    { name: "الخميس", revenue: 1900, orders: 38 },
    { name: "الجمعة", revenue: 2100, orders: 42 },
  ];

  const weeklyData = [
    { name: "الأسبوع 1", revenue: 8500, orders: 170 },
    { name: "الأسبوع 2", revenue: 9200, orders: 184 },
    { name: "الأسبوع 3", revenue: 10500, orders: 210 },
    { name: "الأسبوع 4", revenue: 11800, orders: 236 },
  ];

  const monthlyData = [
    { name: "يناير", revenue: 35000, orders: 700 },
    { name: "فبراير", revenue: 38000, orders: 760 },
    { name: "مارس", revenue: 42000, orders: 840 },
    { name: "أبريل", revenue: 45000, orders: 900 },
    { name: "مايو", revenue: 48000, orders: 960 },
    { name: "يونيو", revenue: 52000, orders: 1040 },
  ];

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-right">
          تحليل الإيرادات والطلبات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" dir="rtl">
          <div className="flex justify-end mb-4">
            <TabsList>
              <TabsTrigger value="monthly">شهري</TabsTrigger>
              <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
              <TabsTrigger value="daily">يومي</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dailyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="الإيرادات (ر.س)"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="عدد الطلبات"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={weeklyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="الإيرادات (ر.س)"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="عدد الطلبات"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="الإيرادات (ر.س)"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="عدد الطلبات"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminRevenueChart;

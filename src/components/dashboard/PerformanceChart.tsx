import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartProps {
  data?: {
    daily: PerformanceData[];
    weekly: PerformanceData[];
    monthly: PerformanceData[];
  };
}

interface PerformanceData {
  name: string;
  orders: number;
  followers: number;
  likes: number;
  views: number;
}

const defaultData = {
  daily: [
    { name: "السبت", orders: 4, followers: 240, likes: 120, views: 450 },
    { name: "الأحد", orders: 3, followers: 139, likes: 80, views: 390 },
    { name: "الإثنين", orders: 5, followers: 280, likes: 150, views: 480 },
    { name: "الثلاثاء", orders: 7, followers: 390, likes: 230, views: 590 },
    { name: "الأربعاء", orders: 6, followers: 340, likes: 210, views: 520 },
    { name: "الخميس", orders: 8, followers: 420, likes: 270, views: 640 },
    { name: "الجمعة", orders: 9, followers: 490, likes: 300, views: 720 },
  ],
  weekly: [
    { name: "الأسبوع 1", orders: 24, followers: 1200, likes: 800, views: 2400 },
    { name: "الأسبوع 2", orders: 28, followers: 1350, likes: 920, views: 2800 },
    {
      name: "الأسبوع 3",
      orders: 32,
      followers: 1500,
      likes: 1050,
      views: 3200,
    },
    {
      name: "الأسبوع 4",
      orders: 38,
      followers: 1800,
      likes: 1200,
      views: 3600,
    },
  ],
  monthly: [
    { name: "يناير", orders: 120, followers: 5200, likes: 3800, views: 12000 },
    { name: "فبراير", orders: 140, followers: 6100, likes: 4200, views: 14000 },
    { name: "مارس", orders: 160, followers: 7000, likes: 4800, views: 16000 },
    { name: "أبريل", orders: 180, followers: 7800, likes: 5400, views: 18000 },
    { name: "مايو", orders: 200, followers: 8600, likes: 6000, views: 20000 },
    { name: "يونيو", orders: 220, followers: 9400, likes: 6600, views: 22000 },
  ],
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data = defaultData,
}) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-right">
          أداء الحساب
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
              <LineChart
                data={data.daily}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  name="الطلبات"
                />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="#82ca9d"
                  name="المتابعين"
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#ff7300"
                  name="الإعجابات"
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#0088fe"
                  name="المشاهدات"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data.weekly}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  name="الطلبات"
                />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="#82ca9d"
                  name="المتابعين"
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#ff7300"
                  name="الإعجابات"
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#0088fe"
                  name="المشاهدات"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data.monthly}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  name="الطلبات"
                />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="#82ca9d"
                  name="المتابعين"
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#ff7300"
                  name="الإعجابات"
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#0088fe"
                  name="المشاهدات"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;

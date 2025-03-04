import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import AdminOrdersTable from "./AdminOrdersTable";
import AdminRevenueChart from "./AdminRevenueChart";

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        لوحة تحكم المدير
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              إجمالي المستخدمين
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,254</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-500">+12%</span> منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              الطلبات النشطة
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">156</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-500">+8%</span> منذ الأسبوع الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              إجمالي الإيرادات
            </CardTitle>
            <DollarSign className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">45,280 ر.س</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-500">+15%</span> منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              معدل النمو
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">18.5%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-500">+2.3%</span> منذ الربع الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <AdminRevenueChart />

      {/* Recent Orders */}
      <AdminOrdersTable />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-right mb-4">
            إجراءات سريعة
          </h2>
          <div className="flex flex-col space-y-3">
            <button className="bg-primary text-white py-2 px-4 rounded-md text-right w-full hover:bg-primary/90 transition-colors">
              إضافة خدمة جديدة
            </button>
            <button className="bg-green-500 text-white py-2 px-4 rounded-md text-right w-full hover:bg-green-600 transition-colors">
              إدارة المستخدمين
            </button>
            <button className="bg-purple-500 text-white py-2 px-4 rounded-md text-right w-full hover:bg-purple-600 transition-colors">
              تعديل أسعار الخدمات
            </button>
          </div>
        </div>

        {/* System Notifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-right mb-4">
            إشعارات النظام
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "تحديث النظام",
                details: "تم تحديث النظام إلى الإصدار 2.3.0",
                time: "منذ 2 ساعة",
                priority: "منخفضة",
              },
              {
                title: "طلبات معلقة",
                details: "يوجد 15 طلب بحاجة إلى مراجعة",
                time: "منذ 5 ساعات",
                priority: "متوسطة",
              },
              {
                title: "تنبيه أمان",
                details: "محاولات تسجيل دخول مشبوهة",
                time: "منذ يوم واحد",
                priority: "عالية",
              },
            ].map((notification, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-gray-500 text-sm">
                  {notification.time}
                </span>
                <div className="text-right">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">
                    {notification.details}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${notification.priority === "عالية" ? "bg-red-100 text-red-800" : notification.priority === "متوسطة" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}
                  >
                    {notification.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

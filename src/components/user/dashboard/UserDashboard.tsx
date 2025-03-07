import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  Package,
  CheckCircle,
  Users,
} from "lucide-react";

const UserDashboard = () => {
  // Sample data
  const stats = [
    {
      title: "الرصيد المتاح",
      value: "250 ر.س",
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      change: "+15%",
      changeType: "increase",
    },
    {
      title: "الطلبات النشطة",
      value: "5",
      icon: <Package className="h-8 w-8 text-blue-500" />,
      change: "+2",
      changeType: "increase",
    },
    {
      title: "الطلبات المكتملة",
      value: "42",
      icon: <CheckCircle className="h-8 w-8 text-purple-500" />,
      change: "+8",
      changeType: "increase",
    },
    {
      title: "عمولات الإحالة",
      value: "120 ر.س",
      icon: <Users className="h-8 w-8 text-orange-500" />,
      change: "+25%",
      changeType: "increase",
    },
  ];

  // Sample active orders
  const activeOrders = [
    {
      id: "ORD-12345",
      service: "متابعين انستغرام",
      quantity: 1000,
      progress: 65,
      status: "قيد التنفيذ",
      date: "2023-06-20",
    },
    {
      id: "ORD-12346",
      service: "إعجابات تويتر",
      quantity: 500,
      progress: 80,
      status: "قيد التنفيذ",
      date: "2023-06-19",
    },
    {
      id: "ORD-12347",
      service: "مشاهدات يوتيوب",
      quantity: 5000,
      progress: 30,
      status: "قيد التنفيذ",
      date: "2023-06-21",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        لوحة التحكم
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end">
                {stat.changeType === "increase" ? (
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm ${stat.changeType === "increase" ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 text-right mb-4">
            أداء الحساب
          </h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">رسم بياني للأداء سيظهر هنا</p>
          </div>
        </CardContent>
      </Card>

      {/* Active Orders */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 text-right mb-4">
            الطلبات النشطة
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full" dir="rtl">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    رقم الطلب
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    الخدمة
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    الكمية
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    التقدم
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    الحالة
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{order.id}</td>
                    <td className="py-3 px-4 text-gray-800">{order.service}</td>
                    <td className="py-3 px-4 text-gray-800">
                      {order.quantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {order.progress}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-right mb-4">
              إجراءات سريعة
            </h2>
            <div className="flex flex-col space-y-3">
              <Link
                to="/dashboard/create-order"
                className="bg-primary text-white py-2 px-4 rounded-md text-right w-full hover:bg-primary/90 transition-colors block text-center"
              >
                إنشاء طلب جديد
              </Link>
              <Link
                to="/dashboard/add-funds"
                className="bg-green-500 text-white py-2 px-4 rounded-md text-right w-full hover:bg-green-600 transition-colors block text-center"
              >
                إضافة رصيد
              </Link>
              <Link
                to="/dashboard/referrals"
                className="bg-purple-500 text-white py-2 px-4 rounded-md text-right w-full hover:bg-purple-600 transition-colors block text-center"
              >
                دعوة صديق
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-right mb-4">
              آخر النشاطات
            </h2>
            <div className="space-y-4">
              {[
                {
                  action: "تم إضافة رصيد",
                  details: "50 ر.س",
                  time: "منذ 2 ساعة",
                },
                {
                  action: "تم إنشاء طلب جديد",
                  details: "متابعين انستغرام",
                  time: "منذ 5 ساعات",
                },
                {
                  action: "اكتمل الطلب",
                  details: "إعجابات تويتر",
                  time: "منذ يوم واحد",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-gray-500 text-sm">{activity.time}</span>
                  <div className="text-right">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;

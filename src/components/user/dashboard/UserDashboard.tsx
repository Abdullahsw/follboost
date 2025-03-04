import React from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import ActiveOrdersList from "@/components/dashboard/ActiveOrdersList";

interface UserDashboardProps {
  balance?: number;
  activeOrders?: number;
  completedOrders?: number;
  commissions?: number;
}

const UserDashboard = ({
  balance = 250,
  activeOrders = 5,
  completedOrders = 42,
  commissions = 120,
}: UserDashboardProps) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        لوحة التحكم
      </h1>

      {/* Dashboard Stats */}
      <DashboardStats
        balance={balance}
        activeOrders={activeOrders}
        completedOrders={completedOrders}
        commissions={commissions}
      />

      {/* Performance Chart */}
      <PerformanceChart />

      {/* Active Orders List */}
      <ActiveOrdersList />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-right mb-4">
            إجراءات سريعة
          </h2>
          <div className="flex flex-col space-y-3">
            <button className="bg-primary text-white py-2 px-4 rounded-md text-right w-full hover:bg-primary/90 transition-colors">
              إنشاء طلب جديد
            </button>
            <button className="bg-green-500 text-white py-2 px-4 rounded-md text-right w-full hover:bg-green-600 transition-colors">
              إضافة رصيد
            </button>
            <button className="bg-purple-500 text-white py-2 px-4 rounded-md text-right w-full hover:bg-purple-600 transition-colors">
              دعوة صديق
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, CheckCircle, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  balance?: number;
  activeOrders?: number;
  completedOrders?: number;
  commissions?: number;
}

const DashboardStats = ({
  balance = 250,
  activeOrders = 5,
  completedOrders = 42,
  commissions = 120,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full bg-white p-4 rounded-lg">
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            الرصيد المتاح
          </CardTitle>
          <CreditCard className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{balance} ر.س</div>
          <p className="text-xs text-gray-500 mt-1">
            متاح للاستخدام في الطلبات
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            الطلبات النشطة
          </CardTitle>
          <Users className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {activeOrders}
          </div>
          <p className="text-xs text-gray-500 mt-1">طلبات قيد التنفيذ حالياً</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            الطلبات المكتملة
          </CardTitle>
          <CheckCircle className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {completedOrders}
          </div>
          <p className="text-xs text-gray-500 mt-1">إجمالي الطلبات المنفذة</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            العمولات المكتسبة
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {commissions} ر.س
          </div>
          <p className="text-xs text-gray-500 mt-1">من برنامج الإحالة</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;

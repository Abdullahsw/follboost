import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Search, RefreshCw, XCircle, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderStatus {
  value: "pending" | "in-progress" | "completed" | "cancelled" | "partial";
  label: string;
  color: string;
}

interface Order {
  id: string;
  service: string;
  platform: string;
  quantity: number;
  link: string;
  date: string;
  status: OrderStatus;
  progress: number;
  price: number;
}

const getStatusBadge = (status: OrderStatus) => {
  return <Badge className={status.color}>{status.label}</Badge>;
};

const OrdersManagementPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const orders: Order[] = [
    {
      id: "ORD-001",
      service: "متابعين انستغرام",
      platform: "Instagram",
      quantity: 1000,
      link: "https://instagram.com/username",
      date: "2023-06-15",
      status: {
        value: "in-progress",
        label: "قيد التنفيذ",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
      progress: 65,
      price: 50,
    },
    {
      id: "ORD-002",
      service: "إعجابات تويتر",
      platform: "Twitter",
      quantity: 500,
      link: "https://twitter.com/username/status/123456789",
      date: "2023-06-14",
      status: {
        value: "completed",
        label: "مكتمل",
        color: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      progress: 100,
      price: 25,
    },
    {
      id: "ORD-003",
      service: "مشاهدات يوتيوب",
      platform: "YouTube",
      quantity: 5000,
      link: "https://youtube.com/watch?v=abcdefg",
      date: "2023-06-16",
      status: {
        value: "in-progress",
        label: "قيد التنفيذ",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
      progress: 30,
      price: 120,
    },
    {
      id: "ORD-004",
      service: "متابعين تيك توك",
      platform: "TikTok",
      quantity: 2000,
      link: "https://tiktok.com/@username",
      date: "2023-06-17",
      status: {
        value: "pending",
        label: "قيد الانتظار",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      progress: 0,
      price: 80,
    },
    {
      id: "ORD-005",
      service: "إعجابات فيسبوك",
      platform: "Facebook",
      quantity: 300,
      link: "https://facebook.com/posts/123456789",
      date: "2023-06-16",
      status: {
        value: "partial",
        label: "مكتمل جزئياً",
        color: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      },
      progress: 80,
      price: 15,
    },
    {
      id: "ORD-006",
      service: "تعليقات انستغرام",
      platform: "Instagram",
      quantity: 100,
      link: "https://instagram.com/p/123456789",
      date: "2023-06-13",
      status: {
        value: "cancelled",
        label: "ملغي",
        color: "bg-red-100 text-red-800 hover:bg-red-100",
      },
      progress: 0,
      price: 30,
    },
  ];

  const activeOrders = orders.filter(
    (order) =>
      order.status.value === "pending" || order.status.value === "in-progress",
  );

  const completedOrders = orders.filter(
    (order) =>
      order.status.value === "completed" ||
      order.status.value === "partial" ||
      order.status.value === "cancelled",
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleViewDetails = (order: Order) => {
    // Set selected order and open dialog
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleReorder = (order: Order) => {
    // Navigate to create order page with pre-selected service
    const serviceId =
      order.service === "متابعين انستغرام"
        ? "1"
        : order.service === "إعجابات تويتر"
          ? "2"
          : order.service === "مشاهدات يوتيوب"
            ? "3"
            : order.service === "متابعين تيك توك"
              ? "4"
              : order.service === "إعجابات فيسبوك"
                ? "5"
                : "1";

    navigate(`/create-order?service=${serviceId}`);
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelOrder = () => {
    // Implement cancel order functionality
    console.log("Cancelling order:", selectedOrder?.id);
    setIsCancelDialogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إدارة الطلبات
      </h1>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن طلب برقم الطلب أو الخدمة..."
              className="pl-10 pr-4 w-full text-right"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <Button className="shrink-0">
          <RefreshCw className="h-4 w-4 mr-2" />
          تحديث الطلبات
        </Button>
      </div>

      <Tabs defaultValue="active" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">الطلبات النشطة</TabsTrigger>
          <TabsTrigger value="completed">الطلبات المكتملة</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                الطلبات النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">الخدمة</TableHead>
                      <TableHead className="text-right">المنصة</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeOrders.length > 0 ? (
                      activeOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="link"
                              className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                              onClick={() => handleReorder(order)}
                            >
                              {order.service}
                            </Button>
                          </TableCell>
                          <TableCell>{order.platform}</TableCell>
                          <TableCell>
                            {order.quantity.toLocaleString()}
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(order)}
                              >
                                <Eye className="h-4 w-4 ml-1" />
                                التفاصيل
                              </Button>
                              {order.status.value === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleCancelOrder(order)}
                                >
                                  <XCircle className="h-4 w-4 ml-1" />
                                  إلغاء
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          لا توجد طلبات نشطة حالياً
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                الطلبات المكتملة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">الخدمة</TableHead>
                      <TableHead className="text-right">المنصة</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedOrders.length > 0 ? (
                      completedOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="link"
                              className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                              onClick={() => handleReorder(order)}
                            >
                              {order.service}
                            </Button>
                          </TableCell>
                          <TableCell>{order.platform}</TableCell>
                          <TableCell>
                            {order.quantity.toLocaleString()}
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="h-4 w-4 ml-1" />
                              التفاصيل
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          لا توجد طلبات مكتملة
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تفاصيل الطلب</DialogTitle>
            <DialogDescription className="text-right">
              {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">الخدمة</p>
                  <p className="font-medium">{selectedOrder.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">المنصة</p>
                  <p className="font-medium">{selectedOrder.platform}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الكمية</p>
                  <p className="font-medium">
                    {selectedOrder.quantity.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">السعر الإجمالي</p>
                  <p className="font-medium">{selectedOrder.price} ر.س</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">التاريخ</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الحالة</p>
                  <p className="font-medium">{selectedOrder.status.label}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">الرابط</p>
                <p className="font-medium break-all">{selectedOrder.link}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">التقدم</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${selectedOrder.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-left">
                  {selectedOrder.progress}%
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد إلغاء الطلب</DialogTitle>
            <DialogDescription className="text-right">
              هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا
              الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              تراجع
            </Button>
            <Button variant="destructive" onClick={confirmCancelOrder}>
              تأكيد الإلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagementPage;

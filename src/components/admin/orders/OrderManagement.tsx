import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Search,
  Eye,
  CheckCheck,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface OrderStatus {
  value:
    | "pending"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "partial"
    | "refunded";
  label: string;
  color: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  service: string;
  serviceId: string;
  platform: string;
  quantity: number;
  link: string;
  amount: number;
  date: string;
  status: OrderStatus;
  progress: number;
  apiOrderId?: string;
  apiProvider?: string;
  lastUpdate?: string;
}

const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
  const [isCompleteOrderDialogOpen, setIsCompleteOrderDialogOpen] =
    useState(false);
  const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(false);

  // Sample orders data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      userId: "USR-001",
      userName: "أحمد محمد",
      service: "متابعين انستغرام عرب",
      serviceId: "SRV-001",
      platform: "Instagram",
      quantity: 1000,
      link: "https://instagram.com/username",
      amount: 50,
      date: "2023-06-15",
      status: {
        value: "in-progress",
        label: "قيد التنفيذ",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
      progress: 65,
      apiOrderId: "API12345",
      apiProvider: "SocialBoost API",
      lastUpdate: "2023-06-16 14:30",
    },
    {
      id: "ORD-002",
      userId: "USR-002",
      userName: "سارة علي",
      service: "إعجابات تويتر",
      serviceId: "SRV-005",
      platform: "Twitter",
      quantity: 500,
      link: "https://twitter.com/username/status/123456789",
      amount: 25,
      date: "2023-06-14",
      status: {
        value: "completed",
        label: "مكتمل",
        color: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      progress: 100,
      apiOrderId: "API12346",
      apiProvider: "SocialBoost API",
      lastUpdate: "2023-06-15 09:15",
    },
    {
      id: "ORD-003",
      userId: "USR-003",
      userName: "محمد خالد",
      service: "مشاهدات يوتيوب",
      serviceId: "SRV-004",
      platform: "YouTube",
      quantity: 5000,
      link: "https://youtube.com/watch?v=abcdefg",
      amount: 120,
      date: "2023-06-16",
      status: {
        value: "in-progress",
        label: "قيد التنفيذ",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
      progress: 30,
      apiOrderId: "API12347",
      apiProvider: "MediaGrowth API",
      lastUpdate: "2023-06-17 10:30",
    },
    {
      id: "ORD-004",
      userId: "USR-004",
      userName: "فاطمة أحمد",
      service: "متابعين تيك توك",
      serviceId: "SRV-009",
      platform: "TikTok",
      quantity: 2000,
      link: "https://tiktok.com/@username",
      amount: 80,
      date: "2023-06-17",
      status: {
        value: "pending",
        label: "قيد الانتظار",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      progress: 0,
    },
    {
      id: "ORD-005",
      userId: "USR-005",
      userName: "عمر حسن",
      service: "إعجابات فيسبوك",
      serviceId: "SRV-006",
      platform: "Facebook",
      quantity: 300,
      link: "https://facebook.com/posts/123456789",
      amount: 15,
      date: "2023-06-16",
      status: {
        value: "partial",
        label: "مكتمل جزئياً",
        color: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      },
      progress: 80,
      apiOrderId: "API12348",
      apiProvider: "SocialBoost API",
      lastUpdate: "2023-06-17 12:45",
    },
    {
      id: "ORD-006",
      userId: "USR-001",
      userName: "أحمد محمد",
      service: "تعليقات انستغرام",
      serviceId: "SRV-003",
      platform: "Instagram",
      quantity: 100,
      link: "https://instagram.com/p/123456789",
      amount: 30,
      date: "2023-06-13",
      status: {
        value: "cancelled",
        label: "ملغي",
        color: "bg-red-100 text-red-800 hover:bg-red-100",
      },
      progress: 0,
      lastUpdate: "2023-06-13 16:20",
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOrderDialogOpen(true);
  };

  const handleCompleteOrder = () => {
    setIsSubmitting(true);

    // Update order status
    setTimeout(() => {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder?.id) {
          return {
            ...order,
            status: {
              value: "completed",
              label: "مكتمل",
              color: "bg-green-100 text-green-800 hover:bg-green-100",
            },
            progress: 100,
            lastUpdate:
              new Date().toISOString().split("T")[0] +
              " " +
              new Date().toTimeString().split(" ")[0].substring(0, 5),
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      setIsSubmitting(false);
      setSuccess(true);
      setIsCompleteOrderDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleCancelOrder = () => {
    setIsSubmitting(true);

    // Update order status
    setTimeout(() => {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder?.id) {
          return {
            ...order,
            status: {
              value: "cancelled",
              label: "ملغي",
              color: "bg-red-100 text-red-800 hover:bg-red-100",
            },
            progress: 0,
            lastUpdate:
              new Date().toISOString().split("T")[0] +
              " " +
              new Date().toTimeString().split(" ")[0].substring(0, 5),
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      setIsSubmitting(false);
      setSuccess(true);
      setIsCancelOrderDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const filteredOrders = searchQuery
    ? orders.filter(
        (order) =>
          order.id.includes(searchQuery) ||
          order.userName.includes(searchQuery) ||
          order.service.includes(searchQuery) ||
          order.platform.includes(searchQuery),
      )
    : orders;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إدارة الطلبات
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم تحديث حالة الطلب بنجاح.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-right">خطأ</AlertTitle>
          <AlertDescription className="text-right">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن طلب برقم الطلب أو اسم المستخدم أو الخدمة..."
              className="pl-10 pr-4 w-full text-right"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => console.log("Refresh orders")}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث الطلبات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
          <TabsTrigger value="in-progress">قيد التنفيذ</TabsTrigger>
          <TabsTrigger value="completed">مكتمل</TabsTrigger>
          <TabsTrigger value="partial">مكتمل جزئياً</TabsTrigger>
          <TabsTrigger value="cancelled">ملغي</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OrdersTable orders={filteredOrders} onViewOrder={handleViewOrder} />
        </TabsContent>

        <TabsContent value="pending">
          <OrdersTable
            orders={filteredOrders.filter(
              (order) => order.status.value === "pending",
            )}
            onViewOrder={handleViewOrder}
          />
        </TabsContent>

        <TabsContent value="in-progress">
          <OrdersTable
            orders={filteredOrders.filter(
              (order) => order.status.value === "in-progress",
            )}
            onViewOrder={handleViewOrder}
          />
        </TabsContent>

        <TabsContent value="completed">
          <OrdersTable
            orders={filteredOrders.filter(
              (order) => order.status.value === "completed",
            )}
            onViewOrder={handleViewOrder}
          />
        </TabsContent>

        <TabsContent value="partial">
          <OrdersTable
            orders={filteredOrders.filter(
              (order) => order.status.value === "partial",
            )}
            onViewOrder={handleViewOrder}
          />
        </TabsContent>

        <TabsContent value="cancelled">
          <OrdersTable
            orders={filteredOrders.filter(
              (order) => order.status.value === "cancelled",
            )}
            onViewOrder={handleViewOrder}
          />
        </TabsContent>
      </Tabs>

      {/* View Order Dialog */}
      <Dialog
        open={isViewOrderDialogOpen}
        onOpenChange={setIsViewOrderDialogOpen}
      >
        <DialogContent className="max-w-3xl" dir="rtl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-right">تفاصيل الطلب</DialogTitle>
                <DialogDescription className="text-right">
                  {selectedOrder.id} - {selectedOrder.service}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    رقم الطلب
                  </Label>
                  <p>{selectedOrder.id}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    المستخدم
                  </Label>
                  <p>
                    {selectedOrder.userName} ({selectedOrder.userId})
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    الخدمة
                  </Label>
                  <p>
                    {selectedOrder.service} ({selectedOrder.serviceId})
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    المنصة
                  </Label>
                  <p>{selectedOrder.platform}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    الكمية
                  </Label>
                  <p>{selectedOrder.quantity.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    المبلغ
                  </Label>
                  <p>{selectedOrder.amount} ر.س</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    تاريخ الطلب
                  </Label>
                  <p>{selectedOrder.date}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    آخر تحديث
                  </Label>
                  <p>{selectedOrder.lastUpdate || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    الحالة
                  </Label>
                  <Badge className={selectedOrder.status.color}>
                    {selectedOrder.status.label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">
                    التقدم
                  </Label>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${selectedOrder.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {selectedOrder.progress}%
                  </span>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="text-right block font-semibold">الرابط</Label>
                <p className="break-all">{selectedOrder.link}</p>
              </div>

              {selectedOrder.apiOrderId && (
                <div className="space-y-2 col-span-2">
                  <Label className="text-right block font-semibold">
                    معلومات API
                  </Label>
                  <p>رقم الطلب في API: {selectedOrder.apiOrderId}</p>
                  <p>مزود الخدمة: {selectedOrder.apiProvider}</p>
                </div>
              )}

              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  {selectedOrder.status.value !== "completed" &&
                    selectedOrder.status.value !== "cancelled" && (
                      <>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setIsViewOrderDialogOpen(false);
                            setIsCancelOrderDialogOpen(true);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          إلغاء الطلب
                        </Button>
                        <Button
                          onClick={() => {
                            setIsViewOrderDialogOpen(false);
                            setIsCompleteOrderDialogOpen(true);
                          }}
                        >
                          <CheckCheck className="h-4 w-4 mr-2" />
                          تعيين كمكتمل
                        </Button>
                      </>
                    )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsViewOrderDialogOpen(false)}
                >
                  إغلاق
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Complete Order Dialog */}
      <Dialog
        open={isCompleteOrderDialogOpen}
        onOpenChange={setIsCompleteOrderDialogOpen}
      >
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد إكمال الطلب</DialogTitle>
            <DialogDescription className="text-right">
              هل أنت متأكد من رغبتك في تعيين هذا الطلب كمكتمل؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsCompleteOrderDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleCompleteOrder} disabled={isSubmitting}>
              {isSubmitting ? "جاري التنفيذ..." : "تأكيد الإكمال"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog
        open={isCancelOrderDialogOpen}
        onOpenChange={setIsCancelOrderDialogOpen}
      >
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد إلغاء الطلب</DialogTitle>
            <DialogDescription className="text-right">
              هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ هذا الإجراء لا يمكن
              التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsCancelOrderDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري التنفيذ..." : "تأكيد الإلغاء"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            إحصائيات الطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">إجمالي الطلبات</h3>
              <p className="text-3xl font-bold text-blue-600">
                {orders.length}
              </p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">الطلبات المكتملة</h3>
              <p className="text-3xl font-bold text-green-600">
                {
                  orders.filter((order) => order.status.value === "completed")
                    .length
                }
              </p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">الطلبات قيد التنفيذ</h3>
              <p className="text-3xl font-bold text-amber-600">
                {
                  orders.filter(
                    (order) =>
                      order.status.value === "in-progress" ||
                      order.status.value === "pending",
                  ).length
                }
              </p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">إجمالي المبيعات</h3>
              <p className="text-3xl font-bold text-purple-600">
                {orders.reduce((total, order) => total + order.amount, 0)} ر.س
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

const OrdersTable = ({ orders, onViewOrder }: OrdersTableProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">الخدمة</TableHead>
                <TableHead className="text-right">المنصة</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">التقدم</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>{order.service}</TableCell>
                    <TableCell>{order.platform}</TableCell>
                    <TableCell>{order.quantity.toLocaleString()}</TableCell>
                    <TableCell>{order.amount} ر.س</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {order.progress}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={order.status.color}>
                        {order.status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    لا توجد طلبات متطابقة مع البحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;

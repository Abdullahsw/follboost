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
import { OrderStatus } from "@/types/Order";

interface OrderStatusDisplay {
  value: OrderStatus;
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
  status: OrderStatusDisplay;
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
      userName: "Ahmed Mohammed",
      service: "Instagram Arab Followers",
      serviceId: "SRV-001",
      platform: "Instagram",
      quantity: 1000,
      link: "https://instagram.com/username",
      amount: 50,
      date: "2023-06-15",
      status: {
        value: "in-progress",
        label: "In Progress",
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
      userName: "Sarah Ali",
      service: "Twitter Likes",
      serviceId: "SRV-005",
      platform: "Twitter",
      quantity: 500,
      link: "https://twitter.com/username/status/123456789",
      amount: 25,
      date: "2023-06-14",
      status: {
        value: "completed",
        label: "Completed",
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
      userName: "Mohammed Khalid",
      service: "YouTube Views",
      serviceId: "SRV-004",
      platform: "YouTube",
      quantity: 5000,
      link: "https://youtube.com/watch?v=abcdefg",
      amount: 120,
      date: "2023-06-16",
      status: {
        value: "in-progress",
        label: "In Progress",
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
      userName: "Fatima Ahmed",
      service: "TikTok Followers",
      serviceId: "SRV-009",
      platform: "TikTok",
      quantity: 2000,
      link: "https://tiktok.com/@username",
      amount: 80,
      date: "2023-06-17",
      status: {
        value: "pending",
        label: "Pending",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      progress: 0,
    },
    {
      id: "ORD-005",
      userId: "USR-005",
      userName: "Omar Hassan",
      service: "Facebook Likes",
      serviceId: "SRV-006",
      platform: "Facebook",
      quantity: 300,
      link: "https://facebook.com/posts/123456789",
      amount: 15,
      date: "2023-06-16",
      status: {
        value: "partial",
        label: "Partially Completed",
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
      userName: "Ahmed Mohammed",
      service: "Instagram Comments",
      serviceId: "SRV-003",
      platform: "Instagram",
      quantity: 100,
      link: "https://instagram.com/p/123456789",
      amount: 30,
      date: "2023-06-13",
      status: {
        value: "cancelled",
        label: "Cancelled",
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
              label: "Completed",
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
              label: "Cancelled",
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Order Management
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Operation Successful!</AlertTitle>
          <AlertDescription>
            Order status has been updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order ID, username, or service..."
              className="pl-10 pr-4 w-full"
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
            Refresh Orders
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="partial">Partial</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
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
        <DialogContent className="max-w-3xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  {selectedOrder.id} - {selectedOrder.service}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="block font-semibold">Order ID</Label>
                  <p>{selectedOrder.id}</p>
                </div>
                <div className="space-y-2">
                  <Label className="block font-semibold">User</Label>
                  <p>
                    {selectedOrder.userName} ({selectedOrder.userId})
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="block font-semibold">Service</Label>
                  <p>
                    {selectedOrder.service} ({selectedOrder.serviceId})
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="block font-semibold">Platform</Label>
                  <p>{selectedOrder.platform}</p>
                </div>
                <div className="space-y-2">
                  <Label className="block font-semibold">Quantity</Label>
                  <p>{selectedOrder.quantity.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <Label className="block font-semibold">Amount</Label>
                  <p>${selectedOrder.amount}</p>
                </div>
                <div className="space-y-2">
                  <Label className="block font-semibold">Order Date</Label>
                  <p>{selectedOrder.date}</p>
                </div>
                <div className="space-y-2">
                  <Label className="block font-semibold">Last Update</Label>
                  <p>{selectedOrder.lastUpdate || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="block font-semibold">Status</Label>
                  <Badge className={selectedOrder.status.color}>
                    {selectedOrder.status.label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="block font-semibold">Progress</Label>
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
                <Label className="block font-semibold">Link</Label>
                <p className="break-all">{selectedOrder.link}</p>
              </div>

              {selectedOrder.apiOrderId && (
                <div className="space-y-2 col-span-2">
                  <Label className="block font-semibold">API Information</Label>
                  <p>API Order ID: {selectedOrder.apiOrderId}</p>
                  <p>Service Provider: {selectedOrder.apiProvider}</p>
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
                          Cancel Order
                        </Button>
                        <Button
                          onClick={() => {
                            setIsViewOrderDialogOpen(false);
                            setIsCompleteOrderDialogOpen(true);
                          }}
                        >
                          <CheckCheck className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </Button>
                      </>
                    )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsViewOrderDialogOpen(false)}
                >
                  Close
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Order Completion</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this order as completed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsCompleteOrderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCompleteOrder} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Completion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog
        open={isCancelOrderDialogOpen}
        onOpenChange={setIsCancelOrderDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Order Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsCancelOrderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Order Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-600">
                {orders.length}
              </p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">Completed Orders</h3>
              <p className="text-3xl font-bold text-green-600">
                {
                  orders.filter((order) => order.status.value === "completed")
                    .length
                }
              </p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">In Progress Orders</h3>
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
              <h3 className="font-semibold mb-1">Total Sales</h3>
              <p className="text-3xl font-bold text-purple-600">
                ${orders.reduce((total, order) => total + order.amount, 0)}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
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
                    <TableCell>${order.amount}</TableCell>
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
                    No matching orders found
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

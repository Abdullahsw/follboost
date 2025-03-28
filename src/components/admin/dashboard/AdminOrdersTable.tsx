import React from "react";
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
import { Eye, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderStatus } from "@/types/Order";

interface OrderStatusDisplay {
  value: OrderStatus;
  label: string;
  color: string;
}

interface Order {
  id: string;
  user: string;
  service: string;
  platform: string;
  quantity: number;
  amount: number;
  date: string;
  status: OrderStatusDisplay;
}

const getStatusBadge = (status: OrderStatusDisplay) => {
  return <Badge className={status.color}>{status.label}</Badge>;
};

const AdminOrdersTable = () => {
  const orders = [
    {
      id: "ORD-001",
      user: "Ahmed Mohammed",
      service: "Instagram Followers",
      platform: "Instagram",
      quantity: 1000,
      amount: 50,
      date: "2023-06-15",
      status: {
        value: "in-progress" as OrderStatus,
        label: "In Progress",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
    },
    {
      id: "ORD-002",
      user: "Sarah Ali",
      service: "Twitter Likes",
      platform: "Twitter",
      quantity: 500,
      amount: 25,
      date: "2023-06-14",
      status: {
        value: "completed" as OrderStatus,
        label: "Completed",
        color: "bg-green-100 text-green-800 hover:bg-green-100",
      },
    },
    {
      id: "ORD-003",
      user: "Mohammed Khalid",
      service: "YouTube Views",
      platform: "YouTube",
      quantity: 5000,
      amount: 120,
      date: "2023-06-16",
      status: {
        value: "in-progress" as OrderStatus,
        label: "In Progress",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
    },
    {
      id: "ORD-004",
      user: "Fatima Ahmed",
      service: "TikTok Followers",
      platform: "TikTok",
      quantity: 2000,
      amount: 80,
      date: "2023-06-17",
      status: {
        value: "pending" as OrderStatus,
        label: "Pending",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
    },
    {
      id: "ORD-005",
      user: "Omar Hassan",
      service: "Facebook Likes",
      platform: "Facebook",
      quantity: 300,
      amount: 15,
      date: "2023-06-16",
      status: {
        value: "cancelled" as OrderStatus,
        label: "Cancelled",
        color: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    },
  ];

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Latest Orders</CardTitle>
      </CardHeader>
      <CardContent>
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
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.user}</TableCell>
                  <TableCell>{order.service}</TableCell>
                  <TableCell>{order.platform}</TableCell>
                  <TableCell>{order.quantity.toLocaleString()}</TableCell>
                  <TableCell>${order.amount}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Confirm Order</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancel Order</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>More Options</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOrdersTable;

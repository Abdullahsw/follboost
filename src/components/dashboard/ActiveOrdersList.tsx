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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OrderStatus {
  value: "pending" | "in-progress" | "completed" | "cancelled";
  label: string;
  color: string;
}

interface Order {
  id: string;
  service: string;
  platform: string;
  quantity: number;
  progress: number;
  date: string;
  status: OrderStatus;
  link: string;
}

interface ActiveOrdersListProps {
  orders?: Order[];
  title?: string;
}

const getStatusBadge = (status: OrderStatus) => {
  return <Badge className={status.color}>{status.label}</Badge>;
};

const ActiveOrdersList = ({
  orders = [
    {
      id: "ORD-001",
      service: "Instagram Followers",
      platform: "Instagram",
      quantity: 1000,
      progress: 65,
      date: "2023-06-15",
      status: {
        value: "in-progress",
        label: "In Progress",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
      link: "https://instagram.com/username",
    },
    {
      id: "ORD-002",
      service: "Twitter Likes",
      platform: "Twitter",
      quantity: 500,
      progress: 100,
      date: "2023-06-14",
      status: {
        value: "completed",
        label: "Completed",
        color: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      link: "https://twitter.com/username/status/123456789",
    },
    {
      id: "ORD-003",
      service: "YouTube Views",
      platform: "YouTube",
      quantity: 5000,
      progress: 30,
      date: "2023-06-16",
      status: {
        value: "in-progress",
        label: "In Progress",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
      link: "https://youtube.com/watch?v=abcdefg",
    },
    {
      id: "ORD-004",
      service: "TikTok Followers",
      platform: "TikTok",
      quantity: 2000,
      progress: 0,
      date: "2023-06-17",
      status: {
        value: "pending",
        label: "Pending",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      link: "https://tiktok.com/@username",
    },
    {
      id: "ORD-005",
      service: "Facebook Likes",
      platform: "Facebook",
      quantity: 300,
      progress: 10,
      date: "2023-06-16",
      status: {
        value: "in-progress",
        label: "In Progress",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
      link: "https://facebook.com/posts/123456789",
    },
  ],
  title = "Active Orders",
}: ActiveOrdersListProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-right">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Order ID</TableHead>
                <TableHead className="text-right">Service</TableHead>
                <TableHead className="text-right">Platform</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Progress</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.service}</TableCell>
                  <TableCell>{order.platform}</TableCell>
                  <TableCell>{order.quantity.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={order.progress} className="h-2 w-full" />
                      <span className="text-xs text-gray-500">
                        {order.progress}%
                      </span>
                    </div>
                  </TableCell>
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

export default ActiveOrdersList;

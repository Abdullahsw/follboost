export type OrderStatus =
  | "completed"
  | "cancelled"
  | "pending"
  | "in-progress"
  | "refunded"
  | "partial";

export interface Order {
  id: string;
  userId: string;
  userName: string;
  service: string;
  serviceId: string;
  platform: string;
  status: OrderStatus;
  progress: number;
  lastUpdate: string;
  apiProvider?: string;
  quantity?: number;
  link?: string;
  price?: number;
  total?: number;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderStatusOption {
  value: OrderStatus;
  label: string;
  color: string;
}

export const ORDER_STATUS_OPTIONS: OrderStatusOption[] = [
  { value: "completed", label: "مكتمل", color: "green" },
  { value: "pending", label: "قيد الانتظار", color: "yellow" },
  { value: "in-progress", label: "قيد التنفيذ", color: "blue" },
  { value: "partial", label: "مكتمل جزئياً", color: "orange" },
  { value: "cancelled", label: "ملغي", color: "red" },
  { value: "refunded", label: "مسترجع", color: "purple" },
];

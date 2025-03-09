import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, Download, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface UserTransactionHistoryProps {
  userId: string;
}

const UserTransactionHistory: React.FC<UserTransactionHistoryProps> = ({
  userId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const pageSize = 10;

  // Load transactions on component mount and when filters change
  useEffect(() => {
    fetchTransactions();
  }, [userId, page, typeFilter, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Build query
      let query = supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Apply filters
      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setTransactions(data || []);
      if (count !== null) {
        setTotalTransactions(count);
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("حدث خطأ أثناء جلب سجل المعاملات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    // Convert transactions to CSV
    const headers = [
      "المعرف",
      "التاريخ",
      "النوع",
      "المبلغ",
      "طريقة الدفع",
      "الحالة",
      "ملاحظات",
    ];

    const csvRows = [
      headers.join(","),
      ...transactions.map((t) => {
        return [
          t.id,
          new Date(t.created_at).toLocaleString("ar-SA"),
          t.type === "credit" ? "إيداع" : "سحب",
          t.amount.toFixed(2),
          t.payment_method,
          t.status === "completed"
            ? "مكتمل"
            : t.status === "pending"
              ? "قيد الانتظار"
              : "ملغي",
          t.notes || "",
        ].join(",");
      }),
    ].join("\n");

    // Create a download link
    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${userId}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={transactions.length === 0}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              تصدير CSV
            </Button>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="نوع المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="credit">إيداع</SelectItem>
                <SelectItem value="debit">سحب</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardTitle className="text-xl font-bold text-right">
            سجل المعاملات
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">خطأ</AlertTitle>
            <AlertDescription className="text-right">{error}</AlertDescription>
          </Alert>
        )}

        <div className="overflow-x-auto">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المعرف</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">طريقة الدفع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    جاري تحميل البيانات...
                  </TableCell>
                </TableRow>
              ) : transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleString("ar-SA")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          transaction.type === "credit"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {transaction.type === "credit" ? "إيداع" : "سحب"}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.amount.toFixed(2)} ر.س</TableCell>
                    <TableCell>{transaction.payment_method}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {transaction.status === "completed"
                          ? "مكتمل"
                          : transaction.status === "pending"
                            ? "قيد الانتظار"
                            : "ملغي"}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.notes || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    لا توجد معاملات لعرضها
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isLoading}
            >
              السابق
            </Button>
            <span className="text-sm">
              صفحة {page} من {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || isLoading}
            >
              التالي
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTransactionHistory;

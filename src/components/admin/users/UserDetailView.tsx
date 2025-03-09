import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import UserBalanceManager from "./UserBalanceManager";
import UserTransactionHistory from "./UserTransactionHistory";

interface UserDetailViewProps {
  userId: string;
  onUserUpdated?: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({
  userId,
  onUserUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    notes: "",
  });

  // Load user data on component mount
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setError("");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserData(data);
      setFormData({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "user",
        status: data.status || "active",
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("حدث خطأ أثناء جلب بيانات المستخدم");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Update user profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
          notes: formData.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      setSuccess(true);

      // Refresh user data
      fetchUserData();

      // Call the callback if provided
      if (onUserUpdated) {
        onUserUpdated();
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.message || "حدث خطأ أثناء تحديث بيانات المستخدم");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <Card className="w-full bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-gray-500">جاري تحميل بيانات المستخدم...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم تحديث بيانات المستخدم بنجاح.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-right">
              معلومات المستخدم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {userData.full_name || "مستخدم"}
              </h3>
              <p className="text-gray-500">{userData.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  className={
                    userData.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {userData.status === "active" ? "نشط" : "غير نشط"}
                </Badge>
                <p className="text-right text-gray-500">الحالة</p>
              </div>

              <div className="flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-800">
                  {userData.role === "admin" ? "مدير" : "مستخدم"}
                </Badge>
                <p className="text-right text-gray-500">نوع الحساب</p>
              </div>

              <div className="flex items-center justify-between">
                <span>{userData.balance?.toFixed(2) || "0.00"} ر.س</span>
                <p className="text-right text-gray-500">الرصيد الحالي</p>
              </div>

              <div className="flex items-center justify-between">
                <span>{userData.phone || "غير محدد"}</span>
                <p className="text-right text-gray-500">رقم الهاتف</p>
              </div>

              <div className="flex items-center justify-between">
                <span>
                  {new Date(userData.created_at).toLocaleDateString("ar-SA")}
                </span>
                <p className="text-right text-gray-500">تاريخ التسجيل</p>
              </div>

              <div className="flex items-center justify-between">
                <span>
                  {userData.last_login
                    ? new Date(userData.last_login).toLocaleDateString("ar-SA")
                    : "لم يسجل دخول بعد"}
                </span>
                <p className="text-right text-gray-500">آخر تسجيل دخول</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="profile" dir="rtl" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
              <TabsTrigger value="balance">إدارة الرصيد</TabsTrigger>
              <TabsTrigger value="transactions">سجل المعاملات</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="w-full bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-right">
                    تعديل بيانات المستخدم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-right block">
                          الاسم الكامل
                        </Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-right block">
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="text-right bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 text-right">
                          لا يمكن تغيير البريد الإلكتروني
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-right block">
                          رقم الهاتف
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="text-right"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-right block">
                          نوع الحساب
                        </Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) =>
                            handleSelectChange("role", value)
                          }
                        >
                          <SelectTrigger id="role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">مستخدم</SelectItem>
                            <SelectItem value="admin">مدير</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-right block">
                          حالة الحساب
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            handleSelectChange("status", value)
                          }
                        >
                          <SelectTrigger id="status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">نشط</SelectItem>
                            <SelectItem value="inactive">غير نشط</SelectItem>
                            <SelectItem value="suspended">معلق</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-right block">
                        ملاحظات
                      </Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="text-right min-h-[100px]"
                        placeholder="أدخل أي ملاحظات إضافية عن المستخدم"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="balance">
              <UserBalanceManager
                userId={userId}
                onBalanceUpdated={() => {
                  fetchUserData();
                  if (onUserUpdated) onUserUpdated();
                }}
              />
            </TabsContent>

            <TabsContent value="transactions">
              <UserTransactionHistory userId={userId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDetailView;

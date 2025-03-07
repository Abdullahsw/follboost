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
  UserPlus,
  Edit,
  Trash,
  Ban,
  DollarSign,
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

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isAddBalanceDialogOpen, setIsAddBalanceDialogOpen] = useState(false);
  const [isWithdrawBalanceDialogOpen, setIsWithdrawBalanceDialogOpen] =
    useState(false);
  const [isBanUserDialogOpen, setIsBanUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);

  // Sample users data
  const [users, setUsers] = useState([
    {
      id: "USR-001",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+966 50 123 4567",
      balance: 250,
      totalSpent: 1200,
      ordersCount: 47,
      status: "نشط",
      registrationDate: "2023-06-15",
      lastLogin: "2023-06-20 14:30",
    },
    {
      id: "USR-002",
      name: "سارة علي",
      email: "sara@example.com",
      phone: "+966 55 987 6543",
      balance: 120,
      totalSpent: 850,
      ordersCount: 32,
      status: "نشط",
      registrationDate: "2023-06-10",
      lastLogin: "2023-06-19 09:15",
    },
    {
      id: "USR-003",
      name: "محمد خالد",
      email: "mohammed@example.com",
      phone: "+966 54 456 7890",
      balance: 0,
      totalSpent: 1500,
      ordersCount: 65,
      status: "محظور",
      registrationDate: "2023-05-20",
      lastLogin: "2023-06-01 11:45",
    },
    {
      id: "USR-004",
      name: "فاطمة أحمد",
      email: "fatima@example.com",
      phone: "+966 56 789 0123",
      balance: 500,
      totalSpent: 300,
      ordersCount: 12,
      status: "نشط",
      registrationDate: "2023-06-18",
      lastLogin: "2023-06-20 16:20",
    },
    {
      id: "USR-005",
      name: "عمر حسن",
      email: "omar@example.com",
      phone: "+966 59 321 6547",
      balance: 75,
      totalSpent: 950,
      ordersCount: 28,
      status: "نشط",
      registrationDate: "2023-05-30",
      lastLogin: "2023-06-19 13:10",
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get form data
    const name = (document.getElementById("new-user-name") as HTMLInputElement)
      ?.value;
    const email = (
      document.getElementById("new-user-email") as HTMLInputElement
    )?.value;
    const phone = (
      document.getElementById("new-user-phone") as HTMLInputElement
    )?.value;
    const password = (
      document.getElementById("new-user-password") as HTMLInputElement
    )?.value;

    // Validate form
    if (!name || !email || !password) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      setIsSubmitting(false);
      return;
    }

    // Create new user object
    const newUser = {
      id: `USR-00${users.length + 1}`,
      name,
      email,
      phone: phone || "-",
      balance: 0,
      totalSpent: 0,
      ordersCount: 0,
      status: "نشط",
      registrationDate: new Date().toISOString().split("T")[0],
      lastLogin: "-",
    };

    // Simulate API call
    setTimeout(() => {
      setUsers([...users, newUser]);
      setIsSubmitting(false);
      setSuccess(true);
      setIsAddUserDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get form data
    const name = (document.getElementById("edit-user-name") as HTMLInputElement)
      ?.value;
    const email = (
      document.getElementById("edit-user-email") as HTMLInputElement
    )?.value;
    const phone = (
      document.getElementById("edit-user-phone") as HTMLInputElement
    )?.value;

    // Validate form
    if (!name || !email) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      setIsSubmitting(false);
      return;
    }

    // Update user
    setTimeout(() => {
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          return { ...user, name, email, phone };
        }
        return user;
      });

      setUsers(updatedUsers);
      setIsSubmitting(false);
      setSuccess(true);
      setIsEditUserDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleAddBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get form data
    const amount = parseFloat(
      (document.getElementById("add-balance-amount") as HTMLInputElement)
        ?.value || "0",
    );

    // Validate form
    if (amount <= 0) {
      setError("يرجى إدخال مبلغ صحيح");
      setIsSubmitting(false);
      return;
    }

    // Update user balance
    setTimeout(() => {
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          return { ...user, balance: user.balance + amount };
        }
        return user;
      });

      setUsers(updatedUsers);
      setIsSubmitting(false);
      setSuccess(true);
      setIsAddBalanceDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleWithdrawBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get form data
    const amount = parseFloat(
      (document.getElementById("withdraw-balance-amount") as HTMLInputElement)
        ?.value || "0",
    );

    // Validate form
    if (amount <= 0) {
      setError("يرجى إدخال مبلغ صحيح");
      setIsSubmitting(false);
      return;
    }

    // Check if user has enough balance
    const user = users.find((u) => u.id === selectedUser.id);
    if (user.balance < amount) {
      setError("رصيد المستخدم غير كافٍ");
      setIsSubmitting(false);
      return;
    }

    // Update user balance
    setTimeout(() => {
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          return { ...user, balance: user.balance - amount };
        }
        return user;
      });

      setUsers(updatedUsers);
      setIsSubmitting(false);
      setSuccess(true);
      setIsWithdrawBalanceDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleBanUser = () => {
    setIsSubmitting(true);

    // Update user status
    setTimeout(() => {
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          return { ...user, status: user.status === "نشط" ? "محظور" : "نشط" };
        }
        return user;
      });

      setUsers(updatedUsers);
      setIsSubmitting(false);
      setSuccess(true);
      setIsBanUserDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleDeleteUser = () => {
    setIsSubmitting(true);

    // Delete user
    setTimeout(() => {
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);

      setUsers(updatedUsers);
      setIsSubmitting(false);
      setSuccess(true);
      setIsDeleteUserDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.includes(searchQuery) ||
          user.email.includes(searchQuery) ||
          user.id.includes(searchQuery),
      )
    : users;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إدارة المستخدمين
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم تنفيذ العملية بنجاح.
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
              placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني أو رقم المستخدم..."
              className="pl-10 pr-4 w-full text-right"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <Dialog
          open={isAddUserDialogOpen}
          onOpenChange={setIsAddUserDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <UserPlus className="h-4 w-4 mr-2" />
              إضافة مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">
                إضافة مستخدم جديد
              </DialogTitle>
              <DialogDescription className="text-right">
                أدخل بيانات المستخدم الجديد
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-user-name" className="text-right block">
                  الاسم
                </Label>
                <Input
                  id="new-user-name"
                  placeholder="أدخل اسم المستخدم"
                  className="text-right"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-user-email" className="text-right block">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="new-user-email"
                  type="email"
                  placeholder="example@domain.com"
                  dir="ltr"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-user-phone" className="text-right block">
                  رقم الهاتف (اختياري)
                </Label>
                <Input
                  id="new-user-phone"
                  placeholder="+966 5X XXX XXXX"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-user-password" className="text-right block">
                  كلمة المرور
                </Label>
                <Input
                  id="new-user-password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  dir="ltr"
                  required
                />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الإضافة..." : "إضافة المستخدم"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-right">
            قائمة المستخدمين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم المستخدم</TableHead>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">
                    البريد الإلكتروني
                  </TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">الرصيد</TableHead>
                  <TableHead className="text-right">إجمالي الإنفاق</TableHead>
                  <TableHead className="text-right">عدد الطلبات</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.balance} ر.س</TableCell>
                      <TableCell>{user.totalSpent} ر.س</TableCell>
                      <TableCell>{user.ordersCount}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === "نشط"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Dialog
                            open={
                              isEditUserDialogOpen &&
                              selectedUser?.id === user.id
                            }
                            onOpenChange={(open) => {
                              setIsEditUserDialogOpen(open);
                              if (open) setSelectedUser(user);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">
                                  تعديل بيانات المستخدم
                                </DialogTitle>
                                <DialogDescription className="text-right">
                                  {user.id} - {user.email}
                                </DialogDescription>
                              </DialogHeader>
                              <form
                                onSubmit={handleEditUser}
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="edit-user-name"
                                    className="text-right block"
                                  >
                                    الاسم
                                  </Label>
                                  <Input
                                    id="edit-user-name"
                                    defaultValue={user.name}
                                    className="text-right"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="edit-user-email"
                                    className="text-right block"
                                  >
                                    البريد الإلكتروني
                                  </Label>
                                  <Input
                                    id="edit-user-email"
                                    type="email"
                                    defaultValue={user.email}
                                    dir="ltr"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="edit-user-phone"
                                    className="text-right block"
                                  >
                                    رقم الهاتف
                                  </Label>
                                  <Input
                                    id="edit-user-phone"
                                    defaultValue={user.phone}
                                    dir="ltr"
                                  />
                                </div>
                                <DialogFooter className="mt-4">
                                  <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                      ? "جاري الحفظ..."
                                      : "حفظ التغييرات"}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={
                              isAddBalanceDialogOpen &&
                              selectedUser?.id === user.id
                            }
                            onOpenChange={(open) => {
                              setIsAddBalanceDialogOpen(open);
                              if (open) setSelectedUser(user);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-600"
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">
                                  إضافة رصيد
                                </DialogTitle>
                                <DialogDescription className="text-right">
                                  إضافة رصيد للمستخدم {user.name}
                                </DialogDescription>
                              </DialogHeader>
                              <form
                                onSubmit={handleAddBalance}
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="add-balance-amount"
                                    className="text-right block"
                                  >
                                    المبلغ
                                  </Label>
                                  <Input
                                    id="add-balance-amount"
                                    type="number"
                                    min="1"
                                    step="1"
                                    placeholder="أدخل المبلغ"
                                    className="text-right"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="add-balance-note"
                                    className="text-right block"
                                  >
                                    ملاحظة (اختياري)
                                  </Label>
                                  <Input
                                    id="add-balance-note"
                                    placeholder="أدخل ملاحظة"
                                    className="text-right"
                                  />
                                </div>
                                <DialogFooter className="mt-4">
                                  <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                      ? "جاري الإضافة..."
                                      : "إضافة الرصيد"}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={
                              isWithdrawBalanceDialogOpen &&
                              selectedUser?.id === user.id
                            }
                            onOpenChange={(open) => {
                              setIsWithdrawBalanceDialogOpen(open);
                              if (open) setSelectedUser(user);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-amber-600"
                              >
                                <DollarSign className="h-4 w-4 rotate-180" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">
                                  سحب رصيد
                                </DialogTitle>
                                <DialogDescription className="text-right">
                                  سحب رصيد من المستخدم {user.name}
                                </DialogDescription>
                              </DialogHeader>
                              <form
                                onSubmit={handleWithdrawBalance}
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="withdraw-balance-amount"
                                    className="text-right block"
                                  >
                                    المبلغ
                                  </Label>
                                  <Input
                                    id="withdraw-balance-amount"
                                    type="number"
                                    min="1"
                                    max={user.balance}
                                    step="1"
                                    placeholder="أدخل المبلغ"
                                    className="text-right"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="withdraw-balance-note"
                                    className="text-right block"
                                  >
                                    ملاحظة (اختياري)
                                  </Label>
                                  <Input
                                    id="withdraw-balance-note"
                                    placeholder="أدخل ملاحظة"
                                    className="text-right"
                                  />
                                </div>
                                <DialogFooter className="mt-4">
                                  <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                      ? "جاري السحب..."
                                      : "سحب الرصيد"}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={
                              isBanUserDialogOpen &&
                              selectedUser?.id === user.id
                            }
                            onOpenChange={(open) => {
                              setIsBanUserDialogOpen(open);
                              if (open) setSelectedUser(user);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-orange-600"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">
                                  {user.status === "نشط"
                                    ? "حظر المستخدم"
                                    : "إلغاء حظر المستخدم"}
                                </DialogTitle>
                                <DialogDescription className="text-right">
                                  {user.status === "نشط"
                                    ? "هل أنت متأكد من رغبتك في حظر هذا المستخدم؟ لن يتمكن من تسجيل الدخول أو استخدام الخدمات."
                                    : "هل أنت متأكد من رغبتك في إلغاء حظر هذا المستخدم؟ سيتمكن من تسجيل الدخول واستخدام الخدمات مرة أخرى."}
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsBanUserDialogOpen(false)}
                                >
                                  إلغاء
                                </Button>
                                <Button
                                  variant={
                                    user.status === "نشط"
                                      ? "destructive"
                                      : "default"
                                  }
                                  onClick={handleBanUser}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting
                                    ? "جاري التنفيذ..."
                                    : user.status === "نشط"
                                      ? "حظر المستخدم"
                                      : "إلغاء الحظر"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={
                              isDeleteUserDialogOpen &&
                              selectedUser?.id === user.id
                            }
                            onOpenChange={(open) => {
                              setIsDeleteUserDialogOpen(open);
                              if (open) setSelectedUser(user);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">
                                  حذف المستخدم
                                </DialogTitle>
                                <DialogDescription className="text-right">
                                  هل أنت متأكد من رغبتك في حذف هذا المستخدم؟ هذا
                                  الإجراء لا يمكن التراجع عنه.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setIsDeleteUserDialogOpen(false)
                                  }
                                >
                                  إلغاء
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleDeleteUser}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting
                                    ? "جاري الحذف..."
                                    : "حذف المستخدم"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      لا توجد نتائج مطابقة للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            إحصائيات المستخدمين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">إجمالي المستخدمين</h3>
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">المستخدمين النشطين</h3>
              <p className="text-3xl font-bold text-green-600">
                {users.filter((user) => user.status === "نشط").length}
              </p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-1">إجمالي الأرصدة</h3>
              <p className="text-3xl font-bold text-purple-600">
                {users.reduce((total, user) => total + user.balance, 0)} ر.س
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;

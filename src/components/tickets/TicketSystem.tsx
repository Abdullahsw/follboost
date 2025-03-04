import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TicketStatus {
  value: "open" | "pending" | "closed" | "answered";
  label: string;
  color: string;
}

interface Ticket {
  id: string;
  subject: string;
  department: string;
  date: string;
  status: TicketStatus;
  lastReply?: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  sender: "user" | "support";
  message: string;
  date: string;
  attachments?: string[];
}

const getStatusBadge = (status: TicketStatus) => {
  return <Badge className={status.color}>{status.label}</Badge>;
};

const TicketSystem = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketDepartment, setNewTicketDepartment] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const tickets: Ticket[] = [
    {
      id: "TKT-001",
      subject: "مشكلة في إضافة الرصيد",
      department: "الدعم الفني",
      date: "2023-06-15",
      status: {
        value: "open",
        label: "مفتوح",
        color: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      lastReply: "2023-06-16",
      messages: [
        {
          id: "MSG-001",
          sender: "user",
          message:
            "لدي مشكلة في إضافة الرصيد عبر بطاقة الائتمان، تظهر رسالة خطأ عند محاولة الدفع.",
          date: "2023-06-15 10:30",
        },
        {
          id: "MSG-002",
          sender: "support",
          message:
            "مرحباً، شكراً لتواصلك معنا. هل يمكنك مشاركة رسالة الخطأ التي تظهر لك؟ وهل جربت استخدام بطاقة أخرى؟",
          date: "2023-06-16 09:15",
        },
      ],
    },
    {
      id: "TKT-002",
      subject: "استفسار حول خدمة متابعين انستغرام",
      department: "المبيعات",
      date: "2023-06-14",
      status: {
        value: "answered",
        label: "تم الرد",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      lastReply: "2023-06-14",
      messages: [
        {
          id: "MSG-003",
          sender: "user",
          message:
            "هل المتابعين الذين سأحصل عليهم من خدمتكم حقيقيين أم وهميين؟ وهل هناك خطر على حسابي؟",
          date: "2023-06-14 14:20",
        },
        {
          id: "MSG-004",
          sender: "support",
          message:
            "مرحباً، نقدم متابعين عالي الجودة مع صور شخصية ومنشورات. خدماتنا آمنة تماماً ولا تتطلب كلمة المرور الخاصة بك، فقط رابط حسابك العام.",
          date: "2023-06-14 15:45",
        },
      ],
    },
    {
      id: "TKT-003",
      subject: "طلب استرداد مبلغ",
      department: "المالية",
      date: "2023-06-12",
      status: {
        value: "pending",
        label: "قيد المراجعة",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      },
      lastReply: "2023-06-13",
      messages: [
        {
          id: "MSG-005",
          sender: "user",
          message:
            "أرغب في استرداد مبلغ الطلب رقم ORD-123 لأن الخدمة لم تنفذ بالشكل المطلوب.",
          date: "2023-06-12 11:10",
        },
        {
          id: "MSG-006",
          sender: "support",
          message:
            "تم استلام طلبك وسيتم مراجعته من قبل قسم المالية. سنوافيك بالرد خلال 24 ساعة.",
          date: "2023-06-13 10:30",
        },
      ],
    },
    {
      id: "TKT-004",
      subject: "اقتراح خدمات جديدة",
      department: "المبيعات",
      date: "2023-06-10",
      status: {
        value: "closed",
        label: "مغلق",
        color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      },
      lastReply: "2023-06-11",
      messages: [
        {
          id: "MSG-007",
          sender: "user",
          message:
            "أقترح إضافة خدمة مشاهدات لمنصة Snapchat، أعتقد أنها ستكون مفيدة للكثير من المستخدمين.",
          date: "2023-06-10 16:45",
        },
        {
          id: "MSG-008",
          sender: "support",
          message:
            "شكراً لاقتراحك القيم! سنقوم بدراسة إمكانية إضافة هذه الخدمة في التحديث القادم للمنصة.",
          date: "2023-06-11 09:20",
        },
        {
          id: "MSG-009",
          sender: "user",
          message: "شكراً لكم على الاهتمام باقتراحي.",
          date: "2023-06-11 10:15",
        },
        {
          id: "MSG-010",
          sender: "support",
          message:
            "نحن نقدر مساهمتك في تطوير المنصة. سيتم إغلاق التذكرة الآن، ويمكنك فتح تذكرة جديدة إذا كان لديك أي استفسارات أخرى.",
          date: "2023-06-11 11:30",
        },
      ],
    },
  ];

  const departments = [
    { id: "1", name: "الدعم الفني" },
    { id: "2", name: "المبيعات" },
    { id: "3", name: "المالية" },
    { id: "4", name: "الاقتراحات والتطوير" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
    setReplyMessage("");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!newTicketSubject) {
      setError("يرجى إدخال عنوان التذكرة");
      return;
    }
    if (!newTicketDepartment) {
      setError("يرجى اختيار القسم");
      return;
    }
    if (!newTicketMessage) {
      setError("يرجى إدخال رسالة التذكرة");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setIsCreateDialogOpen(false);

      // Reset form
      setNewTicketSubject("");
      setNewTicketDepartment("");
      setNewTicketMessage("");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleReplyToTicket = () => {
    if (!replyMessage) {
      setError("يرجى إدخال رسالة الرد");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setReplyMessage("");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const activeTickets = tickets.filter(
    (ticket) => ticket.status.value !== "closed",
  );
  const closedTickets = tickets.filter(
    (ticket) => ticket.status.value === "closed",
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        نظام التذاكر
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم إرسال رسالتك بنجاح وسيتم الرد عليها في أقرب وقت ممكن.
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
              placeholder="ابحث عن تذكرة برقم التذكرة أو العنوان..."
              className="pl-10 pr-4 w-full text-right"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              تذكرة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">
                إنشاء تذكرة جديدة
              </DialogTitle>
              <DialogDescription className="text-right">
                أدخل تفاصيل التذكرة وسيتم الرد عليك في أقرب وقت ممكن.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-subject" className="text-right block">
                  عنوان التذكرة
                </Label>
                <Input
                  id="ticket-subject"
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="text-right"
                  placeholder="أدخل عنوان موجز للتذكرة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-department" className="text-right block">
                  القسم
                </Label>
                <Select
                  value={newTicketDepartment}
                  onValueChange={setNewTicketDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-message" className="text-right block">
                  الرسالة
                </Label>
                <Textarea
                  id="ticket-message"
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  className="text-right min-h-[120px]"
                  placeholder="اشرح مشكلتك أو استفسارك بالتفصيل"
                />
              </div>

              <DialogFooter className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الإرسال..." : "إرسال التذكرة"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">التذاكر النشطة</TabsTrigger>
          <TabsTrigger value="closed">التذاكر المغلقة</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                التذاكر النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full" dir="rtl">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        رقم التذكرة
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        العنوان
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        القسم
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        التاريخ
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        آخر رد
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        الحالة
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTickets.length > 0 ? (
                      activeTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.id}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.subject}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.department}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.date}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.lastReply || "-"}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(ticket.status)}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              <MessageSquare className="h-4 w-4 ml-1" />
                              عرض
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8">
                          لا توجد تذاكر نشطة حالياً
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                التذاكر المغلقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full" dir="rtl">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        رقم التذكرة
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        العنوان
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        القسم
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        التاريخ
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        آخر رد
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        الحالة
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {closedTickets.length > 0 ? (
                      closedTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.id}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.subject}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.department}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.date}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {ticket.lastReply || "-"}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(ticket.status)}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              <MessageSquare className="h-4 w-4 ml-1" />
                              عرض
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8">
                          لا توجد تذاكر مغلقة
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ticket Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl h-[80vh]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">
              {selectedTicket?.subject}
            </DialogTitle>
            <DialogDescription className="text-right">
              {selectedTicket?.id} - {selectedTicket?.department}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {selectedTicket?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${message.sender === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"}`}
                >
                  <div className="text-sm mb-1">
                    {message.sender === "user" ? "أنت" : "فريق الدعم"} -{" "}
                    {message.date}
                  </div>
                  <p className="whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedTicket?.status.value !== "closed" && (
            <div className="space-y-4 mt-4 border-t pt-4">
              <Label htmlFor="reply-message" className="text-right block">
                الرد
              </Label>
              <Textarea
                id="reply-message"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="text-right min-h-[100px]"
                placeholder="اكتب ردك هنا..."
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إغلاق
                </Button>
                <Button onClick={handleReplyToTicket} disabled={isSubmitting}>
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الرد"}
                </Button>
              </div>
            </div>
          )}

          {selectedTicket?.status.value === "closed" && (
            <div className="flex justify-end mt-4 border-t pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إغلاق
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketSystem;

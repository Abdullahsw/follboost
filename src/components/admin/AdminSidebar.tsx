import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  HelpCircle,
  LogOut,
  BarChart3,
  FileText,
  Package,
  Shield,
  Link as LinkIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({
  icon,
  label,
  href,
  active = false,
}: SidebarItemProps) => {
  return (
    <Link to={href} className="block w-full">
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 px-3 py-6 text-right",
          active ? "bg-secondary" : "hover:bg-secondary/50",
        )}
      >
        <div className="flex items-center gap-3 w-full">
          <span className="flex-shrink-0">{icon}</span>
          <span className="flex-grow text-right">{label}</span>
        </div>
      </Button>
    </Link>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const activePath = location.pathname;

  // Make sure all paths are active
  const isActive = (path: string) => {
    if (path === "/admin" && activePath === "/admin") return true;
    if (path !== "/admin" && activePath.includes(path)) return true;
    return false;
  };

  return (
    <div className="h-full w-[280px] bg-background border-l flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <div className="text-right">
            <p className="text-sm font-medium">لوحة الإدارة</p>
            <p className="text-xs text-muted-foreground">FollBoost Admin</p>
          </div>
        </div>

        <Separator className="my-4" />
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="لوحة التحكم"
            href="/admin"
            active={isActive("/admin")}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="إدارة المستخدمين"
            href="/admin/users"
            active={isActive("/admin/users")}
          />
          <SidebarItem
            icon={<ShoppingCart size={20} />}
            label="إدارة الطلبات"
            href="/admin/orders"
            active={isActive("/admin/orders")}
          />
          <SidebarItem
            icon={<Package size={20} />}
            label="إدارة الخدمات"
            href="/admin/services"
            active={isActive("/admin/services")}
          />
          <SidebarItem
            icon={<LinkIcon size={20} />}
            label="تكامل API"
            href="/admin/api-integration"
            active={isActive("/admin/api-integration")}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="اللوحات الفرعية"
            href="/admin/child-panel"
            active={isActive("/admin/child-panel")}
          />
          <SidebarItem
            icon={<BarChart3 size={20} />}
            label="التقارير والإحصائيات"
            href="/admin/reports"
            active={isActive("/admin/reports")}
          />
          <SidebarItem
            icon={<FileText size={20} />}
            label="المحتوى والصفحات"
            href="/admin/content"
            active={isActive("/admin/content")}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1 py-2">
          <SidebarItem
            icon={<Settings size={20} />}
            label="إعدادات النظام"
            href="/admin/settings"
            active={isActive("/admin/settings")}
          />
          <SidebarItem
            icon={<HelpCircle size={20} />}
            label="الدعم الفني"
            href="/admin/support"
            active={isActive("/admin/support")}
          />
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={async () => {
            try {
              await signOut();
              navigate("/admin/login");
            } catch (error) {
              console.error("Error signing out:", error);
            }
          }}
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Users,
  Wallet,
  Settings,
  HelpCircle,
  LogOut,
  Clock,
  Globe,
  MessageSquare,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  className?: string;
}

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

const Sidebar = ({ className = "" }: SidebarProps) => {
  // Use the current location to determine active path
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const activePath = location.pathname;

  return (
    <div
      className={cn(
        "h-full w-[280px] bg-background border-l flex flex-col",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "user"}`}
              alt={user?.user_metadata?.full_name || "مستخدم"}
            />
            <AvatarFallback>
              {user?.user_metadata?.full_name
                ? user.user_metadata.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)
                : "مس"}
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.user_metadata?.full_name || "مستخدم FollBoost"}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
        </div>

        <Separator className="my-4" />
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="لوحة التحكم"
            href="/dashboard"
            active={activePath === "/dashboard"}
          />
          <SidebarItem
            icon={<PlusCircle size={20} />}
            label="إنشاء طلب"
            href="/create-order"
            active={activePath === "/create-order"}
          />
          <SidebarItem
            icon={<Clock size={20} />}
            label="قائمة الخدمات"
            href="/services"
            active={activePath === "/services"}
          />
          <SidebarItem
            icon={<HelpCircle size={20} />}
            label="معلومات الخدمات"
            href="/services/info"
            active={activePath === "/services/info"}
          />
          <SidebarItem
            icon={<ListOrdered size={20} />}
            label="إدارة الطلبات"
            href="/orders"
            active={activePath === "/orders"}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="نظام الإحالة"
            href="/referrals"
            active={activePath === "/referrals"}
          />
          <SidebarItem
            icon={<Wallet size={20} />}
            label="إضافة رصيد"
            href="/add-funds"
            active={activePath === "/add-funds"}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1 py-2">
          <SidebarItem
            icon={<Settings size={20} />}
            label="الإعدادات"
            href="/settings"
            active={activePath === "/settings"}
          />
          <SidebarItem
            icon={<Globe size={20} />}
            label="اللغة والعملة"
            href="/settings"
            active={activePath === "/settings"}
          />
          <SidebarItem
            icon={<MessageSquare size={20} />}
            label="نظام التذاكر"
            href="/tickets"
            active={activePath === "/tickets"}
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
              navigate("/login");
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

export default Sidebar;

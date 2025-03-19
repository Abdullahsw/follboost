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
  Code,
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
          "w-full justify-start gap-3 px-3 py-6",
          active ? "bg-secondary" : "hover:bg-secondary/50",
        )}
      >
        <div className="flex items-center gap-3 w-full">
          <span className="flex-shrink-0">{icon}</span>
          <span className="flex-grow">{label}</span>
        </div>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const activePath = location.pathname;

  return (
    <div className="h-full w-[280px] bg-background border-l flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-8 bg-primary rounded-full" />
          <div>
            <p className="text-sm font-medium">Dashboard</p>
            <p className="text-xs text-muted-foreground">FollBoost</p>
          </div>
        </div>

        <Separator className="my-4" />
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            href="/dashboard"
            active={activePath === "/dashboard" || activePath === "/dashboard/"}
          />
          <SidebarItem
            icon={<PlusCircle size={20} />}
            label="Create Order"
            href="/dashboard/create-order"
            active={activePath.includes("/dashboard/create-order")}
          />
          <SidebarItem
            icon={<ListOrdered size={20} />}
            label="Manage Orders"
            href="/dashboard/orders"
            active={activePath.includes("/dashboard/orders")}
          />
          <SidebarItem
            icon={<Clock size={20} />}
            label="Services"
            href="/dashboard/services"
            active={activePath.includes("/dashboard/services")}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Referral System"
            href="/dashboard/referrals"
            active={activePath.includes("/dashboard/referrals")}
          />
          <SidebarItem
            icon={<Wallet size={20} />}
            label="Add Funds"
            href="/dashboard/add-funds"
            active={activePath.includes("/dashboard/add-funds")}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1 py-2">
          <SidebarItem
            icon={<MessageSquare size={20} />}
            label="Support Tickets"
            href="/dashboard/tickets"
            active={activePath.includes("/dashboard/tickets")}
          />
          <SidebarItem
            icon={<Globe size={20} />}
            label="Help"
            href="/dashboard/help"
            active={activePath.includes("/dashboard/help")}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            href="/dashboard/settings"
            active={activePath.includes("/dashboard/settings")}
          />
          <SidebarItem
            icon={<Code size={20} />}
            label="API Settings"
            href="/dashboard/api-settings"
            active={activePath.includes("/dashboard/api-settings")}
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
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

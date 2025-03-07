import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, Search, User, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  userName?: string;
  userAvatar?: string;
  isLoggedIn?: boolean;
}

const AdminHeader = ({
  onToggleSidebar = () => {},
  userName = "مدير النظام",
  userAvatar = "",
  isLoggedIn = true,
}: AdminHeaderProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Admin searching for:", searchQuery);
    alert(`جاري البحث عن: ${searchQuery}`);
  };

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Admin logging out");
    navigate("/admin/login");
  };

  return (
    <header className="bg-primary text-white border-b border-primary-foreground/20 h-20 w-full flex items-center justify-between px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-primary-foreground/20"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <Link to="/admin" className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <div className="font-bold text-2xl">FollBoost Admin</div>
        </Link>
      </div>

      <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
        <form onSubmit={handleSearch} className="w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <Input
            placeholder="بحث في لوحة التحكم..."
            className="pl-10 pr-4 w-full text-right bg-primary-foreground/20 border-primary-foreground/30 text-white placeholder:text-white/70"
            dir="rtl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-primary-foreground/20"
              onClick={() => alert("تم النقر على زر الإشعارات")}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-primary-foreground/20"
                >
                  <Avatar>
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-primary-foreground text-primary">
                      {userName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" dir="rtl">
                <DropdownMenuLabel className="text-right">
                  {userName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-right">
                  <Link
                    to="/admin/profile"
                    className="flex w-full justify-end items-center gap-2"
                  >
                    الملف الشخصي
                    <User className="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-right">
                  <Link
                    to="/admin/settings"
                    className="flex w-full justify-end items-center gap-2"
                  >
                    الإعدادات
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-right text-red-500"
                  onClick={handleLogout}
                >
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/login")}
            >
              تسجيل الدخول
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;

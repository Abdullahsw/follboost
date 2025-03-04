import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, Menu, Search, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

interface HeaderProps {
  onToggleSidebar?: () => void;
  userName?: string;
  userAvatar?: string;
  isLoggedIn?: boolean;
}

const Header = ({
  onToggleSidebar = () => {},
  userName = "محمد أحمد",
  userAvatar = "",
  isLoggedIn = true,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logging out");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 h-20 w-full flex items-center justify-between px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <Link to="/" className="flex items-center gap-2">
          <div className="font-bold text-2xl text-primary">FollBoost</div>
        </Link>
      </div>

      <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
        <form onSubmit={handleSearch} className="w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ابحث عن خدمات أو طلبات..."
            className="pl-10 pr-4 w-full text-right"
            dir="rtl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-primary text-white">
                      {userName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 text-right">
                <DropdownMenuLabel className="text-right">
                  {userName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-right">
                  <Link
                    to="/profile"
                    className="flex w-full justify-end items-center gap-2"
                  >
                    الملف الشخصي
                    <User className="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-right">
                  <Link
                    to="/settings"
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
              onClick={() => navigate("/login")}
            >
              تسجيل الدخول
            </Button>
            <Button size="sm" onClick={() => navigate("/login")}>
              إنشاء حساب
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

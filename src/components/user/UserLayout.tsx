import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";

interface UserLayoutProps {
  userName?: string;
  userAvatar?: string;
}

const UserLayout = ({
  userName = "محمد أحمد",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
}: UserLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile by default */}
      <div
        className={`fixed inset-y-0 right-0 z-50 transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={toggleSidebar}
          userName={userName}
          userAvatar={userAvatar}
          isLoggedIn={true}
        />

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

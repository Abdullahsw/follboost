import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "block" : "hidden"} md:block md:w-[280px] flex-shrink-0`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userName="محمد أحمد"
          userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
          isLoggedIn={true}
        />

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
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

import React, { useState } from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import DashboardStats from "./dashboard/DashboardStats";
import PerformanceChart from "./dashboard/PerformanceChart";
import ActiveOrdersList from "./dashboard/ActiveOrdersList";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
  balance?: number;
  activeOrders?: number;
  completedOrders?: number;
  commissions?: number;
}

const Home = ({
  userName = "John Smith",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
  balance = 250,
  activeOrders = 5,
  completedOrders = 42,
  commissions = 120,
}: HomeProps) => {
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
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Dashboard Stats */}
            <DashboardStats
              balance={balance}
              activeOrders={activeOrders}
              completedOrders={completedOrders}
              commissions={commissions}
            />

            {/* Performance Chart */}
            <PerformanceChart />

            {/* Active Orders List */}
            <ActiveOrdersList />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-col space-y-3">
                  <button className="bg-primary text-white py-2 px-4 rounded-md w-full hover:bg-primary/90 transition-colors">
                    Create New Order
                  </button>
                  <button className="bg-green-500 text-white py-2 px-4 rounded-md w-full hover:bg-green-600 transition-colors">
                    Add Funds
                  </button>
                  <button className="bg-purple-500 text-white py-2 px-4 rounded-md w-full hover:bg-purple-600 transition-colors">
                    Invite a Friend
                  </button>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">
                  Recent Activities
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      action: "Funds Added",
                      details: "$50",
                      time: "2 hours ago",
                    },
                    {
                      action: "New Order Created",
                      details: "Instagram Followers",
                      time: "5 hours ago",
                    },
                    {
                      action: "Order Completed",
                      details: "Twitter Likes",
                      time: "1 day ago",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-gray-500 text-sm">
                        {activity.time}
                      </span>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">
                          {activity.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;

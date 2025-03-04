import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import AdminAuthGuard from "./components/auth/AdminAuthGuard";

// Auth Pages
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const RegisterPage = lazy(() => import("./components/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("./components/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("./components/auth/ResetPasswordPage"),
);
const AdminLoginPage = lazy(() => import("./components/auth/AdminLoginPage"));
const AdminUser = lazy(() => import("./components/auth/AdminUser"));

// User Pages
const UserLayout = lazy(() => import("./components/user/UserLayout"));
const UserDashboard = lazy(
  () => import("./components/user/dashboard/UserDashboard"),
);
const ServicesPage = lazy(() => import("./components/services/ServicesPage"));
const ServicesList = lazy(() => import("./components/services/ServicesList"));
const CreateOrderPage = lazy(
  () => import("./components/orders/CreateOrderPage"),
);
const OrdersManagementPage = lazy(
  () => import("./components/orders/OrdersManagementPage"),
);
const AddFundsPage = lazy(() => import("./components/funds/AddFundsPage"));
const ReferralProgramPage = lazy(
  () => import("./components/referrals/ReferralProgramPage"),
);
const ProfilePage = lazy(() => import("./components/profile/ProfilePage"));
const TicketSystem = lazy(() => import("./components/tickets/TicketSystem"));
const LanguageCurrencySettings = lazy(
  () => import("./components/settings/LanguageCurrencySettings"),
);

// Admin Pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(
  () => import("./components/admin/dashboard/AdminDashboard"),
);
const AdminApiIntegration = lazy(
  () => import("./components/admin/AdminApiIntegration"),
);
const AdminChildPanel = lazy(
  () => import("./components/admin/AdminChildPanel"),
);

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            جاري التحميل...
          </div>
        }
      >
        <>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/create-user" element={<AdminUser />} />

            {/* Protected User Routes */}
            <Route
              path="/"
              element={
                <AuthGuard>
                  <UserLayout />
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="services" element={<ServicesList />} />
              <Route path="services/info" element={<ServicesPage />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="orders" element={<OrdersManagementPage />} />
              <Route path="create-order" element={<CreateOrderPage />} />
              <Route path="referrals" element={<ReferralProgramPage />} />
              <Route path="add-funds" element={<AddFundsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<LanguageCurrencySettings />} />
              <Route path="tickets" element={<TicketSystem />} />
              <Route path="help" element={<ServicesPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminAuthGuard>
                  <AdminLayout />
                </AdminAuthGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminDashboard />} />
              <Route path="services" element={<AdminDashboard />} />
              <Route path="api-integration" element={<AdminApiIntegration />} />
              <Route path="child-panel" element={<AdminChildPanel />} />
              <Route path="reports" element={<AdminDashboard />} />
              <Route path="content" element={<AdminDashboard />} />
              <Route path="settings" element={<AdminDashboard />} />
              <Route path="support" element={<AdminDashboard />} />
              <Route path="profile" element={<AdminDashboard />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;

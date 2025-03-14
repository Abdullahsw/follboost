import { Suspense, lazy, useState, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import AdminAuthGuard from "./components/auth/AdminAuthGuard";
import AdminFundsManagement from "./components/admin/funds/AdminFundsManagement";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  supabaseClient as supabase,
  checkSupabaseConnection,
  isInOfflineMode,
  enableOfflineMode,
} from "./lib/supabase-client";

// Landing Pages
const LandingPage = lazy(() => import("./components/landing/LandingPage"));
const TermsPage = lazy(() => import("./components/landing/TermsPage"));
const PrivacyPage = lazy(() => import("./components/landing/PrivacyPage"));

// Settings Pages
const ApiSettings = lazy(() => import("./components/settings/ApiSettings"));
const SupabaseSettings = lazy(
  () => import("./components/settings/SupabaseSettings"),
);

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
const AdminEmailVerification = lazy(
  () => import("./components/auth/AdminEmailVerification"),
);

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
const ServiceManagement = lazy(
  () => import("./components/admin/services/ServiceManagement"),
);
const UserManagement = lazy(
  () => import("./components/admin/users/UserManagement"),
);
const OrderManagement = lazy(
  () => import("./components/admin/orders/OrderManagement"),
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test Supabase connection
    const testConnection = async () => {
      try {
        console.log("Testing Supabase connection...");
        console.log("Environment variables:", {
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL
            ? "set"
            : "not set",
          VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
            ? "set"
            : "not set",
        });

        // Use the checkSupabaseConnection helper instead of direct query
        const { success, error, data } = await checkSupabaseConnection();

        if (!success) {
          console.error("Supabase connection error:", error);
          // If we're in offline mode, don't show an error, just continue with limited functionality
          if (isInOfflineMode()) {
            console.log("Running in offline mode with limited functionality");
            setIsLoading(false);
            return;
          }
          throw error;
        }

        console.log("Supabase connection successful:", data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error:", err);
        // Show a more user-friendly error message
        setError(
          "لا يمكن الاتصال بقاعدة البيانات. يرجى التحقق من اتصال الإنترنت الخاص بك أو تشغيل الوضع غير المتصل.",
        );
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">جاري تحميل التطبيق...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ في التطبيق</h1>
        <p className="text-gray-700 mb-4 text-center">{error}</p>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            إعادة تحميل التطبيق
          </button>
          <button
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            onClick={() => {
              enableOfflineMode();
              setError(null);
              setIsLoading(false);
            }}
          >
            تشغيل الوضع غير المتصل
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              جاري التحميل...
            </div>
          }
        >
          <>
            {/* Tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

            <Routes>
              {/* Public Landing Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/create-user" element={<AdminUser />} />
              <Route
                path="/admin/verify-email"
                element={<AdminEmailVerification />}
              />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <UserLayout />
                  </AuthGuard>
                }
              >
                <Route index element={<UserDashboard />} />
                <Route path="services" element={<ServicesList />} />
                <Route path="services/info" element={<ServicesPage />} />
                <Route path="orders" element={<OrdersManagementPage />} />
                <Route path="create-order" element={<CreateOrderPage />} />
                <Route path="referrals" element={<ReferralProgramPage />} />
                <Route path="add-funds" element={<AddFundsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<LanguageCurrencySettings />} />
                <Route path="api-settings" element={<ApiSettings />} />
                <Route
                  path="supabase-settings"
                  element={<SupabaseSettings />}
                />
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
                <Route path="users" element={<UserManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="services" element={<ServiceManagement />} />
                <Route path="funds" element={<AdminFundsManagement />} />
                <Route
                  path="api-integration"
                  element={<AdminApiIntegration />}
                />
                <Route path="child-panel" element={<AdminChildPanel />} />
                <Route
                  path="reports"
                  element={
                    <div className="max-w-7xl mx-auto p-6">
                      <h1 className="text-2xl font-bold text-right mb-6">
                        التقارير والإحصائيات
                      </h1>
                      <p className="text-center p-10 bg-white rounded-lg shadow">
                        قسم التقارير والإحصائيات قيد التطوير
                      </p>
                    </div>
                  }
                />
                <Route
                  path="content"
                  element={
                    <div className="max-w-7xl mx-auto p-6">
                      <h1 className="text-2xl font-bold text-right mb-6">
                        المحتوى والصفحات
                      </h1>
                      <p className="text-center p-10 bg-white rounded-lg shadow">
                        قسم المحتوى والصفحات قيد التطوير
                      </p>
                    </div>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <div className="max-w-7xl mx-auto p-6">
                      <h1 className="text-2xl font-bold text-right mb-6">
                        إعدادات النظام
                      </h1>
                      <p className="text-center p-10 bg-white rounded-lg shadow">
                        قسم إعدادات النظام قيد التطوير
                      </p>
                    </div>
                  }
                />
                <Route
                  path="support"
                  element={
                    <div className="max-w-7xl mx-auto p-6">
                      <h1 className="text-2xl font-bold text-right mb-6">
                        الدعم الفني
                      </h1>
                      <p className="text-center p-10 bg-white rounded-lg shadow">
                        قسم الدعم الفني قيد التطوير
                      </p>
                    </div>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <div className="max-w-7xl mx-auto p-6">
                      <h1 className="text-2xl font-bold text-right mb-6">
                        الملف الشخصي
                      </h1>
                      <p className="text-center p-10 bg-white rounded-lg shadow">
                        قسم الملف الشخصي قيد التطوير
                      </p>
                    </div>
                  }
                />
              </Route>

              {/* Add this before any catchall route */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

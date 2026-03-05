import { Routes, Route, Navigate } from "react-router-dom";
import { useMe } from "@timevault/api-client";
import { ThemeProvider, defaultConfig } from "@timevault/theme";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CapsulesPage from "./pages/CapsulesPage";
import ChainsPage from "./pages/ChainsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AppLayout from "./components/layout/AppLayout";

function ProtectedRoutes() {
  const { data: user, isLoading, isError } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/capsules" element={<CapsulesPage />} />
        <Route path="/chains" element={<ChainsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider config={defaultConfig}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </ThemeProvider>
  );
}

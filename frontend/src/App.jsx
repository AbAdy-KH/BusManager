import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import DriverPage from './pages/DriverPage';
import BusDriverPage from './pages/BusDriverPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function RequireRole({ role, children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && !user?.roles?.includes(role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Index / Login */}
            <Route index element={<LoginPage />} />

            {/* Admin Dashboard: Strictly Admin Only */}
            <Route
              path="admin"
              element={
                <RequireRole role="Admin">
                  <AdminPage />
                </RequireRole>
              }
            />

            {/* Bus & Driver Attendance Page: Strictly Admin Only */}
            <Route
              path="admin/attendance"
              element={
                <RequireRole role="Admin">
                  <BusDriverPage />
                </RequireRole>
              }
            />
            <Route path="bus-driver" element={<Navigate to="/admin/attendance" replace />} />
            <Route path="attendance" element={<Navigate to="/admin/attendance" replace />} />

            {/* Driver Dashboard: For Drivers */}
            <Route
              path="driver"
              element={
                <RequireRole role="Driver">
                  <DriverPage />
                </RequireRole>
              }
            />

            <Route path="login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  );
}

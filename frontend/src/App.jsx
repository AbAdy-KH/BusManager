import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import DriverPage from './pages/DriverPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

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
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Driver Dashboard: For Drivers */}
            <Route
              path="driver"
              element={
                <ProtectedRoute allowedRoles={['Driver', 'Admin']}>
                  <DriverPage />
                </ProtectedRoute>
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

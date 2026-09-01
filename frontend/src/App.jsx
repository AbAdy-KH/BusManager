import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main index page is the Login page */}
          <Route index element={<LoginPage />} />
          {/* Admin fleet management dashboard */}
          <Route path="admin" element={<AdminPage />} />
          {/* Fallback alias /login -> / */}
          <Route path="login" element={<Navigate to="/" replace />} />
          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function useLoginPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, loading, error, clearError } = useAuth();
  const { t, isRtl } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!email.trim() || !password) return;

    const res = await login({ email, password });
    if (res.success) {
      if (res.user?.roles?.includes('Admin')) {
        navigate('/admin');
      } else if (res.user?.roles?.includes('Driver')) {
        navigate('/driver');
      } else {
        navigate('/');
      }
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const isAdmin = user?.roles?.includes('Admin');
  const isDriver = user?.roles?.includes('Driver');

  const targetDashboardUrl = isAdmin ? '/admin' : isDriver ? '/driver' : '/';
  const targetDashboardLabel = isAdmin ? t.adminDashboard : isDriver ? t.driverDashboard : t.goToDashboard;

  return {
    t,
    user,
    isAuthenticated,
    loading,
    error,
    clearError,
    logout,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleSubmit,
    ArrowIcon,
    targetDashboardUrl,
    targetDashboardLabel,
  };
}

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DriverTrackerBar from '../driver/DriverTrackerBar';
import { useLanguage } from '../../context/useLanguage';

export default function Layout() {
  const { isRtl } = useLanguage();

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-slate-900 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white"
    >
      <Navbar />
      <DriverTrackerBar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

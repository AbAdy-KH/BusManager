import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../../context/useLanguage';

export default function Layout() {
  const { isRtl } = useLanguage();

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-[#faf7f2] text-slate-800 antialiased selection:bg-indigo-500 selection:text-white"
    >
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

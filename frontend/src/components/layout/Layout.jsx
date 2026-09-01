import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DriverTrackerBar from '../driver/DriverTrackerBar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar />
      {/* Global driver telemetry bar: active only when a user with Driver role is logged in */}
      <DriverTrackerBar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

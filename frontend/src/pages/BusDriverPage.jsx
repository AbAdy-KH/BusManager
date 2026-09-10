import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/useLanguage';
import {
  fetchBusDriverAssignments,
  fetchDrivers,
  fetchBuses,
  deleteBusDriverAssignment,
  getTodayDateString,
} from '../services/adminService';
import AttendanceStats from '../components/attendance/AttendanceStats';
import AttendanceTable from '../components/attendance/AttendanceTable';
import UnassignedDriversList from '../components/attendance/UnassignedDriversList';
import AssignBusModal from '../components/attendance/AssignBusModal';
import {
  Calendar,
  Plus,
  RefreshCw,
  Search,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function BusDriverPage() {
  const { t } = useLanguage();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriverForModal, setSelectedDriverForModal] = useState('');

  const loadData = useCallback(async (dateToFetch = selectedDate) => {
    setLoading(true);
    setError(null);
    try {
      const [assignmentsRes, driversRes, busesRes] = await Promise.allSettled([
        fetchBusDriverAssignments(dateToFetch),
        fetchDrivers(),
        fetchBuses(),
      ]);

      if (assignmentsRes.status === 'fulfilled') {
        setAssignments(assignmentsRes.value || []);
      } else {
        console.warn('Assignments fetch failed:', assignmentsRes.reason);
      }

      if (driversRes.status === 'fulfilled') {
        setDrivers(driversRes.value || []);
      }

      if (busesRes.status === 'fulfilled') {
        setBuses(busesRes.value || []);
      }

      const allFailed = [assignmentsRes, driversRes, busesRes].every(
        (r) => r.status === 'rejected'
      );
      if (allFailed) {
        throw new Error('Could not connect to backend service.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate, loadData]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    loadData(newDate);
  };

  const handleOpenModal = (driverId = '') => {
    setSelectedDriverForModal(driverId);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setSuccessMsg(t.assignSuccess);
    setTimeout(() => setSuccessMsg(null), 4000);
    loadData(selectedDate);
  };

  const handleUnassign = async (id) => {
    try {
      await deleteBusDriverAssignment(id);
      setSuccessMsg(t.unassignSuccess);
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData(selectedDate);
    } catch (err) {
      setError(err.message || 'Failed to remove assignment.');
    }
  };

  // Determine assigned drivers vs unassigned drivers
  const assignedDriverIdSet = new Set(assignments.map((a) => a.driverId));
  const assignedBusIdSet = new Set(assignments.map((a) => a.busId));

  const unassignedDrivers = drivers.filter(
    (driver) => !assignedDriverIdSet.has(driver.driverId)
  );

  const isToday = selectedDate === getTodayDateString();

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {t.busDriverTitle}
            </h1>
          </div>
        </div>

        {/* Date Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-white border border-cream-300 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-4 h-4 text-sky-600" />
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => handleDateChange(e.target.value)}
              className="text-xs font-mono text-gray-800 bg-transparent focus:outline-none"
            />
          </div>

          {!isToday && (
            <button
              type="button"
              onClick={() => handleDateChange(getTodayDateString())}
              className="px-3 py-1.5 bg-cream-200 hover:bg-cream-300 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {t.today}
            </button>
          )}

          <button
            type="button"
            onClick={() => handleOpenModal('')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.assignBus}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadData(selectedDate)}
            className="font-bold underline text-rose-900 cursor-pointer"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* Statistics Overview */}
      <AttendanceStats
        totalDriversCount={drivers.length}
        assignedDriversCount={assignments.length}
        unassignedDriversCount={unassignedDrivers.length}
        totalBusesCount={buses.length}
        assignedBusesCount={assignedBusIdSet.size}
      />

      {/* Unassigned Drivers Widget */}
      <UnassignedDriversList
        unassignedDrivers={unassignedDrivers}
        onQuickAssign={handleOpenModal}
      />

      {/* Main Attendance Table Card */}
      <div className="bg-white border border-cream-300 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Top Bar with Search */}
        <div className="p-4 border-b border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {t.busDriver}
            </h2>
            <span className="text-[11px] text-gray-500 font-mono">
              {selectedDate} {isToday ? `(${t.today})` : ''}
            </span>
          </div>

          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 rtl:pl-3 rtl:pr-8 pr-3 py-1.5 bg-white border border-cream-300 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-600 text-left rtl:text-right"
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-gray-400 gap-2">
            <div className="w-6 h-6 border-2 border-sky-600/30 border-t-sky-600 rounded-full animate-spin" />
            <span className="text-xs">{t.signingIn}</span>
          </div>
        ) : (
          <AttendanceTable
            assignments={assignments}
            searchTerm={searchTerm}
            onUnassign={handleUnassign}
            onOpenAssignModal={() => handleOpenModal('')}
          />
        )}
      </div>

      {/* Modal Dialog */}
      <AssignBusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        drivers={drivers}
        buses={buses}
        assignments={assignments}
        initialDriverId={selectedDriverForModal}
        selectedDate={selectedDate}
      />
    </div>
  );
}

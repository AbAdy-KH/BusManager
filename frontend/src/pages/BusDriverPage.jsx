import { useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import { useAttendance } from '../hooks/useAttendance.js';
import AttendanceHeader from '../components/attendance/AttendanceHeader';
import AttendanceStats from '../components/attendance/AttendanceStats';
import AttendanceTable from '../components/attendance/AttendanceTable';
import AssignBusModal from '../components/attendance/AssignBusModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BusDriverPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    selectedDate,
    isToday,
    handleDateChange,
    assignments,
    drivers,
    buses,
    stats,
    loading,
    error,
    successMsg,
    loadData,
    handleUnassign,
    isModalOpen,
    selectedDriverForModal,
    handleOpenModal,
    handleCloseModal,
    handleModalSuccess,
  } = useAttendance();

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Top Header */}
      <AttendanceHeader
        selectedDate={selectedDate}
        isToday={isToday}
        onDateChange={handleDateChange}
        onOpenAssignModal={handleOpenModal}
      />

      {/* Notifications */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn shadow-xs">
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
      <AttendanceStats {...stats} />

      {/* Main Attendance Table Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Top Bar with Search */}
        <div className="p-4 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/60">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t.busDriver}
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              {selectedDate} {isToday ? `(${t.today})` : ''}
            </span>
          </div>

          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 rtl:pl-3 rtl:pr-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600 text-left rtl:text-right shadow-2xs"
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
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
        onClose={handleCloseModal}
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

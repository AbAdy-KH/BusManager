import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchBusDriverAssignments,
  fetchDrivers,
  fetchBuses,
  deleteBusDriverAssignment,
  getTodayDateString,
} from '../services/adminService';
import { useLanguage } from '../context/useLanguage';

export function useAttendance() {
  const { t } = useLanguage();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  // Compute stats memo
  const stats = useMemo(() => {
    const assignedDriverIdSet = new Set(assignments.map((a) => a.driverId));
    const assignedBusIdSet = new Set(assignments.map((a) => a.busId));

    const unassignedCount = drivers.filter(
      (driver) => !assignedDriverIdSet.has(driver.driverId)
    ).length;

    return {
      totalDriversCount: drivers.length,
      assignedDriversCount: assignments.length,
      unassignedDriversCount: unassignedCount,
      totalBusesCount: buses.length,
      assignedBusesCount: assignedBusIdSet.size,
    };
  }, [assignments, drivers, buses]);

  const isToday = selectedDate === getTodayDateString();

  return {
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
  };
}

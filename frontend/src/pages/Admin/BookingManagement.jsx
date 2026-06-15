import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Compass, ShieldCheck, UserCheck, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import Spinner from '../../components/UI/Spinner';
import Modal from '../../components/UI/Modal';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Driver assign modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [chosenDriverId, setChosenDriverId] = useState('');
  const [submittingAssign, setSubmittingAssign] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data && res.data.success) {
        setBookings(res.data.bookings);
      }

      // Fetch available drivers
      const driverRes = await api.get('/drivers?availabilityStatus=Available');
      if (driverRes.data && driverRes.data.success) {
        setDrivers(driverRes.data.drivers);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Workflow transition failed');
    }
  };

  const handleOpenAssignModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setChosenDriverId('');
    setAssignModalOpen(true);
  };

  const handleAssignDriverSubmit = async (e) => {
    e.preventDefault();
    if (!chosenDriverId) return;
    setSubmittingAssign(true);

    try {
      const res = await api.put(`/bookings/${selectedBookingId}/assign-driver`, { driverId: chosenDriverId });
      if (res.data && res.data.success) {
        setAssignModalOpen(false);
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Driver assignment failed');
    } finally {
      setSubmittingAssign(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Trip Bookings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Review requests, approve reservations, and dispatch drivers.</p>
      </div>

      {loading ? (
        <div className="h-60 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-205 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-sm">No bookings recorded in database.</p>
        </div>
      ) : (
        <div className="rounded-3xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-xxs tracking-wider">
                  <th className="py-3 px-6">Customer / Route</th>
                  <th className="py-3 px-6">Car Specs</th>
                  <th className="py-3 px-6">Date Schedule</th>
                  <th className="py-3 px-6">Assigned Driver</th>
                  <th className="py-3 px-6">Billing</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Dispatch Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-850/50">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all text-xs">
                    <td className="py-4 px-6 space-y-0.5">
                      <span className="font-bold text-slate-900 dark:text-white block">{b.customerName}</span>
                      <span className="text-xxs text-slate-400 block">{b.mobileNumber}</span>
                      <span className="text-xxs text-slate-500 font-semibold block">{b.pickupLocation} ➔ {b.dropLocation}</span>
                    </td>
                    <td className="py-4 px-6 space-y-0.5 font-semibold">
                      <span>{b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'N/A'}</span>
                      <span className="text-xxs text-slate-450 block uppercase">Reg: {b.vehicle?.registrationNumber || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6 space-y-0.5 text-slate-500 dark:text-slate-450">
                      <div>Start: {new Date(b.rentalDate).toLocaleDateString()}</div>
                      <div>End: {new Date(b.returnDate).toLocaleDateString()}</div>
                      <div className="text-xxs text-slate-400">({b.totalDays} Days)</div>
                    </td>
                    <td className="py-4 px-6">
                      {b.driver ? (
                        <div className="space-y-0.5 font-semibold">
                          <span className="text-slate-850 dark:text-slate-200">{b.driver.name}</span>
                          <span className="text-xxs text-slate-450 block">{b.driver.phoneNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None Assigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">₹{b.totalCost.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xxs font-bold px-2.5 py-0.5 rounded-full ${
                          b.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-955/20'
                            : b.status === 'Trip Completed'
                            ? 'bg-indigo-150 text-indigo-750 dark:bg-indigo-955/20'
                            : 'bg-emerald-100 text-emerald-750 dark:bg-emerald-955/20'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* 1. Pending -> Approve */}
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Approved')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-xxs font-bold transition-all"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}

                        {/* 2. Approved -> Assign Driver */}
                        {b.status === 'Approved' && (
                          <button
                            onClick={() => handleOpenAssignModal(b._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xxs font-bold transition-all"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Assign Driver
                          </button>
                        )}

                        {/* 3. Driver Assigned -> Start Trip (or manually complete) */}
                        {b.status === 'Driver Assigned' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Trip Started')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xxs font-bold transition-all"
                          >
                            <Play className="w-3.5 h-3.5" /> Start Trip
                          </button>
                        )}

                        {/* 4. Payment Completed / Trip Started -> Complete Trip */}
                        {(b.status === 'Payment Completed' || b.status === 'Trip Started') && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Trip Completed')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-xxs font-bold transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Complete Trip
                          </button>
                        )}

                        {b.status === 'Trip Completed' && (
                          <span className="text-slate-400 italic text-xxs">Concluded</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Driver Assignment Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Roster Driver"
      >
        <form onSubmit={handleAssignDriverSubmit} className="space-y-4">
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">
              Select Available Driver
            </label>
            {drivers.length === 0 ? (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>No drivers are currently available. Free a driver first or register another.</span>
              </div>
            ) : (
              <select
                required
                value={chosenDriverId}
                onChange={(e) => setChosenDriverId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl outline-none text-slate-905 dark:text-white"
              >
                <option value="">-- Choose Driver --</option>
                {drivers.map((drv) => (
                  <option key={drv._id} value={drv._id}>
                    {drv.name} (Exp: {drv.experience} yrs | Phone: {drv.phoneNumber})
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            disabled={submittingAssign || drivers.length === 0}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm transition-all shadow-md flex justify-center items-center"
          >
            {submittingAssign ? <Spinner size="sm" color="white" /> : 'Confirm Assignment'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BookingManagement;

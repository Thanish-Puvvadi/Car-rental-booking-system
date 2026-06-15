import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowRight, Compass, Search, Calendar } from 'lucide-react';
import Spinner from '../../components/UI/Spinner';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        if (res.data && res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Failed to load bookings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = statusFilter
    ? bookings.filter((b) => b.status === statusFilter)
    : bookings;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Booking History</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and review your trip parameters.</p>
        </div>

        {/* Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-sm rounded-xl outline-none text-slate-800 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Driver Assigned">Driver Assigned</option>
            <option value="Payment Completed">Payment Completed</option>
            <option value="Trip Started">Trip Started</option>
            <option value="Trip Completed">Trip Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-16 text-center rounded-2xl glass-card border border-dashed border-slate-200 dark:border-slate-800">
          <Compass className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 dark:text-white">No Bookings Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try modifying your filters or submit a new request.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="p-6 rounded-2xl glass-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-amber-500/30 transition-all duration-200"
            >
              {/* Left detail info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xxs font-extrabold text-amber-505 dark:text-amber-500 tracking-wider uppercase">
                    ID: #{b._id.toString().slice(-6).toUpperCase()}
                  </span>
                  <span
                    className={`text-xxs font-bold px-2 py-0.5 rounded-full ${
                      b.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-955/20'
                        : b.status === 'Trip Completed'
                        ? 'bg-indigo-150 text-indigo-750 dark:bg-indigo-955/20'
                        : 'bg-emerald-100 text-emerald-750 dark:bg-emerald-955/20'
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="text-xxs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {b.tripType}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-905 dark:text-white">
                  {b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'Selected Vehicle'}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <span className="text-xxs text-slate-400 block uppercase font-bold tracking-wider">Pickup</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{b.pickupLocation}</span>
                  </div>
                  <div>
                    <span className="text-xxs text-slate-400 block uppercase font-bold tracking-wider">Drop</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{b.dropLocation}</span>
                  </div>
                  <div>
                    <span className="text-xxs text-slate-400 block uppercase font-bold tracking-wider">Start Date</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{new Date(b.rentalDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-xxs text-slate-400 block uppercase font-bold tracking-wider">End Date</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{new Date(b.returnDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Right price & button actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-200/50 dark:border-slate-800/50 pt-4 md:pt-0">
                <div className="md:text-right">
                  <span className="text-xxs text-slate-400 block font-bold uppercase tracking-wider">Total cost</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ₹{b.totalCost.toLocaleString()}
                  </span>
                  <span className="text-xxs text-slate-400 block font-semibold">({b.totalDays} Days)</span>
                </div>

                <Link
                  to={`/bookings/${b._id}`}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-indigo-400 rounded-xl font-semibold text-xs transition-all"
                >
                  Manage <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

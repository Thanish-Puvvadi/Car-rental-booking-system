import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Compass,
  Calendar,
  User,
  CreditCard,
  Bell,
  ArrowRight,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import Spinner from '../../components/UI/Spinner';
import StatCard from '../../components/StatCard';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        if (res.data && res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Failed to load dashboard bookings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const activeCount = bookings.filter((b) => b.status === 'Trip Started').length;
  const completedCount = bookings.filter((b) => b.status === 'Trip Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Check your rental schedule and invoice details.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/profile"
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-300 dark:hover:text-amber-500 rounded-xl font-semibold text-sm transition-all"
          >
            <User className="w-4 h-4" /> Manage Profile
          </Link>
          <Link
            to="/fleet"
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md"
          >
            Book Another Trip
          </Link>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Pending Requests"
          value={pendingCount}
          icon={Compass}
          color="amber"
        />
        <StatCard
          title="Active Trips"
          value={activeCount}
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Completed Trips"
          value={completedCount}
          icon={CheckCircle}
          color="indigo"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings table list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-905 dark:text-white">Recent Trips</h3>
            <Link
              to="/bookings"
              className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-0.5"
            >
              See All Bookings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-10 rounded-2xl glass-card flex justify-center items-center">
              <Spinner />
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-card border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">No booking requests found.</p>
              <Link to="/fleet" className="text-amber-500 text-sm font-semibold hover:underline mt-2 inline-block">
                Book your first car now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 3).map((b) => (
                <div
                  key={b._id}
                  className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/30 transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-xxs font-bold text-amber-505 dark:text-amber-500 uppercase tracking-widest">
                      ID: #{b._id.toString().slice(-6).toUpperCase()}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'Selected Vehicle'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Route: {b.pickupLocation} to {b.dropLocation} ({b.totalDays} Days)
                    </p>
                    <p className="text-xxs text-slate-400">
                      Dates: {new Date(b.rentalDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-200/50 dark:border-slate-800/50 pt-3 sm:pt-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total cost</span>
                      <span className="font-bold text-slate-850 dark:text-white">₹{b.totalCost.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xxs font-bold px-2.5 py-1 rounded-full ${
                          b.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-500'
                            : b.status === 'Trip Completed'
                            ? 'bg-indigo-150 text-indigo-750 dark:bg-indigo-950/30 dark:text-indigo-400'
                            : 'bg-emerald-100 text-emerald-750 dark:bg-emerald-950/20 dark:text-emerald-400'
                        }`}
                      >
                        {b.status}
                      </span>
                      <Link
                        to={`/bookings/${b._id}`}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-400 hover:text-amber-500"
                        title="View Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Panels */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="font-bold text-lg">Quick Instructions</h3>
            <ul className="space-y-3 text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
              <li className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <span>Create a trip request by filling the search form.</span>
              </li>
              <li className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <span>Wait for coordinator dispatch approval and driver assignment.</span>
              </li>
              <li className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <span>Once approved, complete payment logging and print your PDF invoice.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-1.5">
                <Bell className="w-4.5 h-4.5 text-amber-550" /> Alerts
              </h3>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              SMS/Email notifications are dispatched on approval. Ensure your phone number is correct to receive WhatsApp tracking logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

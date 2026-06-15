import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Car,
  Users,
  Compass,
  CreditCard,
  ShieldCheck,
  Calendar,
  Activity,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Spinner from '../../components/UI/Spinner';
import StatCard from '../../components/StatCard';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/reports/dashboard-stats');
        if (res.data && res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalVehicles: 0,
    totalCustomers: 0,
    totalDrivers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedTrips: 0,
    totalRevenue: 0
  };

  const bookingTrends = data?.charts?.bookingTrends || [];
  const revenueTrends = data?.charts?.revenueTrends || [];
  const vehicleUtilization = data?.charts?.vehicleUtilization || [];
  const tripTypeDistribution = data?.charts?.tripTypeDistribution || [];
  const recentLogs = data?.recentLogs || [];

  // Colors for Pie chart cells
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 text-left">
      {/* Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue (INR)"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={CreditCard}
          color="emerald"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Compass}
          color="indigo"
        />
        <StatCard
          title="Registered Fleet"
          value={stats.totalVehicles}
          icon={Car}
          color="amber"
        />
        <StatCard
          title="Active Drivers"
          value={stats.totalDrivers}
          icon={Users}
          color="rose"
        />
      </div>

      {/* Analytics Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Booking Trends - AreaChart */}
        <div className="lg:col-span-8 p-6 rounded-3xl glass-card space-y-4">
          <h3 className="font-bold text-lg">Booking Trends (Last 6 Months)</h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrends.length > 0 ? bookingTrends : [{ month: 'N/A', bookings: 0 }]}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Utilization - PieChart */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-card space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-lg">Vehicle Status Distribution</h3>
          <div className="h-60 w-full text-xs flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleUtilization}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Chart - BarChart */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-card space-y-4">
          <h3 className="font-bold text-lg">Revenue Metrics (Monthly)</h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrends.length > 0 ? revenueTrends : [{ month: 'N/A', revenue: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trip Type distribution - PieChart */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-card space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-lg">Trip Types Distribution</h3>
          <div className="h-72 w-full text-xs flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tripTypeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {tripTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audit Logs Table Row */}
      {recentLogs.length > 0 && (
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" /> Recent Administrative Activity Log
            </h3>
            <span className="text-xxs text-slate-400 font-bold uppercase tracking-wider">Audit logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-xxs tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Operation</th>
                  <th className="py-3 px-4">Target Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-850/50">
                {recentLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all text-xs">
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{log.user?.name || 'System'}</span>
                      <span className="text-xxs block text-slate-450 uppercase">{log.user?.role}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-slate-850 border border-indigo-100 dark:border-slate-800 font-bold text-indigo-750 dark:text-indigo-400 text-xxs">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

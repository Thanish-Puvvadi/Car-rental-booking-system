import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, BarChart3, TrendingUp, Calendar, Compass } from 'lucide-react';
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

const ReportsAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/reports/dashboard-stats');
        if (res.data && res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const bookingTrends = data?.charts?.bookingTrends || [];
  const revenueTrends = data?.charts?.revenueTrends || [];
  const vehicleUtilization = data?.charts?.vehicleUtilization || [];
  const tripTypeDistribution = data?.charts?.tripTypeDistribution || [];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-905 dark:text-white">Reports & Business Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Download data sheets and inspect performance charts.</p>
        </div>
        <a
          href="http://localhost:5000/api/reports/export-bookings"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
        >
          <Download className="w-4.5 h-4.5" /> Export Bookings CSV
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Performance */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Revenue Growth Series
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends.length > 0 ? revenueTrends : [{ month: 'N/A', revenue: 0 }]}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Volume */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Calendar className="w-5 h-5 text-indigo-500" /> Booking Load Metrics
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingTrends.length > 0 ? bookingTrends : [{ month: 'N/A', bookings: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fleet Distribution */}
        <div className="p-6 rounded-3xl glass-card space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <BarChart3 className="w-5 h-5 text-amber-500" /> Active Fleet Utilization
          </div>
          <div className="h-72 w-full text-xs flex items-center justify-center">
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

        {/* Route category distribution */}
        <div className="p-6 rounded-3xl glass-card space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Compass className="w-5 h-5 text-purple-500" /> Trip Type Ratios
          </div>
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
    </div>
  );
};

export default ReportsAnalytics;

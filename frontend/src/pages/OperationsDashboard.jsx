import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Users,
  Car,
  FileText,
  DollarSign,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  Clock,
  Play,
  Check,
  Trash2,
  ChevronDown,
  Download,
  Plus,
  TrendingUp,
  Shield,
  Briefcase,
  User,
  MapPin,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import Spinner from '../components/UI/Spinner';
import StatCard from '../components/StatCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const OperationsDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Booking filtering
  const [statusFilter, setStatusFilter] = useState('All');

  // Enquiry & Follow-up States
  const [enquiries, setEnquiries] = useState([]);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [enquiryStatus, setEnquiryStatus] = useState('New');

  // Automated Message logs State
  const [messageLogs, setMessageLogs] = useState([]);

  // Modal / Form States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'UPI',
    transactionId: ''
  });

  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driverForm, setDriverForm] = useState({
    name: '',
    phoneNumber: '',
    licenseNumber: '',
    experience: '',
    availabilityStatus: 'Available'
  });

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    brand: '',
    model: '',
    registrationNumber: '',
    dailyPrice: '',
    seatingCapacity: '4',
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    availabilityStatus: 'Available'
  });

  // Assign driver direct selection
  const [assigningDriverId, setAssigningDriverId] = useState({});

  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch Dashboard Stats & Charts & Logs
      const statsRes = await api.get('/api/reports/dashboard-stats');
      if (statsRes.data && statsRes.data.success) {
        setStats(statsRes.data.stats);
        setCharts(statsRes.data.charts);
        if (statsRes.data.recentLogs) {
          setAuditLogs(statsRes.data.recentLogs);
        }
      }

      // Fetch Bookings list
      const bookingsRes = await api.get('/api/bookings');
      if (bookingsRes.data && bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
      }

      // Fetch Drivers list (if allowed)
      if (user.role === 'admin' || user.role === 'driver_coordinator') {
        const driversRes = await api.get('/api/drivers');
        if (driversRes.data && driversRes.data.success) {
          setDrivers(driversRes.data.drivers);
        }
      }

      // Fetch Vehicles list
      const vehiclesRes = await api.get('/api/vehicles');
      if (vehiclesRes.data && vehiclesRes.data.success) {
        setVehicles(vehiclesRes.data.vehicles);
      }

      // Fetch Payments list
      const paymentsRes = await api.get('/api/payments');
      if (paymentsRes.data && paymentsRes.data.success) {
        setPayments(paymentsRes.data.payments);
      }

      // Fetch Enquiries list
      const enquiriesRes = await api.get('/api/enquiries');
      if (enquiriesRes.data && enquiriesRes.data.success) {
        setEnquiries(enquiriesRes.data.enquiries);
      }

      // Fetch message logs history
      const logsRes = await api.get('/api/reports/message-logs');
      if (logsRes.data && logsRes.data.success) {
        setMessageLogs(logsRes.data.logs);
      }

    } catch (err) {
      console.error('Dashboard load failure:', err.message);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Status transitions helper
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        alert(`Booking state progressed to '${newStatus}'!`);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Roster update failed');
    }
  };

  // Approve Booking
  const handleApproveBooking = (bookingId) => {
    updateBookingStatus(bookingId, 'Approved');
  };

  // Reject / Cancel (Delete)
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to remove this booking request?')) return;
    try {
      const res = await api.delete(`/api/bookings/${bookingId}`);
      if (res.data && res.data.success) {
        alert('Booking successfully removed.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  // Assign Driver
  const handleAssignDriver = async (bookingId) => {
    const driverId = assigningDriverId[bookingId];
    if (!driverId) {
      alert('Please select an available driver first.');
      return;
    }
    try {
      const res = await api.put(`/api/bookings/${bookingId}/assign-driver`, { driverId });
      if (res.data && res.data.success) {
        alert('Driver Assigned successfully!');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign driver');
    }
  };

  // Record Payment Modal opener
  const openPaymentModal = (booking) => {
    setSelectedBookingForPayment(booking);
    setPaymentForm({
      amount: booking.totalCost,
      paymentMethod: 'UPI',
      transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000)
    });
    setShowPaymentModal(true);
  };

  // Record Payment Submit
  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/payments', {
        bookingId: selectedBookingForPayment._id,
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        transactionId: paymentForm.transactionId
      });
      if (res.data && res.data.success) {
        alert('Payment logged! Status advanced to Payment Completed.');
        setShowPaymentModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log transaction details');
    }
  };

  // Driver CRUD Submit
  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/drivers', {
        ...driverForm,
        experience: Number(driverForm.experience)
      });
      if (res.data && res.data.success) {
        alert('New driver registered successfully!');
        setShowDriverModal(false);
        setDriverForm({
          name: '',
          phoneNumber: '',
          licenseNumber: '',
          experience: '',
          availabilityStatus: 'Available'
        });
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register driver');
    }
  };

  // Delete Driver
  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm('Delete driver from database roster?')) return;
    try {
      const res = await api.delete(`/api/drivers/${driverId}`);
      if (res.data && res.data.success) {
        alert('Driver deleted.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // Driver status quick toggling
  const toggleDriverStatus = async (driver) => {
    const nextStatus = driver.availabilityStatus === 'Available' ? 'Busy' : 'Available';
    try {
      const res = await api.put(`/api/drivers/${driver._id}`, { availabilityStatus: nextStatus });
      if (res.data && res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change driver status');
    }
  };

  // Vehicle CRUD Submit
  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/vehicles', {
        ...vehicleForm,
        dailyPrice: Number(vehicleForm.dailyPrice),
        seatingCapacity: Number(vehicleForm.seatingCapacity)
      });
      if (res.data && res.data.success) {
        alert('New fleet vehicle registered!');
        setShowVehicleModal(false);
        setVehicleForm({
          name: '',
          brand: '',
          model: '',
          registrationNumber: '',
          dailyPrice: '',
          seatingCapacity: '4',
          fuelType: 'Petrol',
          image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
          availabilityStatus: 'Available'
        });
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add vehicle');
    }
  };

  // Delete Vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Remove this vehicle permanently from active inventory?')) return;
    try {
      const res = await api.delete(`/api/vehicles/${vehicleId}`);
      if (res.data && res.data.success) {
        alert('Vehicle deleted.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  // Vehicle status toggling
  const changeVehicleStatus = async (vehicleId, nextStatus) => {
    try {
      const res = await api.put(`/api/vehicles/${vehicleId}`, { availabilityStatus: nextStatus });
      if (res.data && res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change vehicle status');
    }
  };

  // CSV Bookings exporter
  const handleExportCSV = () => {
    window.open('http://localhost:5000/api/reports/export-bookings', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'All') return true;
    return b.status === statusFilter;
  });

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left transition-colors duration-200">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-950 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <ClipboardList className="text-amber-500 animate-pulse" />
            Operations Command Center
          </h1>
          <p className="text-slate-350 text-xs mt-1">
            Logged in as: <span className="text-amber-500 font-bold uppercase tracking-wider">{user.role.replace('_', ' ')}</span> • Manage scheduling logistics, payments, and driver rosters.
          </p>
        </div>

        <div className="flex gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-bold text-xs border border-slate-700/80 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
          {(user.role === 'admin' || user.role === 'accounts') && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" /> Bookings Ledger CSV
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-100 dark:bg-rose-950/20 border border-rose-250 dark:border-rose-900 text-rose-500 rounded-2xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs navigation panel */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'text-amber-500 border-b-2 border-amber-500'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Overview Dashboard
        </button>

        <button
          onClick={() => setActiveTab('trips')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeTab === 'trips'
              ? 'text-amber-500 border-b-2 border-amber-500'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" /> Trips Roster ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeTab === 'fleet'
              ? 'text-amber-500 border-b-2 border-amber-500'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Car className="w-4 h-4" /> Fleet Management ({vehicles.length})
        </button>

        {(user.role === 'admin' || user.role === 'driver_coordinator') && (
          <button
            onClick={() => setActiveTab('drivers')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'drivers'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Chauffeurs ({drivers.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeTab === 'enquiries'
              ? 'text-amber-500 border-b-2 border-amber-500'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Enquiries & Follow-ups ({enquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('communications')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeTab === 'communications'
              ? 'text-amber-500 border-b-2 border-amber-500'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Outgoing Comms ({messageLogs.length})
        </button>

        {user.role === 'admin' && (
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" /> System Audit Logs
          </button>
        )}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-fade-in text-left">
          {/* Counters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}`}
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Active Trips"
              value={stats.activeTrips}
              icon={Play}
              color="indigo"
            />
            <StatCard
              title="Pending Bookings"
              value={stats.pendingBookings}
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Rostered Drivers"
              value={stats.totalDrivers}
              icon={Users}
              color="indigo"
            />
          </div>

          {/* Charts Grid */}
          {charts && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Trends */}
              <div className="p-6 rounded-3xl glass-card space-y-4">
                <h3 className="text-lg font-bold">Revenue Stream Trends (₹)</h3>
                <div className="h-64">
                  {charts.revenueTrends && charts.revenueTrends.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts.revenueTrends}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                        <YAxis stroke="#888888" fontSize={11} />
                        <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                        <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                      No historical payments captured.
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Utilization (Pie chart) */}
              <div className="p-6 rounded-3xl glass-card space-y-4">
                <h3 className="text-lg font-bold">Fleet Inventory Allocation</h3>
                <div className="h-64 flex flex-col md:flex-row items-center justify-around gap-4">
                  <div className="w-full md:w-1/2 h-full">
                    {charts.vehicleUtilization && charts.vehicleUtilization.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={charts.vehicleUtilization}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {charts.vehicleUtilization.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                        No vehicle utilization records.
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    {charts.vehicleUtilization && charts.vehicleUtilization.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{entry.name}:</span>
                        <span className="text-slate-500">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trips tab */}
      {activeTab === 'trips' && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* Filtering Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card text-xs font-semibold">
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Approved', 'Driver Assigned', 'Payment Completed', 'Trip Started', 'Trip Completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    statusFilter === filter
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="text-slate-450 text-xxs tracking-wider uppercase">
              Roster matches: {filteredBookings.length} Trips
            </div>
          </div>

          {/* Bookings Card List */}
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-800">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-550 dark:text-slate-400">No bookings match the status filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => {
                const linkedPayment = payments.find((p) => p.booking?._id === b._id && p.paymentStatus === 'Completed');
                return (
                  <div
                    key={b._id}
                    className="p-6 rounded-3xl glass-card flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-amber-500/30 transition-all text-sm"
                  >
                    {/* Booking metadata */}
                    <div className="space-y-2 lg:max-w-md">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xxs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/5 px-2 py-0.5 rounded">
                          RESERVATION #{b._id.toString().slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`text-xxs font-bold px-2.5 py-0.5 rounded-full ${
                            b.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-500'
                              : b.status === 'Trip Completed'
                              ? 'bg-indigo-150 text-indigo-750 dark:bg-indigo-950/30 dark:text-indigo-400'
                              : 'bg-emerald-100 text-emerald-750 dark:bg-emerald-950/20 dark:text-emerald-400'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-indigo-950 dark:text-white">
                        {b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'Vehicle Missing'}
                      </h4>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-650 dark:text-slate-400">
                        <div className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-amber-500" /> {b.customerName}</div>
                        <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> {b.pickupLocation} ➔ {b.dropLocation}</div>
                        <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> {new Date(b.rentalDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}</div>
                        <div className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-amber-500" /> {b.tripType} • {b.totalDays} Days</div>
                      </div>
                    </div>

                    {/* Operational controls depending on booking state */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-stretch justify-between lg:justify-end border-t lg:border-t-0 border-slate-200/50 dark:border-slate-800/50 pt-4 lg:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-xxs text-slate-450 block uppercase tracking-wider font-semibold">Base Fare</span>
                        <span className="font-extrabold text-lg text-slate-905 dark:text-white">₹{b.totalCost.toLocaleString()}</span>
                        {linkedPayment && <span className="text-xxs text-emerald-500 block">✓ Paid ({linkedPayment.paymentMethod})</span>}
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        {/* 1. Pending: Approve / Reject */}
                        {b.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApproveBooking(b._id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
                            >
                              Approve Request
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b._id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                              title="Reject Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* 2. Approved: Roster assignment (Admin & Driver Coordinator only) */}
                        {b.status === 'Approved' && (user.role === 'admin' || user.role === 'driver_coordinator') && (
                          <div className="flex items-center gap-2">
                            <select
                              value={assigningDriverId[b._id] || ''}
                              onChange={(e) => setAssigningDriverId(prev => ({ ...prev, [b._id]: e.target.value }))}
                              className="px-2 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                            >
                              <option value="">-- Roster Driver --</option>
                              {drivers.filter(d => d.availabilityStatus === 'Available').map(d => (
                                <option key={d._id} value={d._id}>
                                  {d.name} ({d.experience} yrs)
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignDriver(b._id)}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl"
                            >
                              Assign
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b._id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* 3. Driver Assigned: Log invoice payment (Admin & Accounts only) */}
                        {b.status === 'Driver Assigned' && (user.role === 'admin' || user.role === 'accounts') && (
                          <button
                            onClick={() => openPaymentModal(b)}
                            className="px-4 py-2 bg-indigo-650 hover:bg-indigo-755 text-white font-bold text-xs rounded-xl"
                          >
                            Record Payment
                          </button>
                        )}

                        {/* 4. Payment Completed: Dispatch Start Trip (Admin, Coordinator) */}
                        {b.status === 'Payment Completed' && (
                          <button
                            onClick={() => updateBookingStatus(b._id, 'Trip Started')}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" /> Start Trip Journey
                          </button>
                        )}

                        {/* 5. Trip Started: Conclude journey */}
                        {b.status === 'Trip Started' && (
                          <button
                            onClick={() => updateBookingStatus(b._id, 'Trip Completed')}
                            className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Complete Trip
                          </button>
                        )}

                        {/* 6. Trip Completed: Download Invoice Receiver receipt */}
                        {b.status === 'Trip Completed' && (
                          <div className="flex gap-2">
                            <span className="text-xxs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Trip Concluded
                            </span>
                            {linkedPayment && (
                              <a
                                href={`http://localhost:5000/api/payments/${linkedPayment._id}/invoice`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 dark:hover:text-amber-500 hover:border-amber-550 rounded-xl text-xxs font-bold flex items-center gap-1"
                              >
                                <FileText className="w-3.5 h-3.5" /> PDF Invoice
                              </a>
                            )}
                          </div>
                        )}

                        {/* Admin can delete anything */}
                        {user.role === 'admin' && b.status !== 'Pending' && b.status !== 'Approved' && (
                          <button
                            onClick={() => handleDeleteBooking(b._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Fleet tab */}
      {activeTab === 'fleet' && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* Header Controls */}
          {user.role === 'admin' && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowVehicleModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Vehicle Model
              </button>
            </div>
          )}

          {/* Fleet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div key={v._id} className="rounded-2xl glass-card overflow-hidden group flex flex-col justify-between">
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-3 left-3 px-2 py-0.5 text-white font-bold text-xxs rounded-full ${
                        v.availabilityStatus === 'Available'
                          ? 'bg-emerald-600'
                          : v.availabilityStatus === 'Rented'
                          ? 'bg-amber-600'
                          : 'bg-red-650'
                      }`}
                    >
                      {v.availabilityStatus}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-xxs font-bold text-amber-500 uppercase tracking-widest">{v.brand}</span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{v.name}</h4>
                      <p className="text-xxs text-slate-400">Reg: {v.registrationNumber}</p>
                    </div>

                    <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{v.seatingCapacity} Seater • {v.fuelType}</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{v.dailyPrice}/day</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-200/20 dark:border-slate-800/20 mt-3 flex justify-between items-center">
                  <div className="flex gap-1">
                    <button
                      onClick={() => changeVehicleStatus(v._id, 'Available')}
                      disabled={v.availabilityStatus === 'Available'}
                      className="px-2 py-1 bg-emerald-500/10 text-emerald-600 disabled:opacity-30 dark:text-emerald-400 rounded text-xxs font-bold"
                    >
                      Available
                    </button>
                    <button
                      onClick={() => changeVehicleStatus(v._id, 'Maintenance')}
                      disabled={v.availabilityStatus === 'Maintenance'}
                      className="px-2 py-1 bg-rose-500/10 text-rose-600 disabled:opacity-30 dark:text-rose-450 rounded text-xxs font-bold"
                    >
                      Maintenance
                    </button>
                  </div>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteVehicle(v._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drivers tab */}
      {activeTab === 'drivers' && (user.role === 'admin' || user.role === 'driver_coordinator') && (
        <div className="space-y-6 animate-fade-in text-left">
          {user.role === 'admin' && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowDriverModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Roster Chauffeur
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drivers.map((d) => (
              <div key={d._id} className="p-5 rounded-2xl glass-card space-y-4 hover:border-amber-500/20 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-slate-905 dark:text-white">{d.name}</h4>
                      <p className="text-xxs text-slate-450 uppercase tracking-widest font-bold">Experience: {d.experience} Years</p>
                    </div>
                    <span
                      onClick={() => toggleDriverStatus(d)}
                      className={`cursor-pointer px-2.5 py-0.5 text-white font-bold text-xxs rounded-full transition-all ${
                        d.availabilityStatus === 'Available' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                      }`}
                      title="Click to toggle status"
                    >
                      {d.availabilityStatus}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-650 dark:text-slate-400">
                    <p>Phone: {d.phoneNumber}</p>
                    <p className="text-xxs font-mono text-slate-400">License: {d.licenseNumber}</p>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-3 flex justify-end">
                    <button
                      onClick={() => handleDeleteDriver(d._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs tab */}
      {activeTab === 'logs' && user.role === 'admin' && (
        <div className="p-6 rounded-3xl glass-card space-y-4 animate-fade-in text-left">
          <h3 className="text-lg font-bold">System Roster Audit Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-700 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left font-bold text-slate-400 uppercase tracking-wider text-xxs">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Operation</th>
                  <th className="pb-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
                {auditLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="py-3 font-mono text-xxs text-slate-450">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 font-semibold">{log.user?.name || 'System'} ({log.user?.role || 'Guest'})</td>
                    <td className="py-3"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-xxs">{log.action}</span></td>
                    <td className="py-3 text-slate-550 dark:text-slate-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiries & Follow-ups Tab */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-lg font-bold">Customer Enquiries Ledger</h3>
            <p className="text-xs text-slate-450">Track incoming travel query forms and follow up with coordinators.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-700 dark:text-slate-305">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-left font-bold text-slate-400 uppercase tracking-wider text-xxs">
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Query Message</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Follow-up Notes</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40 text-slate-905 dark:text-slate-100">
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-450">No enquiries captured yet.</td>
                    </tr>
                  ) : (
                    enquiries.map((e) => (
                      <tr key={e._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all">
                        <td className="py-4 font-bold">{e.name}</td>
                        <td className="py-4 font-mono text-xxs text-slate-450">{e.email}</td>
                        <td className="py-4 text-slate-650 dark:text-slate-400 max-w-xs truncate" title={e.message}>{e.message}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold ${
                            e.status === 'New'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-500'
                              : e.status === 'Followed Up'
                              ? 'bg-indigo-100 text-indigo-750 dark:bg-indigo-950/20 dark:text-indigo-400'
                              : 'bg-emerald-100 text-emerald-750 dark:bg-emerald-950/20 dark:text-emerald-400'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="py-4 text-xxs italic text-slate-500 max-w-xs truncate" title={e.notes}>{e.notes || 'No follow-up notes.'}</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedEnquiry(e);
                              setEnquiryNotes(e.notes || '');
                              setEnquiryStatus(e.status || 'New');
                              setShowEnquiryModal(true);
                            }}
                            className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-550 dark:text-amber-400 rounded-lg text-xxs font-bold transition-all"
                          >
                            Follow Up / Notes
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Outgoing Message Logs Tab */}
      {activeTab === 'communications' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-lg font-bold">Automated Outgoing Message Registry</h3>
            <p className="text-xs text-slate-450">Review automated SMS/WhatsApp templates and Email logs dispatched upon status transitions.</p>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {messageLogs.length === 0 ? (
                <div className="p-12 text-center rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-450">No communication logs recorded yet.</p>
                </div>
              ) : (
                messageLogs.map((log) => (
                  <div key={log._id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/20 hover:border-amber-500/20 transition-all text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-xxs ${
                          log.channel === 'WhatsApp' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-550'
                        }`}>
                          {log.channel}
                        </span>
                        <span className="font-bold text-slate-805 dark:text-white">To: {log.recipient}</span>
                      </div>
                      <span className="text-xxs text-slate-450">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>

                    {log.subject && (
                      <p className="font-bold text-slate-600 dark:text-slate-350">Subject: {log.subject}</p>
                    )}

                    <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl font-mono text-xxs whitespace-pre-wrap text-slate-650 dark:text-slate-400">
                      {log.body}
                    </div>

                    <div className="flex justify-between items-center text-xxs text-slate-450 pt-1">
                      <span>Ref: Booking #{log.booking?._id?.toString()?.slice(-6)?.toUpperCase() || 'N/A'}</span>
                      <span className="text-emerald-500 font-bold">✓ Delivered</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT LOGGING MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRecordPaymentSubmit} className="w-full max-w-md p-6 rounded-3xl glass-modal space-y-4 text-left">
            <h4 className="text-xl font-bold text-indigo-950 dark:text-white">Record Reservation Payment</h4>
            <p className="text-xs text-slate-450">Log client manual transaction code to authorize trip dispatching.</p>

            <div className="space-y-1">
              <label className="block text-xxs font-bold text-slate-500 uppercase">Amount Due (INR)</label>
              <input
                type="number"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xxs font-bold text-slate-500 uppercase">Transaction ID</label>
              <input
                type="text"
                required
                value={paymentForm.transactionId}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xxs font-bold text-slate-500 uppercase">Payment Method</label>
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-center"
              >
                Confirm Payment
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE DRIVER MODAL */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleDriverSubmit} className="w-full max-w-md p-6 rounded-3xl glass-modal space-y-4 text-left">
            <h4 className="text-xl font-bold text-indigo-950 dark:text-white">Add Chauffeur to Roster</h4>
            
            <div className="space-y-1">
              <label className="block text-xxs font-bold text-slate-500 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={driverForm.name}
                onChange={(e) => setDriverForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xxs font-bold text-slate-500 uppercase">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 99999 88888"
                  value={driverForm.phoneNumber}
                  onChange={(e) => setDriverForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xxs font-bold text-slate-500 uppercase">Experience (Yrs)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={driverForm.experience}
                  onChange={(e) => setDriverForm(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xxs font-bold text-slate-500 uppercase">License ID</label>
              <input
                type="text"
                required
                placeholder="KA-51-2023-XXXXXXX"
                value={driverForm.licenseNumber}
                onChange={(e) => setDriverForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-center"
              >
                Roster Driver
              </button>
              <button
                type="button"
                onClick={() => setShowDriverModal(false)}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE VEHICLE MODAL */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleVehicleSubmit} className="w-full max-w-md p-6 rounded-3xl glass-modal space-y-4 text-left">
            <h4 className="text-xl font-bold text-indigo-950 dark:text-white">Add Fleet Vehicle Inventory</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xxs font-bold text-slate-500 uppercase">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="Toyota"
                  value={vehicleForm.brand}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xxs font-bold text-slate-500 uppercase">Model Specification</label>
                <input
                  type="text"
                  required
                  placeholder="Innova Crysta"
                  value={vehicleForm.name}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xxs font-bold text-slate-500 uppercase">Daily Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="4500"
                  value={vehicleForm.dailyPrice}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, dailyPrice: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xxs font-bold text-slate-500 uppercase">Reg Number</label>
                <input
                  type="text"
                  required
                  placeholder="KA-03-MM-1234"
                  value={vehicleForm.registrationNumber}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, registrationNumber: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xxs font-bold text-slate-500 uppercase">Capacity (Seats)</label>
                <select
                  value={vehicleForm.seatingCapacity}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, seatingCapacity: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                >
                  <option>4</option>
                  <option>5</option>
                  <option>7</option>
                  <option>12</option>
                  <option>15</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xxs font-bold text-slate-500 uppercase">Fuel Category</label>
                <select
                  value={vehicleForm.fuelType}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, fuelType: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xxs font-bold text-slate-500 uppercase">Image URL</label>
              <input
                type="text"
                required
                value={vehicleForm.image}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-center"
              >
                Register Vehicle
              </button>
              <button
                type="button"
                onClick={() => setShowVehicleModal(false)}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* ENQUIRY FOLLOW-UP MODAL */}
      {showEnquiryModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await api.put(`/api/enquiries/${selectedEnquiry._id}`, {
                  status: enquiryStatus,
                  notes: enquiryNotes
                });
                if (res.data && res.data.success) {
                  alert('Follow-up details saved successfully!');
                  setShowEnquiryModal(false);
                  fetchData();
                }
              } catch (err) {
                alert(err.response?.data?.message || 'Failed to update follow-up log');
              }
            }}
            className="w-full max-w-md p-6 rounded-3xl glass-modal space-y-4 text-left animate-fade-in"
          >
            <h4 className="text-xl font-bold text-indigo-950 dark:text-white font-sans">Record Follow-up Logs</h4>
            <p className="text-xs text-slate-450 leading-relaxed">Review contact inquiry and write notes regarding client correspondence.</p>

            <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl space-y-1">
              <p className="text-xxs font-bold text-slate-450 uppercase">Client Message:</p>
              <p className="text-xs italic text-slate-650 dark:text-slate-300">"{selectedEnquiry.message}"</p>
            </div>

            <div className="space-y-1">
              <label className="block text-xxs font-bold text-slate-500 uppercase">Follow-up Status</label>
              <select
                value={enquiryStatus}
                onChange={(e) => setEnquiryStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
              >
                <option>New</option>
                <option>Followed Up</option>
                <option>Resolved</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xxs font-bold text-slate-500 uppercase">Correspondence Notes</label>
              <textarea
                required
                rows="4"
                value={enquiryNotes}
                onChange={(e) => setEnquiryNotes(e.target.value)}
                placeholder="Log details of the conversation..."
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-center"
              >
                Save Log Details
              </button>
              <button
                type="button"
                onClick={() => setShowEnquiryModal(false)}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OperationsDashboard;

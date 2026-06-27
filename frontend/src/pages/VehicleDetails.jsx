import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Users,
  Compass,
  Calendar,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import Spinner from '../components/UI/Spinner';

const VehicleDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form parameters
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    mobileNumber: user?.phone || '',
    email: user?.email || '',
    pickupLocation: '',
    dropLocation: '',
    rentalDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'One Way',
    specialInstructions: '',
  });

  // Verification states
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // 'available' | 'conflicts' | null
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Sync user context or clear on logout/unauthenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || '',
        mobileNumber: user.phone || '',
        email: user.email || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        customerName: '',
        mobileNumber: '',
        email: '',
      }));
    }
  }, [user]);

  // Fetch details
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const res = await api.get(`/api/vehicles/${id}`);
        if (res.data && res.data.success) {
          setVehicle(res.data.vehicle);
        }
      } catch (err) {
        console.error('Error fetching details:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset check status if dates modified
    if (name === 'rentalDate' || name === 'returnDate') {
      setAvailabilityStatus(null);
    }
  };

  const handleCheckAvailability = async () => {
    if (!formData.rentalDate || !formData.returnDate) {
      alert('Please select start and end dates first.');
      return;
    }
    const start = new Date(formData.rentalDate);
    const end = new Date(formData.returnDate);
    if (start >= end) {
      alert('Return date must be after pickup date');
      return;
    }

    setCheckingAvailability(true);
    setAvailabilityStatus(null);

    try {
      const res = await api.get(
        `/vehicles/${id}/availability?rentalDate=${formData.rentalDate}&returnDate=${formData.returnDate}`
      );
      if (res.data && res.data.success) {
        setAvailabilityStatus(res.data.isAvailable ? 'available' : 'conflicts');
      }
    } catch (err) {
      console.error('Availability check failed:', err.message);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/vehicles/${id}` } });
      return;
    }

    if (!formData.rentalDate || !formData.returnDate) {
      setSubmitError('Please check availability for dates first.');
      return;
    }

    setLoadingSubmit(true);

    try {
      const payload = {
        ...formData,
        vehicleId: id,
      };

      const res = await api.post('/api/bookings', payload);
      if (res.data && res.data.success) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Booking submission failed');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Vehicle Not Found</h2>
        <Link to="/fleet" className="text-amber-500 hover:underline mt-4 inline-block">
          Return to Fleet List
        </Link>
      </div>
    );
  }

  // Calculate pricing breakdown
  let totalDays = 0;
  let totalFare = 0;
  if (formData.rentalDate && formData.returnDate) {
    const start = new Date(formData.rentalDate);
    const end = new Date(formData.returnDate);
    if (start < end) {
      totalDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
      totalFare = totalDays * vehicle.dailyPrice;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left">
      <Link
        to="/fleet"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-amber-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Fleet List
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Specification Detail */}
        <div className="lg:col-span-7 space-y-6">
          <div className="h-[400px] overflow-hidden rounded-3xl shadow-lg relative bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800">
            <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
            <span
              className={`absolute top-4 left-4 px-3 py-1 text-white font-bold text-xs rounded-full ${
                vehicle.availabilityStatus === 'Available'
                  ? 'bg-emerald-600'
                  : 'bg-amber-600'
              }`}
            >
              {vehicle.availabilityStatus}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                {vehicle.brand}
              </span>
              <h1 className="text-4xl font-extrabold text-slate-905 dark:text-white mt-1">
                {vehicle.name}
              </h1>
              <p className="text-slate-400 mt-1">Model / Specs: {vehicle.model}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-slate-250/50 dark:border-slate-800/50 py-6 text-sm">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Daily Price</span>
                <span className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-0.5">
                  ₹{vehicle.dailyPrice}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Capacity</span>
                <span className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-amber-500" /> {vehicle.seatingCapacity} Seats
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Fuel Category</span>
                <span className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                  <Compass className="w-5 h-5 text-amber-500" /> {vehicle.fuelType}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Included Comfort Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Dual Zone Climate Air Conditioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Bluetooth / Apple CarPlay Media Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Verified Clean, Inspected Interior</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>GPS Tracking Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Booking Side form widget */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl glass-card">
            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full inline-block">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h4 className="text-xl font-bold">Booking Request Submitted</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your trip booking request is waiting for administrator approval. You will receive invoice logs in your portal dashboard shortly.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/dashboard"
                    className="px-6 py-2.5 bg-indigo-650 text-white font-semibold rounded-xl text-center text-sm"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/fleet"
                    className="px-6 py-2.5 border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-center text-sm"
                  >
                    Explore Fleet
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <h3 className="text-2xl font-bold text-indigo-950 dark:text-white">Configure Trip Details</h3>
                
                {submitError && (
                  <div className="p-3 bg-rose-100 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-500 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* User validation */}
                <div className="space-y-1">
                  <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    autoComplete="off"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="mobileNumber"
                      required
                      autoComplete="off"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                    />
                  </div>
                </div>

                {/* Pickup and drop */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Pickup location
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      required
                      placeholder="Start point"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Drop location
                    </label>
                    <input
                      type="text"
                      name="dropLocation"
                      required
                      placeholder="Destination"
                      value={formData.dropLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                    />
                  </div>
                </div>

                {/* Dates selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="rentalDate"
                      required
                      value={formData.rentalDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      required
                      value={formData.returnDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                    />
                  </div>
                </div>

                {/* Check availability */}
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={checkingAvailability || !formData.rentalDate || !formData.returnDate}
                  className="w-full py-2 bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-750 text-indigo-750 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-slate-700 text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                >
                  {checkingAvailability ? (
                    <Spinner size="sm" color="primary" />
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5" /> Check Calendar Availability
                    </>
                  )}
                </button>

                {/* Availability response display */}
                {availabilityStatus === 'available' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Vehicle is Available for selected dates!</span>
                  </div>
                )}
                {availabilityStatus === 'conflicts' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Booking Overlaps detected. Pick other dates.</span>
                  </div>
                )}

                {/* Passengers & Trip types */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Passengers
                    </label>
                    <input
                      type="number"
                      name="passengers"
                      required
                      min="1"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Trip Type
                    </label>
                    <select
                      name="tripType"
                      value={formData.tripType}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white"
                    >
                      <option>One Way</option>
                      <option>Round Trip</option>
                      <option>Local Rental</option>
                    </select>
                  </div>
                </div>

                {/* Estimate details */}
                {totalFare > 0 && (
                  <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Daily rate:</span>
                      <span className="font-semibold">₹{vehicle.dailyPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Total days:</span>
                      <span className="font-semibold">{totalDays} Days</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-2 font-bold text-indigo-500 dark:text-indigo-400">
                      <span>Total Base Fare:</span>
                      <span>₹{totalFare.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingSubmit || availabilityStatus === 'conflicts'}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm transition-all"
                >
                  {loadingSubmit ? (
                    <Spinner size="sm" color="white" />
                  ) : isAuthenticated ? (
                    'Confirm Rental Request'
                  ) : (
                    'Sign In to Request Booking'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;

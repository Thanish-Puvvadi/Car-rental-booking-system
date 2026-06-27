import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Calendar,
  MapPin,
  Users,
  Compass,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import Spinner from '../components/UI/Spinner';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Fleet state for dropdown selection
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // Booking Form State
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    mobileNumber: user?.phone || '',
    email: user?.email || '',
    vehicleId: '',
    pickupLocation: '',
    dropLocation: '',
    rentalDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'One Way',
    specialInstructions: '',
  });

  // Booking Feedback States
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [recommendation, setRecommendation] = useState({ type: 'Sedan', min: 1, max: 4, desc: 'Compact & comfortable for city trips' });
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Enquiry state variables
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', message: '' });
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryLoading(true);
    setEnquirySuccess(false);
    try {
      const res = await api.post('/api/enquiries', enquiryForm);
      if (res.data && res.data.success) {
        setEnquirySuccess(true);
        setEnquiryForm({ name: '', email: '', message: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit enquiry.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  // Sync user info if loaded later or clear on logout
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

  // Fetch available vehicles for listing
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/api/vehicles?availabilityStatus=Available');
        if (res.data && res.data.success) {
          setVehicles(res.data.vehicles);
        }
      } catch (err) {
        console.error('Error fetching fleet on home:', err.message);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  // 1. Smart Rule-Based Recommendation Engine
  useEffect(() => {
    const p = Number(formData.passengers);
    if (p >= 1 && p <= 4) {
      setRecommendation({
        type: 'Sedan',
        min: 1,
        max: 4,
        desc: 'Comfortable & fuel-efficient for small groups'
      });
    } else if (p >= 5 && p <= 7) {
      setRecommendation({
        type: 'SUV',
        min: 5,
        max: 7,
        desc: 'Spacious SUV with extra luggage space & powerful drive'
      });
    } else if (p >= 8) {
      setRecommendation({
        type: 'Tempo Traveller',
        min: 8,
        max: 15,
        desc: 'Perfect Tempo Traveller for family tours and events'
      });
    }
  }, [formData.passengers]);

  // Dynamic cost estimation
  useEffect(() => {
    if (formData.vehicleId && formData.rentalDate && formData.returnDate) {
      const selected = vehicles.find((v) => v._id === formData.vehicleId);
      if (selected) {
        const start = new Date(formData.rentalDate);
        const end = new Date(formData.returnDate);
        if (start < end) {
          const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
          setEstimatedCost(diffDays * selected.dailyPrice);
          return;
        }
      }
    }
    setEstimatedCost(0);
  }, [formData.vehicleId, formData.rentalDate, formData.returnDate, vehicles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!formData.vehicleId) {
      setSubmitError('Please select a vehicle');
      return;
    }

    const start = new Date(formData.rentalDate);
    const end = new Date(formData.returnDate);
    if (start >= end) {
      setSubmitError('Return date must be after pickup date');
      return;
    }

    setLoadingSubmit(true);

    try {
      // Create the booking
      const res = await api.post('/api/bookings', formData);
      if (res.data && res.data.success) {
        setSubmitSuccess(true);

        // Send WhatsApp confirmation to the entered mobile number
        let phone = formData.mobileNumber.replace(/\D/g, '');
        if (phone.length === 10) {
          phone = '91' + phone; // Default to India country code if 10 digits
        }

        const selectedVehicle = vehicles.find((v) => v._id === formData.vehicleId);
        const carName = selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : 'Selected Car';

        const message = `*Booking Confirmed!*\n\nHi ${formData.customerName},\nYour booking request has been received and confirmed. Here are your trip details:\n\n*Customer Details:*\n- Name: ${formData.customerName}\n- Phone: ${formData.mobileNumber}\n${formData.email ? `- Email: ${formData.email}\n` : ''}\n*Trip Details:*\n- Trip Type: ${formData.tripType}\n- Pickup Location: ${formData.pickupLocation}\n- Drop Location: ${formData.dropLocation}\n- Start Date: ${formData.rentalDate}\n- End Date: ${formData.returnDate}\n- Passengers: ${formData.passengers}\n- Vehicle: ${carName}\n- Estimated Fare: ₹${estimatedCost.toLocaleString()}\n\nThank you for choosing Manivtha Tours & Travels!`;
        
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Clear non-user fields
        setFormData((prev) => ({
          ...prev,
          vehicleId: '',
          pickupLocation: '',
          dropLocation: '',
          rentalDate: '',
          returnDate: '',
          passengers: 1,
          specialInstructions: '',
        }));
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit booking request.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Filter vehicles matching recommended category for quick-select highlights
  const recommendedVehicles = vehicles.filter((v) => {
    if (recommendation.type === 'Sedan') return v.seatingCapacity <= 4;
    if (recommendation.type === 'SUV') return v.seatingCapacity > 4 && v.seatingCapacity <= 7;
    return v.seatingCapacity >= 8;
  });

  // Accordion faq states
  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    {
      q: 'How do I confirm my car booking?',
      a: 'Once you submit a booking request, our administrators verify vehicle and driver availability. Upon approval, you will receive notification and can log in to pay or review assigned driver coordinates.'
    },
    {
      q: 'Are drivers included in the rental price?',
      a: 'We provide both self-drive options and driver-assigned options. Admin reviews may apply standard driver service fees depending on outstation boundaries.'
    },
    {
      q: 'What is the policy for cancellation?',
      a: 'You can cancel bookings free of charge up to 24 hours before your trip starts directly from your customer dashboard.'
    },
    {
      q: 'Is there a limit on kilometres travelled?',
      a: 'Local rentals have limited daily caps, while round-trips offer unlimited distance calculations. Select the appropriate trip type in the booking form for details.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-hero text-white px-4 py-16 overflow-hidden rounded-b-[40px]">
        {/* Background glow highlights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-650/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-amber-500">
              <Sparkles className="w-3.5 h-3.5" /> Premium Travels & Tours
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Rent Premium Cars <br />
              <span className="text-amber-500">With Experienced Drivers</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl">
              Manivtha Tours & Travels delivers premium rides, customized outstation journeys, and corporate travel solutions. Travel in style, safety, and ultimate comfort.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#booking-widget"
                className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-600/20"
              >
                Book Now
              </a>
              <Link
                to="/fleet"
                className="px-6 py-3.5 border border-slate-700 hover:border-slate-500 text-white rounded-xl font-bold transition-all bg-slate-800/30 backdrop-blur-xs"
              >
                Explore Fleet
              </Link>
            </div>
          </div>

          {/* 2. HERO BOOKING WIDGET */}
          <div id="booking-widget" className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl glass-card text-slate-900 dark:text-white relative">
              <h3 className="text-2xl font-bold mb-6 text-indigo-950 dark:text-white">
                Find Your Perfect Ride
              </h3>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full inline-block">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h4 className="text-xl font-bold">Booking Request Sent!</h4>
                  <p className="text-sm text-slate-550 dark:text-slate-450">
                    Your request was successfully filed. An Administrator will review availability and assign a driver shortly. You can track status in your dashboard.
                  </p>
                  <Link
                    to="/dashboard"
                    className="block px-6 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-semibold rounded-xl text-sm"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-rose-100 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-500 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Customer Information (Prepopulated if logged in) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        required
                        autoComplete="off"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-lg focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                      />
                    </div>
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
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-lg focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Pickup Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="pickupLocation"
                          required
                          placeholder="City/Hotel/Airport"
                          value={formData.pickupLocation}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-lg focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Drop Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="dropLocation"
                          required
                          placeholder="Destination"
                          value={formData.dropLocation}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-lg focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          name="rentalDate"
                          required
                          value={formData.rentalDate}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-lg focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          name="returnDate"
                          required
                          value={formData.returnDate}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-lg focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passengers & Trip Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Passengers
                      </label>
                      <div className="relative">
                        <Users className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          name="passengers"
                          required
                          min="1"
                          max="20"
                          value={formData.passengers}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-lg focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Trip Type
                      </label>
                      <select
                        name="tripType"
                        value={formData.tripType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-lg focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                      >
                        <option>One Way</option>
                        <option>Round Trip</option>
                        <option>Local Rental</option>
                      </select>
                    </div>
                  </div>

                  {/* Smart Suggestion Alert */}
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1 text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Suggested Vehicle Class: {recommendation.type}</span>
                    </div>
                    <p className="text-xxs text-slate-500 dark:text-slate-400">
                      {recommendation.desc} (Seats: {recommendation.min}-{recommendation.max})
                    </p>
                  </div>

                  {/* Car Dropdown Selection */}
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Choose Car
                    </label>
                    <select
                      name="vehicleId"
                      required
                      value={formData.vehicleId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-lg focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                    >
                      <option value="">-- Select Vehicle --</option>
                      {recommendedVehicles.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.brand} {v.model} (₹{v.dailyPrice}/day)
                        </option>
                      ))}
                      {/* Show others if they want to override */}
                      {vehicles.filter((v) => !recommendedVehicles.includes(v)).map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.brand} {v.model} (₹{v.dailyPrice}/day) - Other Class
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Billing Details / Cost Estimation */}
                  {estimatedCost > 0 && (
                    <div className="flex justify-between items-center px-4 py-2.5 bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400 font-bold text-sm">
                      <span>Estimated Fare:</span>
                      <span>₹{estimatedCost.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loadingSubmit}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-md"
                  >
                    {loadingSubmit ? (
                      <Spinner size="sm" color="white" />
                    ) : isAuthenticated ? (
                      'Request Trip Booking'
                    ) : (
                      'Sign In to Book Trip'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CARS GRID */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">Our Fleet Categories</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Discover a wide collection of meticulously detailed vehicles. Choose according to your seating capacity requirements.
          </p>
        </div>

        {loadingVehicles ? (
          <div className="h-60 flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.slice(0, 3).map((car) => (
              <div key={car._id} className="rounded-2xl glass-card overflow-hidden glass-card-hover group">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-amber-600/90 text-white font-bold text-xs rounded-full">
                    ₹{car.dailyPrice}/Day
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{car.brand}</span>
                    <h3 className="text-xl font-bold text-slate-905 dark:text-white mt-1">{car.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{car.model}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-y border-slate-200/50 dark:border-slate-800/50 py-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-500" />
                      <span>{car.seatingCapacity} Passengers</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-amber-500" />
                      <span>Fuel: {car.fuelType}</span>
                    </div>
                  </div>
                  <Link
                    to={`/vehicles/${car._id}`}
                    className="block text-center py-2.5 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-300 dark:hover:text-amber-500 font-semibold rounded-xl text-sm transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link
            to="/fleet"
            className="inline-flex items-center gap-1.5 font-bold text-amber-500 hover:text-amber-600 transition-colors"
          >
            Explore Full Fleet <ChevronDown className="w-4 h-4 rotate-270" />
          </Link>
        </div>
      </section>

      {/* 4. SERVICES DESCRIPTION */}
      <section className="bg-slate-100/50 dark:bg-slate-900/40 py-20 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl glass-card text-left space-y-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl inline-block">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">One-Way Journeys</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Point-to-point drop-offs across state boundaries. Perfect for single trips to nearby airports, tourist resorts or home journeys without return bounds.
            </p>
          </div>
          <div className="p-8 rounded-2xl glass-card text-left space-y-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl inline-block">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Round Trips</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Book outstation sightseeing with driver accommodation included. Enjoy flexibility to tour at your pace and stop wherever you please.
            </p>
          </div>
          <div className="p-8 rounded-2xl glass-card text-left space-y-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl inline-block">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Local Rentals</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Flexible 8 Hours / 80 Kilometres packages for weddings, corporate executives dispatching, or city hopping requirements.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-905 dark:text-white">
            Why Drive With Manivtha Travels?
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            We are dedicated to safety, premium standards, and customer satisfaction.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Strict Safety Protocols</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">All vehicles are sanitized, fully insured, and undergo rigorous mechanical audits regularly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg mt-1">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Verified Drivers Only</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Our drivers undergo security validation and possess extensive route expertise.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg mt-1">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">24/7 Dispatch Control</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Our driver coordinators are online day & night to manage flight schedules or route adjustments.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-[350px] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"
            alt="Premium Interior Car"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 text-left">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-slate-905 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="rounded-xl glass-card overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 dark:text-white hover:text-amber-500 dark:hover:text-amber-500 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/30 dark:border-slate-850/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. QUICK CONTACT */}
      <section className="max-w-5xl mx-auto px-4 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-left relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-3xl font-extrabold">Need Custom Travels?</h3>
            <p className="text-slate-400 text-sm">
              Reach out for specialized events, weddings, corporate packages, or outstation traveller rosters. Our coordinators will compile quotes in minutes.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>support@manivtha.com</span>
              </div>
            </div>
          </div>
          <form onSubmit={handleEnquirySubmit} className="bg-white/5 dark:bg-slate-950/20 backdrop-blur-xs p-6 rounded-2xl border border-white/10 space-y-4">
            <h4 className="font-bold text-lg">Send Instant Query</h4>
            {enquirySuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-550/20 text-emerald-400 rounded-xl text-xs text-center space-y-1">
                <p className="font-bold">Query Received!</p>
                <p className="text-xxs text-slate-400">Our dispatch coordinator will reach out to you shortly.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-amber-500 text-white"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-amber-500 text-white"
                />
                <textarea
                  required
                  placeholder="Trip requirements..."
                  rows="3"
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-amber-500 text-white resize-none"
                />
                <button
                  type="submit"
                  disabled={enquiryLoading}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center"
                >
                  {enquiryLoading ? <Spinner size="sm" color="white" /> : 'Send Query'}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

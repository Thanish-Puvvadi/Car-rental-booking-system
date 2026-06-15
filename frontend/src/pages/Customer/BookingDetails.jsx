import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  ArrowLeft,
  Compass,
  User,
  Car,
  FileText,
  AlertCircle,
  CheckCircle,
  Truck,
  DollarSign
} from 'lucide-react';
import Spinner from '../../components/UI/Spinner';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        if (res.data && res.data.success) {
          setBooking(res.data.booking);
        }

        // Fetch payments to check if invoice is ready
        const payRes = await api.get('/payments');
        if (payRes.data && payRes.data.success) {
          setPayments(payRes.data.payments);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Error Loading Booking</h2>
        <p className="text-slate-500 dark:text-slate-400">{error || 'Booking record could not be found.'}</p>
        <Link to="/bookings" className="text-amber-500 hover:underline inline-block font-semibold">
          Return to Booking History
        </Link>
      </div>
    );
  }

  const workflowSteps = [
    { label: 'Pending', desc: 'Awaiting review' },
    { label: 'Approved', desc: 'Trip approved' },
    { label: 'Driver Assigned', desc: 'Chauffeur rostered' },
    { label: 'Payment Completed', desc: 'Bill cleared' },
    { label: 'Trip Started', desc: 'Journey active' },
    { label: 'Trip Completed', desc: 'Journey concluded' },
  ];

  const currentStepIndex = workflowSteps.findIndex((s) => s.label === booking.status);

  // Find linked payment
  const matchingPayment = payments.find((p) => p.booking?._id === id && p.paymentStatus === 'Completed');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-left">
      <Link
        to="/bookings"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-amber-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Bookings List
      </Link>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-indigo-950 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />
        <div className="space-y-1 relative z-10">
          <span className="text-xxs font-bold text-amber-500 uppercase tracking-widest">
            RESERVATION ID: #{booking._id.toString().toUpperCase()}
          </span>
          <h1 className="text-3xl font-extrabold">
            {booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.model}` : 'Selected Vehicle'}
          </h1>
          <p className="text-slate-350 text-xs">
            Route: {booking.pickupLocation} to {booking.dropLocation} ({booking.totalDays} Days)
          </p>
        </div>

        <div className="text-left sm:text-right relative z-10 self-stretch sm:self-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Total Fare</span>
          <span className="text-3xl font-extrabold text-amber-500">₹{booking.totalCost.toLocaleString()}</span>
          <span className="text-xxs text-slate-450 block mt-1">Status: {booking.status}</span>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-6">
        <h3 className="text-lg font-bold">Trip Workflow Status</h3>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
          {/* Connector Line - Desktop */}
          <div className="hidden md:block absolute left-4 right-4 top-5 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

          {workflowSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 flex-1">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                    isCurrent
                      ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20 scale-105'
                      : isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                {/* Texts */}
                <div className="space-y-0.5">
                  <p className={`text-xs font-bold ${isCurrent ? 'text-amber-500' : 'text-slate-700 dark:text-slate-200'}`}>
                    {step.label}
                  </p>
                  <p className="text-xxs text-slate-450">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Specifications specs */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-500" /> Vehicle Specs
          </h3>
          {booking.vehicle ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">Model Name:</span>
                <span className="font-semibold">{booking.vehicle.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">Brand:</span>
                <span className="font-semibold">{booking.vehicle.brand}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">Registration ID:</span>
                <span className="font-semibold uppercase">{booking.vehicle.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fuel Type:</span>
                <span className="font-semibold">{booking.vehicle.fuelType}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Vehicle details not loaded.</p>
          )}
        </div>

        {/* Driver dispatch */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" /> Driver & Crew
          </h3>
          {booking.driver ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">Driver Name:</span>
                <span className="font-semibold">{booking.driver.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">License ID:</span>
                <span className="font-semibold uppercase">{booking.driver.licenseNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">Mobile Phone:</span>
                <span className="font-semibold">{booking.driver.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Roster Status:</span>
                <span className="font-bold text-emerald-500">Assigned</span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-2 text-slate-400">
              <User className="w-8 h-8 mx-auto" />
              <p className="text-xs">No driver assigned yet.</p>
              <p className="text-xxs">Coordinators will update roster after dispatch check.</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Downloader block */}
      {matchingPayment ? (
        <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle className="w-5 h-5 text-emerald-500" /> Payment Confirmed
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transaction ID: {matchingPayment.transactionId} via {matchingPayment.paymentMethod}. PDF Invoice is ready.
            </p>
          </div>
          <a
            href={`http://localhost:5000/api/payments/${matchingPayment._id}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md"
          >
            <FileText className="w-4 h-4" /> Download PDF Invoice
          </a>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-550 flex-shrink-0" />
          <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
            <p className="font-bold text-slate-900 dark:text-white">Payment Records Pending</p>
            <p>Once billing is verified by the accounts team, you will be able to download the PDF invoice directly.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;

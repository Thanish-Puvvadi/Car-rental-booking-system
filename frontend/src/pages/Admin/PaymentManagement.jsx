import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CreditCard, Plus, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import Spinner from '../../components/UI/Spinner';
import Modal from '../../components/UI/Modal';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Record Payment Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    bookingId: '',
    amount: '',
    paymentMethod: 'UPI',
    transactionId: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch payments
      const res = await api.get('/payments');
      if (res.data && res.data.success) {
        setPayments(res.data.payments);
      }

      // Fetch unpaid bookings (Status = Approved or Driver Assigned)
      const bookRes = await api.get('/bookings');
      if (bookRes.data && bookRes.data.success) {
        const unpaid = bookRes.data.bookings.filter(
          (b) => b.status === 'Approved' || b.status === 'Driver Assigned'
        );
        setBookings(unpaid);
      }
    } catch (err) {
      console.error('Failed to load payment operations:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      bookingId: '',
      amount: '',
      paymentMethod: 'UPI',
      transactionId: '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleBookingChange = (e) => {
    const bId = e.target.value;
    const selected = bookings.find((b) => b._id === bId);
    setFormData((prev) => ({
      ...prev,
      bookingId: bId,
      amount: selected ? selected.totalCost : '',
      transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000), // auto generate for ease
    }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.post('/payments', formData);
      if (res.data && res.data.success) {
        setModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Accounts & Payments</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">View transactions and record payment clearings.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {loading ? (
        <div className="h-60 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : payments.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-205 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-sm">No transaction records found in ledger.</p>
        </div>
      ) : (
        <div className="rounded-3xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-xxs tracking-wider">
                  <th className="py-3 px-6">Transaction Date</th>
                  <th className="py-3 px-6">Customer Booking Reference</th>
                  <th className="py-3 px-6">Cleared Amount</th>
                  <th className="py-3 px-6">Payment Method</th>
                  <th className="py-3 px-6">Transaction ID</th>
                  <th className="py-3 px-6">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-850/50">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all text-xs">
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(p.paymentDate).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {p.booking?.customerName || 'N/A'}
                      </span>
                      <span className="text-xxs text-amber-500 font-bold block uppercase tracking-wider">
                        REF ID: #{p.booking?._id?.toString().slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-500">₹{p.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 font-semibold">{p.paymentMethod}</td>
                    <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400 text-xxs">{p.transactionId}</td>
                    <td className="py-4 px-6">
                      <a
                        href={`http://localhost:5000/api/payments/${p._id}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-600 font-semibold"
                        title="Download Invoice"
                      >
                        <FileText className="w-4 h-4" /> PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Booking Payment"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-100 dark:bg-rose-955/20 border border-rose-250 dark:border-rose-900 text-rose-500 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">
              Select Booking Reference
            </label>
            {bookings.length === 0 ? (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs">
                No approved bookings are waiting for payment registration.
              </div>
            ) : (
              <select
                required
                value={formData.bookingId}
                onChange={handleBookingChange}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl outline-none text-slate-905 dark:text-white"
              >
                <option value="">-- Choose Approved Booking --</option>
                {bookings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.customerName} (₹{b.totalCost} | ID: #{b._id.toString().slice(-6).toUpperCase()})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Amount (INR)</label>
              <input
                type="number"
                name="amount"
                required
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              >
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Cash</option>
                <option>Net Banking</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xxs font-bold text-slate-400 uppercase">Transaction ID</label>
            <input
              type="text"
              name="transactionId"
              required
              value={formData.transactionId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || bookings.length === 0}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm transition-all shadow-md flex justify-center items-center"
          >
            {submitting ? <Spinner size="sm" color="white" /> : 'Register Payment'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentManagement;

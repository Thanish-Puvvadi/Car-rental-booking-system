import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, Mail, Lock, Phone, MapPin, ShieldAlert } from 'lucide-react';
import Spinner from '../components/UI/Spinner';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md space-y-8 p-8 rounded-3xl glass-card text-left relative overflow-hidden">
        {/* Glow bg */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />

        {/* Logo and title */}
        <div className="text-center space-y-2 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2">
            <Car className="w-8 h-8 text-amber-500" />
            <div className="flex flex-col text-left">
              <span className="text-lg font-extrabold text-indigo-950 dark:text-white uppercase leading-none">
                Manivtha
              </span>
              <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
                Tours & Travels
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-4">
            Create Customer Account
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-400">
            Sign up to book premium trips and check status.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-100 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-500 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4 relative z-10">
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-xxs font-bold text-slate-505 dark:text-slate-400 uppercase">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xxs font-bold text-slate-505 dark:text-slate-400 uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xxs font-bold text-slate-505 dark:text-slate-400 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="block text-xxs font-bold text-slate-505 dark:text-slate-400 uppercase">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="block text-xxs font-bold text-slate-505 dark:text-slate-400 uppercase">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, City"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-md text-sm mt-6"
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Register Account'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 relative z-10">
          <span>Already have an account? </span>
          <Link to="/login" className="text-amber-500 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

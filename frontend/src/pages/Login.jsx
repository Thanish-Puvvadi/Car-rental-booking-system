import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import Spinner from '../components/UI/Spinner';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirection target
  const from = location.state?.from || '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      // Determine landing page depending on role
      if (from !== '/') {
        navigate(from, { replace: true });
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Credentials helper
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err) {
      setError('Seeding required. Run backend seed script.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md space-y-8 p-8 rounded-3xl glass-card text-left relative overflow-hidden">
        {/* Glow background */}
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
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage your rentals or coordinate trips.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-100 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-500 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1">
            <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-md text-sm mt-6"
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Pre-fills Panel */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-6 space-y-2 relative z-10 text-xs">
          <p className="font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider text-xxs">
            Quick Demo Portals:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('customer@gmail.com', 'customer123')}
              className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-300 font-semibold text-xxs"
            >
              <span>Customer</span>
              <ArrowRight className="w-3 h-3 text-amber-500" />
            </button>
            <button
              onClick={() => handleQuickLogin('coordinator@manivtha.com', 'coordinator123')}
              className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-300 font-semibold text-xxs"
            >
              <span>Coordinator</span>
              <ArrowRight className="w-3 h-3 text-amber-500" />
            </button>
            <button
              onClick={() => handleQuickLogin('accounts@manivtha.com', 'accounts123')}
              className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-300 font-semibold text-xxs"
            >
              <span>Accounts</span>
              <ArrowRight className="w-3 h-3 text-amber-500" />
            </button>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-slate-500 relative z-10">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-amber-500 font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

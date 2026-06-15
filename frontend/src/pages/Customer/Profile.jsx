import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin, Lock, CheckCircle, ShieldAlert } from 'lucide-react';
import Spinner from '../../components/UI/Spinner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile(formData);
      setSuccess(true);
      setFormData((prev) => ({ ...prev, password: '' })); // reset pwd
    } catch (err) {
      setError(err.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Profile Management</h1>
        <p className="text-slate-500 dark:text-slate-400">Update your account coordinates and security passwords.</p>
      </div>

      <div className="p-8 rounded-3xl glass-card relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 mb-6 font-bold">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs flex items-center gap-2 mb-6 font-bold">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xxs font-bold text-slate-450 uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-sm text-slate-905 dark:text-white focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xxs font-bold text-slate-450 uppercase">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-sm text-slate-905 dark:text-white focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xxs font-bold text-slate-450 uppercase">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-sm text-slate-905 dark:text-white focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-800/50 my-6 pt-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Security Update</h3>
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-450 uppercase">Change Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password (optional)"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-sm text-slate-905 dark:text-white focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex justify-center items-center gap-1.5"
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

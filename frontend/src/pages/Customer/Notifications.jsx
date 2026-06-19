import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bell, Info, CheckCircle, Clock, Check } from 'lucide-react';
import Spinner from '../../components/UI/Spinner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data && res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await api.put('/notifications/read');
      if (res.data && res.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Mark read failed:', err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 text-left animate-fade-in">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Alert Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated on booking logs and dispatch schedules.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Bell className="w-8 h-8 text-amber-500 animate-bounce" />
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="text-xxs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 mt-1"
            >
              <Check className="w-3.5 h-3.5" /> Mark all as read
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-500 text-xs rounded-xl flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-800">
            <Bell className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-550 dark:text-slate-450">You have no notification alerts at this moment.</p>
          </div>
        ) : (
          notifications.map((n) => {
            return (
              <div
                key={n._id}
                className={`p-5 rounded-2xl glass-card flex items-start gap-4 transition-all relative ${
                  !n.read ? 'border-amber-500/50 dark:border-amber-500/30 bg-amber-500/5' : 'hover:border-slate-350 dark:hover:border-slate-850'
                }`}
              >
                {!n.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500" />
                )}
                <div className={`p-2.5 rounded-xl border ${
                  n.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-550/20 text-emerald-500'
                    : 'bg-indigo-500/10 border-indigo-550/20 text-indigo-500'
                }`}>
                  {n.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">{n.body}</p>
                  <span className="text-xxs text-slate-400 dark:text-slate-500 block flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;

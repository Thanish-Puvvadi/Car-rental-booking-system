import React from 'react';
import { Bell, Info, Trip, CheckCircle, Clock } from 'lucide-react';

const Notifications = () => {
  const list = [
    {
      title: 'Welcome to Manivtha Travels!',
      body: 'Your account was successfully registered. You can now browse the fleet and request bookings.',
      date: 'Just now',
      type: 'info'
    },
    {
      title: 'Driver Assignment Alert',
      body: 'Amit Kumar has been assigned to your upcoming Bangalore to Coorg booking (KA-01-ZZ-5555). Check details in My Bookings.',
      date: 'Yesterday',
      type: 'success'
    },
    {
      title: 'Payment Confirmed',
      body: 'We recorded payment for your Bangalore to Mysore trip (INV-B832B2). Your PDF invoice is ready to download.',
      date: '3 days ago',
      type: 'success'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Alert Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">Stay updated on booking logs and schedules.</p>
        </div>
        <Bell className="w-8 h-8 text-amber-500" />
      </div>

      <div className="space-y-4">
        {list.map((n, idx) => {
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-card flex items-start gap-4 hover:border-slate-350 dark:hover:border-slate-850 transition-all"
            >
              <div className={`p-2.5 rounded-xl border ${
                n.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
              }`}>
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">{n.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{n.body}</p>
                <span className="text-xxs text-slate-400 dark:text-slate-500 block">{n.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;

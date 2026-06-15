import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 text-left">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Contact Our Team</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Reach out for bookings support, vehicle queries, or monthly partner corporate plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass-card flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Phone Hotline</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Main Support: +91 98765 43210 <br />
                Coordinators: +91 91111 22222
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Email Communications</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Bookings: bookings@manivtha.com <br />
                Accounts: accounts@manivtha.com
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Corporate Headquarters</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Main Road, near Metro Station, City Hub, Bangalore, India
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Support Hours</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Desk Operations: 8:00 AM - 10:00 PM <br />
                Trip Assistance: 24 Hours Active
              </p>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl glass-card space-y-6">
            <h3 className="text-2xl font-bold">Send An Inquiry</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xxs font-bold text-slate-400 uppercase">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white focus:border-amber-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xxs font-bold text-slate-400 uppercase">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Message Body</label>
              <textarea
                rows="4"
                placeholder="How can we assist you with your travels..."
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-900 dark:text-white focus:border-amber-500 transition-all resize-none"
              />
            </div>

            <button className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
              Submit Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

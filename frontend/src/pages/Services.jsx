import React from 'react';
import { Compass, Calendar, Plane, ShieldCheck } from 'lucide-react';

const Services = () => {
  const list = [
    {
      title: 'Outstation Tours',
      icon: Compass,
      desc: 'Sightseeing packages across South India with experienced drivers. Flexible multi-day schedules with overnight options.'
    },
    {
      title: 'Local Rentals',
      icon: Calendar,
      desc: 'Hourly package rates (e.g. 8 hrs / 80 km) for city travel, wedding events, shopping tours, and family gatherings.'
    },
    {
      title: 'Airport Transfers',
      icon: Plane,
      desc: 'Timely pickup & drop-offs to domestic & international airports. Automated flight status monitoring for delay checks.'
    },
    {
      title: 'Corporate Travel Solutions',
      icon: ShieldCheck,
      desc: 'Monthly rosters and long-term lease options for corporate executives. Fully compliant reporting and monthly accounts.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 text-left">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Rental Services</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Tailored transit designs to fit personal, tourist, or business itineraries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {list.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div key={idx} className="p-8 rounded-3xl glass-card space-y-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl inline-block">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{srv.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{srv.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;

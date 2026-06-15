import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [activeIdx, setActiveIdx] = useState(null);

  const list = [
    {
      q: 'How do I request a booking?',
      a: 'Browse the fleet catalog, select a vehicle, check date availability using the calendar widget, fill in trip parameters, and submit. If authenticated, this creates a Pending request in the system.'
    },
    {
      q: 'How are drivers assigned to my booking?',
      a: 'After you submit a booking request, the admin team reviews details and driver availability. The driver coordinator assigns an available driver to the booking, progressing status to "Driver Assigned". You can review driver coordinates in your customer dashboard.'
    },
    {
      q: 'How is payment processed?',
      a: 'The accounts team logs payments received (e.g. Card, Cash, or UPI transactions) against bookings. Once payment is recorded, status progresses to "Payment Completed" and you can download a PDF invoice.'
    },
    {
      q: 'Can I cancel an active booking request?',
      a: 'Yes, pending bookings can be canceled directly from the dashboard. Once approved or driver assigned, please contact the dispatch coordinators hotline to process cancels.'
    },
    {
      q: 'What seating options are recommended for groups?',
      a: 'Our recommendation rules are: 1 to 4 passengers require a Sedan (e.g. Honda City), 5 to 7 passengers require an SUV (e.g. Toyota Innova), and 8 or more passengers require a Tempo Traveller (e.g. Force Traveller).'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-left">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">FAQ Helpdesk</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Find answers about bookings, driver allocations, payment logging, and recommendations.
        </p>
      </div>

      <div className="space-y-4">
        {list.map((item, idx) => {
          const isOpen = activeIdx === idx;
          return (
            <div key={idx} className="rounded-xl glass-card overflow-hidden">
              <button
                onClick={() => setActiveIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 font-semibold text-slate-800 dark:text-white hover:text-amber-500 dark:hover:text-amber-500 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0" />
                  {item.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/20 dark:border-slate-850/20 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;

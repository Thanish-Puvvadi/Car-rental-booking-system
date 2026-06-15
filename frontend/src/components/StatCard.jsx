import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, trend, color = 'indigo' }) => {
  const colorSchemes = {
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500 dark:text-indigo-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-500 dark:text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-500 dark:text-rose-400',
  };

  return (
    <div className="p-6 rounded-2xl glass-card transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${colorSchemes[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold">
          <span className={trend.positive ? 'text-emerald-500' : 'text-rose-500'}>
            {trend.value}
          </span>
          <span className="text-slate-500 dark:text-slate-550">
            {description}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

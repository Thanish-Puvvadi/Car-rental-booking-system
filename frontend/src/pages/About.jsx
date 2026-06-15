import React from 'react';
import { Shield, Users, Award, Landmark } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 text-left">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">About Manivtha Tours & Travels</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Connecting destinations, families, and businesses since 2018 with safe, high-end car rentals.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl inline-block">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Safety First</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Meticulous 40-point maintenance checklists before every vehicle dispatch.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl inline-block">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Professional Crew</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drivers trained in security, route navigation, and hospitality manners.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl inline-block">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Premium Fleet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Vast options including luxury Sedans, executive SUVs, and mini coaches.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl inline-block">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Fair Pricing</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transparent estimates with no hidden taxes or fuel surcharges.
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Journey</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Founded in Bangalore, Manivtha Tours & Travels started with a humble fleet of three cars. Today, we handle regional tour portfolios, tourist transport coordinates, and corporate commutes across South India.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            By integrating modern scheduling dashboards, real-time driver tracking, and digital invoice compilation, we continue to streamline passenger rentals while preserving the warmth of classical travel hospitality.
          </p>
        </div>
        <div className="h-80 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800"
            alt="Scenic Road Trip"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;

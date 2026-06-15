import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Settings, ShieldAlert, Key, ToggleLeft, Activity } from 'lucide-react';
import Spinner from '../../components/UI/Spinner';

const SettingsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settings states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/reports/dashboard-stats');
        if (res.data && res.data.success) {
          setLogs(res.data.recentLogs || []);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Portal Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure notifications, trip rules, and audit logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Toggle options */}
        <div className="lg:col-span-1 p-6 rounded-3xl glass-card space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-1.5">
            <Settings className="w-5 h-5 text-amber-505" /> Options
          </h3>

          <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
            <div className="flex justify-between items-center py-2">
              <div>
                <span className="block text-slate-900 dark:text-white">Email alerts</span>
                <span className="text-xxs text-slate-400 font-normal">Notify customers on approvals</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center py-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <div>
                <span className="block text-slate-900 dark:text-white">WhatsApp Integration</span>
                <span className="text-xxs text-slate-400 font-normal">Push live driver GPS coordinates</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={() => setWhatsappAlerts(!whatsappAlerts)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center py-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <div>
                <span className="block text-slate-900 dark:text-white">Maintenance Mode</span>
                <span className="text-xxs text-slate-400 font-normal">Lock customer booking widgets</span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={() => setMaintenanceMode(!maintenanceMode)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Audit logs list */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-1.5">
            <Activity className="w-5 h-5 text-indigo-505" /> Portal Audit Log History
          </h3>

          {loading ? (
            <div className="py-10 flex justify-center items-center">
              <Spinner />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-slate-400 text-xs py-10 text-center">No system logs registered.</p>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-xxs flex justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">
                      {log.action}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 block font-normal">
                      {log.details}
                    </span>
                    <span className="text-slate-400 font-normal block mt-1">
                      By: {log.user?.name || 'System'} ({log.user?.role || 'Staff'})
                    </span>
                  </div>
                  <span className="text-slate-400 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

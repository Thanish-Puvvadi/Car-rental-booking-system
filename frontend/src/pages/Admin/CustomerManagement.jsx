import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Calendar, Mail } from 'lucide-react';
import Spinner from '../../components/UI/Spinner';

const CustomerManagement = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/users');
        if (res.data && res.data.success) {
          setUsersList(res.data.users);
        }
      } catch (err) {
        console.error('Failed to load users:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter to show only customers or display role badge
  const customers = usersList.filter((u) => u.role === 'customer');

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Customer Accounts</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">View and audit registered customer profiles.</p>
      </div>

      {loading ? (
        <div className="h-60 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : customers.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-sm">No registered customers found.</p>
        </div>
      ) : (
        <div className="rounded-3xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-xxs tracking-wider">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Mobile No</th>
                  <th className="py-3 px-6">Home Address</th>
                  <th className="py-3 px-6">Created On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-850/50">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all text-xs">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                        <Users className="w-4 h-4" />
                      </div>
                      {c.name}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-350">{c.email}</td>
                    <td className="py-4 px-6 font-semibold">{c.phone || 'N/A'}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 max-w-xs truncate">{c.address || 'N/A'}</td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;

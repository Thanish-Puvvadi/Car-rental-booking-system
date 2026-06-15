import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, UserCheck, ShieldAlert } from 'lucide-react';
import Spinner from '../../components/UI/Spinner';
import Modal from '../../components/UI/Modal';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    licenseNumber: '',
    experience: '',
    availabilityStatus: 'Available',
  });

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/drivers');
      if (res.data && res.data.success) {
        setDrivers(res.data.drivers);
      }
    } catch (err) {
      console.error('Error fetching drivers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleOpenAddModal = () => {
    setEditMode(false);
    setFormData({
      name: '',
      phoneNumber: '',
      licenseNumber: '',
      experience: '',
      availabilityStatus: 'Available',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (driver) => {
    setEditMode(true);
    setSelectedDriverId(driver._id);
    setFormData({
      name: driver.name,
      phoneNumber: driver.phoneNumber,
      licenseNumber: driver.licenseNumber,
      experience: driver.experience,
      availabilityStatus: driver.availabilityStatus,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (editMode) {
        const res = await api.put(`/drivers/${selectedDriverId}`, formData);
        if (res.data && res.data.success) {
          setModalOpen(false);
          fetchDrivers();
        }
      } else {
        const res = await api.post('/drivers', formData);
        if (res.data && res.data.success) {
          setModalOpen(false);
          fetchDrivers();
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit driver details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm('Are you sure you want to remove this driver from roster?')) return;
    try {
      const res = await api.delete(`/drivers/${driverId}`);
      if (res.data && res.data.success) {
        fetchDrivers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Driver Roster</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Add, track, or manage verified drivers.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Driver
        </button>
      </div>

      {loading ? (
        <div className="h-60 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : drivers.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-sm">No drivers recorded in system.</p>
        </div>
      ) : (
        <div className="rounded-3xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-xxs tracking-wider">
                  <th className="py-3 px-6">Driver Name</th>
                  <th className="py-3 px-6">Mobile No</th>
                  <th className="py-3 px-6">License ID</th>
                  <th className="py-3 px-6">Experience</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-850/50">
                {drivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-650 dark:text-indigo-400">
                        <UserCheck className="w-4.5 h-4.5" />
                      </div>
                      {driver.name}
                    </td>
                    <td className="py-4 px-6 text-xs">{driver.phoneNumber}</td>
                    <td className="py-4 px-6 uppercase font-semibold text-xs text-slate-600 dark:text-slate-350">
                      {driver.licenseNumber}
                    </td>
                    <td className="py-4 px-6 text-xs">{driver.experience} Years</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xxs font-bold px-2.5 py-0.5 rounded-full ${
                          driver.availabilityStatus === 'Available'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-500'
                            : driver.availabilityStatus === 'Busy'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-955/20'
                            : 'bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {driver.availabilityStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(driver)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-550 text-slate-400 hover:text-amber-500"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(driver._id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-red-500 text-slate-400 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? 'Edit Driver parameters' : 'Register New Driver'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-100 dark:bg-rose-955/20 border border-rose-250 dark:border-rose-900 text-rose-500 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xxs font-bold text-slate-400 uppercase">Driver Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xxs font-bold text-slate-400 uppercase">Mobile Number</label>
            <input
              type="text"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xxs font-bold text-slate-400 uppercase">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              required
              value={formData.licenseNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                required
                min="1"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Status</label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              >
                <option>Available</option>
                <option>Busy</option>
                <option>Off-duty</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex justify-center items-center"
          >
            {submitting ? <Spinner size="sm" color="white" /> : 'Save Driver'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default DriverManagement;

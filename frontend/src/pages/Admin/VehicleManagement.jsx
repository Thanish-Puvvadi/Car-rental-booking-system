import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import Spinner from '../../components/UI/Spinner';
import Modal from '../../components/UI/Modal';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    registrationNumber: '',
    fuelType: 'Petrol',
    seatingCapacity: 4,
    dailyPrice: '',
    image: '',
    availabilityStatus: 'Available',
  });

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles');
      if (res.data && res.data.success) {
        setVehicles(res.data.vehicles);
      }
    } catch (err) {
      console.error('Error fetching fleet:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAddModal = () => {
    setEditMode(false);
    setFormData({
      name: '',
      brand: '',
      model: '',
      registrationNumber: '',
      fuelType: 'Petrol',
      seatingCapacity: 4,
      dailyPrice: '',
      image: '',
      availabilityStatus: 'Available',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (car) => {
    setEditMode(true);
    setSelectedVehicleId(car._id);
    setFormData({
      name: car.name,
      brand: car.brand,
      model: car.model,
      registrationNumber: car.registrationNumber,
      fuelType: car.fuelType,
      seatingCapacity: car.seatingCapacity,
      dailyPrice: car.dailyPrice,
      image: car.image,
      availabilityStatus: car.availabilityStatus,
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
        const res = await api.put(`/vehicles/${selectedVehicleId}`, formData);
        if (res.data && res.data.success) {
          setModalOpen(false);
          fetchVehicles();
        }
      } else {
        const res = await api.post('/vehicles', formData);
        if (res.data && res.data.success) {
          setModalOpen(false);
          fetchVehicles();
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit vehicle data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const res = await api.delete(`/vehicles/${carId}`);
      if (res.data && res.data.success) {
        fetchVehicles();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Vehicle Inventory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Add, edit, or remove fleet cars.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="h-60 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-205 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-sm">No vehicles found in database.</p>
        </div>
      ) : (
        <div className="rounded-3xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-xxs tracking-wider">
                  <th className="py-3 px-6">Details</th>
                  <th className="py-3 px-6">Reg No</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Rate (INR)</th>
                  <th className="py-3 px-6">Availability</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-850/50">
                {vehicles.map((car) => (
                  <tr key={car._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-12 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{car.name}</span>
                        <span className="text-xxs text-slate-400 font-semibold uppercase">{car.brand}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold uppercase text-xs">{car.registrationNumber}</td>
                    <td className="py-4 px-6 text-xs">
                      {car.seatingCapacity} Seater • {car.fuelType}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">₹{car.dailyPrice}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xxs font-bold px-2.5 py-0.5 rounded-full ${
                          car.availabilityStatus === 'Available'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-500'
                            : car.availabilityStatus === 'Rented'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-955/20 dark:text-amber-500'
                            : 'bg-red-100 text-red-700 dark:bg-red-955/20 dark:text-red-500'
                        }`}
                      >
                        {car.availabilityStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(car)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-550 text-slate-400 hover:text-amber-500"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(car._id)}
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
        title={editMode ? 'Edit Vehicle specifications' : 'Register New Vehicle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-100 dark:bg-rose-955/20 border border-rose-250 dark:border-rose-900 text-rose-500 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Brand</label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Model Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Registration No</label>
              <input
                type="text"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Model Spec Year</label>
              <input
                type="text"
                name="model"
                required
                placeholder="2023 SX"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Fuel Category</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
                <option>CNG</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Seating Capacity</label>
              <input
                type="number"
                name="seatingCapacity"
                required
                min="1"
                value={formData.seatingCapacity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xxs font-bold text-slate-400 uppercase">Daily rate (INR)</label>
              <input
                type="number"
                name="dailyPrice"
                required
                value={formData.dailyPrice}
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
                <option>Rented</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xxs font-bold text-slate-400 uppercase">Photo URL</label>
            <input
              type="text"
              name="image"
              placeholder="https://..."
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-slate-205 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-slate-905 dark:text-white focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex justify-center items-center"
          >
            {submitting ? <Spinner size="sm" color="white" /> : 'Save Vehicle'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default VehicleManagement;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, SlidersHorizontal, Users, Compass, Shield, ArrowRight } from 'lucide-react';
import Spinner from '../components/UI/Spinner';

const Fleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    const fetchVehicles = async () => {
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
    fetchVehicles();
  }, []);

  // Filter client-side for smoother interaction
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuel = selectedFuel ? v.fuelType === selectedFuel : true;
    const matchesCapacity = selectedCapacity ? v.seatingCapacity >= Number(selectedCapacity) : true;
    const matchesPrice = v.dailyPrice <= maxPrice;
    return matchesSearch && matchesFuel && matchesCapacity && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Fleet Inventory</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Compare models, capacity limits, and hire pricing.
        </p>
      </div>

      {/* Advanced Filtering controls */}
      <div className="p-6 rounded-2xl glass-card grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-sm text-slate-900 dark:text-white focus:border-amber-500 transition-all"
          />
        </div>

        {/* Fuel Type */}
        <div>
          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-sm text-slate-900 dark:text-white focus:border-amber-500 transition-all"
          >
            <option value="">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Capacity */}
        <div>
          <select
            value={selectedCapacity}
            onChange={(e) => setSelectedCapacity(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 rounded-xl outline-none text-sm text-slate-900 dark:text-white focus:border-amber-500 transition-all"
          >
            <option value="">Any Capacity</option>
            <option value="4">4+ Seats (Sedan)</option>
            <option value="7">7+ Seats (SUV)</option>
            <option value="12">12+ Seats (Traveller)</option>
          </select>
        </div>

        {/* Max Daily Price */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-450 font-semibold">
            <span>Max Price:</span>
            <span>₹{maxPrice.toLocaleString()}/day</span>
          </div>
          <input
            type="range"
            min="2000"
            max="10000"
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Fleet Grid */}
      {loading ? (
        <div className="h-80 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="h-60 flex flex-col items-center justify-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <SlidersHorizontal className="w-12 h-12 text-slate-400 mb-2" />
          <h3 className="font-bold text-slate-900 dark:text-white">No Vehicles Match Criteria</h3>
          <p className="text-xs text-slate-450 mt-1">Try resetting search filters or sliders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredVehicles.map((car) => (
            <div key={car._id} className="rounded-2xl glass-card overflow-hidden glass-card-hover flex flex-col justify-between group">
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  {/* Status Badge */}
                  <span
                    className={`absolute top-4 left-4 px-2.5 py-1 text-white font-bold text-xxs rounded-full ${
                      car.availabilityStatus === 'Available'
                        ? 'bg-emerald-600'
                        : car.availabilityStatus === 'Rented'
                        ? 'bg-amber-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {car.availabilityStatus}
                  </span>
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-slate-900/90 text-white font-bold text-xs rounded-full">
                    ₹{car.dailyPrice}/day
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{car.brand}</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{car.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{car.model}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-slate-200/50 dark:border-slate-800/50 py-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-500" />
                      <span>{car.seatingCapacity} Seater</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-amber-500" />
                      <span>Fuel: {car.fuelType}</span>
                    </div>
                  </div>

                  <div className="text-xxs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>Insurance Included • 24/7 Roadside Assistance</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/vehicles/${car._id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-3 border border-slate-250 dark:border-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-350 dark:hover:text-amber-500 font-semibold rounded-xl text-sm transition-all"
                >
                  Configure Trip <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fleet;

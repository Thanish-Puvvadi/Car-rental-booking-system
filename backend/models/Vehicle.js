const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter vehicle name'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please enter vehicle brand'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please enter vehicle model'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please enter registration number'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      required: [true, 'Please select fuel type'],
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Please specify seating capacity'],
    },
    dailyPrice: {
      type: Number,
      required: [true, 'Please specify daily rental price'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600', // default fallback car
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Rented', 'Maintenance'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);

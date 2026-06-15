const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    dropLocation: {
      type: String,
      required: [true, 'Drop location is required'],
      trim: true,
    },
    rentalDate: {
      type: Date,
      required: [true, 'Rental start date is required'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },
    passengers: {
      type: Number,
      required: [true, 'Number of passengers is required'],
      min: 1,
    },
    tripType: {
      type: String,
      enum: ['One Way', 'Round Trip', 'Local Rental'],
      required: [true, 'Trip type is required'],
    },
    specialInstructions: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Driver Assigned', 'Payment Completed', 'Trip Started', 'Trip Completed'],
      default: 'Pending',
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    totalCost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);

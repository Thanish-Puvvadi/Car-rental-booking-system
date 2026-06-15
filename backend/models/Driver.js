const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide driver name'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide driver phone number'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'Please provide driver license number'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please enter driver experience in years'],
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Busy', 'Off-duty'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Driver', driverSchema);

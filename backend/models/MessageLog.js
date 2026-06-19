const mongoose = require('mongoose');

const MessageLogSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    enum: ['WhatsApp', 'Email'],
    required: true
  },
  subject: {
    type: String,
    default: ''
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Sent', 'Delivered'],
    default: 'Delivered'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MessageLog', MessageLogSchema);

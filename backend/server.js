require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const driverRoutes = require('./routes/driverRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Manivtha Tours & Travels API',
    status: 'Healthy',
    timestamp: new Date()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error.message);
    process.exit(1);
  }
};

startServer();

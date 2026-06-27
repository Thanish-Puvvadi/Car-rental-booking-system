const mongoose = require('mongoose');
require('dotenv').config();
const Vehicle = require('./models/Vehicle');

const updateImage = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manivtha_tours';
    await mongoose.connect(connStr);
    console.log('Connected to DB');

    const result = await Vehicle.updateOne(
      { name: 'Force Traveller' },
      { $set: { image: '/images/force_traveller.png' } }
    );
    
    console.log('Update result:', result);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateImage();

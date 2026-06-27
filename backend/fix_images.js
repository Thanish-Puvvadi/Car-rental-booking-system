const mongoose = require('mongoose');
require('dotenv').config();
const Vehicle = require('./models/Vehicle');

const fixImages = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manivtha_tours';
    await mongoose.connect(connStr);
    console.log('Connected to DB');

    const vehicles = await Vehicle.find();
    for (let v of vehicles) {
      if (v.image.startsWith('/images/')) {
        console.log(`Fixing image for ${v.name}`);
        // assign a fallback unsplash image
        v.image = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600';
        await v.save();
      }
    }
    
    console.log('Done fixing images');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixImages();

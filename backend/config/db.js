const mongoose = require('mongoose');
const { seedDB } = require('../utils/seedData');

const connectDB = async () => {
  try {
    let connStr = process.env.MONGODB_URI;
    let usingInMemory = false;

    if (!connStr) {
      console.log('No MONGODB_URI found. Checking if local MongoDB is running...');
      try {
        await mongoose.connect('mongodb://localhost:27017/manivtha_tours', {
          serverSelectionTimeoutMS: 2000
        });
        console.log(`MongoDB Connected successfully to local database: ${mongoose.connection.host}`);
        return;
      } catch (localErr) {
        console.log('Local MongoDB not running. Initializing In-Memory database fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        connStr = mongoServer.getUri();
        usingInMemory = true;
        global.__MONGO_MEMORY_SERVER__ = mongoServer;
      }
    }

    await mongoose.connect(connStr);
    console.log(`MongoDB Connected successfully to: ${mongoose.connection.host}`);

    if (usingInMemory) {
      console.log('Seeding in-memory database with demo records...');
      await seedDB();
      console.log('In-memory database seeded successfully!');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

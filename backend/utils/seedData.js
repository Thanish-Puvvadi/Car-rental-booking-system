require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const AuditLog = require('../models/AuditLog');

const users = [
  {
    name: 'Manivtha Admin',
    email: 'admin@manivtha.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 99999 88888',
    address: 'HQ Administrative Block, Bangalore, India'
  },
  {
    name: 'Suresh Coordinator',
    email: 'coordinator@manivtha.com',
    password: 'coordinator123',
    role: 'driver_coordinator',
    phone: '+91 88888 77777',
    address: 'Dispatch Bay 2, Bangalore, India'
  },
  {
    name: 'Rajesh Accountant',
    email: 'accounts@manivtha.com',
    password: 'accounts123',
    role: 'accounts',
    phone: '+91 77777 66666',
    address: 'Finance Dept, Bangalore, India'
  },
  {
    name: 'Rahul Customer',
    email: 'customer@gmail.com',
    password: 'customer123',
    role: 'customer',
    phone: '+91 98765 43210',
    address: 'Indiranagar, Bangalore, India'
  }
];

const vehicles = [
  {
    name: 'Honda City',
    brand: 'Honda',
    model: '2023 ZX i-VTEC',
    registrationNumber: 'KA-03-MM-1234',
    fuelType: 'Petrol',
    seatingCapacity: 4,
    dailyPrice: 2500,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    availabilityStatus: 'Available'
  },
  {
    name: 'Hyundai Verna',
    brand: 'Hyundai',
    model: '2022 SX Opt',
    registrationNumber: 'KA-51-AB-7890',
    fuelType: 'Diesel',
    seatingCapacity: 4,
    dailyPrice: 2700,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=600',
    availabilityStatus: 'Available'
  },
  {
    name: 'Toyota Innova Crysta',
    brand: 'Toyota',
    model: '2023 2.4 VX',
    registrationNumber: 'KA-01-ZZ-5555',
    fuelType: 'Diesel',
    seatingCapacity: 7,
    dailyPrice: 4500,
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=600',
    availabilityStatus: 'Available'
  },
  {
    name: 'Mahindra XUV700',
    brand: 'Mahindra',
    model: '2023 AX7 Luxury',
    registrationNumber: 'KA-04-PP-4321',
    fuelType: 'Petrol',
    seatingCapacity: 7,
    dailyPrice: 4800,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=600',
    availabilityStatus: 'Available'
  },
  {
    name: 'Force Traveller',
    brand: 'Force',
    model: '3070 Super 12S',
    registrationNumber: 'KA-02-TT-9999',
    fuelType: 'Diesel',
    seatingCapacity: 12,
    dailyPrice: 6500,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    availabilityStatus: 'Available'
  },
  {
    name: 'Tata Winger',
    brand: 'Tata',
    model: '2022 Tourist 15S',
    registrationNumber: 'KA-03-WW-8888',
    fuelType: 'Diesel',
    seatingCapacity: 15,
    dailyPrice: 7000,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600',
    availabilityStatus: 'Maintenance'
  },
  {
    name: 'Toyota Camry Hybrid',
    brand: 'Toyota',
    model: '2023 Hybrid',
    registrationNumber: 'KA-01-HY-1111',
    fuelType: 'Hybrid',
    seatingCapacity: 5,
    dailyPrice: 5500,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=600',
    availabilityStatus: 'Available'
  },
  {
    name: 'Honda City e:HEV',
    brand: 'Honda',
    model: '2023 ZX e:HEV',
    registrationNumber: 'KA-03-HY-2222',
    fuelType: 'Hybrid',
    seatingCapacity: 5,
    dailyPrice: 3500,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
    availabilityStatus: 'Available'
  }
];

const drivers = [
  {
    name: 'Karan Singh',
    phoneNumber: '+91 91111 22222',
    licenseNumber: 'DL-1420180099887',
    experience: 8,
    availabilityStatus: 'Available'
  },
  {
    name: 'Amit Kumar',
    phoneNumber: '+91 92222 33333',
    licenseNumber: 'DL-1220150033445',
    experience: 12,
    availabilityStatus: 'Available'
  },
  {
    name: 'Vikram Patil',
    phoneNumber: '+91 93333 44444',
    licenseNumber: 'KA-5120190011223',
    experience: 5,
    availabilityStatus: 'Available'
  }
];

const seedDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/manivtha_tours';
      try {
        await mongoose.connect(connStr, { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to database for seeding...');
      } catch (connErr) {
        console.log('Connection to standard database failed. Using In-Memory database fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memConnStr = mongoServer.getUri();
        await mongoose.connect(memConnStr);
        console.log('Connected to In-Memory database for seeding...');
      }
    }

    // Clear all existing data
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Driver.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();
    await AuditLog.deleteMany();
    console.log('Cleared existing collections.');

    // Seed users
    // Need to save them individually to trigger pre-save hooks (password hashing)
    const seededUsers = [];
    for (const u of users) {
      const newUser = new User(u);
      await newUser.save();
      seededUsers.push(newUser);
    }
    console.log(`Seeded ${seededUsers.length} users successfully.`);

    const customerUser = seededUsers.find((u) => u.role === 'customer');
    const adminUser = seededUsers.find((u) => u.role === 'admin');

    // Seed vehicles
    const seededVehicles = await Vehicle.insertMany(vehicles);
    console.log(`Seeded ${seededVehicles.length} vehicles.`);

    // Seed drivers
    const seededDrivers = await Driver.insertMany(drivers);
    console.log(`Seeded ${seededDrivers.length} drivers.`);

    // Seed a couple of historical bookings & payments to populate dashboards
    const hondaCity = seededVehicles.find((v) => v.name === 'Honda City');
    const innova = seededVehicles.find((v) => v.name === 'Toyota Innova Crysta');
    
    // Booking 1: Completed Booking (Last Month)
    const lastMonthDate = new Date();
    lastMonthDate.setDate(lastMonthDate.getDate() - 30);
    const returnLastMonthDate = new Date(lastMonthDate);
    returnLastMonthDate.setDate(returnLastMonthDate.getDate() + 3);

    const booking1 = await Booking.create({
      customerName: 'Rahul Customer',
      mobileNumber: '+91 98765 43210',
      email: 'customer@gmail.com',
      user: customerUser._id,
      vehicle: hondaCity._id,
      driver: seededDrivers[0]._id,
      pickupLocation: 'Indiranagar, Bangalore',
      dropLocation: 'Mysore Palace, Mysore',
      rentalDate: lastMonthDate,
      returnDate: returnLastMonthDate,
      passengers: 3,
      tripType: 'Round Trip',
      totalDays: 3,
      totalCost: hondaCity.dailyPrice * 3,
      status: 'Trip Completed'
    });

    await Payment.create({
      booking: booking1._id,
      amount: booking1.totalCost,
      paymentMethod: 'UPI',
      transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000),
      paymentStatus: 'Completed',
      paymentDate: lastMonthDate
    });

    // Booking 2: Active Booking (Started 2 Days Ago)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);

    const booking2 = await Booking.create({
      customerName: 'Sanjay Sharma',
      mobileNumber: '+91 98111 22222',
      email: 'sanjay@gmail.com',
      user: customerUser._id,
      vehicle: innova._id,
      driver: seededDrivers[1]._id,
      pickupLocation: 'Electronic City, Bangalore',
      dropLocation: 'Coorg Resort, Coorg',
      rentalDate: twoDaysAgo,
      returnDate: tomorrow,
      passengers: 6,
      tripType: 'Outstation', // Round Trip fallback
      tripType: 'Round Trip',
      totalDays: 4,
      totalCost: innova.dailyPrice * 4,
      status: 'Trip Started'
    });

    await Payment.create({
      booking: booking2._id,
      amount: booking2.totalCost,
      paymentMethod: 'Credit Card',
      transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000),
      paymentStatus: 'Completed',
      paymentDate: twoDaysAgo
    });

    // Update vehicle and driver status for the active trip
    await Vehicle.findByIdAndUpdate(innova._id, { availabilityStatus: 'Rented' });
    await Driver.findByIdAndUpdate(seededDrivers[1]._id, { availabilityStatus: 'Busy' });

    // Seed some Audit Logs
    await AuditLog.create([
      {
        user: adminUser._id,
        action: 'System Seed',
        details: 'Database initialized with demo parameters'
      },
      {
        user: adminUser._id,
        action: 'Add Vehicle',
        details: 'Registered Honda City into fleet inventory'
      },
      {
        user: adminUser._id,
        action: 'Add Driver',
        details: 'Registered Karan Singh to roster'
      }
    ]);

    console.log('Seeded historical bookings, payments, and logs.');
    console.log('Database Seeding Completed Successfully.');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { seedDB };

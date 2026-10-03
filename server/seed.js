// server/seed.js
// Standalone script to populate sample data into MongoDB Atlas
require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { seedInitialDatabase } = require('./config/seedData');

async function seed() {
  try {
    console.log('--- Initializing MongoDB Sample Data Seeder ---');
    await connectDB();
    await seedInitialDatabase({ force: true });
    console.log('--- MongoDB Sample Data Successfully Seeded ---');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('--- Seeding Failed ---', err);
    process.exit(1);
  }
}

seed();

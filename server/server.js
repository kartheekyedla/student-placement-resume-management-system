// server/server.js
// Express API Entry for SmartHire (PathPilot) AI-Assisted Placement Platform

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, getDbStatus } = require('./config/db');
const { seedInitialDatabase } = require('./config/seedData');
const errorHandler = require('./middleware/errorHandler');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const driveRoutes = require('./routes/driveRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory for generated/uploaded resumes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health & System Info Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartHire Placement API is healthy and operational.',
    timestamp: new Date().toISOString(),
    database: getDbStatus(),
    version: '1.0.0'
  });
});

// Mount Feature API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler (sanitized, zero-stack leak)
app.use(errorHandler);

// Bootstrapping Server with DB & Seed
const startServer = async () => {
  try {
    await connectDB();
    await seedInitialDatabase();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` SmartHire API Server listening on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` Mode: ${getDbStatus().type}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
};

startServer();

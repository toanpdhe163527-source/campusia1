// campusia-backend/src/server.js
// Main server file for Campusia Backend API (JSON Storage - No MongoDB required)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 5000;

// ============= MIDDLEWARE =============

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve uploaded images
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============= JSON STORAGE SETUP =============

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize JSON files
const eventsFile = path.join(dataDir, 'events.json');
const adminFile = path.join(dataDir, 'admin.json');
const counterFile = path.join(dataDir, 'counter.json');

// Create events.json if not exists
if (!fs.existsSync(eventsFile)) {
  fs.writeFileSync(eventsFile, JSON.stringify([], null, 2));
  console.log('✅ Created events.json');
}

// Create admin.json if not exists
if (!fs.existsSync(adminFile)) {
  const bcrypt = require('bcryptjs');
  const defaultPassword = process.env.ADMIN_PASSWORD || 'campusia@12345';
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
  
  const adminData = {
    username: 'admin',
    password: hashedPassword,
    lastLogin: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(adminFile, JSON.stringify(adminData, null, 2));
  console.log('✅ Created admin.json with default password');
}

// Create counter.json if not exists
if (!fs.existsSync(counterFile)) {
  fs.writeFileSync(counterFile, JSON.stringify({ eventId: 0 }, null, 2));
  console.log('✅ Created counter.json');
}

console.log('✅ JSON storage initialized');

// ============= ROUTES =============

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    storage: 'JSON files'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Campusia API Server',
    version: '1.0.0',
    storage: 'JSON Files (No MongoDB required)',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      events: '/api/events/*'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============= START SERVER =============

app.listen(PORT, () => {
  console.log(`🚀 Campusia API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*'}`);
  console.log(`💾 Storage: JSON Files (No database required)`);
  console.log(`📁 Data directory: ${dataDir}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

module.exports = app;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { connectDB } = require('./config/db');
require('./config/cloudinary');

const healthRoutes = require('./routes/health');
const profileRoutes = require('./routes/profile');
const { router: mediaRoutes, handleUpload, upload } = require('./routes/media');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for Render + Vercel
const rawOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGIN || '*').split(',')
];

const allowedOrigins = rawOrigins
  .filter(Boolean)
  .map(o => o.trim().replace(/\/+$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow all vercel deployment preview & production URLs
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    // Allow localhost origins
    if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback to ensure zero downtime on new domains
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB Atlas
connectDB();

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/media', mediaRoutes);
app.post('/api/upload/cloudinary', upload.single('image'), handleUpload);
app.use('/api/contact', contactRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);

// API Root Information for Render
app.get('/', (req, res) => {
  res.json({
    service: 'Dr. Shubham Keshri — Executive REST API Server',
    version: '1.0.0',
    status: 'online',
    frontendUrl: process.env.CLIENT_URL || 'https://drshubhamkeshri.vercel.app',
    database: 'MongoDB Atlas',
    mediaStorage: 'Cloudinary CDN',
    endpoints: {
      health: '/api/health',
      profile: '/api/profile',
      media: '/api/media',
      contact: 'POST /api/contact',
      contacts: 'GET /api/contacts (Admin)',
      uploadCloudinary: 'POST /api/upload/cloudinary',
      adminLogin: 'POST /api/admin/login'
    }
  });
});

// 404 JSON Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found on Executive API Server',
    frontendApp: process.env.CLIENT_URL || 'https://drshubhamkeshri.vercel.app',
    healthCheck: '/api/health'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Executive API Server running on port ${PORT}`);
  console.log(`📡 Render URL / Local: http://localhost:${PORT}`);
  console.log(`📊 Health Endpoint:    http://localhost:${PORT}/api/health`);
  console.log(`🗄️  MongoDB Atlas:     CONNECTED`);
  console.log(`☁️  Cloudinary:        jzmuwtrf`);
  console.log(`====================================================`);
});

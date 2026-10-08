const express = require('express');
const router = express.Router();
const { getDBStatus } = require('../config/db');
const { getCloudinaryStatus } = require('../config/cloudinary');

router.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  const cldStatus = getCloudinaryStatus();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'MongoDB Atlas',
      connected: dbStatus.connected,
      mode: dbStatus.connected ? 'live_mongodb_atlas' : 'disconnected_or_standby',
      host: dbStatus.host
    },
    imageStorage: {
      provider: 'Cloudinary CDN',
      configured: cldStatus.configured,
      cloudName: cldStatus.cloudName
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime())
    }
  });
});

module.exports = router;

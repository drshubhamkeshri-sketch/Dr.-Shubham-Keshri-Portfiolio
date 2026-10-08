/**
 * Fallback bridge for Render when Root Directory is set to 'backend'
 * and Start Command is erroneously set to 'node backend/server.js'.
 */
module.exports = require('../server.js');

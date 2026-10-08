const express = require('express');
const router = express.Router();

const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'keshri2026';

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { passkey } = req.body;
  if (passkey && passkey === ADMIN_PASSKEY) {
    const token = 'sk_' + Buffer.from(`admin:${Date.now()}:${process.env.ADMIN_PASSKEY || 'default'}`).toString('base64');
    return res.json({
      success: true,
      message: 'Authentication successful. Executive privileges granted.',
      token,
      user: {
        name: 'Dr. Shubham Keshri',
        role: 'Executive Administrator'
      }
    });
  }
  return res.status(401).json({
    success: false,
    error: 'Invalid Executive Passkey. Access restricted to authorized personnel.'
  });
});

module.exports = router;

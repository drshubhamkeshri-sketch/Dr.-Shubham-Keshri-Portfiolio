const express = require('express');
const router = express.Router();
const multer = require('multer');
const Profile = require('../models/Profile');
const { uploadToCloudinary, getCloudinaryStatus } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const jsonBackupPath = path.join(__dirname, '..', 'data', 'profile.json');

// Helper to get or initialize profile
async function getOrCreateProfile() {
  let profile = await Profile.findOne().sort({ updatedAt: -1 });
  if (!profile) {
    if (fs.existsSync(jsonBackupPath)) {
      try {
        const jsonContent = JSON.parse(fs.readFileSync(jsonBackupPath, 'utf8'));
        profile = await Profile.create(jsonContent);
      } catch (e) {
        profile = await Profile.create({});
      }
    } else {
      profile = await Profile.create({});
    }
  }
  return profile;
}

// 1. GET /api/profile
router.get('/', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    res.json({
      success: true,
      data: profile
    });
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. PUT /api/profile - Update full profile or specific sections
router.put('/', async (req, res) => {
  try {
    let profile = await getOrCreateProfile();

    // Whitelist allowed top-level keys to prevent overwriting unintentionally
    const allowedKeys = [
      'name', 'title', 'executiveRole', 'tagline', 'avatarUrl',
      'heroStats', 'customStats', 'subroles', 'contacts',
      'education', 'research', 'electoralStrategy', 'companies'
    ];

    allowedKeys.forEach(key => {
      if (req.body[key] !== undefined) {
        profile[key] = req.body[key];
      }
    });

    profile.updatedAt = new Date();
    const saved = await profile.save();

    // Sync to local json backup
    try {
      const dataDir = path.join(__dirname, '..', 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(jsonBackupPath, JSON.stringify(saved, null, 2), 'utf8');
    } catch (e) {
      // non-fatal
    }

    res.json({
      success: true,
      message: 'Executive profile synchronized successfully in MongoDB Atlas.',
      data: saved
    });
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/profile/avatar - Dedicated Avatar Upload / Replacement
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No avatar image file provided.' });
    }

    const cldStatus = getCloudinaryStatus();
    if (!cldStatus.configured) {
      return res.status(500).json({ success: false, error: 'Cloudinary CDN credentials not configured.' });
    }

    // Upload new avatar directly to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'shubham_keshri_portfolio',
      public_id: `avatar_${Date.now()}`,
      transformation: [
        { width: 800, height: 800, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    const profile = await getOrCreateProfile();
    profile.avatarUrl = result.secure_url;
    profile.updatedAt = new Date();
    await profile.save();

    res.json({
      success: true,
      message: 'Executive profile avatar updated on Cloudinary CDN and MongoDB Atlas!',
      avatarUrl: result.secure_url
    });
  } catch (err) {
    console.error('Avatar upload error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= SUBDOCUMENT CRUD ENDPOINTS =================

// --- COMPANIES / EXPERIENCE ---
router.post('/companies', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    profile.companies.push(req.body);
    profile.updatedAt = new Date();
    await profile.save();
    res.status(201).json({ success: true, message: 'Experience added.', data: profile.companies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/companies/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    const item = profile.companies.id(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Experience record not found.' });
    Object.assign(item, req.body);
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Experience updated.', data: profile.companies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/companies/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    profile.companies.pull(req.params.id);
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Experience removed.', data: profile.companies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- EDUCATION & CREDENTIALS ---
router.post('/education', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    profile.education.push(req.body);
    profile.updatedAt = new Date();
    await profile.save();
    res.status(201).json({ success: true, message: 'Education record added.', data: profile.education });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/education/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    const item = profile.education.id(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Education record not found.' });
    Object.assign(item, req.body);
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Education record updated.', data: profile.education });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/education/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    profile.education.pull(req.params.id);
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Education record removed.', data: profile.education });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- RESEARCH & SCHOLARSHIP ---
router.post('/research', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    profile.research.push(req.body);
    profile.updatedAt = new Date();
    await profile.save();
    res.status(201).json({ success: true, message: 'Research publication added.', data: profile.research });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/research/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    const item = profile.research.id(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Research record not found.' });
    Object.assign(item, req.body);
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Research publication updated.', data: profile.research });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/research/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    profile.research.pull(req.params.id);
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Research publication removed.', data: profile.research });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ELECTORAL STRATEGY & REGIONAL RADAR ---
router.post('/electoral', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    profile.electoralStrategy.push(req.body);
    profile.updatedAt = new Date();
    await profile.save();
    res.status(201).json({ success: true, message: 'Electoral campaign added.', data: profile.electoralStrategy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/electoral/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    const item = profile.electoralStrategy.id(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Electoral campaign record not found.' });
    Object.assign(item, req.body);
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Electoral campaign updated.', data: profile.electoralStrategy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/electoral/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    profile.electoralStrategy.pull(req.params.id);
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, message: 'Electoral campaign removed.', data: profile.electoralStrategy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

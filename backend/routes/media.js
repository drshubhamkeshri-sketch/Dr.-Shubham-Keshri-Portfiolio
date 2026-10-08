const express = require('express');
const router = express.Router();
const multer = require('multer');
const Media = require('../models/Media');
const Profile = require('../models/Profile');
const { uploadToCloudinary, cloudinary, getCloudinaryStatus } = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// 1. GET /api/media - Retrieve all or filter/search
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { caption: regex }, { category: regex }];
    }

    const mediaList = await Media.find(query).sort({ order: 1, uploadedAt: -1 }).lean();

    res.json({
      success: true,
      count: mediaList.length,
      data: mediaList
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Upload handler (used by both /api/media/upload and /api/upload/cloudinary)
const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided for upload.' });
    }

    const { title, category, caption } = req.body;
    const cldStatus = getCloudinaryStatus();

    if (!cldStatus.configured) {
      return res.status(500).json({
        success: false,
        error: 'Cloudinary CDN credentials not configured on server.'
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'shubham_keshri_portfolio',
      tags: ['portfolio', category || 'governance']
    });

    const mediaDoc = await Media.create({
      title: title?.trim() || req.file.originalname,
      category: category || 'governance',
      caption: caption?.trim() || '',
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      localUrl: result.secure_url
    });

    res.status(201).json({
      success: true,
      message: 'Asset uploaded to Cloudinary CDN and permanently registered in MongoDB Atlas!',
      data: mediaDoc
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

router.post('/upload', upload.single('image'), handleUpload);
router.post('/', upload.single('image'), handleUpload);

// 3. PUT /api/media/:id - Update metadata
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, caption, order } = req.body;

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ success: false, error: 'Media record not found.' });
    }

    if (title !== undefined) media.title = title.trim();
    if (category !== undefined) media.category = category;
    if (caption !== undefined) media.caption = caption.trim();
    if (order !== undefined) media.order = Number(order);

    const saved = await media.save();
    res.json({
      success: true,
      message: 'Asset metadata updated successfully in MongoDB Atlas.',
      data: saved
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. POST /api/media/:id/replace - Replace Image File on Cloudinary
router.post('/:id/replace', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No replacement image file uploaded.' });
    }

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ success: false, error: 'Media record not found.' });
    }

    // Delete existing asset on Cloudinary if public ID exists
    if (media.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(media.cloudinaryPublicId);
      } catch (cldErr) {
        console.warn('Old Cloudinary image purge notice:', cldErr.message);
      }
    }

    // Upload new image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'shubham_keshri_portfolio',
      tags: ['portfolio', media.category || 'governance']
    });

    media.cloudinaryUrl = result.secure_url;
    media.cloudinaryPublicId = result.public_id;
    media.localUrl = result.secure_url;
    media.uploadedAt = new Date();

    if (req.body.title) media.title = req.body.title.trim();
    if (req.body.category) media.category = req.body.category;
    if (req.body.caption !== undefined) media.caption = req.body.caption.trim();

    const saved = await media.save();

    res.json({
      success: true,
      message: 'Asset file successfully replaced on Cloudinary CDN and updated in MongoDB Atlas!',
      data: saved
    });
  } catch (err) {
    console.error('Asset replacement error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /api/media/:id/set-avatar - Set this media item as Executive Profile Avatar
router.post('/:id/set-avatar', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ success: false, error: 'Media record not found.' });
    }

    const imgUrl = media.cloudinaryUrl || media.localUrl;
    await Profile.findOneAndUpdate(
      {},
      { avatarUrl: imgUrl, updatedAt: new Date() },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Executive Profile avatar updated to this asset!',
      avatarUrl: imgUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. DELETE /api/media/:id - Delete from Cloudinary & Atlas
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ success: false, error: 'Media record not found.' });
    }

    if (media.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(media.cloudinaryPublicId);
      } catch (cldErr) {
        console.warn('Cloudinary asset removal notice:', cldErr.message);
      }
    }

    await Media.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Media record permanently removed from MongoDB Atlas and Cloudinary CDN.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = { router, handleUpload, upload };

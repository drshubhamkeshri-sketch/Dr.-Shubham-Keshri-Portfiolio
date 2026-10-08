const express = require('express');
const router = express.Router();
const multer = require('multer');
const Media = require('../models/Media');
const { uploadToCloudinary, cloudinary, getCloudinaryStatus } = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET /api/media
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};

    const mediaList = await Media.find(filter).sort({ order: 1, uploadedAt: -1 }).lean();

    res.json({
      success: true,
      count: mediaList.length,
      data: mediaList
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/media/upload or /api/upload/cloudinary
const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided.' });
    }

    const { title, category, caption } = req.body;
    const cldStatus = getCloudinaryStatus();

    if (!cldStatus.configured) {
      return res.status(500).json({
        success: false,
        error: 'Cloudinary credentials are not configured on the server.'
      });
    }

    // Upload directly from memory buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'shubham_keshri_portfolio',
      tags: ['portfolio', category || 'governance']
    });

    // Save record to MongoDB Atlas
    const mediaDoc = await Media.create({
      title: title || req.file.originalname,
      category: category || 'governance',
      caption: caption || '',
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      localUrl: result.secure_url
    });

    res.status(201).json({
      success: true,
      message: 'Asset successfully uploaded to Cloudinary CDN and registered in MongoDB Atlas!',
      data: {
        id: mediaDoc._id,
        title: mediaDoc.title,
        url: result.secure_url,
        publicId: result.public_id,
        category: mediaDoc.category,
        caption: mediaDoc.caption
      }
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

router.post('/upload', upload.single('image'), handleUpload);

// DELETE /api/media/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ success: false, error: 'Media record not found.' });
    }

    // If it has a Cloudinary public ID, remove from Cloudinary CDN as well
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
      message: 'Media record successfully removed from MongoDB Atlas and Cloudinary CDN.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = { router, handleUpload, upload };

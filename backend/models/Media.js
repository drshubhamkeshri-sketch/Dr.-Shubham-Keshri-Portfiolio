const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['governance', 'grassroots', 'academic', 'portrait', 'all', 'deep-tech'],
    default: 'governance'
  },
  caption: {
    type: String,
    trim: true,
    default: ''
  },
  cloudinaryUrl: {
    type: String,
    default: ''
  },
  cloudinaryPublicId: {
    type: String,
    default: ''
  },
  localUrl: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);

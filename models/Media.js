const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['governance', 'grassroots', 'academic', 'portrait', 'all'],
    default: 'governance'
  },
  caption: {
    type: String,
    trim: true
  },
  localUrl: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    default: ''
  },
  cloudinaryPublicId: {
    type: String,
    default: ''
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);

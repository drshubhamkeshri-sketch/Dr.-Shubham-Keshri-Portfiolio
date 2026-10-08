const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 25
  },
  organization: {
    type: String,
    trim: true,
    maxlength: 100
  },
  interest: {
    type: String,
    enum: ['Land Intelligence / CALI AI', 'Strategic Advisory', 'Public Policy / Governance', 'Academic Research / SDGs', 'Media / Keynote', 'Other'],
    default: 'Land Intelligence / CALI AI'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: 3000
  },
  status: {
    type: String,
    enum: ['unread', 'reviewed', 'archived'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);

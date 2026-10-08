const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Dr. Shubham Keshri'
  },
  title: {
    type: String,
    required: true,
    default: 'Director, CALI AI & Sensonix Systems | Qualified Independent Director (IICA, MCA)'
  },
  executiveRole: {
    type: String,
    default: 'Director, CALI AI Private Limited'
  },
  tagline: {
    type: String,
    default: 'Architecting computational infrastructure for planetary land intelligence while orchestrating grassroots socio-economic transformation across India.'
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  heroStats: {
    directorships: { type: Number, default: 3 },
    stateCampaigns: { type: Number, default: 5 },
    constituencyUnits: { type: Number, default: 100 },
    scholarlyTreatises: { type: Number, default: 4 }
  },
  subroles: [{ type: String }],
  contacts: {
    email: { type: String, default: 'hansrajshubham@gmail.com' },
    phones: [{ type: String }],
    base: { type: String, default: 'Connaught Place, New Delhi, India' },
    addresses: {
      current: { type: String, default: 'H. No. 1548, Sector 46, Gurugram, Haryana – 122003' },
      permanent: { type: String, default: 'A-215/5, Chawla Complex, Vikas Marg, Shakarpur, New Delhi – 110092' }
    },
    companyWebsite: { type: String, default: 'https://calideeptechai.com' },
    facebook: { type: String, default: 'https://facebook.com/Shubhamkeshrimanmakeshistory' }
  },
  education: [
    {
      degree: String,
      institution: String,
      period: String,
      description: String
    }
  ],
  research: [
    {
      title: String,
      publication: String,
      abstract: String
    }
  ],
  electoralStrategy: [
    {
      state: String,
      regions: String,
      impact: String
    }
  ],
  companies: [
    {
      name: String,
      role: String,
      tagline: String,
      details: String
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', profileSchema);

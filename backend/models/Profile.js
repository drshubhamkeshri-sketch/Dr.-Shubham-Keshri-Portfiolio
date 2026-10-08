const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  period: { type: String, default: '' },
  location: { type: String, default: 'India' },
  tagline: { type: String, default: '' },
  details: { type: String, default: '' },
  description: { type: String, default: '' },
  website: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  achievements: [{ type: String }],
  logoUrl: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { strict: false });

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  period: { type: String, default: '' },
  year: { type: String, default: '' },
  field: { type: String, default: '' },
  description: { type: String, default: '' },
  credentialType: { type: String, default: 'Academic' },
  order: { type: Number, default: 0 }
}, { strict: false });

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  publication: { type: String, default: '' },
  journal: { type: String, default: '' },
  year: { type: String, default: '' },
  abstract: { type: String, default: '' },
  link: { type: String, default: '' },
  tags: [{ type: String }],
  order: { type: Number, default: 0 }
}, { strict: false });

const electoralSchema = new mongoose.Schema({
  state: { type: String, required: true },
  regions: { type: String, default: '' },
  territory: { type: String, default: '' },
  impact: { type: String, default: '' },
  summary: { type: String, default: '' },
  scope: [{ type: String }],
  scopeItems: [{ type: String }],
  order: { type: Number, default: 0 }
}, { strict: false });

const statItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  suffix: { type: String, default: '+' },
  order: { type: Number, default: 0 }
});

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
    default: 'Strategic Leader, Corporate Director, and Development Visionary building computational infrastructure for planetary land intelligence while orchestrating grassroots transformation.'
  },
  avatarUrl: {
    type: String,
    default: 'https://res.cloudinary.com/jzmuwtrf/image/upload/v1791464503/shubham_keshri_portfolio/executive_portrait.jpg'
  },
  heroStats: {
    directorships: { type: Number, default: 3 },
    campaigns: { type: Number, default: 5 },
    stateCampaigns: { type: Number, default: 5 },
    booths: { type: Number, default: 100 },
    constituencyUnits: { type: Number, default: 100 },
    scholarlyTreatises: { type: Number, default: 4 }
  },
  customStats: [statItemSchema],
  subroles: [{ type: String }],
  contacts: {
    email: { type: String, default: 'hansrajshubham@gmail.com' },
    phones: [{ type: String }],
    base: { type: String, default: 'Connaught Place, New Delhi, India' },
    addresses: {
      current: { type: String, default: 'Sector 46, Gurugram, Haryana – 122003' },
      permanent: { type: String, default: 'A-215/5, Chawla Complex, Vikas Marg, Shakarpur, New Delhi – 110092' }
    },
    companyWebsite: { type: String, default: 'https://calideeptechai.com' },
    facebook: { type: String, default: 'https://facebook.com/Shubhamkeshrimanmakeshistory' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  education: [educationSchema],
  research: [researchSchema],
  electoralStrategy: [electoralSchema],
  companies: [companySchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

module.exports = mongoose.model('Profile', profileSchema);

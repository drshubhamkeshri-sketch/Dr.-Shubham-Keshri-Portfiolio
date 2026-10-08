const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const fs = require('fs');
const path = require('path');

// Default fallback profile data
const defaultProfile = {
  name: "Dr. Shubham Keshri",
  title: "Strategic Leader | Social Reformer | Development Visionary",
  executiveRole: "Director, CALI AI Private Limited",
  tagline: "Architecting computational infrastructure for planetary land intelligence while orchestrating grassroots socio-economic transformation across India.",
  heroStats: {
    directorships: 3,
    stateCampaigns: 5,
    constituencyUnits: 100,
    scholarlyTreatises: 4
  },
  subroles: [
    "Director, CALI AI Private Limited (DPIIT Recognised Deep Tech)",
    "Director, Sensonix Systems Pvt. Ltd.",
    "Director, Rion Links Pvt. Ltd.",
    "Qualified Independent Director (IICA, Ministry of Corporate Affairs, GoI)",
    "Ph.D. Scholar in Sustainable Development Goals (Amity University)"
  ],
  contacts: {
    email: "hansrajshubham@gmail.com",
    phones: ["+91 75308 36212", "+91 96674 12363"],
    base: "Connaught Place, New Delhi, India",
    addresses: {
      current: "H. No. 1548, Sector 46, Gurugram, Haryana – 122003",
      permanent: "A-215/5, Chawla Complex, Vikas Marg, Shakarpur, New Delhi – 110092"
    },
    companyWebsite: "https://calideeptechai.com",
    facebook: "https://facebook.com/Shubhamkeshrimanmakeshistory"
  },
  education: [
    {
      degree: "Ph.D. in Sustainable Development Goals (Pursuing)",
      institution: "Amity University, Noida",
      period: "2022–2025",
      description: "Empirical research on sustainable policy frameworks, grassroots innovation, and socio-economic empowerment aligned with the UN SDG agenda."
    },
    {
      degree: "Qualified Independent Director",
      institution: "Indian Institute of Corporate Affairs (IICA), Ministry of Corporate Affairs, GoI",
      period: "May 2020",
      description: "Equipped with advanced competencies in board governance, statutory compliance, stakeholder management, and ethical corporate stewardship."
    },
    {
      degree: "Master of Arts in Sanskrit",
      institution: "Hansraj College, University of Delhi",
      period: "2017–2019",
      description: "Ancient Indian literature, philosophy, and linguistics with scholarly depth, contributing to cultural and intellectual preservation."
    },
    {
      degree: "Bachelor of Arts in Sanskrit",
      institution: "Hansraj College, University of Delhi",
      period: "2014–2017",
      description: "Classical Indian knowledge systems with active participation in co-curricular forums for community engagement."
    }
  ],
  research: [
    {
      title: "सम्प्रत्ययन-मीमांसा",
      publication: "Naagfani Journal, 2022 – भाग 4",
      abstract: "A philosophical treatise on belief, epistemology, and cognitive validation systems in classical Indian thought."
    },
    {
      title: "Sustainable Development and Cultural Integration in India",
      publication: "Naagfani Journal – भाग 431",
      abstract: "An interdisciplinary study analyzing UN Sustainable Development Goals through an Indic cultural and socio-economic lens."
    }
  ],
  electoralStrategy: [
    {
      state: "Tripura",
      regions: "Pratapgarh & Shadar area",
      impact: "Tribal and rural outreach, voter list verification, youth civic awareness programs, and booth-level data-driven mobilization plans."
    },
    {
      state: "Odisha",
      regions: "Barbil mineral belt",
      impact: "Region-specific campaigns emphasizing youth employment, mineral-belt development, and mobilizing women voters through SHG networks."
    },
    {
      state: "Haryana",
      regions: "Rewari & Gurgaon",
      impact: "Voter turnout initiatives, ground team deployment for constituency demographic micro-targeting, and coordination with local panchayats."
    },
    {
      state: "Delhi",
      regions: "Laxmi Nagar & East Delhi",
      impact: "Urban booth management, issue-based door-to-door campaigns, and youth outreach via cultural-civic interfaces."
    },
    {
      state: "Mumbai",
      regions: "Metropolitan constituencies",
      impact: "Media liaisoning, minority group engagement, and multi-lingual narrative storytelling for inclusive reach."
    }
  ],
  companies: [
    {
      name: "CALI AI Private Limited",
      role: "Director",
      tagline: "Operating System for Planetary Land Intelligence",
      details: "A deep-tech platform recognized by DPIIT that makes land computable at planetary scale via the Cognitive Land Atom, LIFT (fiscal computation) and RAIN (revenue intelligence) engines."
    },
    {
      name: "Sensonix Systems Pvt. Ltd.",
      role: "Director (2019–Present)",
      tagline: "High-Tech Systems & Strategic Operations",
      details: "Leads end-to-end business operations, corporate partnerships, and sustainable resource management frameworks."
    },
    {
      name: "Rion Links Pvt. Ltd.",
      role: "Director (2020–Present)",
      tagline: "Digital Transformation & Data Analytics",
      details: "Drives multi-location operations, digital transformation frameworks, and performance improvement strategies."
    }
  ]
};

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    let profile = null;
    try {
      profile = await Profile.findOne().sort({ updatedAt: -1 }).lean();
    } catch (dbErr) {
      console.warn('Profile DB read failed, falling back:', dbErr.message);
    }

    if (!profile) {
      // Check local JSON backup
      const jsonBackupPath = path.join(__dirname, '..', '..', 'data', 'profile.json');
      if (fs.existsSync(jsonBackupPath)) {
        try {
          const jsonContent = JSON.parse(fs.readFileSync(jsonBackupPath, 'utf8'));
          profile = { ...defaultProfile, ...jsonContent };
        } catch (e) {
          profile = defaultProfile;
        }
      } else {
        profile = defaultProfile;
      }
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, data: defaultProfile });
  }
});

// PUT /api/profile
router.put('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({ ...defaultProfile, ...req.body });
    } else {
      Object.assign(profile, req.body);
      profile.updatedAt = new Date();
    }
    const saved = await profile.save();

    // Also sync to data/profile.json as local backup if folder exists
    try {
      const dataDir = path.join(__dirname, '..', '..', 'data');
      if (fs.existsSync(dataDir)) {
        fs.writeFileSync(path.join(dataDir, 'profile.json'), JSON.stringify(saved, null, 2), 'utf8');
      }
    } catch (e) {
      // Non-fatal
    }

    res.json({
      success: true,
      message: 'Profile records synchronized successfully in MongoDB Atlas.',
      data: saved
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

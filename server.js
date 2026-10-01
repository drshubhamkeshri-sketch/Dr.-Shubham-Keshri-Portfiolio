require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const Contact = require('./models/Contact');
const Media = require('./models/Media');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Configure Cloudinary
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary initialized with provided credentials.');
} else {
  console.log('ℹ️ Cloudinary credentials not fully set in .env (running in local image mode).');
}

// Multer in-memory storage for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// MongoDB Connection with fallback
let isMongoConnected = false;
// Fallback in-memory contacts store if MongoDB is not running locally
const fallbackContacts = [];

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shubham_keshri_portfolio';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB connected successfully to: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB connection unavailable (${err.message}). Using resilient in-memory storage for contact submissions. Set MONGODB_URI in .env to connect to MongoDB Atlas.`);
  }
};

connectDB();

// Curated Media List (Real Photos from Executive Profile)
const curatedMediaList = [
  {
    id: 'media_01',
    title: 'Executive Portrait',
    category: 'portrait',
    caption: 'Dr. Shubham Keshri — Director, CALI AI & Sensonix Systems',
    localUrl: '/assets/images/executive_portrait.jpg'
  },
  {
    id: 'media_02',
    title: 'High-Level Policy Consultation',
    category: 'governance',
    caption: 'Dialogue with Union Minister Ramdas Athawale on social empowerment & governance initiatives',
    localUrl: '/assets/images/meeting_minister.jpg'
  },
  {
    id: 'media_03',
    title: 'Strategic Leadership Assembly',
    category: 'governance',
    caption: 'High-level conference with senior political leadership on regional development frameworks',
    localUrl: '/assets/images/meeting_leadership.jpg'
  },
  {
    id: 'media_04',
    title: 'Cultural Dialogue at Rashtrapati Bhavan',
    category: 'governance',
    caption: 'At Rashtrapati Bhavan with Padma Vibhushan Sonal Mansingh discussing Indic cultural policymaking',
    localUrl: '/assets/images/rashtrapati_bhavan.jpg'
  },
  {
    id: 'media_05',
    title: 'National Leadership Felicitation',
    category: 'governance',
    caption: 'Felicitation ceremony recognizing public contributions in civic awareness and reforms',
    localUrl: '/assets/images/felicitation.jpg'
  },
  {
    id: 'media_06',
    title: 'Sanskrit Bharati National Conference',
    category: 'academic',
    caption: 'Scholarly delegation at Sanskrit Bharati national intellectual symposium',
    localUrl: '/assets/images/sanskrit_conference.jpg'
  },
  {
    id: 'media_07',
    title: 'Grassroots Community Assembly',
    category: 'grassroots',
    caption: 'Direct community dialogue & rural voter engagement session in eastern states',
    localUrl: '/assets/images/grassroots_rally.jpg'
  },
  {
    id: 'media_08',
    title: 'Investor Awareness Symposium',
    category: 'governance',
    caption: 'MCA-affiliated investor awareness program under ICAI Committee on Capital Markets',
    localUrl: '/assets/images/investor_awareness_hall.jpg'
  },
  {
    id: 'media_09',
    title: 'Youth Education Drive',
    category: 'academic',
    caption: 'Interactive workshop on educational equity and grassroots youth development',
    localUrl: '/assets/images/youth_education.jpg'
  },
  {
    id: 'media_10',
    title: 'Planetary Climate March',
    category: 'grassroots',
    caption: 'Leading the People’s Climate March in New Delhi advocating for ecological conservation',
    localUrl: '/assets/images/climate_rally.jpg'
  },
  {
    id: 'media_11',
    title: 'Civic Mobilization Campaign',
    category: 'grassroots',
    caption: 'Youth demonstration for democratic participation and socio-economic rights',
    localUrl: '/assets/images/civic_march.jpg'
  },
  {
    id: 'media_12',
    title: 'Youth Community Outreach',
    category: 'grassroots',
    caption: 'Grassroots volunteer team connecting with urban youth communities',
    localUrl: '/assets/images/youth_outreach.jpg'
  }
];

// Profile Data
const profileData = {
  name: "Dr. Shubham Keshri",
  title: "Strategic Leader | Social Reformer | Development Visionary",
  executiveRole: "Director, CALI AI Private Limited",
  subroles: [
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

// Helper: Load dynamic profile from data/profile.json if available
const profileFilePath = path.join(__dirname, 'data', 'profile.json');
function getProfileData() {
  try {
    if (fs.existsSync(profileFilePath)) {
      const fileContent = fs.readFileSync(profileFilePath, 'utf8');
      return { ...profileData, ...JSON.parse(fileContent) };
    }
  } catch (e) {
    console.error('Error reading profile.json:', e.message);
  }
  return profileData;
}

// ======================== API ROUTES ========================

// 0. Dedicated Admin Dashboard Route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Admin Passkey Authentication
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'keshri2026';
app.post('/api/admin/login', (req, res) => {
  const { passkey } = req.body;
  if (passkey === ADMIN_PASSKEY) {
    const token = 'sk_' + Buffer.from(`admin:${Date.now()}`).toString('base64');
    return res.json({
      success: true,
      message: 'Authentication successful. Executive privileges granted.',
      token,
      user: { name: 'Dr. Shubham Keshri', role: 'Executive Administrator' }
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid Executive Passkey. Access restricted.' });
});

// 1. Health & Config Status API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'MongoDB',
      connected: isMongoConnected,
      mode: isMongoConnected ? 'live_mongodb' : 'resilient_in_memory_fallback',
      contactsCount: isMongoConnected ? undefined : fallbackContacts.length
    },
    imageStorage: {
      provider: 'Cloudinary',
      configured: isCloudinaryConfigured,
      cloudName: isCloudinaryConfigured ? process.env.CLOUDINARY_CLOUD_NAME : 'local_assets_mode'
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      uptimeSeconds: Math.floor(process.uptime())
    }
  });
});

// 2. Profile API (Read dynamic & Admin Write)
app.get('/api/profile', (req, res) => {
  res.json({
    success: true,
    data: getProfileData()
  });
});

app.put('/api/profile', (req, res) => {
  try {
    const current = getProfileData();
    const updated = { ...current, ...req.body };
    fs.writeFileSync(profileFilePath, JSON.stringify(updated, null, 2), 'utf8');
    res.json({
      success: true,
      message: 'Profile records synchronized successfully.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update profile: ' + err.message });
  }
});

// 3. Media Gallery API (combines local curated + MongoDB/Cloudinary records)
app.get('/api/media', async (req, res) => {
  try {
    let dbMedia = [];
    if (isMongoConnected) {
      dbMedia = await Media.find().sort({ uploadedAt: -1 }).lean();
    }
    const combined = [...curatedMediaList, ...dbMedia];
    res.json({
      success: true,
      count: combined.length,
      data: combined
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, data: curatedMediaList });
  }
});

// Delete media item
app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Media.findByIdAndDelete(id);
    }
    const idx = curatedMediaList.findIndex(m => m.id === id);
    if (idx !== -1) {
      curatedMediaList.splice(idx, 1);
    }
    res.json({ success: true, message: 'Media record removed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Contact Submission API (MongoDB Storage)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, organization, interest, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: name, email, and message.'
      });
    }

    const contactPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      organization: organization ? organization.trim() : '',
      interest: interest || 'Land Intelligence / CALI AI',
      message: message.trim(),
      status: 'unread',
      createdAt: new Date()
    };

    let savedRecord;
    if (isMongoConnected) {
      const newContact = new Contact(contactPayload);
      savedRecord = await newContact.save();
    } else {
      contactPayload._id = 'mem_' + Date.now();
      fallbackContacts.unshift(contactPayload);
      savedRecord = contactPayload;
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Dr. Shubham Keshri. Your inquiry has been registered in the Executive Portal.',
      data: {
        id: savedRecord._id,
        name: savedRecord.name,
        storedIn: isMongoConnected ? 'MongoDB' : 'MemoryCache'
      }
    });
  } catch (err) {
    console.error('Contact API error:', err);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while saving your inquiry. ' + err.message
    });
  }
});

// 5. Contact List & Status API (Admin Desk)
app.get('/api/contacts', async (req, res) => {
  try {
    if (isMongoConnected) {
      const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100).lean();
      return res.json({ success: true, count: contacts.length, source: 'MongoDB', data: contacts });
    } else {
      return res.json({ success: true, count: fallbackContacts.length, source: 'MemoryCache', data: fallbackContacts });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update inquiry status (unread, reviewed, archived)
app.patch('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isMongoConnected) {
      const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
      return res.json({ success: true, data: updated });
    } else {
      const item = fallbackContacts.find(c => c._id === id);
      if (item) item.status = status;
      return res.json({ success: true, data: item });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete inquiry
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Contact.findByIdAndDelete(id);
    } else {
      const idx = fallbackContacts.findIndex(c => c._id === id);
      if (idx !== -1) fallbackContacts.splice(idx, 1);
    }
    res.json({ success: true, message: 'Inquiry purged from executive register.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export inquiries to CSV
app.get('/api/contacts/export', async (req, res) => {
  try {
    let contacts = [];
    if (isMongoConnected) {
      contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    } else {
      contacts = fallbackContacts;
    }

    let csv = 'ID,Date,Name,Email,Phone,Organization,Interest,Status,Message\n';
    contacts.forEach(c => {
      const cleanMsg = (c.message || '').replace(/"/g, '""').replace(/\n/g, ' ');
      csv += `"${c._id}","${new Date(c.createdAt).toISOString()}","${c.name}","${c.email}","${c.phone || ''}","${c.organization || ''}","${c.interest}","${c.status || 'unread'}","${cleanMsg}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Dr_Keshri_Executive_Inquiries.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).send('Error generating export: ' + err.message);
  }
});

// 6. Cloudinary Upload API (Upload new image directly to Cloudinary)
app.post('/api/upload/cloudinary', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }

    if (!isCloudinaryConfigured) {
      // Graceful local store if Cloudinary keys aren't in .env yet
      const filename = `uploaded_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
      const savePath = path.join(__dirname, 'public', 'assets', 'images', filename);
      fs.writeFileSync(savePath, req.file.buffer);

      const localItem = {
        id: 'local_' + Date.now(),
        title: req.body.title || req.file.originalname,
        category: req.body.category || 'governance',
        caption: req.body.caption || 'Uploaded via Executive Command Desk',
        localUrl: `/assets/images/${filename}`
      };
      curatedMediaList.unshift(localItem);

      return res.json({
        success: true,
        message: 'Saved to local asset pipeline (Configure CLOUDINARY_CLOUD_NAME in .env for Cloudinary CDN distribution).',
        data: { url: localItem.localUrl, savedInDb: false }
      });
    }

    // Upload using buffer stream to Cloudinary
    const uploadStream = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'shubham_keshri_portfolio',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const result = await uploadStream(req.file.buffer);

    let mediaDoc = null;
    if (isMongoConnected) {
      mediaDoc = await Media.create({
        title: req.body.title || req.file.originalname,
        category: req.body.category || 'governance',
        caption: req.body.caption || '',
        localUrl: result.secure_url,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id
      });
    } else {
      curatedMediaList.unshift({
        id: 'cld_' + Date.now(),
        title: req.body.title || req.file.originalname,
        category: req.body.category || 'governance',
        caption: req.body.caption || '',
        localUrl: result.secure_url,
        cloudinaryUrl: result.secure_url
      });
    }

    res.json({
      success: true,
      message: 'Asset uploaded to Cloudinary CDN successfully!',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        savedInDb: Boolean(mediaDoc)
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Executive Portfolio Server running on port ${PORT}`);
  console.log(`📍 Web Application: http://localhost:${PORT}`);
  console.log(`📊 Health Check:    http://localhost:${PORT}/api/health`);
  console.log(`✉️  Contact API:    POST http://localhost:${PORT}/api/contact`);
  console.log(`📸 Cloudinary API: POST http://localhost:${PORT}/api/upload/cloudinary`);
  console.log(`====================================================`);
});

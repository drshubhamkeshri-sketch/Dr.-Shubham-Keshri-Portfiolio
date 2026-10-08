require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const Media = require('../models/Media');
const Profile = require('../models/Profile');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'jzmuwtrf',
  api_key: process.env.CLOUDINARY_API_KEY || '789451557362313',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Jn5ZxBfJp6pkOe7nzxCNtEOSaTk',
  secure: true
});

const curatedSeedItems = [
  {
    filename: 'executive_portrait.jpg',
    title: 'Executive Portrait',
    category: 'portrait',
    caption: 'Dr. Shubham Keshri — Director, CALI AI & Sensonix Systems',
    order: 1
  },
  {
    filename: 'meeting_minister.jpg',
    title: 'Dialogue with Union Minister Ramdas Athawale',
    category: 'governance',
    caption: 'High-level policy discussion on social welfare initiatives, economic inclusion, and grassroots mobilization.',
    order: 2
  },
  {
    filename: 'meeting_leadership.jpg',
    title: 'Strategic Leadership Assembly',
    category: 'governance',
    caption: 'High-level discussion with senior political leadership on regional development and civic infrastructure.',
    order: 3
  },
  {
    filename: 'rashtrapati_bhavan.jpg',
    title: 'At Rashtrapati Bhavan with Padma Vibhushan Sonal Mansingh',
    category: 'governance',
    caption: 'Dialogue on cultural policy, national heritage preservation, and classical Indian knowledge systems.',
    order: 4
  },
  {
    filename: 'felicitation.jpg',
    title: 'National Leadership Felicitation',
    category: 'governance',
    caption: 'Official recognition for contributions to civic mobilization, electoral literacy, and youth empowerment.',
    order: 5
  },
  {
    filename: 'sanskrit_conference.jpg',
    title: 'Sanskrit Bharati National Conference',
    category: 'academic',
    caption: 'Scholarly delegation at Sanskrit Bharati national intellectual symposium.',
    order: 6
  },
  {
    filename: 'grassroots_rally.jpg',
    title: 'Grassroots Community Assembly',
    category: 'grassroots',
    caption: 'Direct community dialogue & rural voter engagement session in eastern states.',
    order: 7
  },
  {
    filename: 'investor_awareness_hall.jpg',
    title: 'Investor Awareness Symposium',
    category: 'governance',
    caption: 'MCA-affiliated investor awareness program under ICAI Committee on Capital Markets.',
    order: 8
  },
  {
    filename: 'youth_education.jpg',
    title: 'Youth Education Drive',
    category: 'academic',
    caption: 'Interactive workshop on educational equity and grassroots youth development.',
    order: 9
  },
  {
    filename: 'climate_rally.jpg',
    title: 'Planetary Climate March',
    category: 'grassroots',
    caption: 'Leading the People’s Climate March in New Delhi advocating for ecological conservation.',
    order: 10
  },
  {
    filename: 'civic_march.jpg',
    title: 'Civic Mobilization Campaign',
    category: 'grassroots',
    caption: 'Youth demonstration for democratic participation and socio-economic rights.',
    order: 11
  },
  {
    filename: 'youth_outreach.jpg',
    title: 'Youth Community Outreach',
    category: 'grassroots',
    caption: 'Grassroots volunteer team connecting with urban youth communities.',
    order: 12
  },
  {
    filename: 'cali_gis_cadastre_satellite.jpg',
    title: 'Sentinel-2 Multi-Spectral Orthomosaic',
    category: 'deep-tech',
    caption: 'High-resolution cadastral spatial topology layer for planetary land intelligence.',
    order: 13
  },
  {
    filename: 'cali_gis_fiscal_heatmap.jpg',
    title: 'LIFT Ecological & Fiscal Heatmap',
    category: 'deep-tech',
    caption: 'AI-driven land intelligence fiscal computation and municipal revenue modeling.',
    order: 14
  },
  {
    filename: 'public_conference.jpg',
    title: 'Public Policy Symposium',
    category: 'academic',
    caption: 'Keynote discourse on public administration and institutional governance.',
    order: 15
  },
  {
    filename: 'campus_event.jpg',
    title: 'Academic Leadership Dialogue',
    category: 'academic',
    caption: 'Higher education forum on youth mentorship and Indic research frameworks.',
    order: 16
  }
];

const seedDatabaseAndCloudinary = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://drshubhamkeshri_db_user:zLG1ROOXASUgglXT@cluster0.pwrupsh.mongodb.net/shubham_keshri_portfolio?retryWrites=true&w=majority&appName=Cluster0';
  
  console.log('============================================================');
  console.log('🚀 SEEDING PROCESS INITIATED');
  console.log('============================================================');
  console.log(`📡 Connecting to MongoDB Atlas: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas successfully.');
  } catch (err) {
    console.error('❌ Could not connect to MongoDB Atlas:', err.message);
    process.exit(1);
  }

  // Look for image source directories (checking both frontend and public)
  const candidateDirs = [
    path.join(__dirname, '..', '..', 'public', 'assets', 'images'),
    path.join(__dirname, '..', '..', 'frontend', 'assets', 'images')
  ];
  let imagesDir = candidateDirs.find(d => fs.existsSync(d));

  if (!imagesDir) {
    console.error('❌ Could not find local images directory in public/assets/images or frontend/assets/images.');
    process.exit(1);
  }
  console.log(`📁 Source images directory found: ${imagesDir}`);

  // Clear existing media to ensure clean seed
  console.log('🧹 Purging existing Media records in MongoDB Atlas...');
  await Media.deleteMany({});

  const seededMedia = [];
  let executivePortraitUrl = '';

  for (const item of curatedSeedItems) {
    const filePath = path.join(imagesDir, item.filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found locally: ${item.filename}, skipping.`);
      continue;
    }

    console.log(`☁️ Uploading to Cloudinary CDN: [${item.filename}]...`);
    try {
      const uploadRes = await cloudinary.uploader.upload(filePath, {
        folder: 'shubham_keshri_portfolio',
        public_id: item.filename.replace(/\.[^/.]+$/, ''),
        overwrite: true,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      });

      console.log(`   ✅ CDN URL: ${uploadRes.secure_url}`);

      if (item.filename === 'executive_portrait.jpg') {
        executivePortraitUrl = uploadRes.secure_url;
      }

      const mediaDoc = await Media.create({
        title: item.title,
        category: item.category,
        caption: item.caption,
        cloudinaryUrl: uploadRes.secure_url,
        cloudinaryPublicId: uploadRes.public_id,
        localUrl: `/assets/images/${item.filename}`,
        order: item.order
      });

      seededMedia.push({
        id: mediaDoc._id,
        title: item.title,
        category: item.category,
        url: uploadRes.secure_url
      });
    } catch (uploadErr) {
      console.error(`   ❌ Failed to upload ${item.filename}:`, uploadErr.message);
    }
  }

  console.log(`\n🎉 Seeded ${seededMedia.length} media records to Cloudinary & MongoDB Atlas!`);

  // Seed Profile Data
  console.log('\n👤 Seeding Dr. Shubham Keshri Executive Profile in MongoDB Atlas...');
  await Profile.deleteMany({});

  const profilePayload = {
    name: "Dr. Shubham Keshri",
    title: "Director, CALI AI & Sensonix Systems | Qualified Independent Director (IICA, MCA)",
    executiveRole: "Director, CALI AI Private Limited",
    tagline: "Architecting computational infrastructure for planetary land intelligence while orchestrating grassroots socio-economic transformation across India.",
    avatarUrl: executivePortraitUrl || 'https://res.cloudinary.com/jzmuwtrf/image/upload/v1728389000/shubham_keshri_portfolio/executive_portrait.jpg',
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

  const createdProfile = await Profile.create(profilePayload);
  console.log(`✅ Profile record created with ID: ${createdProfile._id}`);

  // Sync back to profile.json as offline backup
  try {
    const dataDir = path.join(__dirname, '..', '..', 'data');
    if (fs.existsSync(dataDir)) {
      fs.writeFileSync(path.join(dataDir, 'profile.json'), JSON.stringify(createdProfile, null, 2), 'utf8');
      console.log('✅ Local backup data/profile.json synchronized.');
    }
  } catch (e) {
    // Non-fatal
  }

  console.log('\n============================================================');
  console.log('✨ ALL DATA SUCCESSFULLY SEEDED TO MONGODB ATLAS & CLOUDINARY CDN!');
  console.log('============================================================\n');

  await mongoose.disconnect();
  process.exit(0);
};

seedDatabaseAndCloudinary();

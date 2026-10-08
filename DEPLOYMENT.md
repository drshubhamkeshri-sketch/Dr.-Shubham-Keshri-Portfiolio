# Architecture & Deployment Guide: Render (Backend) + Vercel (Frontend)

This repository contains the executive portfolio platform for **Dr. Shubham Keshri**, fully separated into a standalone **Render-ready Node.js Backend** and a **Vercel-ready Frontend**, integrated with live **MongoDB Atlas** and **Cloudinary CDN**.

---

## 🏗️ Architecture Overview

```mermaid
graph TD
  UserBrowser[Executive Client Browser]
  
  subgraph Vercel Frontend
    VercelEdge[Vercel Edge Network]
    StaticAssets[HTML / CSS / JS / Three.js]
    ProxyRewrite[vercel.json Proxy: /api/*]
  end

  subgraph Render Backend
    RenderService[Render Node.js / Express Web Service]
    APIControllers[Profile / Media / Inquiries / Admin]
  end

  subgraph Cloud Providers
    AtlasDB[(MongoDB Atlas Database)]
    CloudinaryCDN[Cloudinary Image CDN]
  end

  UserBrowser --> VercelEdge
  VercelEdge --> StaticAssets
  UserBrowser --> ProxyRewrite
  ProxyRewrite --> RenderService
  RenderService --> APIControllers
  APIControllers --> AtlasDB
  APIControllers --> CloudinaryCDN
  UserBrowser -. Image Streaming .-> CloudinaryCDN
```

---

## 📁 Repository Structure

```text
├── backend/                  <-- Deploy this folder to RENDER
│   ├── config/
│   │   ├── db.js             <-- MongoDB Atlas connection with resilience
│   │   └── cloudinary.js     <-- Cloudinary CDN SDK & buffer streamer
│   ├── models/
│   │   ├── Profile.js        <-- Executive profile schema
│   │   ├── Media.js          <-- Media records with Cloudinary URLs & tags
│   │   └── Contact.js        <-- Executive inquiries with validation
│   ├── routes/
│   │   ├── health.js         <-- /api/health monitoring endpoint
│   │   ├── profile.js        <-- /api/profile (GET & PUT)
│   │   ├── media.js          <-- /api/media & /api/upload/cloudinary
│   │   ├── contact.js        <-- /api/contact & /api/contacts (CSV export)
│   │   └── admin.js          <-- /api/admin/login authentication
│   ├── scripts/
│   │   └── seed.js           <-- Seeds images to Cloudinary & data to Atlas
│   ├── render.yaml           <-- Render Blueprint configuration
│   ├── server.js             <-- Express server entry point
│   ├── package.json          <-- Backend dependencies
│   ├── .env                  <-- Live environment configuration
│   └── .env.example          <-- Environment template
│
├── frontend/                 <-- Deploy this folder to VERCEL
│   ├── assets/               <-- Curated image backups & icons
│   ├── css/
│   │   ├── style.css         <-- Luxury obsidian executive styles
│   │   └── admin.css         <-- Command desk styles
│   ├── js/
│   │   ├── config.js         <-- Dynamic API backend URL resolver
│   │   ├── main.js           <-- Dynamic hydration from Atlas & Cloudinary
│   │   ├── admin.js          <-- Admin management & live update dashboard
│   │   ├── globe3d.js        <-- Three.js interactive geospatial globe
│   │   ├── OrbitControls.js  <-- Three.js orbit controls
│   │   └── three.min.js      <-- Three.js library
│   ├── index.html            <-- Main landing experience
│   ├── admin.html            <-- Executive Command Desk
│   ├── vercel.json           <-- Vercel routing & /api rewrite proxy
│   ├── package.json          <-- Frontend scripts
│   └── README.md             <-- Vercel deployment guide
│
├── data/
│   └── profile.json          <-- Local fallback cache
├── DEPLOYMENT.md             <-- This comprehensive deployment guide
└── server.js                 <-- Root server delegator for local run
```

---

## 🗄️ Database & Cloudinary Status (Pre-Seeded)

- **MongoDB Atlas Cluster**: `cluster0.pwrupsh.mongodb.net`
- **Database Name**: `shubham_keshri_portfolio`
- **Seeded Media**: 16 high-resolution assets uploaded to Cloudinary folder `shubham_keshri_portfolio`.
- **Seeded Profile**: Dr. Shubham Keshri credentials, board directorships, research publications, electoral campaigns, and live Cloudinary portrait avatar.
- **Inquiry Registration**: Real-time writing to Atlas collection `contacts`.

---

## 🚀 Step 1: Deploy Backend on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** -> **Web Service**.
3. Select your repository: `Dr.-Shubham-Keshri-Portfiolio`.
4. Fill in the parameters:
   - **Name**: `dr-shubham-keshri-portfolio-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://drshubhamkeshri_db_user:zLG1ROOXASUgglXT@cluster0.pwrupsh.mongodb.net/shubham_keshri_portfolio?retryWrites=true&w=majority&appName=Cluster0`
   - `CLOUDINARY_CLOUD_NAME`: `jzmuwtrf`
   - `CLOUDINARY_API_KEY`: `789451557362313`
   - `CLOUDINARY_API_SECRET`: `Jn5ZxBfJp6pkOe7nzxCNtEOSaTk`
   - `CLOUDINARY_URL`: `cloudinary://789451557362313:Jn5ZxBfJp6pkOe7nzxCNtEOSaTk@jzmuwtrf`
   - `CORS_ORIGIN`: `*`
   - `ADMIN_PASSKEY`: `keshri2026`
6. Click **Deploy Web Service**.
7. Copy your assigned Render URL (e.g. `https://dr-shubham-keshri-portfolio-backend.onrender.com`).

---

## 🌐 Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
2. Select your repository: `Dr.-Shubham-Keshri-Portfiolio`.
3. In the configuration modal:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: `Other`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
4. Open [`frontend/vercel.json`](file:///c:/Users/impra/Desktop/Portfolio/frontend/vercel.json):
   Update the destination to your Render URL:
   ```json
   {
     "source": "/api/:match*",
     "destination": "https://<your-render-service-name>.onrender.com/api/:match*"
   }
   ```
5. Click **Deploy**.

---

## 🔑 Executive Passkey & Management

- **Executive Desk URL**: `https://<your-domain>/admin` or `http://localhost:5000/admin`
- **Passkey**: `keshri2026`
- **Capabilities**:
  - Live inquiry management (review, delete, export CSV)
  - Direct image upload into Cloudinary CDN
  - Real-time profile synchronizer updating MongoDB Atlas

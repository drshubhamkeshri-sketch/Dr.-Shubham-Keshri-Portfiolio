# Dr. Shubham Keshri — Executive Portfolio & Platform Guide

A web-based executive portfolio for **Dr. Shubham Keshri**, built with a **Node.js/Express backend**, **MongoDB storage**, **Cloudinary image integration**, and an **Awwwards-level deep-tech frontend**.

---

## 🏛️ Executive Profile Summary

- **Executive Directorship**: Director at **CALI AI Private Limited** (DPIIT Recognised Deep Tech Platform building the operating system for planetary land intelligence).
- **Corporate Boards**: Director at **Sensonix Systems Pvt. Ltd.** & **Rion Links Pvt. Ltd.**
- **Statutory Credential**: **Qualified Independent Director** — Indian Institute of Corporate Affairs (IICA), Ministry of Corporate Affairs, Government of India (May 2020).
- **Academic Rigor**:
  - Ph.D. Scholar in Sustainable Development Goals (SDGs) — Amity University (2022–2025).
  - Master of Arts in Sanskrit — Hansraj College, University of Delhi (2017–2019).
  - Bachelor of Arts in Sanskrit — Hansraj College, University of Delhi (2014–2017).
- **Electoral Strategy**: Multi-state campaign strategist & demographic analyst (Tripura, Odisha, Haryana, Delhi, Mumbai).
- **Published Research**:
  - *“सम्प्रत्ययन-मीमांसा”* (Naagfani Journal, 2022 – भाग 4)
  - *“Sustainable Development and Cultural Integration in India”* (Naagfani Journal – भाग 431)

---

## 🚀 Quick Start

### 1. Start the Server
```bash
npm start
```
Or for auto-reloading during development:
```bash
npm run dev
```

Visit the portfolio in your browser:
👉 **`http://localhost:5000`**

---

## 🗄️ Database: MongoDB Configuration

The application uses **Mongoose** with automatic resilience:
- If MongoDB is running locally or an Atlas connection string is provided, it connects directly.
- If MongoDB is temporarily offline, the server runs smoothly in resilient fallback mode and saves inquiries in memory.

### Connecting MongoDB Atlas (Cloud):
1. Open [`.env`](file:///c:/Users/impra/Desktop/Portfolio/.env)
2. Replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shubham_portfolio?retryWrites=true&w=majority
```
3. Restart the server.

---

## ☁️ Media Storage: Cloudinary Configuration

All 12+ curated real photographs extracted from the document and PDF are served locally in [`public/assets/images/`](file:///c:/Users/impra/Desktop/Portfolio/public/assets/images/). 

To enable live uploads and sync to **Cloudinary CDN**:
1. Get free API keys from [Cloudinary Console](https://cloudinary.com/console)
2. Add them to [`.env`](file:///c:/Users/impra/Desktop/Portfolio/.env):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
3. You can upload new images directly from the web interface at the bottom of the page or via `POST /api/upload/cloudinary`!

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Status check for MongoDB and Cloudinary |
| `GET` | `/api/profile` | Full structured profile data |
| `GET` | `/api/media` | Curated gallery media & metadata |
| `POST` | `/api/contact` | Submits executive inquiry to MongoDB |
| `GET` | `/api/contacts` | Admin list of all submitted messages |
| `POST` | `/api/upload/cloudinary`| Uploads an image file directly to Cloudinary |

---

## 🎨 Visual Aesthetics & Ponytail Compliance

- **Art Direction**: Obsidian dark mode with electric lime (`#d5ed57`) and rust terracotta (`#d96b3a`) accents.
- **Micro-Interactions**: Physics-based easing (`cubic-bezier(0.16, 1, 0.3, 1)`), interactive region tabs, and full-screen image lightbox.
- **Zero Bloat**: 100% powered by native modern CSS (CSS Grid, flexbox, CSS variables, backdrop blur) and Vanilla JS, following the workspace guidelines in [`DESIGN.md`](file:///c:/Users/impra/Desktop/Portfolio/DESIGN.md) and [`AGENTS.md`](file:///c:/Users/impra/Desktop/Portfolio/AGENTS.md).

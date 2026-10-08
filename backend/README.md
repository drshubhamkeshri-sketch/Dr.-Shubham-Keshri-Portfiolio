# Backend API Service — Dr. Shubham Keshri Portfolio

Production Express REST API server with **MongoDB Atlas** database persistence, **Cloudinary CDN** asset delivery, and **Render** cloud deployment.

---

## 🚀 One-Click / Manual Deployment to Render

### Option A: Via Render Blueprint (render.yaml)
1. In your [Render Dashboard](https://dashboard.render.com), click **New +** -> **Blueprint**.
2. Connect your GitHub repository: `Dr.-Shubham-Keshri-Portfiolio`.
3. Render will auto-detect [`backend/render.yaml`](file:///c:/Users/impra/Desktop/Portfolio/backend/render.yaml) and configure the web service.

### Option B: Manual Web Service Setup
1. In the [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following service settings:
   - **Name**: `dr-shubham-keshri-portfolio-backend`
   - **Region**: Oregon (US West) or Singapore / Frankfurt
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

4. Add the following **Environment Variables** in Render's "Environment" tab:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `10000` | Render assigns port automatically |
| `MONGODB_URI` | `mongodb+srv://drshubhamkeshri_db_user:zLG1ROOXASUgglXT@cluster0.pwrupsh.mongodb.net/shubham_keshri_portfolio?retryWrites=true&w=majority&appName=Cluster0` | Cloud MongoDB cluster |
| `CLOUDINARY_CLOUD_NAME` | `jzmuwtrf` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | `789451557362313` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `Jn5ZxBfJp6pkOe7nzxCNtEOSaTk` | Cloudinary API Secret |
| `CLOUDINARY_URL` | `cloudinary://789451557362313:Jn5ZxBfJp6pkOe7nzxCNtEOSaTk@jzmuwtrf` | Full Cloudinary URL |
| `CORS_ORIGIN` | `*` | Or specify your Vercel URL e.g. `https://your-portfolio.vercel.app` |
| `ADMIN_PASSKEY` | `keshri2026` | Security key for Executive Command Desk |

5. Click **Create Web Service**. Your live backend URL will be:
   `https://dr-shubham-keshri-portfolio-backend.onrender.com`

---

## 🛠️ Local Development & Seeding

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database & Cloudinary Seeder
```bash
npm run seed
```
This automatically uploads all local image assets to Cloudinary (`folder: shubham_keshri_portfolio`) and populates MongoDB Atlas collections.

### 3. Start Local Server
```bash
npm run dev
```
Listens on `http://localhost:5000`.

---

## 📡 API Endpoints

- `GET  /api/health` — Status of MongoDB Atlas & Cloudinary CDN
- `GET  /api/profile` — Read dynamic executive profile from MongoDB
- `PUT  /api/profile` — Update executive profile
- `GET  /api/media` — Retrieve all curated photographic assets
- `POST /api/upload/cloudinary` — Upload asset to Cloudinary & register in MongoDB
- `DELETE /api/media/:id` — Delete asset
- `POST /api/contact` — Register consultation inquiry into MongoDB Atlas
- `GET  /api/contacts` — Fetch registered inquiries (Admin)
- `GET  /api/contacts/export` — Export inquiries to CSV
- `POST /api/admin/login` — Authenticate Executive Desk with passkey

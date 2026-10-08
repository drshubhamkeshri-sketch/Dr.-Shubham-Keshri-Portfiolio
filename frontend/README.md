# Frontend Web Application — Dr. Shubham Keshri Portfolio

Executive Web Application for **Dr. Shubham Keshri** — Director at CALI AI Private Limited and Qualified Independent Director (IICA, MCA). Engineered with Vanilla HTML5, CSS3, Three.js 3D Globe, dynamic API hydration from MongoDB Atlas, and Cloudinary CDN image delivery.

---

## ⚡ Deployment to Vercel

### Step 1: Push Repository to GitHub
Ensure your latest changes are committed and pushed to GitHub.

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
2. Select your repository: `Dr.-Shubham-Keshri-Portfiolio`.
3. In the configuration screen:
   - **Root Directory**: Click "Edit" and choose `frontend`.
   - **Framework Preset**: `Other` (Static HTML).
   - **Build Command**: Leave blank or `echo "build ok"`
   - **Output Directory**: Leave blank (current directory).

### Step 3: Configure Backend Connection (Zero-CORS via Proxy Rewrite)
The file [`frontend/vercel.json`](file:///c:/Users/impra/Desktop/Portfolio/frontend/vercel.json) comes pre-configured with a rewrite rule:
```json
{
  "source": "/api/:match*",
  "destination": "https://<your-render-backend-url>/api/:match*"
}
```
Replace the destination domain with your actual Render service URL (e.g., `https://dr-shubham-keshri-portfolio-backend.onrender.com`).

All frontend calls to `/api/...` will automatically be proxied through Vercel directly to your Render backend with zero CORS issues!

### Step 4: Click Deploy!
Your website will be live at `https://<your-project-name>.vercel.app`!

---

## 💻 Local Preview
To run the frontend locally:
```bash
npx serve . -p 3000
```
Open `http://localhost:3000` in your browser.
`js/config.js` automatically detects localhost and connects to `http://localhost:5000`!

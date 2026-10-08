/**
 * Dr. Shubham Keshri Executive Portfolio - Frontend Configuration
 * Dynamically resolves the API Base URL for local development and production (Vercel -> Render)
 */
(function () {
  // Default Render Backend Service URL (Update this if your Render service has a specific name)
  const DEFAULT_RENDER_BACKEND = 'https://dr-shubham-keshri-portfolio-backend.onrender.com';

  function resolveApiBaseUrl() {
    // 1. Check for manual override in localStorage
    const saved = localStorage.getItem('API_BASE_URL');
    if (saved) return saved.trim().replace(/\/+$/, '');

    // 2. Check injected runtime config
    if (window.__ENV__ && window.__ENV__.API_BASE_URL) {
      return window.__ENV__.API_BASE_URL.trim().replace(/\/+$/, '');
    }

    const { hostname, port } = window.location;

    // 3. Localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // If frontend is served by Express server directly on port 5000
      if (port === '5000') {
        return '';
      }
      // If frontend is run separately (e.g. port 3000, 5500, or file://)
      return 'http://localhost:5000';
    }

    // 4. Production on Vercel:
    // If vercel.json rewrite is used, relative path '' proxies to Render cleanly.
    // If accessing cross-origin, use DEFAULT_RENDER_BACKEND.
    // We check if vercel proxy rewrite is configured; otherwise fallback to Render URL.
    return DEFAULT_RENDER_BACKEND;
  }

  window.APP_CONFIG = {
    API_BASE_URL: resolveApiBaseUrl(),
    DEFAULT_RENDER_BACKEND,
    getApiUrl: function (path) {
      const cleanPath = path.startsWith('/') ? path : '/' + path;
      const base = window.APP_CONFIG.API_BASE_URL;
      return base ? `${base}${cleanPath}` : cleanPath;
    },
    setApiBaseUrl: function (url) {
      if (url && url.trim()) {
        localStorage.setItem('API_BASE_URL', url.trim().replace(/\/+$/, ''));
      } else {
        localStorage.removeItem('API_BASE_URL');
      }
      window.APP_CONFIG.API_BASE_URL = resolveApiBaseUrl();
      console.log('API Base URL updated to:', window.APP_CONFIG.API_BASE_URL);
    }
  };
})();

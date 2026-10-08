/**
 * Dr. Shubham Keshri Executive Portfolio - Frontend Configuration
 * Dynamically resolves the API Base URL for local development and production (Vercel -> Render)
 */
(function () {
  const DEFAULT_RENDER_BACKEND = 'https://dr-shubham-keshri-portfolio-backend.onrender.com';

  function resolveApiBaseUrl() {
    const saved = localStorage.getItem('API_BASE_URL');
    if (saved) return saved.trim().replace(/\/+$/, '');

    if (window.__ENV__ && window.__ENV__.API_BASE_URL) {
      return window.__ENV__.API_BASE_URL.trim().replace(/\/+$/, '');
    }

    const { hostname, port } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      if (port === '5000') {
        return '';
      }
      return 'http://localhost:5000';
    }

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

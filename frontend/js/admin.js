/**
 * DR. SHUBHAM KESHRI — EXECUTIVE TELEMETRY & OPERATIONS CONTROLLER
 * Full Dynamic Multi-Dashboard Administration Suite:
 * - Passkey Security
 * - Executive Identity & Cloudinary Avatar Studio
 * - Corporate Directorships & Experience CRUD
 * - Academic Credentials & Statutory Qualifications CRUD
 * - Scholarly Treatises & Research Publications CRUD
 * - Multi-State Electoral Strategy Radar CRUD
 * - Cloudinary CDN Media Studio (Upload, Replace Asset, Set-Avatar, Edit, Delete)
 * - Communications & Leads Registry
 * - Infrastructure Diagnostics
 */

// Helper to resolve API URLs via window.APP_CONFIG
function apiUrl(path) {
  if (window.APP_CONFIG && typeof window.APP_CONFIG.getApiUrl === 'function') {
    return window.APP_CONFIG.getApiUrl(path);
  }
  return path;
}

let activeProfile = null;
let allContacts = [];
let allMedia = [];
let activeMediaFilter = 'all';
let mediaSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initAuthGateway();
  initApiConfigControls();
});

// 0. API Backend URL Management
function initApiConfigControls() {
  const currentBase = window.APP_CONFIG ? window.APP_CONFIG.API_BASE_URL : '';
  const apiStatusEl = document.getElementById('active-api-url-display');
  if (apiStatusEl) {
    apiStatusEl.textContent = currentBase || 'Same Origin / Proxied';
  }
}

// 1. Passkey Authentication
function initAuthGateway() {
  const token = localStorage.getItem('sk_admin_token');
  const authWall = document.getElementById('auth-wall');
  const adminApp = document.getElementById('admin-app');
  const authForm = document.getElementById('auth-form');
  const authError = document.getElementById('auth-error');
  const logoutBtn = document.getElementById('logout-btn');

  if (token) {
    authWall.style.display = 'none';
    adminApp.style.display = 'grid';
    bootAdminDashboard();
  }

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passkey = document.getElementById('passkey-input').value.trim();
    authError.style.display = 'none';

    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('sk_admin_token', data.token);
        authWall.style.display = 'none';
        adminApp.style.display = 'grid';
        bootAdminDashboard();
      } else {
        authError.textContent = data.error || 'Authentication failed. Access restricted.';
        authError.style.display = 'block';
      }
    } catch (err) {
      authError.textContent = `Server connection error to ${apiUrl('/api/admin/login')}. Verify network.`;
      authError.style.display = 'block';
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('sk_admin_token');
      window.location.reload();
    });
  }
}

// 2. Boot & Initialize Data
function bootAdminDashboard() {
  setupNavigation();
  loadHealthStatus();
  loadInquiries();
  loadMediaAssets();
  loadProfileData();

  const refreshBtn = document.getElementById('refresh-data-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadHealthStatus();
      loadInquiries();
      loadMediaAssets();
      loadProfileData();
    });
  }

  // Sync CSV export link
  const exportBtn = document.querySelector('a[href*="/api/contacts/export"]');
  if (exportBtn) {
    exportBtn.href = apiUrl('/api/contacts/export');
  }

  setupUploadForm();
  setupProfileForm();
  setupAvatarStudio();
  setupHeroStatsForm();
  setupExperienceHandlers();
  setupEducationHandlers();
  setupResearchHandlers();
  setupElectoralHandlers();
  setupMediaStudioHandlers();
  setupMessageModal();
  setupInquiryFilterAndSearch();
}

// 3. Tab Navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.dataset.tab;
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  document.querySelectorAll('.admin-tab-pane').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });

  const pageTitle = document.getElementById('page-title');
  const titleMap = {
    'tab-overview': 'Executive Operations Overview',
    'tab-identity': 'Executive Identity & Avatar Studio',
    'tab-experience': 'Corporate Directorships & Experience',
    'tab-education': 'Academic Credentials & Statutory Qualifications',
    'tab-research': 'Scholarly Treatises & Research Publications',
    'tab-electoral': 'Multi-State Electoral Strategy Radar',
    'tab-media': 'Cloudinary CDN Photographic Studio',
    'tab-inquiries': 'Executive Communications & Leads Desk',
    'tab-system': 'Infrastructure Diagnostics & Health'
  };
  if (pageTitle && titleMap[tabId]) {
    pageTitle.textContent = titleMap[tabId];
  }
}
window.switchTab = switchTab;

// 4. System Health & Telemetry
async function loadHealthStatus() {
  try {
    const res = await fetch(apiUrl('/api/health'));
    const data = await res.json();

    const dbPill = document.getElementById('db-status-pill');
    const cloudPill = document.getElementById('cloud-status-pill');
    const sysDbStatus = document.getElementById('sys-db-status');
    const sysDbProvider = document.getElementById('sys-db-provider');
    const sysCloudStatus = document.getElementById('sys-cloud-status');
    const sysRuntime = document.getElementById('sys-runtime');
    const sysUptime = document.getElementById('sys-uptime');

    if (data.database && data.database.connected) {
      if (dbPill) dbPill.innerHTML = '<span class="status-dot"></span> MongoDB Atlas Active';
      if (sysDbStatus) sysDbStatus.innerHTML = '<span style="color: var(--emerald-primary);">Connected (MongoDB Atlas Cloud)</span>';
      if (sysDbProvider) sysDbProvider.textContent = 'MongoDB Atlas Cloud Cluster';
    } else {
      if (dbPill) dbPill.innerHTML = '<span class="status-dot standby"></span> Memory Cache Standby';
      if (sysDbStatus) sysDbStatus.innerHTML = '<span style="color: var(--gold-light);">Standby / Local Cache</span>';
    }

    if (data.imageStorage && data.imageStorage.configured) {
      if (cloudPill) cloudPill.innerHTML = '<span class="status-dot"></span> Cloudinary CDN';
      if (sysCloudStatus) sysCloudStatus.innerHTML = `<span style="color: var(--emerald-primary);">Connected (${data.imageStorage.cloudName})</span>`;
    } else {
      if (cloudPill) cloudPill.innerHTML = '<span class="status-dot standby"></span> Local Pipeline';
      if (sysCloudStatus) sysCloudStatus.innerHTML = '<span style="color: var(--text-admin-muted);">Local Mode</span>';
    }

    if (data.environment) {
      if (sysRuntime) sysRuntime.textContent = `Node.js ${data.environment.nodeVersion} (${data.environment.nodeEnv})`;
      if (sysUptime) sysUptime.textContent = `${data.environment.uptimeSeconds} seconds`;
    }
  } catch (err) {
    console.error('Health status error:', err);
  }
}

// 5. Inquiries (MongoDB Atlas Storage)
async function loadInquiries() {
  const overviewBody = document.getElementById('overview-inquiries-body');
  const fullBody = document.getElementById('inquiries-full-body');
  const kpiInquiries = document.getElementById('kpi-inquiries');
  const kpiUnread = document.getElementById('kpi-unread');
  const badge = document.getElementById('sidebar-inquiry-badge');

  try {
    const res = await fetch(apiUrl('/api/contacts'));
    const result = await res.json();
    allContacts = result.data || [];

    const unreadCount = allContacts.filter(c => (c.status || 'unread') === 'unread').length;
    if (kpiInquiries) kpiInquiries.textContent = allContacts.length;
    if (kpiUnread) kpiUnread.textContent = unreadCount;
    if (badge) badge.textContent = unreadCount;

    // Render Overview Table (Recent 5)
    if (overviewBody) {
      if (allContacts.length === 0) {
        overviewBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-admin-muted);">No inquiries registered yet.</td></tr>';
      } else {
        overviewBody.innerHTML = allContacts.slice(0, 5).map(c => `
          <tr>
            <td class="mono" style="font-size: 11px;">${new Date(c.createdAt).toLocaleDateString()}</td>
            <td><strong style="color: var(--text-admin-primary);">${escapeHtml(c.name)}</strong></td>
            <td>${escapeHtml(c.organization || '—')}</td>
            <td><span style="font-size: 11px; color: var(--gold-light);">${escapeHtml(c.interest || 'General')}</span></td>
            <td><span class="status-badge ${c.status || 'unread'}">${c.status || 'unread'}</span></td>
            <td>
              <button class="btn-subtle" onclick="openContactModal('${c._id}')">View</button>
            </td>
          </tr>
        `).join('');
      }
    }

    renderFullInquiriesTable();
  } catch (err) {
    console.error('Failed to load inquiries:', err);
  }
}

function renderFullInquiriesTable() {
  const fullBody = document.getElementById('inquiries-full-body');
  if (!fullBody) return;

  const searchVal = (document.getElementById('inquiry-search-input')?.value || '').toLowerCase().trim();
  const filterVal = document.getElementById('inquiry-filter-status')?.value || 'all';

  const filtered = allContacts.filter(c => {
    const matchStatus = (filterVal === 'all') || ((c.status || 'unread') === filterVal);
    const matchSearch = !searchVal || 
      (c.name && c.name.toLowerCase().includes(searchVal)) ||
      (c.email && c.email.toLowerCase().includes(searchVal)) ||
      (c.organization && c.organization.toLowerCase().includes(searchVal)) ||
      (c.message && c.message.toLowerCase().includes(searchVal));
    return matchStatus && matchSearch;
  });

  if (filtered.length === 0) {
    fullBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-admin-muted); padding: 24px;">No inquiries found matching criteria.</td></tr>';
    return;
  }

  fullBody.innerHTML = filtered.map(c => `
    <tr>
      <td class="mono" style="font-size: 11px;">${new Date(c.createdAt).toLocaleDateString()}</td>
      <td><strong>${escapeHtml(c.name)}</strong></td>
      <td class="mono" style="font-size: 11px;">${escapeHtml(c.email)}<br><small style="color: var(--text-admin-muted);">${escapeHtml(c.phone || '')}</small></td>
      <td>${escapeHtml(c.organization || '—')}</td>
      <td><span style="font-size: 11px; color: var(--gold-light);">${escapeHtml(c.interest || 'General')}</span></td>
      <td>
        <select class="status-select" onchange="updateContactStatus('${c._id}', this.value)">
          <option value="unread" ${c.status === 'unread' ? 'selected' : ''}>Unread</option>
          <option value="reviewed" ${c.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
          <option value="archived" ${c.status === 'archived' ? 'selected' : ''}>Archived</option>
        </select>
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 6px;">
          <button class="btn-subtle" onclick="openContactModal('${c._id}')">Inspect</button>
          <button class="btn-danger" onclick="deleteContact('${c._id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function setupInquiryFilterAndSearch() {
  const searchInput = document.getElementById('inquiry-search-input');
  const statusSelect = document.getElementById('inquiry-filter-status');
  if (searchInput) searchInput.addEventListener('input', renderFullInquiriesTable);
  if (statusSelect) statusSelect.addEventListener('change', renderFullInquiriesTable);
}

// Contact Modal & Actions
function setupMessageModal() {
  const modal = document.getElementById('message-modal');
  const closeBtn = document.getElementById('modal-msg-close');
  if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  }
}

function openContactModal(id) {
  const c = allContacts.find(item => item._id === id);
  if (!c) return;

  const modal = document.getElementById('message-modal');
  const body = document.getElementById('modal-msg-body');
  const footer = document.getElementById('modal-msg-footer');

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <div><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">FROM:</span><br><strong>${escapeHtml(c.name)}</strong></div>
      <div><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">DATE:</span><br>${new Date(c.createdAt).toLocaleString()}</div>
      <div><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">EMAIL:</span><br><a href="mailto:${escapeHtml(c.email)}" style="color: var(--cyan-primary);">${escapeHtml(c.email)}</a></div>
      <div><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">PHONE:</span><br>${escapeHtml(c.phone || 'Not provided')}</div>
      <div style="grid-column: span 2;"><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">ORGANIZATION / SECTOR:</span><br>${escapeHtml(c.organization || 'Not provided')}</div>
      <div style="grid-column: span 2;"><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">STRATEGIC DOMAIN OF INTEREST:</span><br><strong style="color: var(--gold-light);">${escapeHtml(c.interest || 'General')}</strong></div>
    </div>
    <div>
      <span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">CONFIDENTIAL MESSAGE TRANSMISSION:</span>
      <div style="margin-top: 8px; padding: 14px; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--bg-admin-border); font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(c.message)}</div>
    </div>
  `;

  footer.innerHTML = `
    <button class="btn-subtle" onclick="updateContactStatus('${c._id}', 'reviewed'); document.getElementById('message-modal').style.display='none';">Mark Reviewed</button>
    <a href="mailto:${escapeHtml(c.email)}?subject=Response%20from%20Office%20of%20Dr.%20Shubham%20Keshri" class="btn-primary" style="display: inline-flex; align-items: center; justify-content: center;">Compose Reply ↗</a>
  `;

  modal.style.display = 'flex';
}
window.openContactModal = openContactModal;

async function updateContactStatus(id, status) {
  try {
    const res = await fetch(apiUrl(`/api/contacts/${id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) loadInquiries();
  } catch (err) {
    alert('Failed to update status: ' + err.message);
  }
}
window.updateContactStatus = updateContactStatus;

async function deleteContact(id) {
  if (!confirm('Permanently purge this executive inquiry record from MongoDB Atlas?')) return;
  try {
    const res = await fetch(apiUrl(`/api/contacts/${id}`), { method: 'DELETE' });
    if (res.ok) loadInquiries();
  } catch (err) {
    alert('Failed to delete inquiry: ' + err.message);
  }
}
window.deleteContact = deleteContact;

// =========================================================================
// 6. EXECUTIVE IDENTITY & DYNAMIC PROFILE SYNC
// =========================================================================

async function loadProfileData() {
  try {
    const res = await fetch(apiUrl('/api/profile'));
    const result = await res.json();
    activeProfile = result.data || {};

    // 1. Identity & Biography Form
    if (document.getElementById('prof-name')) document.getElementById('prof-name').value = activeProfile.name || '';
    if (document.getElementById('prof-title')) document.getElementById('prof-title').value = activeProfile.title || '';
    if (document.getElementById('prof-role')) document.getElementById('prof-role').value = activeProfile.executiveRole || '';
    if (document.getElementById('prof-tagline')) document.getElementById('prof-tagline').value = activeProfile.tagline || '';
    if (document.getElementById('prof-email')) document.getElementById('prof-email').value = activeProfile.contacts?.email || '';
    if (document.getElementById('prof-website')) document.getElementById('prof-website').value = activeProfile.contacts?.companyWebsite || '';
    if (document.getElementById('prof-base')) document.getElementById('prof-base').value = activeProfile.contacts?.base || '';
    if (document.getElementById('prof-current-address')) document.getElementById('prof-current-address').value = activeProfile.contacts?.addresses?.current || '';

    // 2. Avatar Preview & URL
    const avatarImg = document.getElementById('avatar-preview-img');
    const avatarUrlInput = document.getElementById('avatar-url-input');
    if (activeProfile.avatarUrl) {
      if (avatarImg) avatarImg.src = activeProfile.avatarUrl;
      if (avatarUrlInput) avatarUrlInput.value = activeProfile.avatarUrl;
    }

    // 3. Hero Stats
    if (activeProfile.heroStats) {
      if (document.getElementById('stat-directorships')) document.getElementById('stat-directorships').value = activeProfile.heroStats.directorships ?? 3;
      if (document.getElementById('stat-campaigns')) document.getElementById('stat-campaigns').value = activeProfile.heroStats.campaigns ?? 5;
      if (document.getElementById('stat-booths')) document.getElementById('stat-booths').value = activeProfile.heroStats.booths ?? 100;
    }

    // 4. Subroles Marquee Text
    if (document.getElementById('prof-subroles-input')) {
      document.getElementById('prof-subroles-input').value = (activeProfile.subroles || []).join(', ');
    }

    // 5. Update KPI Roles Count
    const kpiRoles = document.getElementById('kpi-roles');
    if (kpiRoles) {
      kpiRoles.textContent = (activeProfile.companies && activeProfile.companies.length) || 3;
    }

    // Render Subdocument Sections
    renderExperienceList();
    renderEducationList();
    renderResearchList();
    renderElectoralList();

  } catch (err) {
    console.error('Failed to load profile data:', err);
  }
}

function setupProfileForm() {
  const saveBtn = document.getElementById('save-profile-btn');
  const feedback = document.getElementById('profile-feedback');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', async () => {
    saveBtn.textContent = 'Synchronizing in MongoDB Atlas...';
    saveBtn.disabled = true;

    const payload = {
      name: document.getElementById('prof-name').value.trim(),
      title: document.getElementById('prof-title').value.trim(),
      executiveRole: document.getElementById('prof-role').value.trim(),
      tagline: document.getElementById('prof-tagline').value.trim(),
      contacts: {
        email: document.getElementById('prof-email').value.trim(),
        companyWebsite: document.getElementById('prof-website').value.trim(),
        base: document.getElementById('prof-base').value.trim(),
        addresses: {
          current: document.getElementById('prof-current-address').value.trim()
        }
      }
    };

    try {
      const res = await fetch(apiUrl('/api/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        feedback.innerHTML = `
          <div style="padding: 12px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--emerald-primary); color: var(--emerald-primary); font-size: 13px;">
            ✓ Changes permanently persisted to MongoDB Atlas. Public portfolio reflects updates immediately.
          </div>
        `;
        setTimeout(() => feedback.innerHTML = '', 4500);
      } else {
        feedback.innerHTML = `<div style="color: var(--danger-primary); font-size: 13px;">Update failed: ${data.error}</div>`;
      }
    } catch (err) {
      feedback.innerHTML = `<div style="color: var(--danger-primary); font-size: 13px;">Network error: ${err.message}</div>`;
    } finally {
      saveBtn.textContent = 'Synchronize Public Portfolio →';
      saveBtn.disabled = false;
    }
  });
}

function setupAvatarStudio() {
  const form = document.getElementById('avatar-upload-form');
  const fileInput = document.getElementById('avatar-file-input');
  const uploadBtn = document.getElementById('avatar-upload-btn');
  const feedback = document.getElementById('avatar-feedback');
  const saveUrlBtn = document.getElementById('avatar-save-url-btn');
  const urlInput = document.getElementById('avatar-url-input');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please choose an image file.');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', fileInput.files[0]);

      uploadBtn.textContent = 'Uploading to Cloudinary CDN...';
      uploadBtn.disabled = true;

      try {
        const res = await fetch(apiUrl('/api/profile/avatar'), {
          method: 'POST',
          body: formData
        });
        const result = await res.json();

        if (res.ok && result.success) {
          feedback.innerHTML = `<div style="color: var(--emerald-primary); font-size: 12px;">✓ Portrait updated on Cloudinary CDN and Atlas!</div>`;
          document.getElementById('avatar-preview-img').src = result.avatarUrl;
          if (urlInput) urlInput.value = result.avatarUrl;
          form.reset();
          loadProfileData();
        } else {
          feedback.innerHTML = `<div style="color: var(--danger-primary); font-size: 12px;">Upload error: ${result.error}</div>`;
        }
      } catch (err) {
        feedback.innerHTML = `<div style="color: var(--danger-primary); font-size: 12px;">Network error: ${err.message}</div>`;
      } finally {
        uploadBtn.textContent = 'Upload New Portrait to Cloudinary →';
        uploadBtn.disabled = false;
      }
    });
  }

  if (saveUrlBtn && urlInput) {
    saveUrlBtn.addEventListener('click', async () => {
      const url = urlInput.value.trim();
      if (!url) return;

      try {
        const res = await fetch(apiUrl('/api/profile'), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarUrl: url })
        });
        if (res.ok) {
          document.getElementById('avatar-preview-img').src = url;
          feedback.innerHTML = `<div style="color: var(--emerald-primary); font-size: 12px;">✓ Avatar URL applied.</div>`;
          setTimeout(() => feedback.innerHTML = '', 3000);
        }
      } catch (err) {
        alert('Failed to set avatar URL: ' + err.message);
      }
    });
  }
}

function setupHeroStatsForm() {
  const saveStatsBtn = document.getElementById('save-hero-stats-btn');
  const feedback = document.getElementById('stats-feedback');
  if (!saveStatsBtn) return;

  saveStatsBtn.addEventListener('click', async () => {
    saveStatsBtn.textContent = 'Updating...';
    saveStatsBtn.disabled = true;

    const subrolesRaw = document.getElementById('prof-subroles-input').value;
    const subroles = subrolesRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      heroStats: {
        directorships: Number(document.getElementById('stat-directorships').value || 3),
        campaigns: Number(document.getElementById('stat-campaigns').value || 5),
        booths: Number(document.getElementById('stat-booths').value || 100)
      },
      subroles
    };

    try {
      const res = await fetch(apiUrl('/api/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        feedback.innerHTML = `<span style="color: var(--emerald-primary); font-size: 12px;">✓ Counters &amp; Marquee synced to Atlas!</span>`;
        setTimeout(() => feedback.innerHTML = '', 4000);
      } else {
        feedback.innerHTML = `<span style="color: var(--danger-primary); font-size: 12px;">Error: ${data.error}</span>`;
      }
    } catch (err) {
      feedback.innerHTML = `<span style="color: var(--danger-primary); font-size: 12px;">Network error: ${err.message}</span>`;
    } finally {
      saveStatsBtn.textContent = 'Update Counters & Marquee Ticker →';
      saveStatsBtn.disabled = false;
    }
  });
}

// =========================================================================
// 7. CORPORATE DIRECTORSHIPS & EXPERIENCE SUB-DASHBOARD
// =========================================================================

function renderExperienceList() {
  const container = document.getElementById('experience-list-container');
  if (!container) return;

  const items = activeProfile?.companies || [];
  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed var(--bg-admin-border);">
        <p style="color: var(--text-admin-secondary);">No corporate directorship records registered yet.</p>
        <button class="btn-primary" style="margin-top: 14px;" onclick="openExperienceModal()">+ Add First Directorship</button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-header">
        <div>
          <span class="mono" style="color: var(--gold-light);">${escapeHtml(item.period || '')}</span>
          <h3 style="margin-top: 4px; font-size: 18px;">${escapeHtml(item.role)} &bull; <span style="color: var(--text-admin-secondary);">${escapeHtml(item.name)}</span></h3>
          <p class="mono" style="font-size: 11px; color: var(--text-admin-muted); margin-top: 2px;">
            ${escapeHtml(item.location || 'India')} ${item.website ? `&bull; <a href="${item.website}" target="_blank" style="color: var(--cyan-primary);">${item.website}</a>` : ''}
          </p>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="status-badge ${item.isActive ? 'reviewed' : 'archived'}">${item.isActive ? 'Active' : 'Past'}</span>
          <button class="btn-subtle" onclick="editExperience('${item._id}')">Edit</button>
          <button class="btn-danger" onclick="deleteExperience('${item._id}')">Delete</button>
        </div>
      </div>
      <p style="margin-top: 12px; font-size: 13px; line-height: 1.6; color: var(--text-admin-secondary);">${escapeHtml(item.description || '')}</p>
    </div>
  `).join('');
}

function setupExperienceHandlers() {
  const form = document.getElementById('experience-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('exp-id').value;
    const payload = {
      name: document.getElementById('exp-company').value.trim(),
      role: document.getElementById('exp-role').value.trim(),
      period: document.getElementById('exp-period').value.trim(),
      location: document.getElementById('exp-location').value.trim(),
      website: document.getElementById('exp-website').value.trim(),
      isActive: document.getElementById('exp-active').value === 'true',
      description: document.getElementById('exp-description').value.trim()
    };

    const submitBtn = document.getElementById('exp-save-btn');
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    try {
      const url = id ? apiUrl(`/api/profile/companies/${id}`) : apiUrl('/api/profile/companies');
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        closeExperienceModal();
        loadProfileData();
      } else {
        alert('Save error: ' + (data.error || 'Unknown'));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      submitBtn.textContent = 'Save Directorship →';
      submitBtn.disabled = false;
    }
  });
}

function openExperienceModal(id = null) {
  const modal = document.getElementById('experience-modal');
  const form = document.getElementById('experience-form');
  const title = document.getElementById('modal-exp-title');
  form.reset();
  document.getElementById('exp-id').value = '';

  if (id) {
    const item = (activeProfile?.companies || []).find(c => c._id === id);
    if (item) {
      document.getElementById('exp-id').value = item._id;
      document.getElementById('exp-company').value = item.name || '';
      document.getElementById('exp-role').value = item.role || '';
      document.getElementById('exp-period').value = item.period || '';
      document.getElementById('exp-location').value = item.location || '';
      document.getElementById('exp-website').value = item.website || '';
      document.getElementById('exp-active').value = item.isActive ? 'true' : 'false';
      document.getElementById('exp-description').value = item.description || '';
      title.textContent = 'Edit Directorship / Corporate Role';
    }
  } else {
    title.textContent = 'Add Directorship / Corporate Role';
  }

  modal.style.display = 'flex';
}
window.openExperienceModal = openExperienceModal;
window.editExperience = openExperienceModal;

function closeExperienceModal() {
  document.getElementById('experience-modal').style.display = 'none';
}
window.closeExperienceModal = closeExperienceModal;

async function deleteExperience(id) {
  if (!confirm('Permanently remove this corporate directorship record?')) return;
  try {
    const res = await fetch(apiUrl(`/api/profile/companies/${id}`), { method: 'DELETE' });
    if (res.ok) loadProfileData();
  } catch (err) {
    alert('Failed to delete: ' + err.message);
  }
}
window.deleteExperience = deleteExperience;

// =========================================================================
// 8. ACADEMIC CREDENTIALS & STATUTORY QUALIFICATIONS SUB-DASHBOARD
// =========================================================================

function renderEducationList() {
  const container = document.getElementById('education-list-container');
  if (!container) return;

  const items = activeProfile?.education || [];
  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed var(--bg-admin-border);">
        <p style="color: var(--text-admin-secondary);">No educational or statutory qualifications registered yet.</p>
        <button class="btn-primary" style="margin-top: 14px;" onclick="openEducationModal()">+ Add First Credential</button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-header">
        <div>
          <span class="mono" style="color: var(--gold-light);">${escapeHtml(item.year || '')}</span>
          <h3 style="margin-top: 4px; font-size: 18px;">${escapeHtml(item.degree)}</h3>
          <p class="mono" style="font-size: 11px; color: var(--text-admin-muted); margin-top: 2px;">
            ${escapeHtml(item.institution || '')} ${item.field ? `&bull; ${escapeHtml(item.field)}` : ''}
          </p>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn-subtle" onclick="editEducation('${item._id}')">Edit</button>
          <button class="btn-danger" onclick="deleteEducation('${item._id}')">Delete</button>
        </div>
      </div>
      <p style="margin-top: 12px; font-size: 13px; line-height: 1.6; color: var(--text-admin-secondary);">${escapeHtml(item.description || '')}</p>
    </div>
  `).join('');
}

function setupEducationHandlers() {
  const form = document.getElementById('education-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edu-id').value;
    const payload = {
      degree: document.getElementById('edu-degree').value.trim(),
      institution: document.getElementById('edu-inst').value.trim(),
      year: document.getElementById('edu-year').value.trim(),
      field: document.getElementById('edu-field').value.trim(),
      description: document.getElementById('edu-description').value.trim()
    };

    const submitBtn = document.getElementById('edu-save-btn');
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    try {
      const url = id ? apiUrl(`/api/profile/education/${id}`) : apiUrl('/api/profile/education');
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        closeEducationModal();
        loadProfileData();
      } else {
        alert('Save error: ' + (data.error || 'Unknown'));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      submitBtn.textContent = 'Save Credential →';
      submitBtn.disabled = false;
    }
  });
}

function openEducationModal(id = null) {
  const modal = document.getElementById('education-modal');
  const form = document.getElementById('education-form');
  const title = document.getElementById('modal-edu-title');
  form.reset();
  document.getElementById('edu-id').value = '';

  if (id) {
    const item = (activeProfile?.education || []).find(e => e._id === id);
    if (item) {
      document.getElementById('edu-id').value = item._id;
      document.getElementById('edu-degree').value = item.degree || '';
      document.getElementById('edu-inst').value = item.institution || '';
      document.getElementById('edu-year').value = item.year || '';
      document.getElementById('edu-field').value = item.field || '';
      document.getElementById('edu-description').value = item.description || '';
      title.textContent = 'Edit Credential / Degree';
    }
  } else {
    title.textContent = 'Add Academic / Statutory Credential';
  }

  modal.style.display = 'flex';
}
window.openEducationModal = openEducationModal;
window.editEducation = openEducationModal;

function closeEducationModal() {
  document.getElementById('education-modal').style.display = 'none';
}
window.closeEducationModal = closeEducationModal;

async function deleteEducation(id) {
  if (!confirm('Permanently remove this academic/statutory credential record?')) return;
  try {
    const res = await fetch(apiUrl(`/api/profile/education/${id}`), { method: 'DELETE' });
    if (res.ok) loadProfileData();
  } catch (err) {
    alert('Failed to delete: ' + err.message);
  }
}
window.deleteEducation = deleteEducation;

// =========================================================================
// 9. SCHOLARLY TREATISES & RESEARCH PUBLICATIONS SUB-DASHBOARD
// =========================================================================

function renderResearchList() {
  const container = document.getElementById('research-list-container');
  if (!container) return;

  const items = activeProfile?.research || [];
  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed var(--bg-admin-border);">
        <p style="color: var(--text-admin-secondary);">No research treatises registered yet.</p>
        <button class="btn-primary" style="margin-top: 14px;" onclick="openResearchModal()">+ Add First Treatise</button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-header">
        <div>
          <span class="mono" style="color: var(--gold-light);">${escapeHtml(item.year || '')} &bull; ${escapeHtml(item.journal || 'Academic Publication')}</span>
          <h3 style="margin-top: 4px; font-size: 18px;">${escapeHtml(item.title)}</h3>
          ${item.link ? `<p class="mono" style="font-size: 11px; margin-top: 2px;"><a href="${item.link}" target="_blank" style="color: var(--cyan-primary);">View Document / DOI ↗</a></p>` : ''}
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn-subtle" onclick="editResearch('${item._id}')">Edit</button>
          <button class="btn-danger" onclick="deleteResearch('${item._id}')">Delete</button>
        </div>
      </div>
      <p style="margin-top: 12px; font-size: 13px; line-height: 1.6; color: var(--text-admin-secondary);">${escapeHtml(item.abstract || '')}</p>
      ${item.tags && item.tags.length ? `
        <div class="tags-container">
          ${item.tags.map(t => `<span class="tag-chip">${escapeHtml(t)}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function setupResearchHandlers() {
  const form = document.getElementById('research-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('res-id').value;
    const tagsRaw = document.getElementById('res-tags').value;
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      title: document.getElementById('res-title').value.trim(),
      journal: document.getElementById('res-journal').value.trim(),
      year: document.getElementById('res-year').value.trim(),
      abstract: document.getElementById('res-abstract').value.trim(),
      link: document.getElementById('res-link').value.trim(),
      tags
    };

    const submitBtn = document.getElementById('res-save-btn');
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    try {
      const url = id ? apiUrl(`/api/profile/research/${id}`) : apiUrl('/api/profile/research');
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        closeResearchModal();
        loadProfileData();
      } else {
        alert('Save error: ' + (data.error || 'Unknown'));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      submitBtn.textContent = 'Save Publication →';
      submitBtn.disabled = false;
    }
  });
}

function openResearchModal(id = null) {
  const modal = document.getElementById('research-modal');
  const form = document.getElementById('research-form');
  const title = document.getElementById('modal-res-title');
  form.reset();
  document.getElementById('res-id').value = '';

  if (id) {
    const item = (activeProfile?.research || []).find(r => r._id === id);
    if (item) {
      document.getElementById('res-id').value = item._id;
      document.getElementById('res-title').value = item.title || '';
      document.getElementById('res-journal').value = item.journal || '';
      document.getElementById('res-year').value = item.year || '';
      document.getElementById('res-abstract').value = item.abstract || '';
      document.getElementById('res-link').value = item.link || '';
      document.getElementById('res-tags').value = (item.tags || []).join(', ');
      title.textContent = 'Edit Scholarly Publication';
    }
  } else {
    title.textContent = 'Add Scholarly Publication';
  }

  modal.style.display = 'flex';
}
window.openResearchModal = openResearchModal;
window.editResearch = openResearchModal;

function closeResearchModal() {
  document.getElementById('research-modal').style.display = 'none';
}
window.closeResearchModal = closeResearchModal;

async function deleteResearch(id) {
  if (!confirm('Permanently remove this research publication record?')) return;
  try {
    const res = await fetch(apiUrl(`/api/profile/research/${id}`), { method: 'DELETE' });
    if (res.ok) loadProfileData();
  } catch (err) {
    alert('Failed to delete: ' + err.message);
  }
}
window.deleteResearch = deleteResearch;

// =========================================================================
// 10. MULTI-STATE ELECTORAL STRATEGY RADAR SUB-DASHBOARD
// =========================================================================

function renderElectoralList() {
  const container = document.getElementById('electoral-list-container');
  if (!container) return;

  const items = activeProfile?.electoralStrategy || [];
  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed var(--bg-admin-border);">
        <p style="color: var(--text-admin-secondary);">No state electoral campaign records registered yet.</p>
        <button class="btn-primary" style="margin-top: 14px;" onclick="openElectoralModal()">+ Add First Campaign</button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-header">
        <div>
          <span class="mono" style="color: var(--gold-light);">${escapeHtml(item.territory || 'Constituency Unit')}</span>
          <h3 style="margin-top: 4px; font-size: 18px;">${escapeHtml(item.state)}</h3>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn-subtle" onclick="editElectoral('${item._id}')">Edit</button>
          <button class="btn-danger" onclick="deleteElectoral('${item._id}')">Delete</button>
        </div>
      </div>
      <p style="margin-top: 12px; font-size: 13px; line-height: 1.6; color: var(--text-admin-secondary);">${escapeHtml(item.summary || '')}</p>
      ${item.scope && item.scope.length ? `
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--bg-admin-border);">
          <strong style="font-size: 11px; text-transform: uppercase; color: var(--text-admin-muted); font-family: var(--font-mono);">Operational Scope:</strong>
          <ul style="margin-top: 8px; padding-left: 18px; font-size: 13px; color: var(--text-admin-secondary); line-height: 1.6;">
            ${item.scope.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function setupElectoralHandlers() {
  const form = document.getElementById('electoral-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('elec-id').value;
    const scopeRaw = document.getElementById('elec-scope').value;
    const scope = scopeRaw.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      state: document.getElementById('elec-state').value.trim(),
      territory: document.getElementById('elec-territory').value.trim(),
      summary: document.getElementById('elec-summary').value.trim(),
      scope
    };

    const submitBtn = document.getElementById('elec-save-btn');
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    try {
      const url = id ? apiUrl(`/api/profile/electoral/${id}`) : apiUrl('/api/profile/electoral');
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        closeElectoralModal();
        loadProfileData();
      } else {
        alert('Save error: ' + (data.error || 'Unknown'));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      submitBtn.textContent = 'Save State Campaign →';
      submitBtn.disabled = false;
    }
  });
}

function openElectoralModal(id = null) {
  const modal = document.getElementById('electoral-modal');
  const form = document.getElementById('electoral-form');
  const title = document.getElementById('modal-elec-title');
  form.reset();
  document.getElementById('elec-id').value = '';

  if (id) {
    const item = (activeProfile?.electoralStrategy || []).find(s => s._id === id);
    if (item) {
      document.getElementById('elec-id').value = item._id;
      document.getElementById('elec-state').value = item.state || '';
      document.getElementById('elec-territory').value = item.territory || '';
      document.getElementById('elec-summary').value = item.summary || '';
      document.getElementById('elec-scope').value = (item.scope || []).join('\n');
      title.textContent = 'Edit Regional Electoral Campaign';
    }
  } else {
    title.textContent = 'Add Regional Electoral Campaign';
  }

  modal.style.display = 'flex';
}
window.openElectoralModal = openElectoralModal;
window.editElectoral = openElectoralModal;

function closeElectoralModal() {
  document.getElementById('electoral-modal').style.display = 'none';
}
window.closeElectoralModal = closeElectoralModal;

async function deleteElectoral(id) {
  if (!confirm('Permanently remove this state electoral campaign record?')) return;
  try {
    const res = await fetch(apiUrl(`/api/profile/electoral/${id}`), { method: 'DELETE' });
    if (res.ok) loadProfileData();
  } catch (err) {
    alert('Failed to delete: ' + err.message);
  }
}
window.deleteElectoral = deleteElectoral;

// =========================================================================
// 11. MEDIA & CLOUDINARY STUDIO (Upload, Replace Asset, Set-Avatar, Delete)
// =========================================================================

async function loadMediaAssets() {
  const countStat = document.getElementById('media-count-stat');
  const kpiMedia = document.getElementById('kpi-media');

  try {
    const res = await fetch(apiUrl('/api/media'));
    const result = await res.json();
    allMedia = result.data || [];

    if (countStat) countStat.textContent = `${allMedia.length} Active Records`;
    if (kpiMedia) kpiMedia.textContent = allMedia.length;

    renderMediaGrid();
  } catch (err) {
    console.error('Failed to load media:', err);
  }
}

function renderMediaGrid() {
  const grid = document.getElementById('media-admin-grid');
  if (!grid) return;

  const currentAvatarUrl = activeProfile?.avatarUrl || '';

  const filtered = allMedia.filter(m => {
    const matchCategory = (activeMediaFilter === 'all') || (m.category === activeMediaFilter);
    const matchSearch = !mediaSearchQuery ||
      (m.title && m.title.toLowerCase().includes(mediaSearchQuery)) ||
      (m.caption && m.caption.toLowerCase().includes(mediaSearchQuery)) ||
      (m.category && m.category.toLowerCase().includes(mediaSearchQuery));
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-admin-muted); grid-column: 1 / -1; text-align: center; padding: 40px;">No photographic records match the selected filter.</p>';
    return;
  }

  grid.innerHTML = filtered.map(m => {
    const imgUrl = m.cloudinaryUrl || m.localUrl;
    const isCurrentAvatar = currentAvatarUrl && imgUrl && currentAvatarUrl.includes(m.cloudinaryPublicId || imgUrl);

    return `
      <div class="media-admin-card" id="media-card-${m._id || m.id}">
        <div style="position: relative;">
          <img src="${imgUrl}" alt="${escapeHtml(m.title)}" loading="lazy">
          ${isCurrentAvatar ? '<span class="status-badge reviewed" style="position: absolute; top: 10px; right: 10px; background: rgba(16,185,129,0.9);">Current Portrait</span>' : ''}
        </div>
        <div class="media-admin-meta">
          <span class="mono" style="font-size: 10px; color: var(--gold-light);">${escapeHtml(m.category || 'archive')}</span>
          <h4>${escapeHtml(m.title)}</h4>
          <p>${escapeHtml(m.caption || '')}</p>
          
          <div class="media-card-actions">
            <button class="btn-tiny replace-action" onclick="openMediaReplaceModal('${m._id || m.id}')">
              Replace File
            </button>
            <button class="btn-tiny avatar-action" onclick="setMediaAsAvatar('${m._id || m.id}')">
              Set Portrait
            </button>
            <button class="btn-tiny" onclick="openMediaEditModal('${m._id || m.id}')">
              Edit Info
            </button>
            <button class="btn-tiny danger" onclick="deleteMedia('${m._id || m.id}')">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupMediaStudioHandlers() {
  // Search & Filter
  const searchInput = document.getElementById('media-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      mediaSearchQuery = e.target.value.toLowerCase().trim();
      renderMediaGrid();
    });
  }

  const filterButtons = document.querySelectorAll('[data-media-filter]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMediaFilter = btn.dataset.mediaFilter;
      renderMediaGrid();
    });
  });

  // Replace File Form
  const replaceForm = document.getElementById('media-replace-form');
  if (replaceForm) {
    replaceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('replace-media-id').value;
      const fileInput = document.getElementById('replace-file-input');
      const feedback = document.getElementById('replace-feedback');
      const submitBtn = document.getElementById('replace-submit-btn');

      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please choose a replacement image file.');
        return;
      }

      const formData = new FormData();
      formData.append('image', fileInput.files[0]);
      formData.append('title', document.getElementById('replace-title-input').value.trim());
      formData.append('caption', document.getElementById('replace-caption-input').value.trim());

      submitBtn.textContent = 'Transmitting to Cloudinary CDN...';
      submitBtn.disabled = true;

      try {
        const res = await fetch(apiUrl(`/api/media/${id}/replace`), {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (res.ok && data.success) {
          feedback.innerHTML = `<span style="color: var(--emerald-primary);">✓ Asset replaced on Cloudinary CDN!</span>`;
          setTimeout(() => {
            closeMediaReplaceModal();
            loadMediaAssets();
          }, 1200);
        } else {
          feedback.innerHTML = `<span style="color: var(--danger-primary);">Error: ${data.error}</span>`;
        }
      } catch (err) {
        feedback.innerHTML = `<span style="color: var(--danger-primary);">Network error: ${err.message}</span>`;
      } finally {
        submitBtn.textContent = 'Upload & Replace on CDN →';
        submitBtn.disabled = false;
      }
    });
  }

  // Edit Metadata Form
  const editForm = document.getElementById('media-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-media-id').value;
      const feedback = document.getElementById('media-edit-feedback');
      const submitBtn = document.getElementById('media-edit-save-btn');

      const payload = {
        title: document.getElementById('edit-media-title').value.trim(),
        category: document.getElementById('edit-media-category').value,
        caption: document.getElementById('edit-media-caption').value.trim()
      };

      submitBtn.textContent = 'Saving...';
      submitBtn.disabled = true;

      try {
        const res = await fetch(apiUrl(`/api/media/${id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.success) {
          feedback.innerHTML = `<span style="color: var(--emerald-primary);">✓ Metadata saved in Atlas!</span>`;
          setTimeout(() => {
            closeMediaEditModal();
            loadMediaAssets();
          }, 1000);
        } else {
          feedback.innerHTML = `<span style="color: var(--danger-primary);">Error: ${data.error}</span>`;
        }
      } catch (err) {
        feedback.innerHTML = `<span style="color: var(--danger-primary);">Network error: ${err.message}</span>`;
      } finally {
        submitBtn.textContent = 'Save Metadata →';
        submitBtn.disabled = false;
      }
    });
  }
}

function openMediaReplaceModal(id) {
  const media = allMedia.find(m => (m._id || m.id) === id);
  if (!media) return;

  const modal = document.getElementById('media-replace-modal');
  const form = document.getElementById('media-replace-form');
  form.reset();
  document.getElementById('replace-media-id').value = id;
  document.getElementById('replace-title-input').value = media.title || '';
  document.getElementById('replace-caption-input').value = media.caption || '';
  document.getElementById('replace-feedback').innerHTML = '';

  modal.style.display = 'flex';
}
window.openMediaReplaceModal = openMediaReplaceModal;

function closeMediaReplaceModal() {
  document.getElementById('media-replace-modal').style.display = 'none';
}
window.closeMediaReplaceModal = closeMediaReplaceModal;

function openMediaEditModal(id) {
  const media = allMedia.find(m => (m._id || m.id) === id);
  if (!media) return;

  const modal = document.getElementById('media-edit-modal');
  document.getElementById('edit-media-id').value = id;
  document.getElementById('edit-media-title').value = media.title || '';
  document.getElementById('edit-media-category').value = media.category || 'governance';
  document.getElementById('edit-media-caption').value = media.caption || '';
  document.getElementById('media-edit-feedback').innerHTML = '';

  modal.style.display = 'flex';
}
window.openMediaEditModal = openMediaEditModal;

function closeMediaEditModal() {
  document.getElementById('media-edit-modal').style.display = 'none';
}
window.closeMediaEditModal = closeMediaEditModal;

async function setMediaAsAvatar(id) {
  if (!confirm('Assign this photographic document as Dr. Shubham Keshri\'s official executive portrait across the public portfolio?')) return;
  try {
    const res = await fetch(apiUrl(`/api/media/${id}/set-avatar`), { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      alert('✓ Official portrait updated to this asset!');
      loadProfileData();
      loadMediaAssets();
    } else {
      alert('Update failed: ' + (data.error || 'Unknown'));
    }
  } catch (err) {
    alert('Network error: ' + err.message);
  }
}
window.setMediaAsAvatar = setMediaAsAvatar;

async function deleteMedia(id) {
  if (!confirm('Permanently purge this asset from Cloudinary CDN and MongoDB Atlas?')) return;
  try {
    const res = await fetch(apiUrl(`/api/media/${id}`), { method: 'DELETE' });
    if (res.ok) loadMediaAssets();
  } catch (err) {
    alert('Failed to delete media: ' + err.message);
  }
}
window.deleteMedia = deleteMedia;

function setupUploadForm() {
  const form = document.getElementById('admin-upload-form');
  const feedback = document.getElementById('upload-feedback');
  const submitBtn = document.getElementById('admin-upload-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('media-file');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Please select an image file to transmit.');
      return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', document.getElementById('media-title').value.trim());
    formData.append('category', document.getElementById('media-category').value);
    formData.append('caption', document.getElementById('media-caption').value.trim());

    submitBtn.textContent = 'Transmitting to Cloudinary CDN...';
    submitBtn.disabled = true;

    try {
      const res = await fetch(apiUrl('/api/upload/cloudinary'), {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (res.ok && data.success) {
        feedback.innerHTML = `
          <div style="padding: 12px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--emerald-primary); color: var(--emerald-primary); font-size: 13px;">
            ✓ Asset synchronized to Cloudinary CDN. ${data.message}
          </div>
        `;
        form.reset();
        loadMediaAssets();
        setTimeout(() => feedback.innerHTML = '', 5000);
      } else {
        feedback.innerHTML = `
          <div style="padding: 12px; border-radius: 8px; background: rgba(239, 68, 68, 0.15); border: 1px solid var(--danger-primary); color: var(--danger-primary); font-size: 13px;">
            ${data.error || 'Upload failed.'}
          </div>
        `;
      }
    } catch (err) {
      feedback.innerHTML = `<div style="color: var(--danger-primary); font-size: 13px;">Network error: ${err.message}</div>`;
    } finally {
      submitBtn.textContent = 'Transmit Asset to Cloudinary →';
      submitBtn.disabled = false;
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

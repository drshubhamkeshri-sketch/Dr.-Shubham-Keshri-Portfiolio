/**
 * DR. SHUBHAM KESHRI — EXECUTIVE TELEMETRY & OPERATIONS CONTROLLER
 * Full MongoDB Atlas Inquiries Management, Cloudinary CDN Pipeline, and Dynamic Profile Sync
 */

// Helper to resolve API URLs via window.APP_CONFIG
function apiUrl(path) {
  if (window.APP_CONFIG && typeof window.APP_CONFIG.getApiUrl === 'function') {
    return window.APP_CONFIG.getApiUrl(path);
  }
  return path;
}

let allContacts = [];
let allMedia = [];
let activeContact = null;

document.addEventListener('DOMContentLoaded', () => {
  initAuthGateway();
  initApiConfigControls();
});

// 0. API Backend URL Management
function initApiConfigControls() {
  const currentBase = window.APP_CONFIG ? window.APP_CONFIG.API_BASE_URL : '';
  const apiStatusEl = document.getElementById('active-api-url-display');
  if (apiStatusEl) {
    apiStatusEl.textContent = currentBase || 'Same Origin / Relative';
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
      authError.textContent = `Server connection error to ${apiUrl('/api/admin/login')}. Please verify network.`;
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
  setupMessageModal();
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

  document.querySelectorAll('.admin-tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });

  const pageTitle = document.getElementById('admin-page-title');
  const titleMap = {
    'tab-overview': 'Executive Operations Overview',
    'tab-inquiries': 'Executive Communications & Leads Desk',
    'tab-media': 'Cloudinary CDN Asset Pipeline',
    'tab-profile': 'Dynamic Strategic Positioning & Roles',
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
      if (sysDbStatus) sysDbStatus.innerHTML = '<span style="color: var(--emerald-primary);">Connected (MongoDB Atlas Live)</span>';
      if (sysDbProvider) sysDbProvider.textContent = 'MongoDB Atlas Cloud Cluster';
    } else {
      if (dbPill) dbPill.innerHTML = '<span class="status-dot standby"></span> Memory Cache Standby';
      if (sysDbStatus) sysDbStatus.innerHTML = '<span style="color: var(--gold-light);">Standby / Disconnected</span>';
      if (sysDbProvider) sysDbProvider.textContent = 'Local Standby Mode';
    }

    if (data.imageStorage && data.imageStorage.configured) {
      if (cloudPill) cloudPill.innerHTML = '<span class="status-dot"></span> Cloudinary CDN';
      if (sysCloudStatus) sysCloudStatus.innerHTML = `<span style="color: var(--emerald-primary);">Connected (${data.imageStorage.cloudName})</span>`;
    } else {
      if (cloudPill) cloudPill.innerHTML = '<span class="status-dot standby"></span> Local Pipeline';
      if (sysCloudStatus) sysCloudStatus.innerHTML = '<span style="color: var(--text-admin-muted);">Local Mode (Check CLOUDINARY in .env)</span>';
    }

    if (data.environment) {
      if (sysRuntime) sysRuntime.textContent = `Node.js ${data.environment.nodeVersion} (${data.environment.nodeEnv})`;
      if (sysUptime) sysUptime.textContent = `${data.environment.uptimeSeconds} seconds`;
    }
  } catch (err) {
    console.error('Health status error:', err);
  }
}

// 5. Inquiries (MongoDB Storage)
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
            <td><strong style="color: var(--text-admin);">${escapeHtml(c.name)}</strong></td>
            <td><span class="mono">${escapeHtml(c.email)}</span></td>
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

    // Render Full Inquiries Table
    if (fullBody) {
      if (allContacts.length === 0) {
        fullBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-admin-muted);">No inquiries found.</td></tr>';
      } else {
        fullBody.innerHTML = allContacts.map(c => `
          <tr>
            <td class="mono" style="font-size: 11px;">${new Date(c.createdAt).toLocaleDateString()}</td>
            <td><strong>${escapeHtml(c.name)}</strong></td>
            <td class="mono" style="font-size: 11px;">${escapeHtml(c.email)}<br><small>${escapeHtml(c.phone || '')}</small></td>
            <td>${escapeHtml(c.organization || '—')}</td>
            <td><span style="font-size: 11px; color: var(--gold-light);">${escapeHtml(c.interest || 'General')}</span></td>
            <td>
              <select class="status-select" onchange="updateContactStatus('${c._id}', this.value)">
                <option value="unread" ${c.status === 'unread' ? 'selected' : ''}>Unread</option>
                <option value="reviewed" ${c.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                <option value="archived" ${c.status === 'archived' ? 'selected' : ''}>Archived</option>
              </select>
            </td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="btn-subtle" onclick="openContactModal('${c._id}')">Inspect</button>
                <button class="btn-danger" onclick="deleteContact('${c._id}')">Delete</button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Failed to load inquiries:', err);
  }
}

// 6. Contact Modal & Actions
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

  activeContact = c;
  const modal = document.getElementById('message-modal');
  const body = document.getElementById('modal-msg-body');
  const footer = document.getElementById('modal-msg-footer');

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <div><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">FROM:</span><br><strong>${escapeHtml(c.name)}</strong></div>
      <div><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">DATE:</span><br>${new Date(c.createdAt).toLocaleString()}</div>
      <div><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">EMAIL:</span><br><a href="mailto:${escapeHtml(c.email)}" style="color: var(--cyan-light);">${escapeHtml(c.email)}</a></div>
      <div><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">PHONE:</span><br>${escapeHtml(c.phone || 'Not provided')}</div>
      <div style="grid-column: span 2;"><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">ORGANIZATION / SECTOR:</span><br>${escapeHtml(c.organization || 'Not provided')}</div>
      <div style="grid-column: span 2;"><span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">STRATEGIC DOMAIN OF INTEREST:</span><br><strong style="color: var(--gold-light);">${escapeHtml(c.interest)}</strong></div>
    </div>
    <div>
      <span class="mono" style="font-size: 11px; color: var(--text-admin-muted);">CONFIDENTIAL MESSAGE TRANSMISSION:</span>
      <div style="margin-top: 8px; padding: 14px; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--border-admin); font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(c.message)}</div>
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
  if (!confirm('Permanently purge this executive inquiry record?')) return;
  try {
    const res = await fetch(apiUrl(`/api/contacts/${id}`), { method: 'DELETE' });
    if (res.ok) loadInquiries();
  } catch (err) {
    alert('Failed to delete inquiry: ' + err.message);
  }
}
window.deleteContact = deleteContact;

// 7. Media & Cloudinary Pipeline
async function loadMediaAssets() {
  const grid = document.getElementById('media-admin-grid');
  const countStat = document.getElementById('media-count-stat');
  const kpiMedia = document.getElementById('kpi-media');

  try {
    const res = await fetch(apiUrl('/api/media'));
    const result = await res.json();
    allMedia = result.data || [];

    if (countStat) countStat.textContent = `${allMedia.length} Records Active`;
    if (kpiMedia) kpiMedia.textContent = allMedia.length;

    if (grid) {
      grid.innerHTML = allMedia.map(m => `
        <div class="media-admin-card">
          <img src="${m.cloudinaryUrl || m.localUrl}" alt="${escapeHtml(m.title)}" loading="lazy">
          <div class="media-admin-meta">
            <span class="mono" style="font-size: 10px; color: var(--gold-light);">${escapeHtml(m.category || 'archive')}</span>
            <h4>${escapeHtml(m.title)}</h4>
            <p>${escapeHtml(m.caption || '')}</p>
            <div style="margin-top: auto; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
              <span class="mono" style="font-size: 10px; color: var(--text-admin-muted);">${m.cloudinaryUrl ? 'Cloudinary CDN' : 'Local Master'}</span>
              <button class="btn-danger" style="padding: 2px 8px; font-size: 10px;" onclick="deleteMedia('${m._id || m.id}')">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Failed to load media:', err);
  }
}

async function deleteMedia(id) {
  if (!confirm('Remove this asset record from Cloudinary and MongoDB?')) return;
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

// 8. Dynamic Profile Content Editor
async function loadProfileData() {
  try {
    const res = await fetch(apiUrl('/api/profile'));
    const result = await res.json();
    const data = result.data;

    if (!data) return;

    if (document.getElementById('prof-name')) document.getElementById('prof-name').value = data.name || '';
    if (document.getElementById('prof-title')) document.getElementById('prof-title').value = data.title || '';
    if (document.getElementById('prof-role')) document.getElementById('prof-role').value = data.executiveRole || '';
    if (document.getElementById('prof-tagline')) document.getElementById('prof-tagline').value = data.tagline || '';
    if (document.getElementById('prof-email')) document.getElementById('prof-email').value = data.contacts?.email || '';
    if (document.getElementById('prof-website')) document.getElementById('prof-website').value = data.contacts?.companyWebsite || '';
    if (document.getElementById('prof-base')) document.getElementById('prof-base').value = data.contacts?.base || '';
    if (document.getElementById('prof-current-address')) document.getElementById('prof-current-address').value = data.contacts?.addresses?.current || '';
  } catch (err) {
    console.error('Failed to load profile:', err);
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
            ✓ Changes permanently persisted to MongoDB Atlas. Live portfolio updated immediately.
          </div>
        `;
        setTimeout(() => feedback.innerHTML = '', 4000);
      } else {
        feedback.innerHTML = `<div style="color: var(--danger-primary); font-size: 13px;">Update failed: ${data.error}</div>`;
      }
    } catch (err) {
      feedback.innerHTML = `<div style="color: var(--danger-primary); font-size: 13px;">Network error: ${err.message}</div>`;
    } finally {
      saveBtn.textContent = 'Synchronize Live Site →';
      saveBtn.disabled = false;
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

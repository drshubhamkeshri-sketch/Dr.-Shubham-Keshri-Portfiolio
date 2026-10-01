/**
 * DR. SHUBHAM KESHRI — EXECUTIVE TELEMETRY & OPERATIONS CONTROLLER
 * Full MongoDB Inquiries Management, Cloudinary CDN Pipeline, and Dynamic Profile Sync
 */

let allContacts = [];
let allMedia = [];
let activeContact = null;

document.addEventListener('DOMContentLoaded', () => {
  initAuthGateway();
});

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
      const res = await fetch('/api/admin/login', {
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
      authError.textContent = 'Server connection error. Please verify network.';
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

  document.querySelectorAll('.admin-tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });

  const pageTitle = document.getElementById('page-title');
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
    const res = await fetch('/api/health');
    const data = await res.json();

    const dbPill = document.getElementById('db-status-pill');
    const cloudPill = document.getElementById('cloud-status-pill');
    const sysDbStatus = document.getElementById('sys-db-status');
    const sysDbProvider = document.getElementById('sys-db-provider');
    const sysCloudStatus = document.getElementById('sys-cloud-status');
    const sysRuntime = document.getElementById('sys-runtime');
    const sysUptime = document.getElementById('sys-uptime');

    if (data.database && data.database.connected) {
      if (dbPill) dbPill.innerHTML = '<span class="status-dot"></span> MongoDB Active';
      if (sysDbStatus) sysDbStatus.innerHTML = '<span style="color: var(--emerald-primary);">Connected (MongoDB Live)</span>';
      if (sysDbProvider) sysDbProvider.textContent = 'MongoDB Atlas / Standalone Server';
    } else {
      if (dbPill) dbPill.innerHTML = '<span class="status-dot standby"></span> Memory Cache Standby';
      if (sysDbStatus) sysDbStatus.innerHTML = '<span style="color: var(--gold-light);">Resilient Fallback Mode (Memory Cache)</span>';
      if (sysDbProvider) sysDbProvider.textContent = 'In-Memory Resilient Cache (Set MONGODB_URI in .env)';
    }

    if (data.imageStorage && data.imageStorage.configured) {
      if (cloudPill) cloudPill.innerHTML = '<span class="status-dot"></span> Cloudinary CDN';
      if (sysCloudStatus) sysCloudStatus.innerHTML = `<span style="color: var(--emerald-primary);">Connected (${data.imageStorage.cloudName})</span>`;
    } else {
      if (cloudPill) cloudPill.innerHTML = '<span class="status-dot standby"></span> Local CDN Pipeline';
      if (sysCloudStatus) sysCloudStatus.innerHTML = '<span style="color: var(--text-admin-muted);">Local Document Pipeline (Set Cloudinary in .env)</span>';
    }

    if (data.system) {
      if (sysRuntime) sysRuntime.textContent = `Node.js ${data.system.nodeVersion} (${data.system.platform})`;
      if (sysUptime) sysUptime.textContent = `${data.system.uptimeSeconds} seconds`;
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
    const res = await fetch('/api/contacts');
    const result = await res.json();
    allContacts = result.data || [];

    const unreadCount = allContacts.filter(c => (c.status || 'unread') === 'unread').length;
    if (kpiInquiries) kpiInquiries.textContent = allContacts.length;
    if (kpiUnread) kpiUnread.textContent = unreadCount;
    if (badge) badge.textContent = unreadCount;

    // Overview Table (Top 5)
    if (overviewBody) {
      if (allContacts.length === 0) {
        overviewBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-admin-muted); padding: 24px;">No inquiries registered yet. Test form on public portfolio.</td></tr>';
      } else {
        overviewBody.innerHTML = allContacts.slice(0, 5).map(c => `
          <tr>
            <td class="mono" style="font-size: 11px;">${new Date(c.createdAt).toLocaleDateString()}</td>
            <td style="font-weight: 600; color: var(--text-admin-primary);">${escapeHtml(c.name)}</td>
            <td>${escapeHtml(c.organization || 'Independent')}</td>
            <td>${escapeHtml(c.interest || 'Land Intelligence')}</td>
            <td><span class="status-tag ${c.status || 'unread'}">${c.status || 'unread'}</span></td>
            <td><button class="btn-subtle" style="padding: 4px 10px; font-size: 11px;" onclick="openContactModal('${c._id}')">Review &rarr;</button></td>
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
  const filterStatus = document.getElementById('inquiry-filter-status')?.value || 'all';
  const searchTerm = (document.getElementById('inquiry-search-input')?.value || '').toLowerCase().trim();

  if (!fullBody) return;

  let filtered = allContacts.filter(c => {
    const matchesStatus = filterStatus === 'all' || (c.status || 'unread') === filterStatus;
    const matchesSearch = !searchTerm ||
      (c.name && c.name.toLowerCase().includes(searchTerm)) ||
      (c.email && c.email.toLowerCase().includes(searchTerm)) ||
      (c.organization && c.organization.toLowerCase().includes(searchTerm)) ||
      (c.message && c.message.toLowerCase().includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    fullBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-admin-muted); padding: 30px;">No communications match current criteria.</td></tr>';
    return;
  }

  fullBody.innerHTML = filtered.map(c => `
    <tr>
      <td class="mono" style="font-size: 11px;">${new Date(c.createdAt).toLocaleString()}</td>
      <td style="font-weight: 600; color: var(--text-admin-primary);">${escapeHtml(c.name)}</td>
      <td>
        <a href="mailto:${escapeHtml(c.email)}" style="color: var(--cyan-primary);">${escapeHtml(c.email)}</a>
        ${c.phone ? `<br><span class="mono" style="color: var(--text-admin-muted); font-size: 11px;">${escapeHtml(c.phone)}</span>` : ''}
      </td>
      <td>${escapeHtml(c.organization || 'Independent')}</td>
      <td>${escapeHtml(c.interest || 'Land Intelligence')}</td>
      <td><span class="status-tag ${c.status || 'unread'}">${c.status || 'unread'}</span></td>
      <td style="text-align: right;">
        <button class="btn-subtle" style="padding: 4px 10px; font-size: 11px; margin-right: 4px;" onclick="openContactModal('${c._id}')">Open</button>
        <button class="btn-danger" style="padding: 4px 10px; font-size: 11px;" onclick="deleteContact('${c._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Search and filter event listeners
document.getElementById('inquiry-search-input')?.addEventListener('input', renderFullInquiriesTable);
document.getElementById('inquiry-filter-status')?.addEventListener('change', renderFullInquiriesTable);

// 6. Contact Details Modal & Status Update
function setupMessageModal() {
  const modal = document.getElementById('message-modal');
  const closeBtn = document.getElementById('modal-msg-close');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

function openContactModal(id) {
  const contact = allContacts.find(c => c._id === id);
  if (!contact) return;
  activeContact = contact;

  const modal = document.getElementById('message-modal');
  const title = document.getElementById('modal-msg-title');
  const body = document.getElementById('modal-msg-body');
  const footer = document.getElementById('modal-msg-footer');

  title.textContent = `Inquiry: ${contact.name}`;
  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; font-size: 13px;">
      <div><strong>Sender:</strong> ${escapeHtml(contact.name)}</div>
      <div><strong>Registered At:</strong> ${new Date(contact.createdAt).toLocaleString()}</div>
      <div><strong>Email:</strong> <a href="mailto:${escapeHtml(contact.email)}" style="color: var(--cyan-primary);">${escapeHtml(contact.email)}</a></div>
      <div><strong>Phone:</strong> ${contact.phone ? escapeHtml(contact.phone) : 'Not provided'}</div>
      <div><strong>Organization:</strong> ${escapeHtml(contact.organization || 'Not provided')}</div>
      <div><strong>Subject:</strong> ${escapeHtml(contact.interest)}</div>
    </div>
    <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid var(--bg-admin-border); border-radius: 10px; padding: 18px;">
      <strong style="display: block; font-family: var(--font-mono); font-size: 11px; color: var(--gold-light); text-transform: uppercase; margin-bottom: 8px;">Full Communication Brief:</strong>
      <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.7; color: var(--text-admin-primary);">${escapeHtml(contact.message)}</p>
    </div>
  `;

  footer.innerHTML = `
    <button class="btn-subtle" onclick="updateContactStatus('${contact._id}', 'unread')">Mark Unread</button>
    <button class="btn-subtle" onclick="updateContactStatus('${contact._id}', 'archived')">Archive</button>
    <button class="btn-primary" onclick="updateContactStatus('${contact._id}', 'reviewed')">Mark as Reviewed ✓</button>
  `;

  modal.style.display = 'flex';
}
window.openContactModal = openContactModal;

async function updateContactStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      document.getElementById('message-modal').style.display = 'none';
      loadInquiries();
    }
  } catch (err) {
    alert('Failed to update status: ' + err.message);
  }
}
window.updateContactStatus = updateContactStatus;

async function deleteContact(id) {
  if (!confirm('Are you certain you wish to permanently purge this inquiry from the database?')) return;
  try {
    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadInquiries();
    }
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
    const res = await fetch('/api/media');
    const result = await res.json();
    allMedia = result.data || [];

    if (countStat) countStat.textContent = `${allMedia.length} Records Active`;
    if (kpiMedia) kpiMedia.textContent = allMedia.length;

    if (grid) {
      grid.innerHTML = allMedia.map(m => `
        <div class="media-admin-card">
          <img src="${m.localUrl || m.cloudinaryUrl}" alt="${escapeHtml(m.title)}" loading="lazy">
          <div class="media-admin-meta">
            <span class="mono" style="font-size: 10px; color: var(--gold-light);">${escapeHtml(m.category || 'archive')}</span>
            <h4>${escapeHtml(m.title)}</h4>
            <p>${escapeHtml(m.caption || '')}</p>
            <div style="margin-top: auto; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
              <span class="mono" style="font-size: 10px; color: var(--text-admin-muted);">${m.cloudinaryUrl ? 'Cloudinary CDN' : 'Local Master'}</span>
              <button class="btn-danger" style="padding: 2px 8px; font-size: 10px;" onclick="deleteMedia('${m.id || m._id}')">Remove</button>
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
  if (!confirm('Remove this asset record from display?')) return;
  try {
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
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
      const res = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (res.ok && data.success) {
        feedback.innerHTML = `
          <div style="padding: 12px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--emerald-primary); color: var(--emerald-primary); font-size: 13px;">
            ✓ Asset synchronized successfully. ${data.message}
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
    const res = await fetch('/api/profile');
    const result = await res.json();
    const data = result.data;

    if (!data) return;

    document.getElementById('prof-name').value = data.name || '';
    document.getElementById('prof-title').value = data.title || '';
    document.getElementById('prof-role').value = data.executiveRole || '';
    document.getElementById('prof-tagline').value = data.tagline || '';
    document.getElementById('prof-email').value = data.contacts?.email || '';
    document.getElementById('prof-website').value = data.contacts?.companyWebsite || '';
    document.getElementById('prof-base').value = data.contacts?.base || '';
    document.getElementById('prof-current-address').value = data.contacts?.addresses?.current || '';
  } catch (err) {
    console.error('Failed to load profile:', err);
  }
}

function setupProfileForm() {
  const saveBtn = document.getElementById('save-profile-btn');
  const feedback = document.getElementById('profile-feedback');

  if (!saveBtn) return;

  saveBtn.addEventListener('click', async () => {
    saveBtn.textContent = 'Synchronizing...';
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
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        feedback.innerHTML = `
          <div style="padding: 12px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--emerald-primary); color: var(--emerald-primary); font-size: 13px;">
            ✓ Changes permanently persisted. Live portfolio updated immediately.
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

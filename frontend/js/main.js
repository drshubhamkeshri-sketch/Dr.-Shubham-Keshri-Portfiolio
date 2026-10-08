/**
 * DR. SHUBHAM KESHRI — ULTRA-LUXURY INTERACTIVE PORTFOLIO ENGINE
 * Dynamic Dual-Theme (Dark/Light) + Device Auto-Detection + Rich Motion & Dynamic API Hydration
 */

// Helper to resolve API URLs via window.APP_CONFIG
function apiUrl(path) {
  if (window.APP_CONFIG && typeof window.APP_CONFIG.getApiUrl === 'function') {
    return window.APP_CONFIG.getApiUrl(path);
  }
  return path;
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initScrollProgressBar();
  initHeroCanvas();
  if (typeof init3DGlobe === 'function') init3DGlobe();
  init3DTilt();
  initSpotlightEffect();
  initScrollReveal();
  initCounterAnimations();
  initGalleryFilterAndLightbox();
  initConsultationForm();
  initSystemPortal();
  initStickyNav();
  initMobileNavigation();

  // Dynamic API Hydration from MongoDB Atlas & Cloudinary CDN
  loadDynamicMedia();
  loadDynamicProfile();
});

// 1. Dynamic Theme Engine (Device Auto-Detection + Manual Button Switch)
let currentTheme = 'dark';
let onThemeChangeCallback = null;

function initThemeEngine() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  if (storedTheme) {
    currentTheme = storedTheme;
  } else if (systemPrefersDark.matches) {
    currentTheme = 'dark';
  } else {
    currentTheme = 'light';
  }

  applyTheme(currentTheme);

  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
    }
  });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      applyTheme(nextTheme);
    });
  }
}

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  if (themeToggleBtn) {
    const sunIcon = themeToggleBtn.querySelector('.theme-icon-sun');
    const moonIcon = themeToggleBtn.querySelector('.theme-icon-moon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
      moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    }
    themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
  }

  if (typeof onThemeChangeCallback === 'function') {
    onThemeChangeCallback(theme);
  }

  if (typeof update3DGlobeTheme === 'function') {
    update3DGlobeTheme(theme);
  }
}

// 2. Scroll Progress Bar Engine
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

// 3. Global Full-Portfolio Luminous Fluid Aurora Mesh & Studio Glow Engine
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let time = 0;
  let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
  let scrollY = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || window.pageYOffset;
  }, { passive: true });

  const auroraBands = [
    { freq: 0.0016, amp: 95, speed: 0.50, phase: 0.0, colorDark: [245, 158, 11], colorLight: [217, 119, 6], baseOffset: 0.28, opacity: 0.24 },
    { freq: 0.0022, amp: 115, speed: 0.70, phase: 2.1, colorDark: [6, 182, 212], colorLight: [2, 132, 199], baseOffset: 0.42, opacity: 0.28 },
    { freq: 0.0014, amp: 105, speed: 0.40, phase: 3.6, colorDark: [99, 102, 241], colorLight: [79, 70, 229], baseOffset: 0.58, opacity: 0.22 },
    { freq: 0.0025, amp: 85, speed: 0.80, phase: 5.0, colorDark: [16, 185, 129], colorLight: [5, 150, 105], baseOffset: 0.72, opacity: 0.18 }
  ];

  function renderAuroraMesh() {
    ctx.clearRect(0, 0, width, height);

    if (mouse.active) {
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;
    } else {
      const idleX = width * 0.65 + Math.sin(time * 0.4) * 90;
      const idleY = height * 0.45 + Math.cos(time * 0.3) * 60;
      mouse.x += (idleX - mouse.x) * 0.02;
      mouse.y += (idleY - mouse.y) * 0.02;
    }

    const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';

    ctx.globalCompositeOperation = isDark ? 'screen' : 'source-over';
    const scrollPhase = (scrollY * 0.0008);

    auroraBands.forEach((band, index) => {
      const baseY = height * band.baseOffset;
      const points = [];
      const step = 20;

      for (let x = -60; x <= width + 60; x += step) {
        const wave1 = Math.sin(x * band.freq + time * band.speed + band.phase + scrollPhase) * band.amp;
        const wave2 = Math.cos(x * (band.freq * 1.7) - time * (band.speed * 0.6) + index) * (band.amp * 0.45);
        const wave3 = Math.sin(x * 0.0008 + time * 0.2) * 20;

        let mouseDeform = 0;
        const dx = x - mouse.x;
        const dy = baseY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 350;
        if (dist < radius) {
          const factor = Math.cos((dist / radius) * (Math.PI / 2));
          mouseDeform = Math.sin(dist * 0.025 - time * 2.0) * 36 * factor;
        }

        const y = baseY + wave1 + wave2 + wave3 + mouseDeform;
        points.push({ x, y });
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i - 1].x + points[i].x) / 2;
        const yc = (points[i - 1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }
      ctx.lineTo(width + 60, height + 100);
      ctx.lineTo(-60, height + 100);
      ctx.closePath();

      const [r, g, b] = isDark ? band.colorDark : band.colorLight;
      const peakAlpha = band.opacity * (0.85 + Math.sin(time * 0.8 + index) * 0.15);

      const grad = ctx.createLinearGradient(0, baseY - band.amp * 1.2, width * 0.5, baseY + band.amp * 2);
      if (isDark) {
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.01)`);
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${peakAlpha})`);
        grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${peakAlpha * 0.6})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      } else {
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.01)`);
        grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${peakAlpha * 0.45})`);
        grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${peakAlpha * 0.25})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      }

      ctx.fillStyle = grad;
      ctx.fill();
    });

    if (mouse.x > 0 && mouse.y > 0) {
      const bloomRadius = Math.max(width * 0.38, 380);
      const bloomGrad = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, bloomRadius
      );

      if (isDark) {
        bloomGrad.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
        bloomGrad.addColorStop(0.28, 'rgba(6, 182, 212, 0.14)');
        bloomGrad.addColorStop(0.55, 'rgba(99, 102, 241, 0.07)');
        bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        bloomGrad.addColorStop(0, 'rgba(217, 119, 6, 0.14)');
        bloomGrad.addColorStop(0.35, 'rgba(2, 132, 199, 0.09)');
        bloomGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }

      ctx.fillStyle = bloomGrad;
      ctx.fillRect(0, 0, width, height);
    }

    const focalX = width * 0.72;
    const focalY = height * 0.46;
    const focalRadius = Math.max(width * 0.35, 340);
    const focalGrad = ctx.createRadialGradient(
      focalX, focalY, 0,
      focalX, focalY, focalRadius
    );

    if (isDark) {
      focalGrad.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
      focalGrad.addColorStop(0.38, 'rgba(245, 158, 11, 0.11)');
      focalGrad.addColorStop(0.72, 'rgba(99, 102, 241, 0.05)');
      focalGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      focalGrad.addColorStop(0, 'rgba(2, 132, 199, 0.11)');
      focalGrad.addColorStop(0.4, 'rgba(217, 119, 6, 0.08)');
      focalGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }

    ctx.fillStyle = focalGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'source-over';
    time += 0.007;
    requestAnimationFrame(renderAuroraMesh);
  }

  renderAuroraMesh();
}

// 4. 3D Card Hover Tilt Effect
function init3DTilt() {
  const cards = document.querySelectorAll('.portrait-3d-card, .state-radar-card, .gallery-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// 5. Spotlight Mouse Follow Effect on Bento Cards
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// 6. Scroll Reveal Staggered Animations
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-item');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

// 7. Animated Number Counters
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let hasRun = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasRun) {
      hasRun = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target || counter.textContent, 10);
        if (isNaN(target)) return;
        let count = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            counter.innerHTML = `${target}<span>+</span>`;
            clearInterval(timer);
          } else {
            counter.innerHTML = `${count}<span>+</span>`;
          }
        }, 40);
      });
    }
  }, { threshold: 0.3 });

  const statsRow = document.querySelector('.hero-stats-row');
  if (statsRow) observer.observe(statsRow);
}

// 8. Photo Gallery Filtering & Fullscreen Lightbox
function initGalleryFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-pill-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    };
  });

  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal) return;

  galleryCards.forEach(card => {
    card.onclick = () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-card-title');
      const tag = card.querySelector('.gallery-card-tag');

      if (img && modalImg) {
        modalImg.src = img.src;
        modalCaption.textContent = title ? `${tag ? tag.textContent + ' — ' : ''}${title.textContent}` : '';
        modal.classList.add('active');
      }
    };
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  document.onkeydown = (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  };
}

// DYNAMIC API HYDRATION 1: Load Media from MongoDB Atlas / Cloudinary CDN
async function loadDynamicMedia() {
  const grid = document.getElementById('gallery-grid') || document.querySelector('.gallery-interactive-grid');
  if (!grid) return;

  try {
    const res = await fetch(apiUrl('/api/media'));
    if (!res.ok) return;
    const json = await res.json();

    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      grid.innerHTML = '';

      const categoryLabels = {
        governance: 'State Policy & Governance',
        grassroots: 'Grassroots & Social Action',
        academic: 'Scholarship & Culture',
        portrait: 'Executive Portrait',
        'deep-tech': 'Planetary Land Intelligence'
      };

      json.data.forEach(item => {
        const tagLabel = categoryLabels[item.category] || (item.category ? item.category.toUpperCase() : 'Archive');
        const imgUrl = item.cloudinaryUrl || item.localUrl;

        const card = document.createElement('article');
        card.className = 'gallery-card reveal-item revealed';
        card.dataset.category = item.category || 'governance';
        card.innerHTML = `
          <div class="gallery-card-img-box">
            <span class="gallery-card-tag">${tagLabel}</span>
            <img src="${imgUrl}" alt="${item.title ? escapeHtml(item.title) : 'Dr. Shubham Keshri'}" loading="lazy" />
          </div>
          <div class="gallery-card-info">
            <h3 class="gallery-card-title">${item.title ? escapeHtml(item.title) : 'Executive Archive'}</h3>
            <p class="gallery-card-desc">${item.caption ? escapeHtml(item.caption) : ''}</p>
          </div>
        `;
        grid.appendChild(card);
      });

      // Update pill count
      const allPill = document.querySelector('.filter-pill-btn[data-filter="all"]');
      if (allPill) allPill.textContent = `All Records (${json.data.length})`;

      // Rebind tilt, filter, and lightbox on new cards
      initGalleryFilterAndLightbox();
      init3DTilt();
    }
  } catch (err) {
    console.warn('Notice: Gallery operating on pre-rendered fallback:', err.message);
  }
}

// DYNAMIC API HYDRATION 2: Scalable Executive Profile from MongoDB Atlas
async function loadDynamicProfile() {
  try {
    const res = await fetch(apiUrl('/api/profile'));
    if (!res.ok) return;
    const json = await res.json();

    if (json.success && json.data) {
      const p = json.data;

      // 1. Executive Avatar / Portrait
      if (p.avatarUrl) {
        const avatarEl = document.getElementById('executive-portrait-img') || document.querySelector('.portrait-inner img');
        if (avatarEl) avatarEl.src = p.avatarUrl;
      }

      // 2. Name & Primary Titles
      if (p.name) {
        document.querySelectorAll('.brand-meta h2, .portrait-hologram-footer h4').forEach(el => {
          el.textContent = p.name;
        });
      }

      // Keep navbar brand tag compact & prestigious (never wrap or stretch header height)
      document.querySelectorAll('.brand-meta .brand-role-tag').forEach(el => {
        el.textContent = 'EXECUTIVE DIRECTOR';
      });

      // Route the full formal title & extender designation to the hero title banner & portrait hologram
      if (p.title) {
        const heroTitle = document.getElementById('hero-formal-title');
        if (heroTitle) {
          const titleTextEl = heroTitle.querySelector('.title-text') || heroTitle;
          titleTextEl.textContent = p.title;
        }
        const hologramRole = document.getElementById('portrait-hologram-role');
        if (hologramRole) {
          hologramRole.textContent = p.title;
        }
      } else if (p.executiveRole) {
        const hologramRole = document.getElementById('portrait-hologram-role');
        if (hologramRole) {
          hologramRole.textContent = p.executiveRole;
        }
      }

      // 3. Strategic Mission Statement / Tagline
      if (p.tagline) {
        const descEl = document.querySelector('.hero-desc');
        if (descEl) descEl.textContent = p.tagline;
      }

      // 4. Dynamic Hero Stat Counters
      if (p.heroStats) {
        const statItems = document.querySelectorAll('.hero-stats-row .stat-item');
        if (statItems[0] && p.heroStats.directorships !== undefined) {
          const numEl = statItems[0].querySelector('.stat-number');
          if (numEl) {
            numEl.setAttribute('data-target', p.heroStats.directorships);
            numEl.innerHTML = `${p.heroStats.directorships}<span>+</span>`;
          }
        }
        if (statItems[1] && p.heroStats.campaigns !== undefined) {
          const numEl = statItems[1].querySelector('.stat-number');
          if (numEl) {
            numEl.setAttribute('data-target', p.heroStats.campaigns);
            numEl.innerHTML = `${p.heroStats.campaigns}<span>+</span>`;
          }
        }
        if (statItems[2] && p.heroStats.booths !== undefined) {
          const numEl = statItems[2].querySelector('.stat-number');
          if (numEl) {
            numEl.setAttribute('data-target', p.heroStats.booths);
            numEl.innerHTML = `${p.heroStats.booths}<span>+</span>`;
          }
        }
      }

      // 5. Infinite Credentials Marquee Ticker
      if (p.subroles && Array.isArray(p.subroles) && p.subroles.length > 0) {
        const marqueeContent = document.querySelector('.marquee-content');
        if (marqueeContent) {
          const itemsHtml = p.subroles.map(r => `
            <div class="marquee-item"><span class="marquee-star">✦</span> ${escapeHtml(r.toUpperCase())}</div>
          `).join('');
          marqueeContent.innerHTML = itemsHtml + itemsHtml; // duplicate for seamless loop
        }
      }

      // 6. Corporate Directorships & Experience
      if (p.companies && Array.isArray(p.companies) && p.companies.length > 0) {
        const expGrid = document.getElementById('experience-grid');
        if (expGrid) {
          expGrid.innerHTML = p.companies.map(c => `
            <div class="directorship-card reveal-item revealed">
              <div class="directorship-top-head">
                <div>
                  <div class="directorship-role">${escapeHtml(c.role || 'Executive Directorship')}</div>
                  <h4>${escapeHtml(c.name)}</h4>
                </div>
                <span class="directorship-badge ${c.isActive ? '' : 'past'}">
                  ${c.isActive ? 'Active Directorship' : 'Past Appointment'}
                </span>
              </div>
              <p class="directorship-desc">${escapeHtml(c.description || '')}</p>
              <div class="directorship-footer">
                <span>${escapeHtml(c.period || '')}${c.location ? ` &bull; ${escapeHtml(c.location)}` : ''}</span>
                ${c.website ? `<a href="${c.website}" target="_blank" rel="noopener">${cleanUrl(c.website)} ↗</a>` : ''}
              </div>
            </div>
          `).join('');
        }
      }

      // 7. Multi-State Electoral Strategy Radar
      if (p.electoralStrategy && Array.isArray(p.electoralStrategy) && p.electoralStrategy.length > 0) {
        const radarGrid = document.querySelector('.states-radar-grid');
        if (radarGrid) {
          radarGrid.innerHTML = p.electoralStrategy.map(s => `
            <div class="state-radar-card reveal-item revealed">
              <div class="state-top-head">
                <h4>${escapeHtml(s.state)}</h4>
                <span class="state-badge">${escapeHtml(s.territory || 'Constituency Unit')}</span>
              </div>
              <p class="state-desc">${escapeHtml(s.summary || '')}</p>
              ${s.scope && s.scope.length ? `
                <div class="state-meta-box">
                  <strong>Operational Scope</strong>
                  <ul>
                    ${s.scope.map(sc => `<li>${escapeHtml(sc)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('');
        }
      }

      // 8. Scholarly Research & Academic Credentials Timeline
      const timeline = document.querySelector('.research-timeline-list');
      if (timeline && ((p.education && p.education.length > 0) || (p.research && p.research.length > 0))) {
        let timelineRows = '';

        // Add Education Credentials
        if (p.education && p.education.length > 0) {
          p.education.forEach(e => {
            timelineRows += `
              <div class="timeline-row reveal-item revealed">
                <div>
                  <span class="timeline-year-tag">${escapeHtml(e.year || 'Academic')}</span>
                  <p class="timeline-inst">${escapeHtml(e.institution || '')}</p>
                </div>
                <div class="timeline-content">
                  <h3>${escapeHtml(e.degree)}</h3>
                  <p>${escapeHtml(e.description || '')}</p>
                </div>
              </div>
            `;
          });
        }

        // Add Research Treatises
        if (p.research && p.research.length > 0) {
          p.research.forEach(r => {
            timelineRows += `
              <div class="timeline-row reveal-item revealed">
                <div>
                  <span class="timeline-year-tag">${escapeHtml(r.year || 'Published Treatise')}</span>
                  <p class="timeline-inst">${escapeHtml(r.journal || 'Academic Forum')}</p>
                </div>
                <div class="timeline-content">
                  <h3>${escapeHtml(r.title)}</h3>
                  <p>${escapeHtml(r.abstract || '')}</p>
                  ${r.link ? `<p style="margin-top: 8px;"><a href="${r.link}" target="_blank" style="color: var(--cyan-primary); font-size: 13px;">View Document / Publication ↗</a></p>` : ''}
                </div>
              </div>
            `;
          });
        }

        if (timelineRows) {
          timeline.innerHTML = timelineRows;
        }
      }

      // 9. Contact Desk Metadata
      if (p.contacts) {
        if (p.contacts.email) {
          document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
            a.href = `mailto:${p.contacts.email}`;
            a.textContent = p.contacts.email;
          });
        }
        if (p.contacts.companyWebsite) {
          document.querySelectorAll('a[href*="calideeptechai.com"]').forEach(a => {
            a.href = p.contacts.companyWebsite;
            a.textContent = `${cleanUrl(p.contacts.companyWebsite)} ↗`;
          });
        }
      }

      // Re-trigger reveal observer for newly injected elements
      initScrollReveal();
    }
  } catch (err) {
    console.warn('Notice: Profile operating on pre-rendered fallback:', err.message);
  }
}

function cleanUrl(url) {
  if (!url) return '';
  return url.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
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

// 9. Consultation Form Submission (MongoDB API)
function initConsultationForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-alert');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('form-name').value.trim(),
      email: document.getElementById('form-email').value.trim(),
      phone: document.getElementById('form-phone').value.trim(),
      organization: document.getElementById('form-org').value.trim(),
      interest: document.getElementById('form-interest').value,
      message: document.getElementById('form-message').value.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
      showAlert('Please enter required information (Full Name, Official Email, Brief).', 'error');
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Transmitting to Executive Desk...';
    submitBtn.disabled = true;

    try {
      const res = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        showAlert(`Inquiry received and permanently registered in database (${result.data.storedIn}). Dr. Shubham Keshri's office will respond promptly.`, 'success');
        form.reset();
      } else {
        showAlert(result.error || 'Failed to submit inquiry. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      showAlert('Network error communicating with the executive server. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  function showAlert(msg, type) {
    alertBox.textContent = msg;
    alertBox.className = `form-feedback-alert ${type}`;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// 10. Sticky Nav on Scroll
function initStickyNav() {
  const nav = document.querySelector('header.luxury-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// 11. Discreet Executive System & Cloudinary Portal
function initSystemPortal() {
  const trigger = document.getElementById('portal-trigger');
  const modal = document.getElementById('portal-modal');
  const closeBtn = document.getElementById('portal-close');
  const mongoStatus = document.getElementById('portal-mongo-status');
  const cloudStatus = document.getElementById('portal-cloud-status');

  const uploadForm = document.getElementById('cloudinary-upload-form');
  const uploadResult = document.getElementById('upload-result');
  const uploadBtn = document.getElementById('upload-btn');

  if (!trigger || !modal) return;

  const openPortal = async () => {
    modal.classList.add('active');
    try {
      const res = await fetch(apiUrl('/api/health'));
      const data = await res.json();
      if (data.database && data.database.connected) {
        mongoStatus.innerHTML = '<span style="color: #10b981;">● Active (Live MongoDB Atlas)</span>';
      } else {
        mongoStatus.innerHTML = '<span style="color: #f59e0b;">● Standby Mode</span>';
      }

      if (data.imageStorage && data.imageStorage.configured) {
        cloudStatus.innerHTML = `<span style="color: #10b981;">● Connected Cloudinary (${data.imageStorage.cloudName})</span>`;
      } else {
        cloudStatus.innerHTML = '<span style="color: #94a3b8;">● Cloudinary Pending</span>';
      }
    } catch (err) {
      mongoStatus.textContent = 'Status check unavailable';
    }
  };

  const closePortal = () => modal.classList.remove('active');

  trigger.addEventListener('click', openPortal);
  if (closeBtn) closeBtn.addEventListener('click', closePortal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePortal();
  });

  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('upload-file');
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please choose an image file.');
        return;
      }

      const formData = new FormData();
      formData.append('image', fileInput.files[0]);
      formData.append('title', document.getElementById('upload-title').value || 'Executive Asset');

      uploadBtn.textContent = 'Uploading to Cloudinary...';
      uploadBtn.disabled = true;

      try {
        const res = await fetch(apiUrl('/api/upload/cloudinary'), {
          method: 'POST',
          body: formData
        });
        const result = await res.json();

        if (res.ok && result.success) {
          uploadResult.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 12px; border-radius: 8px; font-size: 13px;">
              <strong style="color: #10b981;">Cloudinary CDN Uploaded:</strong>
              <br><a href="${result.data.url}" target="_blank" style="color: #38bdf8; text-decoration: underline;">View Live Cloud Asset ↗</a>
            </div>
          `;
          // Refresh gallery in background
          loadDynamicMedia();
        } else {
          uploadResult.innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 12px; border-radius: 8px; font-size: 13px;">
              <strong style="color: #ef4444;">Upload Error:</strong>
              <p style="margin-top: 4px; color: #94a3b8;">${result.error || 'Failed to upload image'}</p>
            </div>
          `;
        }
      } catch (err) {
        uploadResult.innerHTML = `<p style="color: #ef4444; font-size: 13px;">Network error: ${err.message}</p>`;
      } finally {
        uploadBtn.textContent = 'Upload to Cloudinary CDN ↗';
        uploadBtn.disabled = false;
      }
    });
  }
}

// 12. Mobile Navigation Drawer Controller
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const navItems = document.querySelectorAll('.mobile-nav-item, #mobile-drawer-cta');

  if (!menuBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  navItems.forEach(item => {
    item.addEventListener('click', closeDrawer);
  });
}

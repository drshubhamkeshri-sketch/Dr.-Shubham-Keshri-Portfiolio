/**
 * DR. SHUBHAM KESHRI — ULTRA-LUXURY INTERACTIVE PORTFOLIO ENGINE
 * Dynamic Dual-Theme (Dark/Light) + Device Auto-Detection + Rich Motion & Animation System
 */

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
});

// 1. Dynamic Theme Engine (Device Auto-Detection + Manual Button Switch)
let currentTheme = 'dark';
let onThemeChangeCallback = null;

function initThemeEngine() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Determine initial theme based on user choice or device OS settings
  if (storedTheme) {
    currentTheme = storedTheme;
  } else if (systemPrefersDark.matches) {
    currentTheme = 'dark';
  } else {
    currentTheme = 'light';
  }

  applyTheme(currentTheme);

  // Listen for device system OS theme changes (if user hasn't manually set preference)
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
    }
  });

  // Manual Toggle Button
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

  // 4 Organic Luminous Aurora Light Waves
  const auroraBands = [
    { freq: 0.0016, amp: 95, speed: 0.50, phase: 0.0, colorDark: [245, 158, 11], colorLight: [217, 119, 6], baseOffset: 0.28, opacity: 0.24 },
    { freq: 0.0022, amp: 115, speed: 0.70, phase: 2.1, colorDark: [6, 182, 212], colorLight: [2, 132, 199], baseOffset: 0.42, opacity: 0.28 },
    { freq: 0.0014, amp: 105, speed: 0.40, phase: 3.6, colorDark: [99, 102, 241], colorLight: [79, 70, 229], baseOffset: 0.58, opacity: 0.22 },
    { freq: 0.0025, amp: 85, speed: 0.80, phase: 5.0, colorDark: [16, 185, 129], colorLight: [5, 150, 105], baseOffset: 0.72, opacity: 0.18 }
  ];

  function renderAuroraMesh() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse inertia
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

    // 1. Render Multi-Chromatic Fluid Aurora Waves Across Viewport
    ctx.globalCompositeOperation = isDark ? 'screen' : 'source-over';

    const scrollPhase = (scrollY * 0.0008);

    auroraBands.forEach((band, index) => {
      const baseY = height * band.baseOffset;
      const points = [];
      const step = 20;

      for (let x = -60; x <= width + 60; x += step) {
        // Multi-frequency organic undulating harmonic curves + scroll parallax
        const wave1 = Math.sin(x * band.freq + time * band.speed + band.phase + scrollPhase) * band.amp;
        const wave2 = Math.cos(x * (band.freq * 1.7) - time * (band.speed * 0.6) + index) * (band.amp * 0.45);
        const wave3 = Math.sin(x * 0.0008 + time * 0.2) * 20;

        // Fluid organic cursor deflection
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

      // Draw flowing silk curtain fill with vertical radiant gradient
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

    // 2. Interactive Ambient Studio Spotlight (Glides with Cursor Across Any Section)
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

    // 3. Focal Ambient Keylight (Subtle ambient depth)
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

  onThemeChangeCallback = () => {
    // Redraws smoothly on theme switch
  };
}

// 4. 3D Card Hover Tilt Effect (Interactive Depth on Cards)
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
    btn.addEventListener('click', () => {
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
    });
  });

  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal) return;

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-card-title');
      const tag = card.querySelector('.gallery-card-tag');

      if (img && modalImg) {
        modalImg.src = img.src;
        modalCaption.textContent = title ? `${tag ? tag.textContent + ' — ' : ''}${title.textContent}` : '';
        modal.classList.add('active');
      }
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
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
      const res = await fetch('/api/contact', {
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
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.database && data.database.connected) {
        mongoStatus.innerHTML = '<span style="color: #10b981;">● Active (Live MongoDB)</span>';
      } else {
        mongoStatus.innerHTML = '<span style="color: #f59e0b;">● Standby (Resilient Storage Mode)</span>';
      }

      if (data.imageStorage && data.imageStorage.configured) {
        cloudStatus.innerHTML = `<span style="color: #10b981;">● Connected (${data.imageStorage.cloudName})</span>`;
      } else {
        cloudStatus.innerHTML = '<span style="color: #94a3b8;">● Local CDN Mode (Keys in .env)</span>';
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
        const res = await fetch('/api/upload/cloudinary', {
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
        } else {
          uploadResult.innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 12px; border-radius: 8px; font-size: 13px;">
              <strong style="color: #ef4444;">Cloudinary Notice:</strong>
              <p style="margin-top: 4px; color: #94a3b8;">${result.error || result.help || 'Add Cloudinary keys to .env'}</p>
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

(function () {
  'use strict';

  /**
   * DR. SHUBHAM KESHRI — 3D EXECUTIVE CADASTRE OS WORKSTATION
   * High-Precision Realistic Enterprise GIS Platform Showcase
   * Powered by Real 4K Photorealistic Satellite Orthomosaics,
   * LIFT Fiscal Valuation Heatmaps, Interactive Sovereign Deed Ledger,
   * and 3D Perspective Glass Tilt Physics.
   */

  const PARCEL_DATABASE = {
    '105': {
      id: 'CALI-CAD-DL-CP105',
      lot: 'LOT DL-CP-105',
      name: 'CALI AI Deep-Tech HQ (Director Suite & Patent Core)',
      entity: 'CALI AI Private Limited (DPIIT Reg)',
      area: '1,250 sq. m (14 Boundary Vertices)',
      valuation: 'SDG 11.3 Class A+ (High Efficiency)',
      hash: '0x8F4A19B3E298F432C1A7789D42E098F432C1A7C1',
      status: 'Topological Validation: 100% (0 Overlaps)',
      coords: '28°37\'58.2"N 77°13\'08.4"E'
    },
    '101': {
      id: 'CALI-CAD-DL-CP101',
      lot: 'LOT DL-CP-101',
      name: 'Central Circle Commercial Arc',
      entity: 'Survey of India Urban Cadastre',
      area: '850 sq. m (8 Boundary Vertices)',
      valuation: 'SDG 11.3 Class A (Commercial Node)',
      hash: '0x3C9D71A8E401B276901844D1095C21B784A19B3E',
      status: 'Topology Validated &bull; WGS 84 Reference',
      coords: '28°38\'04.1"N 77°13\'02.8"E'
    },
    '102': {
      id: 'CALI-CAD-DL-CP102',
      lot: 'LOT DL-CP-102',
      name: 'Barakhamba Financial Corridor',
      entity: 'High-Density Urban Cadastre Node',
      area: '620 sq. m (12 Boundary Vertices)',
      valuation: 'SDG 11.3 Class A- (High Density Transit)',
      hash: '0x7184A19B3E298F432C1A7789D42E098F401B2769',
      status: 'Multi-Spectral Synced &bull; Closed Ring Polygon',
      coords: '28°37\'49.6"N 77°13\'16.2"E'
    }
  };

  let currentLayer = 'satellite';
  let currentZoom = 1.0;
  let isRadarActive = true;
  let activeParcelId = '105';

  function init3DGlobe() {
    const workstation = document.getElementById('cadastre-workstation');
    const tiltElement = document.getElementById('workstation-tilt-element');
    const glareElement = document.getElementById('workstation-glare');

    if (!workstation || !tiltElement) return;

    // 1. Tactile 3D Perspective Glass Tilt on Mouse Movement
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isHovering = false;

    workstation.addEventListener('mousemove', (e) => {
      const rect = workstation.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle, realistic perspective angle (max 5 degrees)
      targetRotY = ((x - centerX) / centerX) * 4.5;
      targetRotX = -((y - centerY) / centerY) * 4.0;
      isHovering = true;

      // Specular Glass Glare hotspot tracking
      if (glareElement) {
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        glareElement.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.12) 0%, transparent 55%)`;
      }
    });

    workstation.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
      isHovering = false;
      if (glareElement) {
        glareElement.style.background = 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)';
      }
    });

    // Smooth animation loop for 3D spring tilt physics
    function tiltPhysicsLoop() {
      currentRotX += (targetRotX - currentRotX) * 0.1;
      currentRotY += (targetRotY - currentRotY) * 0.1;

      if (window.innerWidth > 1024) {
        tiltElement.style.transform = `perspective(1400px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(${isHovering ? 1.01 : 1.0}, ${isHovering ? 1.01 : 1.0}, 1.0)`;
      } else {
        tiltElement.style.transform = 'none';
      }

      requestAnimationFrame(tiltPhysicsLoop);
    }
    tiltPhysicsLoop();

    // 2. Layer Switching Engine
    setupLayerSwitchers();

    // 3. Interactive Parcel Pins & Deed Modal
    setupParcelInteractivity();

    // 4. In-Viewport HUD Navigation Tools
    setupViewportHUDTools();

    // 5. Hardware Status & Real-Time Telemetry Clocks
    startTelemetryEngine();
  }

  // =========================================================================
  // LAYER SWITCHING ENGINE
  // =========================================================================

  function switchLayer(layerKey) {
    currentLayer = layerKey;
    const imgSatellite = document.getElementById('img-layer-satellite');
    const imgFiscal = document.getElementById('img-layer-fiscal');
    const modeLabel = document.getElementById('hud-active-mode-label');
    const deckStatusText = document.getElementById('deck-status-text');

    // Update Left Sidebar Layer Buttons
    document.querySelectorAll('.layer-toggle-row').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-layer') === layerKey);
    });

    // Update Bottom Deck Buttons
    const btnDeckSat = document.getElementById('btn-deck-satellite');
    const btnDeckCad = document.getElementById('btn-deck-cadastral');
    const btnDeckFis = document.getElementById('btn-deck-fiscal');

    if (btnDeckSat) btnDeckSat.classList.toggle('active', layerKey === 'satellite');
    if (btnDeckCad) btnDeckCad.classList.toggle('active', layerKey === 'cadastral');
    if (btnDeckFis) btnDeckFis.classList.toggle('active', layerKey === 'fiscal');

    if (layerKey === 'fiscal') {
      if (imgSatellite) imgSatellite.classList.remove('visible');
      if (imgFiscal) imgFiscal.classList.add('visible');
      if (modeLabel) modeLabel.textContent = 'MODE: SDG 11.3 ECOLOGICAL MATRIX';
      if (deckStatusText) {
        deckStatusText.innerHTML = 'Dr. Shubham Keshri Ph.D. Framework &bull; SDG 11.3 Land Consumption Ratio &bull; Sustainable Urban Topology';
      }
      appendTerminalLog('SDG 11.3 ECOLOGICAL LAND CONSUMPTION MODEL ENGAGED', 'gold');
    } else if (layerKey === 'cadastral') {
      if (imgSatellite) imgSatellite.classList.add('visible');
      if (imgFiscal) imgFiscal.classList.remove('visible');
      if (modeLabel) modeLabel.textContent = 'MODE: CADASTRAL VECTOR LOTS (DL-CP)';
      if (deckStatusText) {
        deckStatusText.innerHTML = 'Survey of India Vector Boundaries &bull; Lot DL-CP-105 HQ Focal Lock &bull; Topological Validation';
      }
      openDeedInspector('105');
      appendTerminalLog('CADASTRAL BOUNDARY VECTORS HIGHLIGHTED [1,800 LOTS]', 'green');
    } else {
      // satellite
      if (imgSatellite) imgSatellite.classList.add('visible');
      if (imgFiscal) imgFiscal.classList.remove('visible');
      if (modeLabel) modeLabel.textContent = 'MODE: MULTI-SPECTRAL ORTHOMOSAIC (0.05m GSD)';
      if (deckStatusText) {
        deckStatusText.innerHTML = 'Dr. Shubham Keshri Proprietary Cadastral OS &bull; 1,800 Land Parcels Synchronized &bull; Sentinel-2 High-Res Orthomosaic';
      }
      appendTerminalLog('SENTINEL-2 MULTI-SPECTRAL ORTHOMOSAIC STREAMING', 'green');
    }
  }

  function setupLayerSwitchers() {
    // Left Rail Buttons
    const btnSat = document.getElementById('btn-layer-satellite');
    const btnCad = document.getElementById('btn-layer-cadastral');
    const btnFis = document.getElementById('btn-layer-fiscal');

    if (btnSat) btnSat.addEventListener('click', () => switchLayer('satellite'));
    if (btnCad) btnCad.addEventListener('click', () => switchLayer('cadastral'));
    if (btnFis) btnFis.addEventListener('click', () => switchLayer('fiscal'));

    // Bottom Outer Deck Buttons
    const btnDeckSat = document.getElementById('btn-deck-satellite');
    const btnDeckCad = document.getElementById('btn-deck-cadastral');
    const btnDeckFis = document.getElementById('btn-deck-fiscal');
    const btnDeckInsp = document.getElementById('btn-deck-inspect');

    if (btnDeckSat) btnDeckSat.addEventListener('click', () => switchLayer('satellite'));
    if (btnDeckCad) btnDeckCad.addEventListener('click', () => switchLayer('cadastral'));
    if (btnDeckFis) btnDeckFis.addEventListener('click', () => switchLayer('fiscal'));
    if (btnDeckInsp) btnDeckInsp.addEventListener('click', () => toggleDeedInspector());
  }

  // =========================================================================
  // PARCEL REGISTRY & SOVEREIGN DEED INSPECTOR
  // =========================================================================

  function openDeedInspector(parcelId) {
    const data = PARCEL_DATABASE[parcelId];
    if (!data) return;

    activeParcelId = parcelId;

    // Update active highlight in left ledger
    document.querySelectorAll('.parcel-ledger-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-parcel') === parcelId);
    });

    const deedModal = document.getElementById('deed-modal');
    if (!deedModal) return;

    const elId = document.getElementById('deed-id-val');
    const elEntity = document.getElementById('deed-entity-val');
    const elArea = document.getElementById('deed-area-val');
    const elVal = document.getElementById('deed-val-val');
    const elHash = document.getElementById('deed-hash-val');

    if (elId) elId.textContent = data.id;
    if (elEntity) elEntity.textContent = data.entity;
    if (elArea) elArea.textContent = data.area;
    if (elVal) elVal.textContent = data.valuation;
    if (elHash) elHash.textContent = data.hash;

    deedModal.classList.remove('hidden');

    appendTerminalLog(`PARCEL RECORD ${data.lot} ACCESSED &bull; TITLE VERIFIED`, 'gold');
  }

  function toggleDeedInspector() {
    const deedModal = document.getElementById('deed-modal');
    if (!deedModal) return;
    if (deedModal.classList.contains('hidden')) {
      openDeedInspector(activeParcelId);
    } else {
      deedModal.classList.add('hidden');
    }
  }

  function setupParcelInteractivity() {
    // Left sidebar parcel items
    document.querySelectorAll('.parcel-ledger-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-parcel');
        if (id) openDeedInspector(id);
      });
    });

    // Map Interactive Pins
    const pin105 = document.getElementById('pin-lot-105');
    const pin101 = document.getElementById('pin-lot-101');
    const pin102 = document.getElementById('pin-lot-102');

    if (pin105) pin105.addEventListener('click', () => openDeedInspector('105'));
    if (pin101) pin101.addEventListener('click', () => openDeedInspector('101'));
    if (pin102) pin102.addEventListener('click', () => openDeedInspector('102'));

    // Close Deed Modal Button
    const btnClose = document.getElementById('btn-close-deed');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        const deedModal = document.getElementById('deed-modal');
        if (deedModal) deedModal.classList.add('hidden');
      });
    }

    // Verify Hash Action Button
    const btnVerify = document.getElementById('btn-action-verify');
    if (btnVerify) {
      btnVerify.addEventListener('click', () => {
        btnVerify.textContent = '✓ TOPOLOGY VERIFIED';
        btnVerify.style.background = '#10b981';
        btnVerify.style.color = '#ffffff';
        appendTerminalLog('TOPOLOGICAL HASH VERIFIED: 0x8F4A19B3E298F432C1A7C1 [0 CONFLICTS]', 'green');
        setTimeout(() => {
          btnVerify.textContent = 'Verify Topology ↗';
          btnVerify.style.background = '';
          btnVerify.style.color = '';
        }, 3000);
      });
    }
  }

  // =========================================================================
  // VIEWPORT HUD CONTROLS (ZOOM, RADAR, RECENTER)
  // =========================================================================

  function applyZoom() {
    const images = document.querySelectorAll('.viewport-layer-image img');
    images.forEach(img => {
      img.style.transform = `scale(${currentZoom})`;
      img.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

  function setupViewportHUDTools() {
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnCenterHQ = document.getElementById('btn-center-hq');
    const btnToggleRadar = document.getElementById('btn-toggle-radar');
    const radar = document.getElementById('viewport-radar');

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        if (currentZoom < 1.4) {
          currentZoom += 0.15;
          applyZoom();
          appendTerminalLog(`VIEWPORT ZOOM LEVEL: ${(currentZoom * 100).toFixed(0)}%`, 'green');
        }
      });
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        if (currentZoom > 1.0) {
          currentZoom -= 0.15;
          applyZoom();
          appendTerminalLog(`VIEWPORT ZOOM LEVEL: ${(currentZoom * 100).toFixed(0)}%`, 'green');
        }
      });
    }

    if (btnCenterHQ) {
      btnCenterHQ.addEventListener('click', () => {
        currentZoom = 1.0;
        applyZoom();
        openDeedInspector('105');
        appendTerminalLog('RECENTERED ON LOT DL-CP-105 (DIRECTOR HQ CORE)', 'gold');
      });
    }

    if (btnToggleRadar && radar) {
      btnToggleRadar.addEventListener('click', () => {
        isRadarActive = !isRadarActive;
        radar.style.display = isRadarActive ? 'block' : 'none';
        btnToggleRadar.textContent = isRadarActive ? '📡 Radar' : 'Radar Off';
        appendTerminalLog(`RADAR SWEEP TELEMETRY: ${isRadarActive ? 'ENABLED' : 'PAUSED'}`);
      });
    }
  }

  // =========================================================================
  // LIVE TELEMETRY ENGINE (CLOCK, GPS, TERMINAL LOGS)
  // =========================================================================

  function startTelemetryEngine() {
    const timeEl = document.getElementById('hw-time-ticker');
    const gpsEl = document.getElementById('hw-gps-ticker');

    function updateClocks() {
      const now = new Date();
      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
      }

      // Micro jitter in GPS reading (sub-millimeter RTK drift simulation)
      if (gpsEl) {
        const jitterLat = (Math.random() * 0.0004 - 0.0002).toFixed(4);
        const jitterLng = (Math.random() * 0.0004 - 0.0002).toFixed(4);
        gpsEl.textContent = `GPS: 28°37'58.${Math.floor(20 + Math.random() * 5)}"N 77°13'08.${Math.floor(40 + Math.random() * 5)}"E | GSD: 0.05m`;
      }
    }
    setInterval(updateClocks, 1000);
    updateClocks();

    // Stream occasional realistic telemetry messages into terminal log
    const periodicLogs = [
      { text: 'SENTINEL-2 TILES SYNCHRONIZED WITH UAV LIDAR', type: 'green' },
      { text: 'CALI AI CADASTRAL PARTITION COMPLETED [DL-CP-105]', type: 'gold' },
      { text: 'SDG 11.3 SUSTAINABILITY INDEX RE-EVALUATED: 0.94 OPTIMAL', type: 'green' },
      { text: 'TOPOLOGICAL BLOCKCHAIN HASH CONFIRMED ON LEDGER', type: 'gold' },
      { text: 'THERMAL SPECTRAL REFLECTANCE: 94.2% OPTIMAL', type: '' }
    ];

    let logIndex = 0;
    setInterval(() => {
      const item = periodicLogs[logIndex % periodicLogs.length];
      logIndex++;
      appendTerminalLog(item.text, item.type);
    }, 9000);
  }

  function appendTerminalLog(text, typeClass) {
    const container = document.getElementById('terminal-log-lines');
    if (!container) return;

    const line = document.createElement('div');
    line.className = 'log-line' + (typeClass ? ' ' + typeClass : '');
    line.textContent = `> ${text}`;

    container.appendChild(line);

    // Keep max 5 lines
    while (container.children.length > 5) {
      container.removeChild(container.firstChild);
    }
  }

  // Theme update handler hook (compatible with main.js)
  function update3DGlobeTheme(theme) {
    // Styling seamlessly driven by CSS [data-theme="light"]
    appendTerminalLog(`SYSTEM THEME UPDATED: ${theme.toUpperCase()} MODE`, 'gold');
  }

  // Export functions to global scope
  window.init3DGlobe = init3DGlobe;
  window.update3DGlobeTheme = update3DGlobeTheme;

  // Auto-init if DOM is already ready
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init3DGlobe();
  } else {
    document.addEventListener('DOMContentLoaded', init3DGlobe);
  }
})();

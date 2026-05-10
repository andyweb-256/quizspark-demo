/* ============================================================
   QuizSpark — js/themes.js
   Handles all per-niche theming:
   - Sets data-theme on <html>
   - Injects the niche CSS file dynamically
   - Swaps background SVG layers
   - Initialises the particle canvas via Particles.init()
   - Lazy-loads the correct question file via <script> injection
   - Manages the niche splash screen
   ============================================================ */

const Themes = (function () {

  /* ── State ───────────────────────────────────────────────── */
  let currentNiche      = null;
  let loadedQuestions   = {};   // { nicheKey: true } — loaded once, cached
  let loadedStylesheets = {};   // { nicheKey: true } — injected once, cached
  let onReadyCallback   = null; // called after question file confirms loaded

  /* ── Niche metadata (mirrors TAXONOMY but flat for quick lookup) */
  const NICHE_META = {
    sci  : { label: 'Science & Technology', icon: '⚗️', color: '#60b8ff' },
    hist : { label: 'History',              icon: '📜', color: '#fb923c' },
    geo  : { label: 'Geography',            icon: '🌍', color: '#34d399' },
    pop  : { label: 'Pop Culture',          icon: '🎬', color: '#f472b6' },
    spo  : { label: 'Sports',               icon: '⚽', color: '#378ADD' },
    art  : { label: 'Arts & Literature',    icon: '🎭', color: '#a78bfa' },
    nat  : { label: 'Food & Nature',        icon: '🌿', color: '#f97316' },
    lang : { label: 'Language & Words',     icon: '💬', color: '#94a3b8' },
  };

  /* ── Ensure background DOM structure exists ─────────────── */
  function ensureThemeBg() {
    if (document.getElementById('theme-bg')) return;
    const wrap = document.createElement('div');
    wrap.id        = 'theme-bg';
    wrap.className = 'theme-bg';
    wrap.innerHTML = `
      <div class="theme-bg__layer theme-bg__layer--1" id="theme-layer-1"></div>
      <div class="theme-bg__layer theme-bg__layer--2" id="theme-layer-2"></div>
      <div class="theme-bg__layer theme-bg__layer--3" id="theme-layer-3"></div>
    `;
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  /* ── Ensure particle canvas exists ──────────────────────── */
  function ensureParticleCanvas() {
    if (document.getElementById('particle-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.appendChild(canvas);
  }

  /* ── Load niche CSS dynamically (once per niche) ─────────── */
  function loadNicheCSS(nicheKey) {
    if (loadedStylesheets[nicheKey]) return;
    const link  = document.createElement('link');
    link.rel    = 'stylesheet';
    link.href   = `css/themes/${nicheKey}.css`;
    link.id     = `theme-css-${nicheKey}`;
    document.head.appendChild(link);
    loadedStylesheets[nicheKey] = true;
  }

  /* ── Set background layers ───────────────────────────────── */
  function setBackgroundLayers(nicheKey) {
    const base = `assets/themes/${nicheKey}`;
    const l1   = document.getElementById('theme-layer-1');
    const l2   = document.getElementById('theme-layer-2');
    const l3   = document.getElementById('theme-layer-3');
    if (!l1) return;

    // Fade out before swap
    [l1, l2, l3].forEach(el => { if (el) el.style.opacity = '0'; });

    setTimeout(() => {
      if (l1) l1.style.backgroundImage = `url('${base}/bg-layer1.svg')`;
      if (l2) l2.style.backgroundImage = `url('${base}/bg-layer2.svg')`;
      if (l3) l3.style.backgroundImage = `url('${base}/bg-layer3.svg')`;

      // Restore layer opacities from CSS defaults
      if (l1) l1.style.opacity = '1';
      if (l2) l2.style.opacity = '0.6';
      if (l3) l3.style.opacity = '0.35';
    }, 300);
  }

  /* ── Parallax on mouse move ──────────────────────────────── */
  function initParallax() {
    window.addEventListener('mousemove', function (e) {
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;

      const l2 = document.getElementById('theme-layer-2');
      const l3 = document.getElementById('theme-layer-3');

      if (l2) l2.style.transform = `translate(${xPct * 8}px, ${yPct * 8}px)`;
      if (l3) l3.style.transform = `translate(${xPct * 16}px, ${yPct * 16}px)`;
    });
  }

  /* ── Lazy-load question file ─────────────────────────────── */
  function loadQuestions(nicheKey, callback) {
    if (loadedQuestions[nicheKey]) {
      if (callback) callback();
      return;
    }

    const script    = document.createElement('script');
    script.src      = `questions/${nicheKey}.js`;
    script.onload   = function () {
      loadedQuestions[nicheKey] = true;
      if (callback) callback();
    };
    script.onerror  = function () {
      console.error(`QuizSpark: Failed to load questions/${nicheKey}.js`);
    };
    document.head.appendChild(script);
  }

  /* ── Show niche splash screen ────────────────────────────── */
  function showSplash(nicheKey, onDone) {
    const meta = NICHE_META[nicheKey];
    if (!meta) { if (onDone) onDone(); return; }

    // Remove any existing splash
    const existing = document.getElementById('niche-splash');
    if (existing) existing.remove();

    const splash       = document.createElement('div');
    splash.id          = 'niche-splash';
    splash.className   = 'splash';
    splash.innerHTML   = `
      <div class="splash__icon">${meta.icon}</div>
      <div class="splash__title" style="color:${meta.color}">${meta.label}</div>
      <div class="splash__sub">Loading your questions...</div>
    `;
    document.body.appendChild(splash);

    // Auto-dismiss after 1.8s (matches CSS animation)
    setTimeout(() => {
      splash.addEventListener('animationend', () => {
        splash.remove();
        if (onDone) onDone();
      }, { once: true });
    }, 1800);
  }

  /* ── Hide splash immediately (e.g. on back navigation) ───── */
  function hideSplash() {
    const splash = document.getElementById('niche-splash');
    if (splash) splash.remove();
  }

  /* ── Apply theme to <html> data-theme ────────────────────── */
  function applyDataTheme(nicheKey) {
    document.documentElement.setAttribute('data-theme', nicheKey);
  }

  /* ── Update nav logo accent ──────────────────────────────── */
  function updateNavAccent(nicheKey) {
    const meta   = NICHE_META[nicheKey];
    const logo   = document.querySelector('.nav__logo span');
    if (logo && meta) logo.style.color = meta.color;
  }

  /* ── Public: apply(nicheKey, options) ────────────────────── */
  /**
   * Switches the full visual theme to the given niche.
   * Loads CSS, swaps backgrounds, starts particles,
   * lazy-loads the question file, and shows the splash.
   *
   * @param {string}   nicheKey  - e.g. 'sci', 'hist' ...
   * @param {object}   options
   *   @param {boolean} options.splash   - show splash screen (default true)
   *   @param {boolean} options.particles- start particles (default true)
   *   @param {function}options.onReady  - called after questions loaded
   */
  function apply(nicheKey, options) {
    if (!NICHE_META[nicheKey]) {
      console.warn(`QuizSpark Themes: unknown niche "${nicheKey}"`);
      return;
    }

    const opts = Object.assign({
      splash   : true,
      particles: true,
      onReady  : null,
    }, options);

    currentNiche = nicheKey;

    // 1. Set data-theme on <html>
    applyDataTheme(nicheKey);

    // 2. Load niche CSS
    loadNicheCSS(nicheKey);

    // 3. Ensure DOM structure
    ensureThemeBg();
    ensureParticleCanvas();

    // 4. Swap background layers
    setBackgroundLayers(nicheKey);

    // 5. Start / switch particles
    if (opts.particles && typeof Particles !== 'undefined') {
      Particles.init(nicheKey);
    }

    // 6. Update nav accent
    updateNavAccent(nicheKey);

    // 7. Lazy-load question file
    loadQuestions(nicheKey, function () {
      // Questions ready — fire onReady callback
      if (opts.onReady) opts.onReady();
    });

    // 8. Show splash (runs parallel to question load)
    if (opts.splash) {
      showSplash(nicheKey, null);
    }
  }

  /* ── Public: reset() ─────────────────────────────────────── */
  /**
   * Resets to the default (no-niche) state.
   * Removes data-theme, stops particles, clears backgrounds.
   */
  function reset() {
    currentNiche = null;
    document.documentElement.removeAttribute('data-theme');

    const l1 = document.getElementById('theme-layer-1');
    const l2 = document.getElementById('theme-layer-2');
    const l3 = document.getElementById('theme-layer-3');
    [l1, l2, l3].forEach(el => {
      if (el) {
        el.style.backgroundImage = 'none';
        el.style.opacity         = '0';
      }
    });

    if (typeof Particles !== 'undefined') Particles.stop();
    hideSplash();
  }

  /* ── Public: getCurrent() ────────────────────────────────── */
  function getCurrent() { return currentNiche; }

  /* ── Public: getMeta(nicheKey) ───────────────────────────── */
  function getMeta(nicheKey) { return NICHE_META[nicheKey] || null; }

  /* ── Public: isLoaded(nicheKey) ──────────────────────────── */
  function isLoaded(nicheKey) { return !!loadedQuestions[nicheKey]; }

  /* ── Init parallax on DOM ready ──────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }

  return { apply, reset, getCurrent, getMeta, isLoaded, showSplash, hideSplash };

})();

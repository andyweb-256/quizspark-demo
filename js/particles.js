/* ============================================================
   QuizSpark — js/particles.js
   Canvas-based particle engine. Reusable and configurable.
   Each niche passes a preset config object to customise the
   particle behaviour. Driven by requestAnimationFrame.
   ============================================================ */

const Particles = (function () {

  /* ── Internal state ─────────────────────────────────────── */
  let canvas, ctx, W, H;
  let particles   = [];
  let animFrameId = null;
  let config      = {};
  let isRunning   = false;
  let mouseX      = 0;
  let mouseY      = 0;

  /* ── Default config (overridden per niche preset) ────────── */
  const DEFAULTS = {
    count        : 60,          // number of particles
    colors       : ['#60b8ff'], // array of hex colors
    minSize      : 1,           // minimum particle radius (px)
    maxSize      : 3,           // maximum particle radius (px)
    minSpeed     : 0.1,         // minimum movement speed
    maxSpeed     : 0.4,         // maximum movement speed
    minOpacity   : 0.1,         // minimum alpha
    maxOpacity   : 0.5,         // maximum alpha
    fadeSpeed    : 0.003,       // opacity change per frame
    direction    : 'omni',      // 'omni' | 'up' | 'right' | 'horizontal'
    drift        : 0.02,        // random drift factor
    glow         : false,       // apply shadow glow
    glowBlur     : 8,           // shadow blur radius
    connectLines : false,       // draw lines between nearby particles
    connectDist  : 120,         // max distance for connection lines
    mouseRepel   : false,       // particles repel from mouse
    repelRadius  : 100,         // repel radius in px
    repelStrength: 0.5,         // repel force multiplier
    shape        : 'circle',    // 'circle' | 'dot' | 'ring'
    pulse        : false,       // particles grow/shrink over time
    pulseSpeed   : 0.02,        // pulse oscillation speed
  };

  /* ── Niche presets ───────────────────────────────────────── */
  const PRESETS = {

    sci: {
      count       : 70,
      colors      : ['#60b8ff', '#a78bfa', '#34d399'],
      minSize     : 1,
      maxSize     : 2.5,
      minSpeed    : 0.08,
      maxSpeed    : 0.3,
      minOpacity  : 0.08,
      maxOpacity  : 0.45,
      direction   : 'omni',
      glow        : true,
      glowBlur    : 10,
      connectLines: true,
      connectDist : 100,
      mouseRepel  : true,
      repelRadius : 80,
      pulse       : true,
      pulseSpeed  : 0.015,
      // Floating atoms feel — slow drift, connection lines suggest molecular bonds
    },

    hist: {
      count       : 45,
      colors      : ['#fb923c', '#fbbf24', '#f97316'],
      minSize     : 1,
      maxSize     : 2,
      minSpeed    : 0.05,
      maxSpeed    : 0.2,
      minOpacity  : 0.06,
      maxOpacity  : 0.35,
      direction   : 'omni',
      drift       : 0.03,
      glow        : true,
      glowBlur    : 12,
      connectLines: false,
      mouseRepel  : false,
      pulse       : false,
      // Dust motes and embers — sparse, warm, drifting slowly
    },

    geo: {
      count       : 55,
      colors      : ['#34d399', '#60b8ff', '#059669'],
      minSize     : 1,
      maxSize     : 2,
      minSpeed    : 0.15,
      maxSpeed    : 0.35,
      minOpacity  : 0.08,
      maxOpacity  : 0.4,
      direction   : 'horizontal',
      drift       : 0.025,
      glow        : false,
      connectLines: true,
      connectDist : 90,
      mouseRepel  : false,
      pulse       : false,
      // Drifting cloud wisps — gentle horizontal motion
    },

    pop: {
      count       : 90,
      colors      : ['#f472b6', '#a78bfa', '#fbbf24', '#60b8ff'],
      minSize     : 1,
      maxSize     : 3,
      minSpeed    : 0.2,
      maxSpeed    : 0.6,
      minOpacity  : 0.1,
      maxOpacity  : 0.55,
      fadeSpeed   : 0.005,
      direction   : 'omni',
      drift       : 0.04,
      glow        : true,
      glowBlur    : 14,
      connectLines: false,
      mouseRepel  : true,
      repelRadius : 60,
      repelStrength: 0.8,
      pulse       : true,
      pulseSpeed  : 0.03,
      // Neon confetti sparks — high density, fast, colourful burst
    },

    spo: {
      count       : 65,
      colors      : ['#378ADD', '#60b8ff', '#ffffff'],
      minSize     : 1,
      maxSize     : 2.5,
      minSpeed    : 0.3,
      maxSpeed    : 0.7,
      minOpacity  : 0.07,
      maxOpacity  : 0.4,
      direction   : 'right',
      drift       : 0.01,
      glow        : true,
      glowBlur    : 8,
      connectLines: false,
      mouseRepel  : false,
      pulse       : false,
      shape       : 'dot',
      // Speed light trails — fast rightward streaks
    },

    art: {
      count       : 50,
      colors      : ['#a78bfa', '#c4b5fd', '#f472b6'],
      minSize     : 1,
      maxSize     : 2.5,
      minSpeed    : 0.06,
      maxSpeed    : 0.22,
      minOpacity  : 0.07,
      maxOpacity  : 0.4,
      direction   : 'omni',
      drift       : 0.035,
      glow        : true,
      glowBlur    : 16,
      connectLines: false,
      mouseRepel  : false,
      pulse       : true,
      pulseSpeed  : 0.01,
      shape       : 'ring',
      // Ink drop wisps — slow, swirling, lavender/rose
    },

    nat: {
      count       : 60,
      colors      : ['#4ade80', '#f97316', '#fbbf24'],
      minSize     : 1,
      maxSize     : 2,
      minSpeed    : 0.08,
      maxSpeed    : 0.28,
      minOpacity  : 0.08,
      maxOpacity  : 0.45,
      direction   : 'up',
      drift       : 0.04,
      glow        : true,
      glowBlur    : 10,
      connectLines: false,
      mouseRepel  : false,
      pulse       : true,
      pulseSpeed  : 0.02,
      // Floating pollen/spores — gentle upward drift, bioluminescent glow
    },

    lang: {
      count       : 40,
      colors      : ['#94a3b8', '#cbd5e1', '#60b8ff'],
      minSize     : 1,
      maxSize     : 2,
      minSpeed    : 0.05,
      maxSpeed    : 0.18,
      minOpacity  : 0.06,
      maxOpacity  : 0.35,
      direction   : 'omni',
      drift       : 0.02,
      glow        : false,
      connectLines: false,
      mouseRepel  : false,
      pulse       : false,
      // Floating letter fragments — silver/white, slow typewriter drift
    },

  };

  /* ── Particle class ──────────────────────────────────────── */
  function createParticle() {
    const color   = config.colors[Math.floor(Math.random() * config.colors.length)];
    const size    = config.minSize + Math.random() * (config.maxSize - config.minSize);
    const opacity = config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity);
    const speed   = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);

    // Direction vector
    let vx = 0, vy = 0;
    switch (config.direction) {
      case 'up':
        vx = (Math.random() - 0.5) * speed * 0.5;
        vy = -speed;
        break;
      case 'right':
        vx = speed;
        vy = (Math.random() - 0.5) * speed * 0.3;
        break;
      case 'horizontal':
        vx = (Math.random() > 0.5 ? 1 : -1) * speed;
        vy = (Math.random() - 0.5) * speed * 0.2;
        break;
      default: // omni
        const angle = Math.random() * Math.PI * 2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
    }

    return {
      x         : Math.random() * W,
      y         : Math.random() * H,
      vx,
      vy,
      size,
      baseSize  : size,
      color,
      opacity,
      baseOpacity: opacity,
      fadeDir   : Math.random() > 0.5 ? 1 : -1,
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }

  /* ── Hex to rgba ─────────────────────────────────────────── */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /* ── Draw a single particle ──────────────────────────────── */
  function drawParticle(p) {
    ctx.save();

    if (config.glow) {
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = config.glowBlur;
    }

    ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

    if (config.shape === 'ring') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.strokeStyle = p.color;
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    ctx.restore();
  }

  /* ── Draw connection lines ───────────────────────────────── */
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectDist) {
          const alpha = (1 - dist / config.connectDist) * 0.12;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = particles[i].color;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  /* ── Update particle position and state ─────────────────── */
  function updateParticle(p) {
    // Mouse repel
    if (config.mouseRepel) {
      const dx   = p.x - mouseX;
      const dy   = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < config.repelRadius && dist > 0) {
        const force = (1 - dist / config.repelRadius) * config.repelStrength;
        p.vx += (dx / dist) * force * 0.05;
        p.vy += (dy / dist) * force * 0.05;
      }
    }

    // Random drift
    p.vx += (Math.random() - 0.5) * config.drift;
    p.vy += (Math.random() - 0.5) * config.drift;

    // Clamp speed
    const speed    = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    const maxSpeed = config.maxSpeed * 1.5;
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed;
      p.vy = (p.vy / speed) * maxSpeed;
    }

    p.x += p.vx;
    p.y += p.vy;

    // Fade in/out
    p.opacity += config.fadeSpeed * p.fadeDir;
    if (p.opacity >= config.maxOpacity) {
      p.opacity = config.maxOpacity;
      p.fadeDir = -1;
    } else if (p.opacity <= config.minOpacity) {
      p.opacity = config.minOpacity;
      p.fadeDir = 1;
    }

    // Pulse size
    if (config.pulse) {
      p.pulsePhase += config.pulseSpeed;
      p.size = p.baseSize + Math.sin(p.pulsePhase) * (p.baseSize * 0.4);
    }

    // Wrap around edges
    const pad = p.size + 10;
    if (p.x < -pad) p.x = W + pad;
    if (p.x > W + pad) p.x = -pad;
    if (p.y < -pad) p.y = H + pad;
    if (p.y > H + pad) p.y = -pad;
  }

  /* ── Animation loop ──────────────────────────────────────── */
  function loop() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, W, H);

    if (config.connectLines) drawConnections();

    for (let i = 0; i < particles.length; i++) {
      updateParticle(particles[i]);
      drawParticle(particles[i]);
    }

    animFrameId = requestAnimationFrame(loop);
  }

  /* ── Resize handler ──────────────────────────────────────── */
  function onResize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Mouse tracker ───────────────────────────────────────── */
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  /* ── Public API ──────────────────────────────────────────── */

  /**
   * init(nicheKey)
   * Initialises the particle engine for the given niche.
   * Creates the canvas if it doesn't exist.
   * Replaces any existing animation.
   *
   * @param {string} nicheKey - e.g. 'sci', 'hist', 'geo' ...
   */
  function init(nicheKey) {
    // Merge preset with defaults
    const preset = PRESETS[nicheKey] || {};
    config = Object.assign({}, DEFAULTS, preset);

    // Get or create canvas
    canvas = document.getElementById('particle-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'particle-canvas';
      document.body.appendChild(canvas);
    }

    ctx = canvas.getContext('2d');
    W   = canvas.width  = window.innerWidth;
    H   = canvas.height = window.innerHeight;

    // Stop any existing loop
    stop();

    // Build particle pool
    particles = [];
    for (let i = 0; i < config.count; i++) {
      particles.push(createParticle());
    }

    // Event listeners
    window.removeEventListener('resize',    onResize);
    window.removeEventListener('mousemove', onMouseMove);
    window.addEventListener('resize',    onResize);
    if (config.mouseRepel) {
      window.addEventListener('mousemove', onMouseMove);
    }

    isRunning   = true;
    animFrameId = requestAnimationFrame(loop);
  }

  /**
   * stop()
   * Cancels the animation loop and clears the canvas.
   */
  function stop() {
    isRunning = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (ctx) ctx.clearRect(0, 0, W, H);
  }

  /**
   * pause() / resume()
   * Temporarily freeze/unfreeze without rebuilding particles.
   */
  function pause() {
    isRunning = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function resume() {
    if (!isRunning && canvas) {
      isRunning   = true;
      animFrameId = requestAnimationFrame(loop);
    }
  }

  /**
   * setPreset(nicheKey)
   * Switches to a different niche preset mid-session.
   * Fades out existing particles and rebuilds.
   */
  function setPreset(nicheKey) {
    init(nicheKey);
  }

  /**
   * getPresets()
   * Returns the list of available preset keys.
   */
  function getPresets() {
    return Object.keys(PRESETS);
  }

  return { init, stop, pause, resume, setPreset, getPresets };

})();

/* ============================================================
   QuizSpark — js/share.js
   Handles result sharing via:
   1. Web Share API (mobile/modern browsers)
   2. Clipboard copy fallback (desktop)
   3. Pre-built share text with score, niche, streak and URL

   Called from results.html after a session ends.
   ============================================================ */

const Share = (function () {

  /* ── Site config ─────────────────────────────────────────── */
  // Update SITE_URL to your live domain before deploying
  const SITE_URL = 'https://quizspark.com';

  /* ── Emoji score bar ─────────────────────────────────────── */
  /**
   * buildScoreBar(score, total)
   * Returns a string of green/red squares representing the score.
   * e.g. score=7, total=10 → "🟩🟩🟩🟩🟩🟩🟩🟥🟥🟥"
   */
  function buildScoreBar(score, total) {
    const correct = '🟩';
    const wrong   = '🟥';
    return correct.repeat(score) + wrong.repeat(total - score);
  }

  /* ── Difficulty label ────────────────────────────────────── */
  function diffLabel(difficulty) {
    const labels = {
      1: 'Cadet',
      2: 'Veteran',
      3: 'Elite',
      4: 'Mastermind',
      adaptive: 'Adaptive',
    };
    return labels[difficulty] || '';
  }

  /* ── Timer mode label ────────────────────────────────────── */
  function timerLabel(timerMode) {
    const labels = {
      chill       : '⏸ Chill',
      blitz       : '⚡ Blitz',
      sudden_death: '💀 Sudden Death',
    };
    return labels[timerMode] || '';
  }

  /* ── Format time ─────────────────────────────────────────── */
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  /* ── Build share text ────────────────────────────────────── */
  /**
   * buildShareText(data)
   * Constructs the full share message.
   *
   * @param {object} data
   *   niche       {string}  - niche key
   *   nicheName   {string}  - display label e.g. "Science & Technology"
   *   score       {number}
   *   total       {number}
   *   timeSec     {number}  - total session time in seconds
   *   difficulty  {number|'adaptive'}
   *   timerMode   {string}
   *   streak      {number}  - current streak count
   *   isDaily     {boolean}
   *
   * @returns {string} ready-to-share text
   */
  function buildShareText(data) {
    const scoreBar = buildScoreBar(data.score, data.total);
    const pct      = Math.round((data.score / data.total) * 100);
    const prefix   = data.isDaily ? '📅 QuizSpark Daily' : '⚡ QuizSpark';
    const streakLine = data.streak > 1
      ? `🔥 ${data.streak} day streak\n`
      : '';

    return (
      `${prefix} — ${data.nicheName}\n` +
      `\n` +
      `${scoreBar}\n` +
      `${data.score}/${data.total} correct (${pct}%)\n` +
      `⏱ ${formatTime(data.timeSec)} · ${diffLabel(data.difficulty)} · ${timerLabel(data.timerMode)}\n` +
      `${streakLine}` +
      `\n` +
      `${SITE_URL}`
    );
  }

  /* ── Build share title (for Web Share API) ───────────────── */
  function buildShareTitle(data) {
    const pct = Math.round((data.score / data.total) * 100);
    return `I scored ${data.score}/${data.total} (${pct}%) on QuizSpark!`;
  }

  /* ── Web Share API ───────────────────────────────────────── */
  /**
   * isWebShareSupported()
   * Returns true if the browser supports the Web Share API.
   */
  function isWebShareSupported() {
    return typeof navigator !== 'undefined' && !!navigator.share;
  }

  /* ── Clipboard copy ──────────────────────────────────────── */
  /**
   * copyToClipboard(text)
   * Copies text to clipboard. Returns a Promise<boolean>.
   */
  async function copyToClipboard(text) {
    // Modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        // Fall through to legacy method
      }
    }

    // Legacy execCommand fallback
    try {
      const ta = document.createElement('textarea');
      ta.value           = text;
      ta.style.position  = 'fixed';
      ta.style.opacity   = '0';
      ta.style.top       = '0';
      ta.style.left      = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      return success;
    } catch (e) {
      console.error('QuizSpark Share: clipboard copy failed', e);
      return false;
    }
  }

  /* ── Show toast notification ─────────────────────────────── */
  function showToast(message, duration) {
    duration = duration || 2500;
    let toast = document.getElementById('share-toast');

    if (!toast) {
      toast        = document.createElement('div');
      toast.id     = 'share-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /* ── Main share function ─────────────────────────────────── */
  /**
   * share(data, buttonEl)
   * Attempts Web Share API first, falls back to clipboard copy.
   * Shows a toast notification on success/failure.
   *
   * @param {object} data     - same shape as buildShareText()
   * @param {Element} buttonEl- the button that was clicked (for feedback)
   */
  async function share(data, buttonEl) {
    const text  = buildShareText(data);
    const title = buildShareTitle(data);

    if (isWebShareSupported()) {
      try {
        await navigator.share({ title, text, url: SITE_URL });
        // Web Share API doesn't confirm success — just animate button
        if (buttonEl) animateButton(buttonEl, '✓ Shared!');
        return { ok: true, method: 'webshare' };
      } catch (err) {
        if (err.name === 'AbortError') {
          // User cancelled — do nothing
          return { ok: false, method: 'webshare', cancelled: true };
        }
        // Fall through to clipboard
      }
    }

    // Clipboard fallback
    const copied = await copyToClipboard(text);
    if (copied) {
      showToast('📋 Score copied to clipboard!');
      if (buttonEl) animateButton(buttonEl, '✓ Copied!');
      return { ok: true, method: 'clipboard' };
    } else {
      showToast('Could not copy — try manually selecting the text.');
      return { ok: false, method: 'clipboard' };
    }
  }

  /* ── Button feedback animation ───────────────────────────── */
  function animateButton(btn, label) {
    const original = btn.textContent;
    btn.textContent = label;
    btn.disabled    = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled    = false;
    }, 2000);
  }

  /* ── Render share button ─────────────────────────────────── */
  /**
   * renderShareButton(container, data)
   * Creates and injects a share button into the given container.
   * Wires up the share() function to the button's click event.
   *
   * @param {Element} container - where to inject the button
   * @param {object}  data      - session result data
   */
  function renderShareButton(container, data) {
    if (!container) return;

    const btn       = document.createElement('button');
    btn.className   = 'share-btn';
    btn.innerHTML   = isWebShareSupported()
      ? '↗ Share result'
      : '📋 Copy result';

    btn.addEventListener('click', () => share(data, btn));
    container.appendChild(btn);
  }

  /* ── Build share URL with query params ───────────────────── */
  /**
   * buildShareUrl(data)
   * Creates a URL with score params so a shared link can
   * show a "they scored X" message on landing.
   *
   * @returns {string} full URL
   */
  function buildShareUrl(data) {
    const params = new URLSearchParams({
      niche : data.niche,
      score : data.score,
      total : data.total,
      diff  : data.difficulty,
    });
    return `${SITE_URL}?${params.toString()}`;
  }

  /* ── Read shared score from URL on landing ───────────────── */
  /**
   * getSharedScore()
   * If the page was opened via a share link, returns the
   * embedded score data, otherwise null.
   */
  function getSharedScore() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('score')) return null;
    return {
      niche     : params.get('niche'),
      score     : parseInt(params.get('score'),  10),
      total     : parseInt(params.get('total'),  10),
      difficulty: params.get('diff'),
    };
  }

  /* ── Public API ──────────────────────────────────────────── */
  return {
    share,
    buildShareText,
    buildShareTitle,
    buildShareUrl,
    buildScoreBar,
    renderShareButton,
    getSharedScore,
    copyToClipboard,
    showToast,
    isWebShareSupported,
  };

})();

/* ============================================================
   QuizSpark — js/leaderboard.js
   Handles all leaderboard communication via the Cloudflare
   Worker proxy. The Worker holds the API key — this file
   never touches it directly.

   WORKER ENDPOINT:
   Set WORKER_URL below to your deployed Cloudflare Worker URL.
   The Worker must accept:
     GET  /leaderboard?niche=sci&limit=20&type=alltime|daily
     POST /leaderboard  { name, score, total, time, niche, date }

   Responses expected:
     GET  → { entries: [ { rank, name, score, total, time, date } ] }
     POST → { ok: true, rank: number }
   ============================================================ */

const Leaderboard = (function () {

  /* ── Config ──────────────────────────────────────────────── */

  // Replace with your deployed Cloudflare Worker URL
  const WORKER_URL = 'https://your-worker.your-subdomain.workers.dev';

  // How long to cache leaderboard responses (ms)
  const CACHE_TTL = 60 * 1000; // 1 minute

  /* ── In-memory cache ─────────────────────────────────────── */
  const cache = {};
  // cache[key] = { data, timestamp }

  /* ── Utility: build cache key ────────────────────────────── */
  function cacheKey(niche, type) {
    return `${niche}__${type}`;
  }

  /* ── Utility: is cache valid ─────────────────────────────── */
  function isCacheValid(key) {
    const entry = cache[key];
    if (!entry) return false;
    return Date.now() - entry.timestamp < CACHE_TTL;
  }

  /* ── Fetch leaderboard entries ───────────────────────────── */

  /**
   * fetch(options)
   * Retrieves leaderboard entries from the Worker.
   *
   * @param {object} options
   *   niche   {string}           - niche key e.g. 'sci' (or 'daily')
   *   type    {'alltime'|'daily'}- leaderboard type (default 'alltime')
   *   limit   {number}           - max entries to return (default 20)
   *   force   {boolean}          - bypass cache (default false)
   *
   * @returns {Promise<{ok: boolean, entries: Array, error: string|null}>}
   */
  async function fetch(options) {
    const opts = Object.assign({
      niche : 'global',
      type  : 'alltime',
      limit : 20,
      force : false,
    }, options);

    const key = cacheKey(opts.niche, opts.type);

    // Return cached result if valid
    if (!opts.force && isCacheValid(key)) {
      return { ok: true, entries: cache[key].data, fromCache: true };
    }

    try {
      const url      = `${WORKER_URL}/leaderboard?niche=${opts.niche}&type=${opts.type}&limit=${opts.limit}`;
      const response = await window.fetch(url, {
        method : 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Worker responded with status ${response.status}`);
      }

      const data = await response.json();

      // Store in cache
      cache[key] = { data: data.entries || [], timestamp: Date.now() };

      return { ok: true, entries: data.entries || [], fromCache: false };

    } catch (err) {
      console.error('QuizSpark Leaderboard: fetch failed', err);
      // Return cached data even if stale, as a fallback
      if (cache[key]) {
        return { ok: true, entries: cache[key].data, fromCache: true, stale: true };
      }
      return { ok: false, entries: [], error: err.message };
    }
  }

  /* ── Submit a score ──────────────────────────────────────── */

  /**
   * submit(entry)
   * Posts a score to the leaderboard via the Worker.
   *
   * @param {object} entry
   *   name   {string}  - player name (max 20 chars)
   *   score  {number}  - correct answers
   *   total  {number}  - total questions
   *   time   {number}  - time in seconds
   *   niche  {string}  - niche key
   *   date   {string}  - "YYYY-MM-DD" (for daily board)
   *   isDaily{boolean} - whether this is a daily quiz entry
   *
   * @returns {Promise<{ok: boolean, rank: number|null, error: string|null}>}
   */
  async function submit(entry) {
    // Sanitise name
    const name = String(entry.name || 'Anonymous')
      .trim()
      .slice(0, 20)
      .replace(/[<>]/g, ''); // strip basic XSS chars

    const payload = {
      name,
      score  : entry.score,
      total  : entry.total,
      time   : entry.time,
      niche  : entry.niche  || 'global',
      date   : entry.date   || Storage.todayString(),
      isDaily: entry.isDaily || false,
    };

    try {
      const response = await window.fetch(`${WORKER_URL}/leaderboard`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Worker responded with status ${response.status}`);
      }

      const data = await response.json();

      // Invalidate cache for this niche so next fetch is fresh
      const type = payload.isDaily ? 'daily' : 'alltime';
      delete cache[cacheKey(payload.niche, type)];

      return { ok: true, rank: data.rank || null };

    } catch (err) {
      console.error('QuizSpark Leaderboard: submit failed', err);
      return { ok: false, rank: null, error: err.message };
    }
  }

  /* ── Format helpers for UI ───────────────────────────────── */

  /**
   * formatTime(seconds)
   * Converts seconds into "M:SS" string.
   */
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  /**
   * formatScore(score, total)
   * Returns "8 / 10" style string.
   */
  function formatScore(score, total) {
    return `${score} / ${total}`;
  }

  /**
   * formatRank(rank)
   * Returns "#1", "#2", "#142" etc.
   */
  function formatRank(rank) {
    return `#${rank}`;
  }

  /**
   * getRankClass(rank)
   * Returns CSS modifier class for gold/silver/bronze styling.
   */
  function getRankClass(rank) {
    if (rank === 1) return 'lb-row--gold';
    if (rank === 2) return 'lb-row--silver';
    if (rank === 3) return 'lb-row--bronze';
    return '';
  }

  /**
   * renderRows(entries, container)
   * Injects leaderboard rows into a container element.
   * Uses .lb-row classes from main.css.
   */
  function renderRows(entries, container) {
    if (!container) return;

    if (!entries || !entries.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:var(--sp-6);color:var(--text-3);
                    font-family:var(--font-mono);font-size:0.8rem;">
          No entries yet. Be the first!
        </div>`;
      return;
    }

    container.innerHTML = entries.map((entry, i) => {
      const rank      = entry.rank || (i + 1);
      const rankClass = getRankClass(rank);
      return `
        <div class="lb-row ${rankClass}">
          <div class="lb-row__rank">${formatRank(rank)}</div>
          <div class="lb-row__name">${escapeHtml(entry.name)}</div>
          <div class="lb-row__score">${formatScore(entry.score, entry.total)}</div>
          <div class="lb-row__time">${formatTime(entry.time)}</div>
        </div>`;
    }).join('');
  }

  /* ── Security: basic HTML escape ─────────────────────────── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Clear cache ─────────────────────────────────────────── */
  function clearCache() {
    Object.keys(cache).forEach(k => delete cache[k]);
  }

  /* ── Public API ──────────────────────────────────────────── */
  return {
    fetch,
    submit,
    renderRows,
    formatTime,
    formatScore,
    formatRank,
    getRankClass,
    clearCache,
    // Expose worker URL setter for runtime config
    setWorkerUrl(url) { /* WORKER_URL = url — note: const, set at top */ },
  };

})();

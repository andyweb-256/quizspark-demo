/* ============================================================
   QuizSpark — worker/leaderboard-worker.js
   Cloudflare Worker — leaderboard proxy.

   DEPLOYMENT:
   ─────────────────────────────────────────────────────────
   1. Go to https://workers.cloudflare.com and create a new Worker.
   2. Paste this entire file into the Worker editor.
   3. Set the following Environment Variables (Secrets) in your
      Worker settings — never hardcode them here:

        LEADERBOARD_API_KEY   — your KV / database API key
        LEADERBOARD_API_URL   — base URL of your leaderboard API
        ALLOWED_ORIGIN        — your live site URL e.g. https://quizspark.com
                                (use * during local dev only)

   4. Deploy. Copy the Worker URL into js/leaderboard.js WORKER_URL.

   ENDPOINTS THIS WORKER EXPOSES:
   ─────────────────────────────────────────────────────────
   GET  /leaderboard?niche=sci&type=alltime&limit=20
        → { entries: [ { rank, name, score, total, time, date } ] }

   POST /leaderboard
        Body: { name, score, total, time, niche, date, isDaily }
        → { ok: true, rank: number }

   OPTIONS /leaderboard  (CORS preflight)
        → 200 with CORS headers

   STORAGE BACKEND:
   ─────────────────────────────────────────────────────────
   This Worker is storage-backend agnostic. The section marked
   "STORAGE ADAPTER" below is where you connect to your chosen
   backend. Two options are provided as examples:

   Option A — Cloudflare KV (simplest, works entirely within CF)
   Option B — External REST API (e.g. Supabase, PlanetScale, etc.)

   Uncomment the one you want and fill in the details.
   ============================================================ */

/* ── CORS helper ─────────────────────────────────────────── */
function corsHeaders(origin) {
  const allowed = self.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin' : allowed === '*' ? '*' : origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age'      : '86400',
  };
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

/* ── Input validation ────────────────────────────────────── */
function validateEntry(entry) {
  const errors = [];

  if (!entry.name || typeof entry.name !== 'string') {
    errors.push('name is required');
  }
  if (typeof entry.score !== 'number' || entry.score < 0 || entry.score > 10) {
    errors.push('score must be a number between 0 and 10');
  }
  if (typeof entry.total !== 'number' || entry.total !== 10) {
    errors.push('total must be 10');
  }
  if (typeof entry.time !== 'number' || entry.time < 0 || entry.time > 3600) {
    errors.push('time must be a number between 0 and 3600 seconds');
  }

  const validNiches = ['sci','hist','geo','pop','spo','art','nat','lang','daily','global'];
  if (!validNiches.includes(entry.niche)) {
    errors.push(`niche must be one of: ${validNiches.join(', ')}`);
  }

  return errors;
}

function sanitiseName(name) {
  return String(name)
    .trim()
    .slice(0, 20)
    .replace(/[<>&"']/g, c => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;',
      '"': '&quot;', "'": '&#39;',
    }[c]));
}

/* ══════════════════════════════════════════════════════════
   STORAGE ADAPTER
   Uncomment ONE of the following sections.
══════════════════════════════════════════════════════════ */

/* ── OPTION A: Cloudflare KV ─────────────────────────────
   Requires a KV namespace called LEADERBOARD bound to this Worker.
   In the CF dashboard: Workers & Pages → your worker →
   Settings → Variables → KV Namespace Bindings → Add binding.
   Variable name: LEADERBOARD
   ──────────────────────────────────────────────────────── */

async function kvGetEntries(niche, type, limit) {
  const key  = `lb:${niche}:${type}`;
  const raw  = await LEADERBOARD.get(key);
  const all  = raw ? JSON.parse(raw) : [];
  return all.slice(0, limit);
}

async function kvSaveEntry(entry) {
  // Determine which boards this entry should appear on
  const boards = [
    `lb:${entry.niche}:alltime`,
    entry.isDaily ? `lb:daily:daily` : null,
  ].filter(Boolean);

  let finalRank = null;

  for (const key of boards) {
    const raw     = await LEADERBOARD.get(key);
    const entries = raw ? JSON.parse(raw) : [];

    // Add new entry
    entries.push({
      name : entry.name,
      score: entry.score,
      total: entry.total,
      time : entry.time,
      date : entry.date,
    });

    // Sort: highest score first, then fastest time
    entries.sort((a, b) => {
      const pctA = a.score / a.total;
      const pctB = b.score / b.total;
      if (pctB !== pctA) return pctB - pctA;
      return a.time - b.time;
    });

    // Keep top 100
    const trimmed = entries.slice(0, 100);

    // Add rank field
    const ranked = trimmed.map((e, i) => ({ ...e, rank: i + 1 }));

    // Find this entry's rank
    const myIdx = ranked.findIndex(
      e => e.name === entry.name &&
           e.score === entry.score &&
           e.time  === entry.time
    );
    if (myIdx !== -1 && finalRank === null) finalRank = ranked[myIdx].rank;

    // Save back to KV (TTL: 90 days for daily, none for alltime)
    const options = key.includes(':daily:') ? { expirationTtl: 60 * 60 * 24 * 90 } : {};
    await LEADERBOARD.put(key, JSON.stringify(ranked), options);
  }

  return finalRank || 999;
}

/* ── OPTION B: External REST API ─────────────────────────
   Uncomment this section and comment out Option A above
   if you prefer an external database (Supabase, etc.)

async function apiGetEntries(niche, type, limit) {
  const url = `${self.LEADERBOARD_API_URL}/entries?niche=${niche}&type=${type}&limit=${limit}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${self.LEADERBOARD_API_KEY}`,
      'Content-Type' : 'application/json',
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.entries || [];
}

async function apiSaveEntry(entry) {
  const url = `${self.LEADERBOARD_API_URL}/entries`;
  const res = await fetch(url, {
    method : 'POST',
    headers: {
      'Authorization': `Bearer ${self.LEADERBOARD_API_KEY}`,
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.rank || 999;
}
──────────────────────────────────────────────────────── */


/* ── Main request handler ────────────────────────────────── */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url    = new URL(request.url);
  const origin = request.headers.get('Origin') || '';
  const method = request.method.toUpperCase();
  const path   = url.pathname;

  /* ── CORS preflight ────────────────────────────────────── */
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  /* ── Route: /leaderboard ───────────────────────────────── */
  if (!path.startsWith('/leaderboard')) {
    return jsonResponse({ error: 'Not found' }, 404, origin);
  }

  /* ── GET — fetch entries ───────────────────────────────── */
  if (method === 'GET') {
    try {
      const niche = url.searchParams.get('niche') || 'global';
      const type  = url.searchParams.get('type')  || 'alltime';
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);

      // Use kvGetEntries (Option A) or apiGetEntries (Option B)
      const entries = await kvGetEntries(niche, type, limit);

      return jsonResponse({ entries }, 200, origin);

    } catch (err) {
      console.error('GET error:', err);
      return jsonResponse({ error: 'Failed to fetch leaderboard' }, 500, origin);
    }
  }

  /* ── POST — submit score ────────────────────────────────── */
  if (method === 'POST') {
    try {
      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON body' }, 400, origin);
      }

      // Validate
      const errors = validateEntry(body);
      if (errors.length) {
        return jsonResponse({ error: errors.join(', ') }, 400, origin);
      }

      // Sanitise
      const entry = {
        name   : sanitiseName(body.name),
        score  : Math.floor(body.score),
        total  : Math.floor(body.total),
        time   : Math.floor(body.time),
        niche  : body.niche,
        date   : body.date || new Date().toISOString().slice(0, 10),
        isDaily: !!body.isDaily,
      };

      // Use kvSaveEntry (Option A) or apiSaveEntry (Option B)
      const rank = await kvSaveEntry(entry);

      return jsonResponse({ ok: true, rank }, 200, origin);

    } catch (err) {
      console.error('POST error:', err);
      return jsonResponse({ error: 'Failed to submit score' }, 500, origin);
    }
  }

  /* ── Method not allowed ────────────────────────────────── */
  return jsonResponse({ error: 'Method not allowed' }, 405, origin);
}

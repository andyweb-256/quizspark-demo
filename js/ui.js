/* ============================================================
   QuizSpark — js/ui.js
   Handles all DOM rendering and user interaction.
   - Builds the niche grid, sub-niche chips, difficulty row,
     timer row on index.html
   - Wires up Engine callbacks for the quiz screen
   - Renders question cards, option buttons, progress bar,
     timer ring, fun facts
   - Renders the results screen with score circle
   - Wires Share and Leaderboard on results
   Depends on: taxonomy.js, engine.js, storage.js,
               themes.js, share.js, leaderboard.js
   ============================================================ */

const UI = (function () {

  /* ── State ───────────────────────────────────────────────── */
  let selectedNiche        = null;
  let selectedSubNiche     = null;
  let selectedSuperSub     = null;
  let selectedDifficulty   = null;
  let selectedTimer        = null;
  let activeShuffledData   = null; // current question's shuffled options
  let answeredThisQuestion = false;

  /* ── DOM refs (index.html) ───────────────────────────────── */
  const $ = id => document.getElementById(id);

  /* ════════════════════════════════════════════════════════════
     INDEX PAGE — selector UI
  ════════════════════════════════════════════════════════════ */

  /* ── Build niche grid ────────────────────────────────────── */
  function buildNicheGrid() {
    const grid = $('niche-grid');
    if (!grid || typeof TAXONOMY === 'undefined') return;

    grid.innerHTML = TAXONOMY.map(niche => `
      <div class="niche-card" data-niche="${niche.key}"
           style="--niche-color:${niche.color}">
        <div class="niche-card__dot"></div>
        <div class="niche-card__icon">${niche.icon}</div>
        <div class="niche-card__label">${niche.label}</div>
      </div>
    `).join('');

    grid.querySelectorAll('.niche-card').forEach(card => {
      card.addEventListener('click', () => onNicheSelect(card.dataset.niche));
    });
  }

  /* ── Niche selected ──────────────────────────────────────── */
  function onNicheSelect(nicheKey) {
    selectedNiche    = nicheKey;
    selectedSubNiche = null;
    selectedSuperSub = null;

    // Update active state on cards
    document.querySelectorAll('.niche-card').forEach(c => {
      c.classList.toggle('active', c.dataset.niche === nicheKey);
    });

    // Apply theme (no splash on selector page)
    if (typeof Themes !== 'undefined') {
      Themes.apply(nicheKey, { splash: false, onReady: null });
    }

    // Build sub-niche chips
    buildSubNicheChips(nicheKey);

    // Reset deeper selections
    selectedDifficulty = null;
    selectedTimer      = null;
    syncPlayButton();
  }

  /* ── Build sub-niche chips ───────────────────────────────── */
  function buildSubNicheChips(nicheKey) {
    const container = $('subniche-container');
    if (!container) return;

    const niche = (TAXONOMY || []).find(n => n.key === nicheKey);
    if (!niche || !niche.subs) { container.innerHTML = ''; return; }

    // "All" chip + one per sub-niche
    const allChip = `
      <button class="subniche-chip active" data-sub="all">
        All topics
      </button>`;

    const subChips = niche.subs.map(sub => `
      <button class="subniche-chip" data-sub="${sub.key}">
        ${sub.label}
      </button>
    `).join('');

    container.innerHTML = `<div class="subniche-wrap">${allChip}${subChips}</div>`;

    container.querySelectorAll('.subniche-chip').forEach(chip => {
      chip.addEventListener('click', () => onSubNicheSelect(chip.dataset.sub));
    });
  }

  /* ── Sub-niche selected ──────────────────────────────────── */
  function onSubNicheSelect(subKey) {
    selectedSubNiche = subKey === 'all' ? null : subKey;
    selectedSuperSub = null;

    document.querySelectorAll('.subniche-chip[data-sub]').forEach(c => {
      c.classList.toggle('active', c.dataset.sub === subKey);
    });

    // If a sub-niche is picked, show its super-sub chips
    if (selectedSubNiche) {
      buildSuperSubChips(selectedNiche, selectedSubNiche);
    } else {
      removeSuperSubChips();
    }

    syncPlayButton();
  }

  /* ── Build super-sub chips ───────────────────────────────── */
  function buildSuperSubChips(nicheKey, subKey) {
    removeSuperSubChips();
    const niche = (TAXONOMY || []).find(n => n.key === nicheKey);
    if (!niche) return;
    const sub = (niche.subs || []).find(s => s.key === subKey);
    if (!sub || !sub.subs || !sub.subs.length) return;

    const wrap = document.createElement('div');
    wrap.id    = 'supersub-container';
    wrap.style.marginTop = 'var(--sp-3)';

    const allChip = `<button class="subniche-chip subniche-chip--deep active" data-supersub="all">All</button>`;
    const chips   = sub.subs.map(ss => `
      <button class="subniche-chip subniche-chip--deep" data-supersub="${ss.key}">
        ${ss.label}
      </button>
    `).join('');

    wrap.innerHTML = `<div class="subniche-wrap">${allChip}${chips}</div>`;

    const container = $('subniche-container');
    if (container) container.appendChild(wrap);

    wrap.querySelectorAll('.subniche-chip[data-supersub]').forEach(chip => {
      chip.addEventListener('click', () => onSuperSubSelect(chip.dataset.supersub));
    });
  }

  function removeSuperSubChips() {
    const existing = $('supersub-container');
    if (existing) existing.remove();
    selectedSuperSub = null;
  }

  /* ── Super-sub selected ──────────────────────────────────── */
  function onSuperSubSelect(key) {
    selectedSuperSub = key === 'all' ? null : key;
    document.querySelectorAll('.subniche-chip[data-supersub]').forEach(c => {
      c.classList.toggle('active', c.dataset.supersub === key);
    });
    syncPlayButton();
  }

  /* ── Build difficulty row ────────────────────────────────── */
  function buildDifficultyRow() {
    const row = $('difficulty-row');
    if (!row) return;

    const diffs = [
      { val:1,          label:'Cadet',      desc:'Beginner-friendly questions' },
      { val:2,          label:'Veteran',    desc:'A solid challenge' },
      { val:3,          label:'Elite',      desc:'Tough. Think carefully.' },
      { val:4,          label:'Mastermind', desc:'Only the best survive' },
      { val:'adaptive', label:'Adaptive',   desc:'Adjusts to your performance' },
    ];

    row.innerHTML = diffs.map(d => `
      <div class="diff-card" data-diff="${d.val}">
        <div class="diff-card__rank">${typeof d.val === 'number' ? 'Tier ' + d.val : 'Auto'}</div>
        <div class="diff-card__name">${d.label}</div>
        <div class="diff-card__desc">${d.desc}</div>
      </div>
    `).join('');

    row.querySelectorAll('.diff-card').forEach(card => {
      card.addEventListener('click', () => {
        row.querySelectorAll('.diff-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedDifficulty = card.dataset.diff === 'adaptive'
          ? 'adaptive'
          : parseInt(card.dataset.diff, 10);
        syncPlayButton();
      });
    });
  }

  /* ── Build timer row ─────────────────────────────────────── */
  function buildTimerRow() {
    const row = $('timer-row');
    if (!row) return;

    const timers = [
      { val:'chill',        icon:'🧊', label:'Chill',        desc:'No timer. Take your time.' },
      { val:'blitz',        icon:'⚡', label:'Blitz',        desc:'15 seconds per question.' },
      { val:'sudden_death', icon:'💀', label:'Sudden Death', desc:'One wrong answer ends it.' },
    ];

    row.innerHTML = timers.map(t => `
      <div class="timer-card" data-timer="${t.val}">
        <div class="timer-card__icon">${t.icon}</div>
        <div class="timer-card__name">${t.label}</div>
        <div class="timer-card__desc">${t.desc}</div>
      </div>
    `).join('');

    row.querySelectorAll('.timer-card').forEach(card => {
      card.addEventListener('click', () => {
        row.querySelectorAll('.timer-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedTimer = card.dataset.timer;
        syncPlayButton();
      });
    });
  }

  /* ── Play button state ───────────────────────────────────── */
  function syncPlayButton() {
    const btn = $('play-btn');
    if (!btn) return;
    const ready = selectedNiche && selectedDifficulty !== null && selectedTimer;
    btn.disabled = !ready;
    btn.style.opacity = ready ? '1' : '0.45';
  }

  /* ── Wire play button ────────────────────────────────────── */
  function wirePlayButton() {
    const btn = $('play-btn');
    if (!btn) return;
    btn.disabled = true;
    btn.style.opacity = '0.45';
    btn.addEventListener('click', onPlayClick);
  }

  /* ── Play button clicked ─────────────────────────────────── */
  function onPlayClick() {
    if (!selectedNiche || selectedDifficulty === null || !selectedTimer) return;

    // Apply full theme with splash before navigating to quiz
    if (typeof Themes !== 'undefined') {
      Themes.apply(selectedNiche, {
        splash: true,
        onReady: function () {
          _launchQuiz();
        },
      });
    } else {
      _launchQuiz();
    }
  }

  function _launchQuiz() {
    const session = Engine.createSession({
      niche        : selectedNiche,
      subNiche     : selectedSubNiche,
      superSubNiche: selectedSuperSub,
      difficulty   : selectedDifficulty,
      timerMode    : selectedTimer,
    });

    if (!session) {
      showError('No questions found for this selection. Try a different combination.');
      return;
    }

    // Navigate to quiz page, passing config via sessionStorage
    sessionStorage.setItem('qs_config', JSON.stringify({
      niche        : selectedNiche,
      subNiche     : selectedSubNiche,
      superSubNiche: selectedSuperSub,
      difficulty   : selectedDifficulty,
      timerMode    : selectedTimer,
    }));

    window.location.href = 'quiz.html';
  }

  /* ════════════════════════════════════════════════════════════
     QUIZ PAGE — active quiz rendering
  ════════════════════════════════════════════════════════════ */

  /* ── Init quiz page ──────────────────────────────────────── */
  function initQuizPage() {
    const raw = sessionStorage.getItem('qs_config');
    if (!raw) { window.location.href = 'index.html'; return; }

    const config = JSON.parse(raw);

    // Apply theme (no splash — was shown on index)
    if (typeof Themes !== 'undefined') {
      Themes.apply(config.niche, {
        splash: false,
        onReady: function () {
          _startQuiz(config);
        },
      });
    } else {
      _startQuiz(config);
    }
  }

  function _startQuiz(config) {
    const session = Engine.createSession(config);
    if (!session) { window.location.href = 'index.html'; return; }

    Engine.setCallbacks({
      onQuestion  : renderQuestion,
      onAnswer    : renderAnswerResult,
      onTick      : renderTimerTick,
      onSessionEnd: renderResults,
    });

    Engine.start();
  }

  /* ── Render a question ───────────────────────────────────── */
  function renderQuestion(q, shuffled, index, total, session) {
    activeShuffledData   = shuffled;
    answeredThisQuestion = false;

    // Progress bar
    const bar = $('progress-fill');
    if (bar) bar.style.width = `${(index / total) * 100}%`;

    // Question counter
    const counter = $('question-counter');
    if (counter) counter.textContent = `${index + 1} / ${total}`;

    // Niche badge
    const badge = $('question-niche');
    if (badge) {
      const meta = typeof Themes !== 'undefined'
        ? Themes.getMeta(session.niche)
        : null;
      badge.textContent = meta ? `${meta.icon} ${meta.label}` : session.niche;
    }

    // Question text
    const qText = $('question-text');
    if (qText) {
      qText.textContent = q.question;
      qText.classList.remove('anim-fade-up');
      void qText.offsetWidth; // reflow to restart animation
      qText.classList.add('anim-fade-up');
    }

    // Options
    renderOptions(shuffled.options, shuffled.correct);

    // Hide fun fact
    const ff = $('fun-fact');
    if (ff) ff.style.display = 'none';

    // Hide next button
    const nextBtn = $('next-btn');
    if (nextBtn) nextBtn.style.display = 'none';

    // Reset timer ring
    resetTimerRing();
  }

  /* ── Render answer options ───────────────────────────────── */
  function renderOptions(options, correctIndex) {
    const grid = $('options-grid');
    if (!grid) return;

    const keys = ['A', 'B', 'C', 'D'];

    grid.innerHTML = options.map((opt, i) => `
      <button class="option-btn" data-index="${i}" aria-label="Option ${keys[i]}: ${opt}">
        <span class="option-btn__key">${keys[i]}</span>
        <span class="option-btn__text">${opt}</span>
      </button>
    `).join('');

    grid.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answeredThisQuestion) return;
        answeredThisQuestion = true;
        const chosen = parseInt(btn.dataset.index, 10);
        Engine.answer(chosen, activeShuffledData.correct);
      });
    });

    // Keyboard support A/B/C/D
    document.onkeydown = function (e) {
      const map = { a:0, b:1, c:2, d:3, A:0, B:1, C:2, D:3 };
      if (map[e.key] !== undefined && !answeredThisQuestion) {
        answeredThisQuestion = true;
        Engine.answer(map[e.key], activeShuffledData.correct);
      }
    };
  }

  /* ── Render answer result (correct/wrong highlight) ─────── */
  function renderAnswerResult(result, session) {
    const grid = $('options-grid');
    if (!grid) return;

    // Disable all buttons
    grid.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

    // Highlight chosen and correct
    grid.querySelectorAll('.option-btn').forEach(btn => {
      const idx = parseInt(btn.dataset.index, 10);
      if (idx === result.correctIndex) {
        btn.classList.add('option-btn--correct');
        btn.classList.add('anim-correct-pop');
      } else if (idx === result.chosenIndex && !result.isCorrect) {
        btn.classList.add('option-btn--wrong');
        btn.classList.add('anim-shake');
      }
    });

    // Update score display
    const scoreEl = $('current-score');
    if (scoreEl) scoreEl.textContent = result.score;

    // Show fun fact
    if (result.funFact) {
      const ff = $('fun-fact');
      if (ff) {
        ff.style.display = 'block';
        ff.innerHTML = `
          <div class="fun-fact__label">Did you know?</div>
          ${result.funFact}
        `;
      }
    }

    // Show next button (or auto-advance after delay if not last)
    const nextBtn = $('next-btn');
    const isLast  = result.questionIndex + 1 >= result.total;
    if (nextBtn) {
      nextBtn.style.display = 'block';
      nextBtn.textContent   = isLast ? 'See Results' : 'Next Question →';
    }
  }

  /* ── Next button wired on quiz page ──────────────────────── */
  function wireNextButton() {
    const btn = $('next-btn');
    if (!btn) return;
    btn.style.display = 'none';
    btn.addEventListener('click', () => {
      Engine.next();
    });
  }

  /* ── Timer ring rendering ────────────────────────────────── */
  function renderTimerTick(remaining) {
    const fill  = $('timer-ring-fill');
    const count = $('timer-count');

    if (count) count.textContent = remaining;

    if (fill) {
      const total       = 15;
      const dashArray   = 163;
      const offset      = dashArray - (remaining / total) * dashArray;
      fill.style.strokeDashoffset = offset;

      // Turn red when <= 5 seconds
      if (remaining <= 5) {
        fill.classList.add('timer-ring__fill--danger');
      } else {
        fill.classList.remove('timer-ring__fill--danger');
      }
    }
  }

  function resetTimerRing() {
    const fill  = $('timer-ring-fill');
    const count = $('timer-count');
    if (fill) {
      fill.style.strokeDashoffset = '0';
      fill.classList.remove('timer-ring__fill--danger');
    }
    if (count) count.textContent = '15';
  }

  /* ════════════════════════════════════════════════════════════
     RESULTS PAGE — score, share, leaderboard
  ════════════════════════════════════════════════════════════ */

  /* ── Render results ──────────────────────────────────────── */
  function renderResults(session) {
    // Save to sessionStorage for results.html to read
    sessionStorage.setItem('qs_result', JSON.stringify({
      score       : session.score,
      total       : session.questions.length,
      totalTimeSec: session.totalTimeSec,
      niche       : session.niche,
      difficulty  : session.difficulty,
      timerMode   : session.timerMode,
    }));
    window.location.href = 'results.html';
  }

  /* ── Init results page ───────────────────────────────────── */
  function initResultsPage() {
    const raw = sessionStorage.getItem('qs_result');
    if (!raw) { window.location.href = 'index.html'; return; }

    const result = JSON.parse(raw);

    // Apply theme
    if (typeof Themes !== 'undefined') {
      Themes.apply(result.niche, { splash: false });
    }

    // Score circle
    const val   = $('score-value');
    const total = $('score-total');
    const fill  = $('score-circle-fill');

    if (val)   val.textContent   = result.score;
    if (total) total.textContent = `/ ${result.total}`;

    if (fill) {
      const pct    = result.score / result.total;
      const offset = 440 - (pct * 440);
      setTimeout(() => { fill.style.strokeDashoffset = offset; }, 100);
    }

    // Rank label
    const rankEl = $('result-rank');
    if (rankEl) rankEl.textContent = Engine.getDiffLabel(result.difficulty);

    // Time
    const timeEl = $('result-time');
    if (timeEl) timeEl.textContent = Share.formatTime(result.totalTimeSec);

    // Streak
    const streak    = Storage.getStreak();
    const streakEl  = $('result-streak');
    if (streakEl && streak.count > 1) {
      streakEl.innerHTML = `<span class="streak-badge">🔥 ${streak.count} day streak</span>`;
    }

    // Share button
    const shareContainer = $('share-container');
    if (shareContainer && typeof Share !== 'undefined') {
      const meta = typeof Themes !== 'undefined'
        ? Themes.getMeta(result.niche)
        : null;
      Share.renderShareButton(shareContainer, {
        niche      : result.niche,
        nicheName  : meta ? meta.label : result.niche,
        score      : result.score,
        total      : result.total,
        timeSec    : result.totalTimeSec,
        difficulty : result.difficulty,
        timerMode  : result.timerMode,
        streak     : streak.count,
        isDaily    : false,
      });
    }

    // Leaderboard submit prompt
    wireLeaderboardSubmit(result);

    // Load leaderboard
    loadLeaderboard(result.niche);

    // High score check
    const hs = Storage.getHighScore(result.niche);
    const hsEl = $('high-score');
    if (hsEl && hs) {
      hsEl.textContent = `Personal best: ${hs.score}/${hs.total}`;
    }
  }

  /* ── Wire leaderboard submit ─────────────────────────────── */
  function wireLeaderboardSubmit(result) {
    const form  = $('lb-submit-form');
    const input = $('lb-name-input');
    const btn   = $('lb-submit-btn');
    if (!form || !input || !btn) return;

    btn.addEventListener('click', async function () {
      const name = input.value.trim();
      if (!name) { input.focus(); return; }

      btn.disabled    = true;
      btn.textContent = 'Submitting...';

      const res = await Leaderboard.submit({
        name,
        score  : result.score,
        total  : result.total,
        time   : result.totalTimeSec,
        niche  : result.niche,
        isDaily: false,
      });

      if (res.ok) {
        form.innerHTML = `<div style="color:var(--correct);font-family:var(--font-mono);font-size:0.8rem;">
          ✓ Submitted! Your rank: #${res.rank || '—'}
        </div>`;
        // Save name preference
        Storage.setPref('playerName', name);
        loadLeaderboard(result.niche, true);
      } else {
        btn.disabled    = false;
        btn.textContent = 'Submit';
        Share.showToast('Submission failed — check your connection.');
      }
    });

    // Pre-fill saved name
    const prefs = Storage.getPrefs();
    if (prefs.playerName && input) input.value = prefs.playerName;
  }

  /* ── Load and render leaderboard ─────────────────────────── */
  async function loadLeaderboard(nicheKey, force) {
    const container = $('leaderboard-rows');
    if (!container || typeof Leaderboard === 'undefined') return;

    container.innerHTML = `<div style="text-align:center;padding:var(--sp-5);
      color:var(--text-3);font-family:var(--font-mono);font-size:0.78rem;">
      Loading...
    </div>`;

    const res = await Leaderboard.fetch({
      niche: nicheKey,
      type : 'alltime',
      limit: 20,
      force: !!force,
    });

    Leaderboard.renderRows(res.entries, container);
  }

  /* ════════════════════════════════════════════════════════════
     SHARED UTILITIES
  ════════════════════════════════════════════════════════════ */

  /* ── Show inline error message ───────────────────────────── */
  function showError(msg) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;bottom:var(--sp-5);left:50%;transform:translateX(-50%);
      background:var(--wrong-glow);border:1px solid var(--wrong);
      color:var(--wrong);padding:var(--sp-3) var(--sp-5);border-radius:var(--r-full);
      font-size:0.85rem;z-index:400;font-family:var(--font-mono);
    `;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  /* ── Init based on current page ──────────────────────────── */
  function init() {
    const page = document.body.dataset.page;

    if (page === 'home') {
      buildNicheGrid();
      buildDifficultyRow();
      buildTimerRow();
      wirePlayButton();
    }

    if (page === 'quiz') {
      initQuizPage();
      wireNextButton();
    }

    if (page === 'results') {
      initResultsPage();
    }
  }

  /* ── Auto-init on DOM ready ──────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Public API ──────────────────────────────────────────── */
  return {
    init,
    buildNicheGrid,
    buildDifficultyRow,
    buildTimerRow,
    renderQuestion,
    renderAnswerResult,
    renderTimerTick,
    renderResults,
    initResultsPage,
    showError,
  };

})();

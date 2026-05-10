/* ============================================================
   QuizSpark — js/engine.js
   Core game engine. Handles:
   - Question filtering by niche / subNiche / superSubNiche / difficulty
   - Session setup and question shuffling
   - Timer logic (Chill / Blitz / Sudden Death)
   - Scoring and adaptive difficulty
   - Session state machine
   Reads from global QUESTIONS and TAXONOMY (taxonomy.js).
   Reads/writes via Storage (storage.js).
   Calls into UI (ui.js) for rendering via callbacks.
   ============================================================ */

const Engine = (function () {

  /* ── Timer mode constants ────────────────────────────────── */
  const TIMER = {
    CHILL       : 'chill',        // no timer
    BLITZ       : 'blitz',        // 15 seconds per question
    SUDDEN_DEATH: 'sudden_death', // one wrong answer ends session
  };

  /* ── Difficulty constants ────────────────────────────────── */
  const DIFF = {
    CADET     : 1,
    VETERAN   : 2,
    ELITE     : 3,
    MASTERMIND: 4,
  };

  const DIFF_LABELS = {
    1: 'Cadet',
    2: 'Veteran',
    3: 'Elite',
    4: 'Mastermind',
  };

  /* ── Session state ───────────────────────────────────────── */
  let session = null;
  /*
    session = {
      niche           : string,
      subNiche        : string | null,
      superSubNiche   : string | null,
      difficulty      : 1|2|3|4 | 'adaptive',
      timerMode       : 'chill'|'blitz'|'sudden_death',
      questions       : [],      // filtered + shuffled question pool
      currentIndex    : number,  // 0-based index into questions
      score           : number,
      startTime       : number,  // Date.now() at session start
      questionStartTime: number, // Date.now() at question reveal
      answers         : [],      // { questionId, chosen, correct, timeMs }
      isActive        : bool,
      isDone          : bool,
      adaptiveDiff    : number,  // current adaptive difficulty level
      consecutiveRight: number,  // for adaptive mode step-up
      consecutiveWrong: number,  // for adaptive mode step-down
    }
  */

  /* ── Timer state ─────────────────────────────────────────── */
  let timerInterval = null;
  let timerRemaining = 0;
  let onTickCallback  = null;
  let onTimeoutCallback = null;

  /* ── Callbacks set by ui.js ──────────────────────────────── */
  let callbacks = {
    onQuestion  : null,   // (question, index, total, session) called per question
    onAnswer    : null,   // (result, session) called after an answer
    onTick      : null,   // (remaining) called every second in blitz mode
    onSessionEnd: null,   // (session) called when session finishes
  };

  /* ── Utility: shuffle array (Fisher-Yates) ───────────────── */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ── Utility: clamp ──────────────────────────────────────── */
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  /* ── Filter questions from global QUESTIONS pool ─────────── */
  function filterQuestions(niche, subNiche, superSubNiche, difficulty) {
    if (typeof QUESTIONS === 'undefined' || !QUESTIONS.length) {
      console.error('QuizSpark Engine: QUESTIONS array is empty or not loaded.');
      return [];
    }

    return QUESTIONS.filter(q => {
      // Must match niche
      if (q.niche !== niche) return false;

      // Optional subNiche filter
      if (subNiche && q.subNiche !== subNiche) return false;

      // Optional superSubNiche filter
      if (superSubNiche && q.superSubNiche !== superSubNiche) return false;

      // Difficulty filter — skip in adaptive mode (handled dynamically)
      if (difficulty !== 'adaptive' && q.difficulty !== difficulty) return false;

      // Never serve wrongOnly questions in a regular session
      if (q.wrongOnly) return false;

      return true;
    });
  }

  /* ── Build adaptive question pool ───────────────────────────
     Adaptive mode: pulls a proportional mix of difficulties.
     30% D1 / 35% D2 / 25% D3 / 10% D4
     Then adjusts per-question based on performance.
  ─────────────────────────────────────────────────────────── */
  function buildAdaptivePool(niche, subNiche, superSubNiche, count) {
    const base = QUESTIONS.filter(q => {
      if (q.niche !== niche)              return false;
      if (subNiche     && q.subNiche     !== subNiche)     return false;
      if (superSubNiche && q.superSubNiche !== superSubNiche) return false;
      if (q.wrongOnly) return false;
      return true;
    });

    const byDiff = { 1: [], 2: [], 3: [], 4: [] };
    base.forEach(q => (byDiff[q.difficulty] || []).push(q));

    const targets = {
      1: Math.round(count * 0.30),
      2: Math.round(count * 0.35),
      3: Math.round(count * 0.25),
      4: Math.round(count * 0.10),
    };

    let pool = [];
    [1, 2, 3, 4].forEach(d => {
      const available = shuffle(byDiff[d]);
      pool = pool.concat(available.slice(0, targets[d]));
    });

    // If pool is short (not enough questions), fill with whatever's left
    if (pool.length < count) {
      const usedIds = new Set(pool.map(q => q.id));
      const extras  = shuffle(base.filter(q => !usedIds.has(q.id)));
      pool = pool.concat(extras.slice(0, count - pool.length));
    }

    return shuffle(pool);
  }

  /* ── Adaptive difficulty step logic ─────────────────────── */
  function updateAdaptiveDiff(correct) {
    if (!session || session.difficulty !== 'adaptive') return;

    if (correct) {
      session.consecutiveRight++;
      session.consecutiveWrong = 0;
      // Step up after 2 consecutive correct
      if (session.consecutiveRight >= 2) {
        session.adaptiveDiff    = clamp(session.adaptiveDiff + 1, 1, 4);
        session.consecutiveRight = 0;
      }
    } else {
      session.consecutiveWrong++;
      session.consecutiveRight = 0;
      // Step down after 2 consecutive wrong
      if (session.consecutiveWrong >= 2) {
        session.adaptiveDiff    = clamp(session.adaptiveDiff - 1, 1, 4);
        session.consecutiveWrong = 0;
      }
    }
  }

  /* ── Timer management ────────────────────────────────────── */
  function startTimer(seconds) {
    clearTimer();
    timerRemaining = seconds;

    if (callbacks.onTick) callbacks.onTick(timerRemaining);

    timerInterval = setInterval(() => {
      timerRemaining--;
      if (callbacks.onTick) callbacks.onTick(timerRemaining);

      if (timerRemaining <= 0) {
        clearTimer();
        // Time ran out — treat as wrong answer
        if (callbacks.onTimeoutCallback) callbacks.onTimeoutCallback();
        else handleTimeout();
      }
    }, 1000);
  }

  function clearTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function handleTimeout() {
    if (!session || !session.isActive) return;
    // Register a timed-out answer (null = no selection)
    recordAnswer(null);
  }

  /* ── Session setup ───────────────────────────────────────── */

  /**
   * createSession(config)
   * Builds and returns a new session object without starting it.
   *
   * @param {object} config
   *   niche          {string}           required
   *   subNiche       {string|null}      optional
   *   superSubNiche  {string|null}      optional
   *   difficulty     {1|2|3|4|'adaptive'} required
   *   timerMode      {'chill'|'blitz'|'sudden_death'} required
   *   questionCount  {number}           default 10
   */
  function createSession(config) {
    const count = config.questionCount || 10;

    let pool;
    if (config.difficulty === 'adaptive') {
      pool = buildAdaptivePool(
        config.niche,
        config.subNiche       || null,
        config.superSubNiche  || null,
        count * 3             // build a larger pool, pick from it
      );
    } else {
      pool = filterQuestions(
        config.niche,
        config.subNiche      || null,
        config.superSubNiche || null,
        config.difficulty
      );
    }

    if (!pool.length) {
      console.warn('QuizSpark Engine: no questions found for this configuration.');
      return null;
    }

    const questions = shuffle(pool).slice(0, count);

    session = {
      niche           : config.niche,
      subNiche        : config.subNiche      || null,
      superSubNiche   : config.superSubNiche || null,
      difficulty      : config.difficulty,
      timerMode       : config.timerMode,
      questions,
      currentIndex    : 0,
      score           : 0,
      startTime       : null,
      questionStartTime: null,
      answers         : [],
      isActive        : false,
      isDone          : false,
      adaptiveDiff    : 2, // adaptive starts at Veteran
      consecutiveRight: 0,
      consecutiveWrong: 0,
    };

    return session;
  }

  /* ── Start session ───────────────────────────────────────── */

  /**
   * start()
   * Begins the current session. Fires the first question.
   */
  function start() {
    if (!session) {
      console.error('QuizSpark Engine: no session created. Call createSession() first.');
      return;
    }

    session.isActive  = true;
    session.startTime = Date.now();
    serveQuestion();
  }

  /* ── Serve current question ──────────────────────────────── */
  function serveQuestion() {
    if (!session.isActive) return;

    const q = session.questions[session.currentIndex];
    if (!q) { endSession(); return; }

    session.questionStartTime = Date.now();

    // Shuffle options (keep correct answer index tracking)
    const shuffledData = shuffleOptions(q);

    // Fire callback into UI
    if (callbacks.onQuestion) {
      callbacks.onQuestion(
        q,
        shuffledData,
        session.currentIndex,
        session.questions.length,
        session
      );
    }

    // Start timer if Blitz mode
    if (session.timerMode === TIMER.BLITZ) {
      startTimer(15);
    }
  }

  /* ── Shuffle options while tracking correct answer ────────── */
  function shuffleOptions(q) {
    const indices  = [0, 1, 2, 3];
    const shuffled = shuffle(indices);
    const newOptions = shuffled.map(i => q.options[i]);
    const newCorrect = shuffled.indexOf(q.correct);

    return {
      options    : newOptions,
      correct    : newCorrect,
      originalQ  : q,
    };
  }

  /* ── Record an answer ────────────────────────────────────── */

  /**
   * answer(chosenIndex)
   * Called by ui.js when the user picks an option.
   * chosenIndex is the index into the SHUFFLED options array,
   * or null for a timeout.
   */
  function answer(chosenIndex, shuffledCorrectIndex) {
    if (!session || !session.isActive) return;
    clearTimer();
    recordAnswer(chosenIndex, shuffledCorrectIndex);
  }

  function recordAnswer(chosenIndex, shuffledCorrectIndex) {
    const q        = session.questions[session.currentIndex];
    const timeMs   = Date.now() - session.questionStartTime;
    const isCorrect = chosenIndex !== null &&
                      chosenIndex === shuffledCorrectIndex;

    session.answers.push({
      questionId: q.id,
      chosen    : chosenIndex,
      correct   : shuffledCorrectIndex,
      isCorrect,
      timeMs,
    });

    if (isCorrect) session.score++;

    // Adaptive difficulty update
    updateAdaptiveDiff(isCorrect);

    // Build result object for UI
    const result = {
      isCorrect,
      chosenIndex,
      correctIndex : shuffledCorrectIndex,
      funFact      : q.funFact,
      score        : session.score,
      questionIndex: session.currentIndex,
      total        : session.questions.length,
      timedOut     : chosenIndex === null,
    };

    if (callbacks.onAnswer) callbacks.onAnswer(result, session);

    // Sudden Death: wrong answer ends session immediately
    if (!isCorrect && session.timerMode === TIMER.SUDDEN_DEATH) {
      setTimeout(() => endSession(), 1200);
      return;
    }

    session.currentIndex++;

    // Check if session is over
    if (session.currentIndex >= session.questions.length) {
      setTimeout(() => endSession(), 1200);
    }
  }

  /* ── Advance to next question (called by ui.js after delay) ─ */
  function next() {
    if (!session || !session.isActive) return;
    if (session.isDone) return;
    serveQuestion();
  }

  /* ── End session ─────────────────────────────────────────── */
  function endSession() {
    if (!session) return;

    clearTimer();
    session.isActive = false;
    session.isDone   = true;

    const totalTimeMs = Date.now() - session.startTime;
    const totalTimeSec = Math.round(totalTimeMs / 1000);

    // Persist results
    Storage.saveLastSession({
      niche         : session.niche,
      subNiche      : session.subNiche,
      superSubNiche : session.superSubNiche,
      difficulty    : session.difficulty,
      timerMode     : session.timerMode,
      score         : session.score,
      total         : session.questions.length,
      time          : totalTimeSec,
    });

    Storage.saveHighScore(
      session.niche,
      session.score,
      session.questions.length,
      totalTimeSec
    );

    Storage.incrementStats(session.score, session.questions.length);
    Storage.updateStreak();

    if (callbacks.onSessionEnd) {
      callbacks.onSessionEnd({
        ...session,
        totalTimeSec,
      });
    }
  }

  /* ── Daily quiz seed ─────────────────────────────────────── */

  /**
   * getDailyQuestions(count)
   * Returns a deterministic set of questions for today's daily quiz.
   * Uses today's date string as a seed for a simple PRNG so all
   * users get the same questions on the same day (client-side).
   *
   * @param {number} count - default 10
   * @returns {Array} array of question objects
   */
  function getDailyQuestions(count) {
    count = count || 10;

    if (typeof QUESTIONS === 'undefined' || !QUESTIONS.length) return [];

    // Build a deterministic seed from today's date
    const dateStr = Storage.todayString();    // "YYYY-MM-DD"
    const seed    = dateStr.split('-').reduce((acc, n) => acc + parseInt(n), 0);

    // Simple seeded PRNG (mulberry32)
    function seededRandom(s) {
      return function () {
        s |= 0; s = s + 0x6D2B79F5 | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    const rng = seededRandom(seed);

    // Eligible pool — all non-wrongOnly questions
    const pool = QUESTIONS.filter(q => !q.wrongOnly).slice();

    // Seeded shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, count);
  }

  /* ── Getters ─────────────────────────────────────────────── */

  function getSession()          { return session; }
  function getCurrentQuestion()  { return session ? session.questions[session.currentIndex] : null; }
  function getScore()            { return session ? session.score : 0; }
  function getTimerRemaining()   { return timerRemaining; }
  function getDiffLabel(d)       { return DIFF_LABELS[d] || 'Unknown'; }

  /* ── Set callbacks (called by ui.js) ─────────────────────── */
  function setCallbacks(cbs) {
    callbacks = Object.assign(callbacks, cbs);
  }

  /* ── Reset engine state ──────────────────────────────────── */
  function reset() {
    clearTimer();
    session       = null;
    timerRemaining = 0;
  }

  /* ── Public API ──────────────────────────────────────────── */
  return {
    // Constants
    TIMER,
    DIFF,
    DIFF_LABELS,
    // Session lifecycle
    createSession,
    start,
    answer,
    next,
    endSession,
    reset,
    // Daily
    getDailyQuestions,
    // Getters
    getSession,
    getCurrentQuestion,
    getScore,
    getTimerRemaining,
    getDiffLabel,
    // Callbacks
    setCallbacks,
  };

})();

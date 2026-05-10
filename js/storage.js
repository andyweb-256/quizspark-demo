/* ============================================================
   QuizSpark — js/storage.js
   Handles all localStorage reads and writes.
   Covers: streak tracking, daily quiz state, user preferences,
   last session data, and high scores.
   No dependencies — loads standalone before engine.js.
   ============================================================ */

const Storage = (function () {

  /* ── Storage keys ────────────────────────────────────────── */
  const KEYS = {
    STREAK_COUNT    : 'qs_streak_count',      // integer
    STREAK_LAST_DATE: 'qs_streak_last_date',  // "YYYY-MM-DD"
    DAILY_PLAYED    : 'qs_daily_played',      // "YYYY-MM-DD" of last daily play
    DAILY_SCORE     : 'qs_daily_score',       // { date, score, total, time }
    HIGH_SCORES     : 'qs_high_scores',       // { [nicheKey]: { score, total, date } }
    LAST_SESSION    : 'qs_last_session',      // { niche, subNiche, difficulty, timer, score }
    PREFS           : 'qs_prefs',             // { soundOn, reducedMotion }
    TOTAL_PLAYED    : 'qs_total_played',      // integer — lifetime games played
    TOTAL_CORRECT   : 'qs_total_correct',     // integer — lifetime correct answers
  };

  /* ── Safe JSON read/write ────────────────────────────────── */
  function get(key) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : null;
    } catch (e) {
      console.warn(`QuizSpark Storage: failed to read "${key}"`, e);
      return null;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`QuizSpark Storage: failed to write "${key}"`, e);
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ── Date helpers ────────────────────────────────────────── */
  /**
   * Returns today's date as a "YYYY-MM-DD" string in local time.
   */
  function todayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /**
   * Returns yesterday's date as a "YYYY-MM-DD" string.
   */
  function yesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /* ── Streak ──────────────────────────────────────────────── */

  /**
   * getStreak()
   * Returns { count, lastDate } for the current streak.
   */
  function getStreak() {
    return {
      count   : get(KEYS.STREAK_COUNT)     || 0,
      lastDate: get(KEYS.STREAK_LAST_DATE) || null,
    };
  }

  /**
   * updateStreak()
   * Called after any completed quiz session (daily or regular).
   * Increments streak if played on consecutive days,
   * resets to 1 if a day was missed, no-ops if already played today.
   * Returns the updated streak count.
   */
  function updateStreak() {
    const today     = todayString();
    const yesterday = yesterdayString();
    const streak    = getStreak();

    if (streak.lastDate === today) {
      // Already updated today — return unchanged
      return streak.count;
    }

    let newCount;
    if (streak.lastDate === yesterday) {
      // Consecutive day — extend streak
      newCount = (streak.count || 0) + 1;
    } else {
      // Missed a day or first time — reset
      newCount = 1;
    }

    set(KEYS.STREAK_COUNT,     newCount);
    set(KEYS.STREAK_LAST_DATE, today);
    return newCount;
  }

  /**
   * resetStreak()
   * Manually resets streak to 0 (e.g. on account clear).
   */
  function resetStreak() {
    set(KEYS.STREAK_COUNT,     0);
    set(KEYS.STREAK_LAST_DATE, null);
  }

  /* ── Daily Quiz ──────────────────────────────────────────── */

  /**
   * hasPlayedDailyToday()
   * Returns true if the user has already played the daily quiz today.
   */
  function hasPlayedDailyToday() {
    return get(KEYS.DAILY_PLAYED) === todayString();
  }

  /**
   * markDailyPlayed(score, total, timeSeconds)
   * Records that the daily quiz was completed today.
   */
  function markDailyPlayed(score, total, timeSeconds) {
    set(KEYS.DAILY_PLAYED, todayString());
    set(KEYS.DAILY_SCORE, {
      date : todayString(),
      score,
      total,
      time : timeSeconds,
    });
    updateStreak();
  }

  /**
   * getDailyScore()
   * Returns today's daily score object, or null if not played.
   */
  function getDailyScore() {
    const data = get(KEYS.DAILY_SCORE);
    if (!data || data.date !== todayString()) return null;
    return data;
  }

  /* ── High Scores ─────────────────────────────────────────── */

  /**
   * getHighScores()
   * Returns the full high scores object keyed by niche.
   */
  function getHighScores() {
    return get(KEYS.HIGH_SCORES) || {};
  }

  /**
   * saveHighScore(nicheKey, score, total, timeSeconds)
   * Saves a high score for a niche if it beats the existing record.
   * Returns true if it was a new high score.
   */
  function saveHighScore(nicheKey, score, total, timeSeconds) {
    const scores  = getHighScores();
    const current = scores[nicheKey];
    const pct     = score / total;

    const isBetter = !current ||
      pct > (current.score / current.total) ||
      (pct === (current.score / current.total) && timeSeconds < current.time);

    if (isBetter) {
      scores[nicheKey] = {
        score,
        total,
        time : timeSeconds,
        date : todayString(),
      };
      set(KEYS.HIGH_SCORES, scores);
      return true;
    }
    return false;
  }

  /**
   * getHighScore(nicheKey)
   * Returns the best score object for a specific niche, or null.
   */
  function getHighScore(nicheKey) {
    const scores = getHighScores();
    return scores[nicheKey] || null;
  }

  /* ── Last Session ────────────────────────────────────────── */

  /**
   * saveLastSession(sessionData)
   * Persists the most recent session config and result.
   * @param {object} sessionData - { niche, subNiche, superSubNiche, difficulty, timer, score, total, time }
   */
  function saveLastSession(sessionData) {
    set(KEYS.LAST_SESSION, sessionData);
  }

  /**
   * getLastSession()
   * Returns the last session object or null.
   */
  function getLastSession() {
    return get(KEYS.LAST_SESSION);
  }

  /* ── Lifetime Stats ──────────────────────────────────────── */

  /**
   * incrementStats(correctCount, totalCount)
   * Adds to the lifetime games played and correct answers counters.
   */
  function incrementStats(correctCount, totalCount) {
    const played  = (get(KEYS.TOTAL_PLAYED)  || 0) + 1;
    const correct = (get(KEYS.TOTAL_CORRECT) || 0) + correctCount;
    set(KEYS.TOTAL_PLAYED,  played);
    set(KEYS.TOTAL_CORRECT, correct);
  }

  /**
   * getStats()
   * Returns { gamesPlayed, totalCorrect, accuracy }
   */
  function getStats() {
    const gamesPlayed  = get(KEYS.TOTAL_PLAYED)  || 0;
    const totalCorrect = get(KEYS.TOTAL_CORRECT) || 0;
    const totalAnswered = gamesPlayed * 10; // 10 questions per session
    const accuracy = totalAnswered > 0
      ? Math.round((totalCorrect / totalAnswered) * 100)
      : 0;
    return { gamesPlayed, totalCorrect, accuracy };
  }

  /* ── User Preferences ────────────────────────────────────── */

  /**
   * getPrefs()
   * Returns user preferences object with defaults.
   */
  function getPrefs() {
    return Object.assign({
      soundOn      : false,
      reducedMotion: false,
    }, get(KEYS.PREFS) || {});
  }

  /**
   * setPrefs(prefsObj)
   * Merges and saves user preferences.
   */
  function setPrefs(prefsObj) {
    const current = getPrefs();
    set(KEYS.PREFS, Object.assign(current, prefsObj));
  }

  /**
   * setPref(key, value)
   * Sets a single preference by key.
   */
  function setPref(key, value) {
    const current = getPrefs();
    current[key]  = value;
    set(KEYS.PREFS, current);
  }

  /* ── Clear all data ──────────────────────────────────────── */

  /**
   * clearAll()
   * Removes all QuizSpark data from localStorage.
   * Used by a "reset progress" option.
   */
  function clearAll() {
    Object.values(KEYS).forEach(key => remove(key));
  }

  /* ── Storage availability check ─────────────────────────── */

  /**
   * isAvailable()
   * Returns true if localStorage is accessible.
   * Useful for private/incognito mode detection.
   */
  function isAvailable() {
    try {
      const test = '__qs_test__';
      localStorage.setItem(test, '1');
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ── Public API ──────────────────────────────────────────── */
  return {
    // Streak
    getStreak,
    updateStreak,
    resetStreak,
    // Daily
    hasPlayedDailyToday,
    markDailyPlayed,
    getDailyScore,
    // High scores
    getHighScores,
    saveHighScore,
    getHighScore,
    // Session
    saveLastSession,
    getLastSession,
    // Stats
    incrementStats,
    getStats,
    // Prefs
    getPrefs,
    setPrefs,
    setPref,
    // Utility
    todayString,
    clearAll,
    isAvailable,
  };

})();

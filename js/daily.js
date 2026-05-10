/* ============================================================
   QuizSpark — js/daily.js
   Manages the Daily Quiz feature.
   - Checks if the user has already played today
   - Builds today's 10-question set via Engine.getDailyQuestions()
   - Runs the session via Engine with Chill timer by default
   - Records the result via Storage.markDailyPlayed()
   - Submits score to the daily leaderboard via Leaderboard.submit()
   - Renders the "already played" state for returning visitors
   ============================================================ */

const Daily = (function () {

  /* ── State ───────────────────────────────────────────────── */
  let dailySession    = null;
  let shuffledData    = [];   // per-question shuffled options, built upfront
  let currentShuffled = null; // active shuffled options for current question

  /* ── Get today's label ───────────────────────────────────── */
  function getTodayLabel() {
    const d = new Date();
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      year   : 'numeric',
      month  : 'long',
      day    : 'numeric',
    });
  }

  /* ── Check if all niches have loaded for daily ───────────── */
  function allNichesLoaded() {
    const niches = ['sci','hist','geo','pop','spo','art','nat','lang'];
    if (typeof QUESTIONS === 'undefined') return false;
    // Daily pool draws from all niches — check at least one has loaded
    return QUESTIONS.length > 0;
  }

  /* ── Load all niche question files ──────────────────────────
     The daily quiz draws from all 8 niches, so we need to
     load them all before picking questions. Themes.isLoaded()
     checks the cache — only injects a <script> tag if needed.
  ─────────────────────────────────────────────────────────── */
  function loadAllNiches(onDone) {
    const niches  = ['sci','hist','geo','pop','spo','art','nat','lang'];
    let   loaded  = 0;
    const total   = niches.length;

    niches.forEach(niche => {
      if (Themes.isLoaded(niche)) {
        loaded++;
        if (loaded === total && onDone) onDone();
        return;
      }

      const script    = document.createElement('script');
      script.src      = `questions/${niche}.js`;
      script.onload   = () => {
        loaded++;
        if (loaded === total && onDone) onDone();
      };
      script.onerror  = () => {
        console.warn(`QuizSpark Daily: failed to load questions/${niche}.js`);
        loaded++;
        if (loaded === total && onDone) onDone();
      };
      document.head.appendChild(script);
    });
  }

  /* ── Render the "already played today" screen ────────────── */
  /**
   * renderAlreadyPlayed(container)
   * Shows the user their score from today's already-completed daily.
   *
   * @param {Element} container - element to inject into
   */
  function renderAlreadyPlayed(container) {
    if (!container) return;

    const score  = Storage.getDailyScore();
    const streak = Storage.getStreak();
    const bar    = score
      ? Share.buildScoreBar(score.score, score.total)
      : '';
    const pct    = score
      ? Math.round((score.score / score.total) * 100)
      : 0;

    container.innerHTML = `
      <div class="daily-played-msg anim-fade-up">
        <div class="daily-date">${getTodayLabel()}</div>

        <div style="font-size:1.8rem;margin:var(--sp-4) 0 var(--sp-2);">
          ${bar}
        </div>

        ${score ? `
          <div class="t-display" style="font-size:2rem;margin-bottom:var(--sp-2);">
            ${score.score}<span style="color:var(--text-3);font-size:1rem;">/${score.total}</span>
          </div>
          <div class="t-mono text-dimmed" style="font-size:0.8rem;margin-bottom:var(--sp-4);">
            ${pct}% correct · ⏱ ${Leaderboard.formatTime(score.time)}
          </div>
        ` : ''}

        <div class="streak-badge" style="margin:0 auto var(--sp-5);display:inline-flex;">
          🔥 ${streak.count} day streak
        </div>

        <div class="t-body text-muted" style="font-size:0.85rem;margin-bottom:var(--sp-5);">
          You've already played today's quiz. Come back tomorrow for a new set!
        </div>

        <div id="daily-share-btn-wrap"></div>
      </div>
    `;

    // Inject share button if we have a score
    if (score) {
      const meta = Themes.getMeta('sci'); // fallback — daily is cross-niche
      Share.renderShareButton(
        container.querySelector('#daily-share-btn-wrap'),
        {
          niche     : 'daily',
          nicheName : 'Daily Quiz',
          score     : score.score,
          total     : score.total,
          timeSec   : score.time,
          difficulty: 'adaptive',
          timerMode : 'chill',
          streak    : streak.count,
          isDaily   : true,
        }
      );
    }
  }

  /* ── Build the daily quiz UI header ──────────────────────── */
  /**
   * renderHeader(container)
   * Renders the date label and streak badge above the quiz.
   */
  function renderHeader(container) {
    if (!container) return;
    const streak = Storage.getStreak();

    container.innerHTML = `
      <div class="daily-header anim-fade-up">
        <div class="daily-date">${getTodayLabel()}</div>
        <div class="t-display" style="font-size:clamp(1.6rem,4vw,2.4rem);margin-bottom:var(--sp-3);">
          Daily Quiz
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:var(--sp-3);">
          ${streak.count > 0 ? `
            <div class="streak-badge">🔥 ${streak.count} day streak</div>
          ` : ''}
          <span class="t-mono text-dimmed" style="font-size:0.75rem;">
            10 questions · all niches
          </span>
        </div>
      </div>
    `;
  }

  /* ── Initialise the daily quiz session ───────────────────── */
  /**
   * init(options)
   * Sets up and starts today's daily quiz.
   *
   * @param {object} options
   *   questionContainer  {Element} - where the quiz renders
   *   onEnd              {Function}- called with result data when done
   */
  function init(options) {
    const opts = Object.assign({
      questionContainer: null,
      onEnd            : null,
    }, options);

    // Load all niche files first (may already be cached)
    loadAllNiches(function () {
      const questions = Engine.getDailyQuestions(10);

      if (!questions.length) {
        console.error('QuizSpark Daily: no questions available.');
        return;
      }

      // Pre-shuffle all question options upfront
      shuffledData = questions.map(q => {
        const indices  = [0, 1, 2, 3];
        const shuffled = shuffle(indices);
        return {
          options    : shuffled.map(i => q.options[i]),
          correct    : shuffled.indexOf(q.correct),
          originalQ  : q,
        };
      });

      // Create engine session manually (daily bypasses normal niche filtering)
      Engine.reset();

      // Wire up engine callbacks
      Engine.setCallbacks({
        onQuestion  : function (q, sData, index, total, session) {
          currentShuffled = shuffledData[index];
          if (opts.questionContainer && typeof UI !== 'undefined') {
            UI.renderQuestion(q, currentShuffled, index, total, session, opts.questionContainer);
          }
        },
        onAnswer    : function (result, session) {
          if (opts.questionContainer && typeof UI !== 'undefined') {
            UI.renderAnswerFeedback(result, currentShuffled, opts.questionContainer);
          }
        },
        onTick      : function (remaining) {
          if (typeof UI !== 'undefined') UI.updateTimer(remaining);
        },
        onSessionEnd: function (session) {
          const streak = Storage.getStreak();

          // Mark as played in storage
          Storage.markDailyPlayed(
            session.score,
            session.questions.length,
            session.totalTimeSec
          );

          const resultData = {
            niche     : 'daily',
            nicheName : 'Daily Quiz',
            score     : session.score,
            total     : session.questions.length,
            timeSec   : session.totalTimeSec,
            difficulty: 'adaptive',
            timerMode : session.timerMode,
            streak    : streak.count,
            isDaily   : true,
          };

          if (opts.onEnd) opts.onEnd(resultData, session);
        },
      });

      // Build a fake session object directly on engine
      // Daily always uses Chill timer and adaptive difficulty
      const fakeSession = {
        niche            : 'daily',
        subNiche         : null,
        superSubNiche    : null,
        difficulty       : 'adaptive',
        timerMode        : Engine.TIMER.CHILL,
        questions,
        currentIndex     : 0,
        score            : 0,
        startTime        : Date.now(),
        questionStartTime: Date.now(),
        answers          : [],
        isActive         : true,
        isDone           : false,
        adaptiveDiff     : 2,
        consecutiveRight : 0,
        consecutiveWrong : 0,
      };

      // Inject into engine via createSession-equivalent
      // (We build manually because daily skips normal filtering)
      dailySession = fakeSession;

      // Serve the first question via the engine callback chain
      const q = questions[0];
      const sData = shuffledData[0];
      currentShuffled = sData;

      if (Engine.getCallbacks && Engine.getCallbacks().onQuestion) {
        Engine.getCallbacks().onQuestion(q, sData, 0, questions.length, fakeSession);
      } else if (opts.questionContainer && typeof UI !== 'undefined') {
        UI.renderQuestion(q, sData, 0, questions.length, fakeSession, opts.questionContainer);
      }
    });
  }

  /* ── Answer handler for daily quiz ──────────────────────── */
  /**
   * answer(chosenIndex)
   * Processes an answer during the daily quiz.
   * Mirrors Engine.answer() but operates on dailySession.
   */
  function answer(chosenIndex) {
    if (!dailySession || dailySession.isDone) return;

    const q         = dailySession.questions[dailySession.currentIndex];
    const sData     = shuffledData[dailySession.currentIndex];
    const isCorrect = chosenIndex === sData.correct;
    const timeMs    = Date.now() - dailySession.questionStartTime;

    dailySession.answers.push({
      questionId: q.id,
      chosen    : chosenIndex,
      correct   : sData.correct,
      isCorrect,
      timeMs,
    });

    if (isCorrect) dailySession.score++;

    const result = {
      isCorrect,
      chosenIndex,
      correctIndex : sData.correct,
      funFact      : q.funFact,
      score        : dailySession.score,
      questionIndex: dailySession.currentIndex,
      total        : dailySession.questions.length,
      timedOut     : false,
    };

    const cbs = Engine.getCallbacks ? Engine.getCallbacks() : {};
    if (cbs.onAnswer) cbs.onAnswer(result, dailySession);

    dailySession.currentIndex++;

    if (dailySession.currentIndex >= dailySession.questions.length) {
      dailySession.isDone   = true;
      dailySession.isActive = false;

      const totalTimeSec = Math.round((Date.now() - dailySession.startTime) / 1000);
      dailySession.totalTimeSec = totalTimeSec;

      setTimeout(() => {
        if (cbs.onSessionEnd) cbs.onSessionEnd(dailySession);
      }, 1200);
    }
  }

  /* ── Next question for daily ─────────────────────────────── */
  function next() {
    if (!dailySession || dailySession.isDone) return;

    const index  = dailySession.currentIndex;
    const q      = dailySession.questions[index];
    const sData  = shuffledData[index];
    currentShuffled = sData;

    dailySession.questionStartTime = Date.now();

    const cbs = Engine.getCallbacks ? Engine.getCallbacks() : {};
    if (cbs.onQuestion) {
      cbs.onQuestion(q, sData, index, dailySession.questions.length, dailySession);
    }
  }

  /* ── Submit daily score to leaderboard ───────────────────── */
  /**
   * submitScore(name, resultData)
   * Posts the daily result to the leaderboard.
   * Returns a Promise with { ok, rank }.
   */
  async function submitScore(name, resultData) {
    return Leaderboard.submit({
      name   : name,
      score  : resultData.score,
      total  : resultData.total,
      time   : resultData.timeSec,
      niche  : 'daily',
      date   : Storage.todayString(),
      isDaily: true,
    });
  }

  /* ── Utility: shuffle (local copy, no engine dep) ────────── */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ── Public API ──────────────────────────────────────────── */
  return {
    init,
    answer,
    next,
    submitScore,
    renderAlreadyPlayed,
    renderHeader,
    getTodayLabel,
    loadAllNiches,
    get session() { return dailySession; },
  };

})();

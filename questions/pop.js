/* ============================================================
   QuizSpark — questions/pop.js
   Pop Culture question bank.

   HOW THIS FILE WORKS:
   ─────────────────────────────────────────────────────────
   This file is loaded dynamically by js/themes.js when the
   user selects the Pop Culture niche. It appends questions
   to the global QUESTIONS array defined in js/taxonomy.js.

   DO NOT add a new QUESTIONS declaration here.
   DO NOT use ES module syntax (import/export).
   All questions must be added inside the POP_QUESTIONS array
   below, between the opening [ and the closing ];

   ─────────────────────────────────────────────────────────
   QUESTION OBJECT FORMAT:
   ─────────────────────────────────────────────────────────
   Each question must follow this exact structure:

   {
     id:             "pop_film_classics_001",
     niche:          "pop",
     subNiche:       "film",
     superSubNiche:  "classics",
     difficulty:     1,
     question:       "Your question text here?",
     options:        ["Option A", "Option B", "Option C", "Option D"],
     correct:        0,
     funFact:        "An interesting fact revealed after answering.",
     wrongOnly:      false
   }

   ─────────────────────────────────────────────────────────
   FIELD RULES:
   ─────────────────────────────────────────────────────────
   id:
     Format: {niche}_{subNiche}_{superSubNiche}_{number}
     Number is zero-padded to 3 digits, incrementing per leaf.
     Example: pop_film_classics_001, pop_film_classics_002 ...

   niche:
     Always "pop" for this file.

   subNiche:
     Must match one of the sub-niche keys in taxonomy.js:
     "film" | "mus" | "tv" | "games" | "internet"

   superSubNiche:
     Must match one of the leaf keys under the chosen subNiche:
     film     → "classics" | "directors" | "franchises" | "awards"
     mus      → "hiphop" | "rock" | "classical_music" |
                "afrobeats" | "kpop"
     tv       → "drama" | "comedy" | "animation"
     games    → "video_games_history" | "gaming_characters" |
                "esports"
     internet → "memes" | "social_media" | "viral_moments"

   difficulty:
     1 = Cadet       (easy,      ~30% of questions)
     2 = Veteran     (medium,    ~35% of questions)
     3 = Elite       (hard,      ~25% of questions)
     4 = Mastermind  (very hard, ~10% of questions)

   options:
     Always exactly 4 strings. Keep them concise.

   correct:
     Zero-based index of the correct option (0, 1, 2, or 3).

   funFact:
     A short, interesting fact shown after the question is
     answered. Should add context — not just repeat the answer.
     Keep it under 2 sentences.

   wrongOnly:
     Set to true if this question should only appear in a
     future "Wrong Answer Only" mode. Otherwise false.

   ─────────────────────────────────────────────────────────
   ADDING QUESTIONS — STEP BY STEP:
   ─────────────────────────────────────────────────────────
   1. Find the correct section comment below
      (e.g. Movies & Film › Classic Films).
   2. Add your question object after the section comment.
   3. Number sequentially from _001 — check the last ID in
      that section to avoid duplicates.
   4. Aim for the difficulty distribution:
      30% difficulty:1 / 35% difficulty:2 /
      25% difficulty:3 / 10% difficulty:4
   5. Save the file. No build step needed.

   ─────────────────────────────────────────────────────────
   SECTIONS IN THIS FILE (17 leaf nodes):
   ─────────────────────────────────────────────────────────
   Movies & Film    → classics, directors, franchises, awards
   Music            → hiphop, rock, classical_music,
                      afrobeats, kpop
   TV & Streaming   → drama, comedy, animation
   Gaming           → video_games_history, gaming_characters,
                      esports
   Internet Culture → memes, social_media, viral_moments
   ============================================================ */

(function () {
  const POP_QUESTIONS = [

    /* ── Movies & Film › Classic Films ──────────────────────
       ID format: pop_film_classics_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Movies & Film › Directors & Cinematography ─────────
       ID format: pop_film_directors_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Movies & Film › Franchises & Sequels ───────────────
       ID format: pop_film_franchises_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Movies & Film › Awards & Records ───────────────────
       ID format: pop_film_awards_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Music › Hip-Hop & Rap ───────────────────────────────
       ID format: pop_mus_hiphop_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Music › Rock & Alternative ─────────────────────────
       ID format: pop_mus_rock_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Music › Classical Music ─────────────────────────────
       ID format: pop_mus_classical_music_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Music › Afrobeats & African Pop ────────────────────
       ID format: pop_mus_afrobeats_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Music › K-Pop & Korean Wave ────────────────────────
       ID format: pop_mus_kpop_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── TV & Streaming › Drama Series ──────────────────────
       ID format: pop_tv_drama_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── TV & Streaming › Comedy Series ─────────────────────
       ID format: pop_tv_comedy_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── TV & Streaming › Animation & Anime ─────────────────
       ID format: pop_tv_animation_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Gaming › Gaming History ─────────────────────────────
       ID format: pop_games_video_games_history_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Gaming › Characters & Lore ─────────────────────────
       ID format: pop_games_gaming_characters_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Gaming › Esports ────────────────────────────────────
       ID format: pop_games_esports_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Internet Culture › Memes & Internet Humour ─────────
       ID format: pop_internet_memes_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Internet Culture › Social Media ────────────────────
       ID format: pop_internet_social_media_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Internet Culture › Viral Moments ───────────────────
       ID format: pop_internet_viral_moments_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


  ];

  // Append to global QUESTIONS array (defined in js/taxonomy.js)
  if (typeof QUESTIONS !== 'undefined') {
    QUESTIONS.push(...POP_QUESTIONS);
  } else {
    console.warn('QuizSpark: QUESTIONS global not found. Ensure taxonomy.js loads first.');
  }
})();

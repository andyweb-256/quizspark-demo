/* ============================================================
   QuizSpark — questions/hist.js
   History question bank.

   HOW THIS FILE WORKS:
   ─────────────────────────────────────────────────────────
   This file is loaded dynamically by js/themes.js when the
   user selects the History niche. It appends questions to
   the global QUESTIONS array defined in js/taxonomy.js.

   DO NOT add a new QUESTIONS declaration here.
   DO NOT use ES module syntax (import/export).
   All questions must be added inside the HIST_QUESTIONS array
   below, between the opening [ and the closing ];

   ─────────────────────────────────────────────────────────
   QUESTION OBJECT FORMAT:
   ─────────────────────────────────────────────────────────
   Each question must follow this exact structure:

   {
     id:             "hist_anc_egypt_001",
     niche:          "hist",
     subNiche:       "anc",
     superSubNiche:  "egypt",
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
     Example: hist_anc_egypt_001, hist_anc_egypt_002 ...

   niche:
     Always "hist" for this file.

   subNiche:
     Must match one of the sub-niche keys in taxonomy.js:
     "anc" | "wars" | "col" | "rev" | "mod"

   superSubNiche:
     Must match one of the leaf keys under the chosen subNiche:
     anc  → "egypt" | "greece" | "rome" | "mesopotamia" | "china"
     wars → "ww1" | "ww2" | "cold_war" | "ancient_battles"
     col  → "africa_colonialism" | "asia_colonialism" | "independence_movements"
     rev  → "french_revolution" | "american_revolution" | "industrial_revolution" | "african_independence"
     mod  → "20th_century" | "21st_century" | "inventions"

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
      (e.g. Ancient Worlds › Egypt).
   2. Add your question object after the section comment.
   3. Number sequentially from _001 — check the last ID in
      that section to avoid duplicates.
   4. Aim for the difficulty distribution:
      30% difficulty:1 / 35% difficulty:2 /
      25% difficulty:3 / 10% difficulty:4
   5. Save the file. No build step needed.

   ─────────────────────────────────────────────────────────
   SECTIONS IN THIS FILE (19 leaf nodes):
   ─────────────────────────────────────────────────────────
   Ancient Worlds   → egypt, greece, rome, mesopotamia, china
   Wars & Conflicts → ww1, ww2, cold_war, ancient_battles
   Colonialism      → africa_colonialism, asia_colonialism,
                      independence_movements
   Revolutions      → french_revolution, american_revolution,
                      industrial_revolution, african_independence
   Modern Era       → 20th_century, 21st_century, inventions
   ============================================================ */

(function () {
  const HIST_QUESTIONS = [

    /* ── Ancient Worlds › Egypt ──────────────────────────────
       ID format: hist_anc_egypt_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Ancient Worlds › Greece ─────────────────────────────
       ID format: hist_anc_greece_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Ancient Worlds › Rome ───────────────────────────────
       ID format: hist_anc_rome_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Ancient Worlds › Mesopotamia ───────────────────────
       ID format: hist_anc_mesopotamia_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Ancient Worlds › China ──────────────────────────────
       ID format: hist_anc_china_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Wars & Conflicts › World War I ─────────────────────
       ID format: hist_wars_ww1_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Wars & Conflicts › World War II ────────────────────
       ID format: hist_wars_ww2_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Wars & Conflicts › The Cold War ────────────────────
       ID format: hist_wars_cold_war_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Wars & Conflicts › Ancient Battles ─────────────────
       ID format: hist_wars_ancient_battles_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Colonialism › Africa Under Colonialism ─────────────
       ID format: hist_col_africa_colonialism_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Colonialism › Asia Under Colonialism ───────────────
       ID format: hist_col_asia_colonialism_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Colonialism › Independence Movements ───────────────
       ID format: hist_col_independence_movements_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Revolutions › The French Revolution ────────────────
       ID format: hist_rev_french_revolution_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Revolutions › The American Revolution ──────────────
       ID format: hist_rev_american_revolution_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Revolutions › Industrial Revolution ────────────────
       ID format: hist_rev_industrial_revolution_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Revolutions › African Independence ─────────────────
       ID format: hist_rev_african_independence_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Modern Era › 20th Century ──────────────────────────
       ID format: hist_mod_20th_century_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Modern Era › 21st Century ──────────────────────────
       ID format: hist_mod_21st_century_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Modern Era › Inventions & Discoveries ──────────────
       ID format: hist_mod_inventions_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


  ];

  // Append to global QUESTIONS array (defined in js/taxonomy.js)
  if (typeof QUESTIONS !== 'undefined') {
    QUESTIONS.push(...HIST_QUESTIONS);
  } else {
    console.warn('QuizSpark: QUESTIONS global not found. Ensure taxonomy.js loads first.');
  }
})();

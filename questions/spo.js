/* ============================================================
   QuizSpark — questions/spo.js
   Sports question bank.

   HOW THIS FILE WORKS:
   ─────────────────────────────────────────────────────────
   This file is loaded dynamically by js/themes.js when the
   user selects the Sports niche. It appends questions to
   the global QUESTIONS array defined in js/taxonomy.js.

   DO NOT add a new QUESTIONS declaration here.
   DO NOT use ES module syntax (import/export).
   All questions must be added inside the SPO_QUESTIONS array
   below, between the opening [ and the closing ];

   ─────────────────────────────────────────────────────────
   QUESTION OBJECT FORMAT:
   ─────────────────────────────────────────────────────────
   Each question must follow this exact structure:

   {
     id:             "spo_football_premier_league_001",
     niche:          "spo",
     subNiche:       "football",
     superSubNiche:  "premier_league",
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
     Example: spo_football_premier_league_001, _002 ...

   niche:
     Always "spo" for this file.

   subNiche:
     Must match one of the sub-niche keys in taxonomy.js:
     "football" | "ath" | "tennis" | "cricket" | "bball" | "combat"

   superSubNiche:
     Must match one of the leaf keys under the chosen subNiche:
     football → "premier_league" | "world_cup" | "afcon" | "legends"
     ath      → "olympics" | "athletics_records"
     tennis   → "grand_slams" | "tennis_legends"
     cricket  → "test_cricket" | "cricket_records"
     bball    → "nba" | "fiba"
     combat   → "boxing" | "mma"

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
      (e.g. Football › Premier League).
   2. Add your question object after the section comment.
   3. Number sequentially from _001 — check the last ID in
      that section to avoid duplicates.
   4. Aim for the difficulty distribution:
      30% difficulty:1 / 35% difficulty:2 /
      25% difficulty:3 / 10% difficulty:4
   5. Save the file. No build step needed.

   ─────────────────────────────────────────────────────────
   SECTIONS IN THIS FILE (14 leaf nodes):
   ─────────────────────────────────────────────────────────
   Football (Soccer) → premier_league, world_cup, afcon, legends
   Athletics         → olympics, athletics_records
   Tennis            → grand_slams, tennis_legends
   Cricket           → test_cricket, cricket_records
   Basketball        → nba, fiba
   Combat Sports     → boxing, mma
   ============================================================ */

(function () {
  const SPO_QUESTIONS = [

    /* ── Football › Premier League ───────────────────────────
       ID format: spo_football_premier_league_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Football › FIFA World Cup ───────────────────────────
       ID format: spo_football_world_cup_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Football › AFCON ────────────────────────────────────
       ID format: spo_football_afcon_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Football › Football Legends ────────────────────────
       ID format: spo_football_legends_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Athletics › The Olympics ────────────────────────────
       ID format: spo_ath_olympics_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Athletics › World Records ──────────────────────────
       ID format: spo_ath_athletics_records_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Tennis › Grand Slams ────────────────────────────────
       ID format: spo_tennis_grand_slams_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Tennis › Tennis Legends ─────────────────────────────
       ID format: spo_tennis_tennis_legends_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Cricket › Test Cricket ──────────────────────────────
       ID format: spo_cricket_test_cricket_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Cricket › Cricket Records ──────────────────────────
       ID format: spo_cricket_cricket_records_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Basketball › NBA ────────────────────────────────────
       ID format: spo_bball_nba_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Basketball › FIBA & International ──────────────────
       ID format: spo_bball_fiba_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Combat Sports › Boxing ──────────────────────────────
       ID format: spo_combat_boxing_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Combat Sports › MMA & UFC ───────────────────────────
       ID format: spo_combat_mma_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


  ];

  // Append to global QUESTIONS array (defined in js/taxonomy.js)
  if (typeof QUESTIONS !== 'undefined') {
    QUESTIONS.push(...SPO_QUESTIONS);
  } else {
    console.warn('QuizSpark: QUESTIONS global not found. Ensure taxonomy.js loads first.');
  }
})();

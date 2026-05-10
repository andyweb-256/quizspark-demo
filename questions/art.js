/* ============================================================
   QuizSpark — questions/art.js
   Arts & Literature question bank.

   HOW THIS FILE WORKS:
   ─────────────────────────────────────────────────────────
   This file is loaded dynamically by js/themes.js when the
   user selects the Arts & Literature niche. It appends
   questions to the global QUESTIONS array defined in
   js/taxonomy.js.

   DO NOT add a new QUESTIONS declaration here.
   DO NOT use ES module syntax (import/export).
   All questions must be added inside the ART_QUESTIONS array
   below, between the opening [ and the closing ];

   ─────────────────────────────────────────────────────────
   QUESTION OBJECT FORMAT:
   ─────────────────────────────────────────────────────────
   Each question must follow this exact structure:

   {
     id:             "art_lit_shakespeare_001",
     niche:          "art",
     subNiche:       "lit",
     superSubNiche:  "shakespeare",
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
     Example: art_lit_shakespeare_001, art_lit_shakespeare_002 ...

   niche:
     Always "art" for this file.

   subNiche:
     Must match one of the sub-niche keys in taxonomy.js:
     "lit" | "vis" | "theatre" | "myth"

   superSubNiche:
     Must match one of the leaf keys under the chosen subNiche:
     lit     → "shakespeare" | "classic_novels" |
               "african_literature" | "poetry"
     vis     → "painting" | "sculpture" | "architecture"
     theatre → "broadway" | "greek_theatre"
     myth    → "greek_myth" | "norse_myth" |
               "egyptian_myth" | "african_myth"

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
      (e.g. Literature › Shakespeare).
   2. Add your question object after the section comment.
   3. Number sequentially from _001 — check the last ID in
      that section to avoid duplicates.
   4. Aim for the difficulty distribution:
      30% difficulty:1 / 35% difficulty:2 /
      25% difficulty:3 / 10% difficulty:4
   5. Save the file. No build step needed.

   ─────────────────────────────────────────────────────────
   SECTIONS IN THIS FILE (13 leaf nodes):
   ─────────────────────────────────────────────────────────
   Literature          → shakespeare, classic_novels,
                         african_literature, poetry
   Visual Arts         → painting, sculpture, architecture
   Theatre             → broadway, greek_theatre
   Mythology           → greek_myth, norse_myth,
                         egyptian_myth, african_myth
   ============================================================ */

(function () {
  const ART_QUESTIONS = [

    /* ── Literature › Shakespeare ────────────────────────────
       ID format: art_lit_shakespeare_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Literature › Classic Novels ────────────────────────
       ID format: art_lit_classic_novels_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Literature › African Literature ────────────────────
       ID format: art_lit_african_literature_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Literature › Poetry ─────────────────────────────────
       ID format: art_lit_poetry_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Visual Arts › Painting ──────────────────────────────
       ID format: art_vis_painting_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Visual Arts › Sculpture ─────────────────────────────
       ID format: art_vis_sculpture_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Visual Arts › Architecture ─────────────────────────
       ID format: art_vis_architecture_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Theatre & Performance › Broadway & Musicals ─────────
       ID format: art_theatre_broadway_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Theatre & Performance › Greek Theatre ───────────────
       ID format: art_theatre_greek_theatre_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Mythology › Greek Mythology ────────────────────────
       ID format: art_myth_greek_myth_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Mythology › Norse Mythology ────────────────────────
       ID format: art_myth_norse_myth_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Mythology › Egyptian Mythology ─────────────────────
       ID format: art_myth_egyptian_myth_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Mythology › African Mythology ──────────────────────
       ID format: art_myth_african_myth_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


  ];

  // Append to global QUESTIONS array (defined in js/taxonomy.js)
  if (typeof QUESTIONS !== 'undefined') {
    QUESTIONS.push(...ART_QUESTIONS);
  } else {
    console.warn('QuizSpark: QUESTIONS global not found. Ensure taxonomy.js loads first.');
  }
})();

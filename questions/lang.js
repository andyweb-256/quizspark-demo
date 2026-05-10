/* ============================================================
   QuizSpark — questions/lang.js
   Language & Words question bank.

   HOW THIS FILE WORKS:
   ─────────────────────────────────────────────────────────
   This file is loaded dynamically by js/themes.js when the
   user selects the Language & Words niche. It appends
   questions to the global QUESTIONS array defined in
   js/taxonomy.js.

   DO NOT add a new QUESTIONS declaration here.
   DO NOT use ES module syntax (import/export).
   All questions must be added inside the LANG_QUESTIONS array
   below, between the opening [ and the closing ];

   ─────────────────────────────────────────────────────────
   QUESTION OBJECT FORMAT:
   ─────────────────────────────────────────────────────────
   Each question must follow this exact structure:

   {
     id:             "lang_ety_word_origins_001",
     niche:          "lang",
     subNiche:       "ety",
     superSubNiche:  "word_origins",
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
     Example: lang_ety_word_origins_001, _002 ...

   niche:
     Always "lang" for this file.

   subNiche:
     Must match one of the sub-niche keys in taxonomy.js:
     "ety" | "world" | "idiom" | "ling"

   superSubNiche:
     Must match one of the leaf keys under the chosen subNiche:
     ety   → "word_origins" | "borrowed_words"
     world → "most_spoken" | "language_families" |
              "endangered_languages"
     idiom → "english_idioms" | "global_proverbs"
     ling  → "grammar" | "phonetics"

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
      (e.g. Etymology › Word Origins).
   2. Add your question object after the section comment.
   3. Number sequentially from _001 — check the last ID in
      that section to avoid duplicates.
   4. Aim for the difficulty distribution:
      30% difficulty:1 / 35% difficulty:2 /
      25% difficulty:3 / 10% difficulty:4
   5. Save the file. No build step needed.

   ─────────────────────────────────────────────────────────
   SECTIONS IN THIS FILE (9 leaf nodes):
   ─────────────────────────────────────────────────────────
   Etymology        → word_origins, borrowed_words
   World Languages  → most_spoken, language_families,
                      endangered_languages
   Idioms & Proverbs→ english_idioms, global_proverbs
   Linguistics      → grammar, phonetics
   ============================================================ */

(function () {
  const LANG_QUESTIONS = [

    /* ── Etymology › Word Origins ────────────────────────────
       ID format: lang_ety_word_origins_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Etymology › Borrowed Words ─────────────────────────
       ID format: lang_ety_borrowed_words_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── World Languages › Most Spoken Languages ────────────
       ID format: lang_world_most_spoken_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── World Languages › Language Families ────────────────
       ID format: lang_world_language_families_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── World Languages › Endangered Languages ─────────────
       ID format: lang_world_endangered_languages_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Idioms & Proverbs › English Idioms ─────────────────
       ID format: lang_idiom_english_idioms_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Idioms & Proverbs › Global Proverbs ────────────────
       ID format: lang_idiom_global_proverbs_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Linguistics › Grammar ───────────────────────────────
       ID format: lang_ling_grammar_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Linguistics › Phonetics & Sounds ───────────────────
       ID format: lang_ling_phonetics_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


  ];

  // Append to global QUESTIONS array (defined in js/taxonomy.js)
  if (typeof QUESTIONS !== 'undefined') {
    QUESTIONS.push(...LANG_QUESTIONS);
  } else {
    console.warn('QuizSpark: QUESTIONS global not found. Ensure taxonomy.js loads first.');
  }
})();

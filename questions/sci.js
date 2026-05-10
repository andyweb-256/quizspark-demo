/* ============================================================
   QuizSpark — questions/sci.js
   Science & Technology question bank.

   HOW THIS FILE WORKS:
   ─────────────────────────────────────────────────────────
   This file is loaded dynamically by js/themes.js when the
   user selects the Science & Technology niche. It appends
   questions to the global QUESTIONS array defined in
   js/taxonomy.js.

   DO NOT add a new QUESTIONS declaration here.
   DO NOT use ES module syntax (import/export).
   All questions must be added inside the SCI_QUESTIONS array
   below, between the opening [ and the closing ];

   ─────────────────────────────────────────────────────────
   QUESTION OBJECT FORMAT:
   ─────────────────────────────────────────────────────────
   Each question must follow this exact structure:

   {
     id:             "sci_phy_mechanics_001",
     niche:          "sci",
     subNiche:       "phy",
     superSubNiche:  "mechanics",
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
     Example: sci_phy_mechanics_001, sci_phy_mechanics_002 ...

   niche:
     Always "sci" for this file.

   subNiche:
     Must match one of the sub-niche keys in taxonomy.js:
     "phy" | "bio" | "chem" | "space" | "comp"

   superSubNiche:
     Must match one of the leaf keys under the chosen subNiche:
     phy   → "mechanics" | "thermo" | "optics" | "quantum" | "relativity"
     bio   → "cell_biology" | "genetics" | "ecology" | "anatomy" | "evolution"
     chem  → "elements" | "reactions" | "organic" | "bonding"
     space → "planets" | "stars" | "galaxies" | "space_exploration"
     comp  → "programming" | "hardware" | "internet" | "ai_ml"

   difficulty:
     1 = Cadet   (easy, ~30% of questions)
     2 = Veteran (medium, ~35% of questions)
     3 = Elite   (hard, ~25% of questions)
     4 = Mastermind (very hard, ~10% of questions)

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
   1. Find the correct section comment below (e.g. Physics › Mechanics).
   2. Add your question object after the section comment.
   3. Number sequentially from _001 — check the last ID in
      that section to avoid duplicates.
   4. Aim for the difficulty distribution:
      30% difficulty:1 / 35% difficulty:2 /
      25% difficulty:3 / 10% difficulty:4
   5. Save the file. No build step needed.

   ─────────────────────────────────────────────────────────
   SECTIONS IN THIS FILE (21 leaf nodes):
   ─────────────────────────────────────────────────────────
   Physics      → mechanics, thermo, optics, quantum, relativity
   Biology      → cell_biology, genetics, ecology, anatomy, evolution
   Chemistry    → elements, reactions, organic, bonding
   Space        → planets, stars, galaxies, space_exploration
   Computing    → programming, hardware, internet, ai_ml
   ============================================================ */

(function () {
  const SCI_QUESTIONS = [

    /* ── Physics › Mechanics ─────────────────────────────────
       ID format: sci_phy_mechanics_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Physics › Thermodynamics ────────────────────────────
       ID format: sci_phy_thermo_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Physics › Optics & Light ────────────────────────────
       ID format: sci_phy_optics_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Physics › Quantum ───────────────────────────────────
       ID format: sci_phy_quantum_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Physics › Relativity ────────────────────────────────
       ID format: sci_phy_relativity_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Biology › Cell Biology ──────────────────────────────
       ID format: sci_bio_cell_biology_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Biology › Genetics ──────────────────────────────────
       ID format: sci_bio_genetics_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Biology › Ecology ───────────────────────────────────
       ID format: sci_bio_ecology_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Biology › Human Anatomy ─────────────────────────────
       ID format: sci_bio_anatomy_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Biology › Evolution ─────────────────────────────────
       ID format: sci_bio_evolution_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Chemistry › Elements & Periodic Table ───────────────
       ID format: sci_chem_elements_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Chemistry › Chemical Reactions ─────────────────────
       ID format: sci_chem_reactions_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Chemistry › Organic Chemistry ──────────────────────
       ID format: sci_chem_organic_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Chemistry › Atomic Bonding ─────────────────────────
       ID format: sci_chem_bonding_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Space › Planets & Moons ─────────────────────────────
       ID format: sci_space_planets_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Space › Stars & Stellar Objects ─────────────────────
       ID format: sci_space_stars_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Space › Galaxies & Cosmology ────────────────────────
       ID format: sci_space_galaxies_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Space › Space Exploration ───────────────────────────
       ID format: sci_space_space_exploration_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Computing › Programming ─────────────────────────────
       ID format: sci_comp_programming_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Computing › Hardware & Systems ─────────────────────
       ID format: sci_comp_hardware_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Computing › The Internet ────────────────────────────
       ID format: sci_comp_internet_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Computing › AI & Machine Learning ───────────────────
       ID format: sci_comp_ai_ml_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


  ];

  // Append to global QUESTIONS array (defined in js/taxonomy.js)
  if (typeof QUESTIONS !== 'undefined') {
    QUESTIONS.push(...SCI_QUESTIONS);
  } else {
    console.warn('QuizSpark: QUESTIONS global not found. Ensure taxonomy.js loads first.');
  }
})();

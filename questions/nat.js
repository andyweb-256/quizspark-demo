/* ============================================================
   QuizSpark — questions/nat.js
   Food & Nature question bank.

   HOW THIS FILE WORKS:
   ─────────────────────────────────────────────────────────
   This file is loaded dynamically by js/themes.js when the
   user selects the Food & Nature niche. It appends questions
   to the global QUESTIONS array defined in js/taxonomy.js.

   DO NOT add a new QUESTIONS declaration here.
   DO NOT use ES module syntax (import/export).
   All questions must be added inside the NAT_QUESTIONS array
   below, between the opening [ and the closing ];

   ─────────────────────────────────────────────────────────
   QUESTION OBJECT FORMAT:
   ─────────────────────────────────────────────────────────
   Each question must follow this exact structure:

   {
     id:             "nat_food_world_cuisines_001",
     niche:          "nat",
     subNiche:       "food",
     superSubNiche:  "world_cuisines",
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
     Example: nat_food_world_cuisines_001, _002 ...

   niche:
     Always "nat" for this file.

   subNiche:
     Must match one of the sub-niche keys in taxonomy.js:
     "food" | "animal" | "plant" | "eco"

   superSubNiche:
     Must match one of the leaf keys under the chosen subNiche:
     food   → "world_cuisines" | "ingredients" |
               "cooking_techniques"
     animal → "mammals" | "marine_life" | "birds" | "insects"
     plant  → "trees" | "flowers" | "fungi"
     eco    → "rainforest" | "savanna" | "ocean_ecosystems"

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
      (e.g. Food & Cooking › World Cuisines).
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
   Food & Cooking    → world_cuisines, ingredients,
                       cooking_techniques
   Animals           → mammals, marine_life, birds, insects
   Plants & Fungi    → trees, flowers, fungi
   Ecosystems        → rainforest, savanna, ocean_ecosystems
   ============================================================ */

(function () {
  const NAT_QUESTIONS = [

    /* ── Food & Cooking › World Cuisines ─────────────────────
       ID format: nat_food_world_cuisines_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Food & Cooking › Ingredients & Spices ───────────────
       ID format: nat_food_ingredients_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Food & Cooking › Cooking Techniques ────────────────
       ID format: nat_food_cooking_techniques_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Animals & Wildlife › Mammals ───────────────────────
       ID format: nat_animal_mammals_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Animals & Wildlife › Marine Life ───────────────────
       ID format: nat_animal_marine_life_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Animals & Wildlife › Birds ─────────────────────────
       ID format: nat_animal_birds_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Animals & Wildlife › Insects & Arachnids ───────────
       ID format: nat_animal_insects_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Plants & Fungi › Trees & Forests ───────────────────
       ID format: nat_plant_trees_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Plants & Fungi › Flowers & Flowering Plants ─────────
       ID format: nat_plant_flowers_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Plants & Fungi › Fungi & Mushrooms ─────────────────
       ID format: nat_plant_fungi_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Ecosystems › Rainforests ────────────────────────────
       ID format: nat_eco_rainforest_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Ecosystems › Savannas & Grasslands ─────────────────
       ID format: nat_eco_savanna_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Ecosystems › Ocean Ecosystems ──────────────────────
       ID format: nat_eco_ocean_ecosystems_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


  ];

  // Append to global QUESTIONS array (defined in js/taxonomy.js)
  if (typeof QUESTIONS !== 'undefined') {
    QUESTIONS.push(...NAT_QUESTIONS);
  } else {
    console.warn('QuizSpark: QUESTIONS global not found. Ensure taxonomy.js loads first.');
  }
})();

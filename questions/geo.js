/* ============================================================
   QuizSpark — questions/geo.js
   Geography question bank.

   HOW THIS FILE WORKS:
   ─────────────────────────────────────────────────────────
   This file is loaded dynamically by js/themes.js when the
   user selects the Geography niche. It appends questions to
   the global QUESTIONS array defined in js/taxonomy.js.

   DO NOT add a new QUESTIONS declaration here.
   DO NOT use ES module syntax (import/export).
   All questions must be added inside the GEO_QUESTIONS array
   below, between the opening [ and the closing ];

   ─────────────────────────────────────────────────────────
   QUESTION OBJECT FORMAT:
   ─────────────────────────────────────────────────────────
   Each question must follow this exact structure:

   {
     id:             "geo_cap_africa_capitals_001",
     niche:          "geo",
     subNiche:       "cap",
     superSubNiche:  "africa_capitals",
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
     Example: geo_cap_africa_capitals_001, _002 ...

   niche:
     Always "geo" for this file.

   subNiche:
     Must match one of the sub-niche keys in taxonomy.js:
     "cap" | "land" | "flags" | "oceans" | "climate"

   superSubNiche:
     Must match one of the leaf keys under the chosen subNiche:
     cap     → "africa_capitals" | "europe_capitals" |
               "asia_capitals" | "americas_capitals"
     land    → "mountains" | "rivers" | "deserts" | "islands"
     flags   → "africa_flags" | "europe_flags" |
               "asia_flags" | "americas_flags"
     oceans  → "seas_and_oceans" | "currents"
     climate → "zones" | "weather_phenomena"

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
      (e.g. World Capitals › African Capitals).
   2. Add your question object after the section comment.
   3. Number sequentially from _001 — check the last ID in
      that section to avoid duplicates.
   4. Aim for the difficulty distribution:
      30% difficulty:1 / 35% difficulty:2 /
      25% difficulty:3 / 10% difficulty:4
   5. Save the file. No build step needed.

   ─────────────────────────────────────────────────────────
   SECTIONS IN THIS FILE (16 leaf nodes):
   ─────────────────────────────────────────────────────────
   World Capitals   → africa_capitals, europe_capitals,
                      asia_capitals, americas_capitals
   Landforms        → mountains, rivers, deserts, islands
   Flags & Borders  → africa_flags, europe_flags,
                      asia_flags, americas_flags
   Oceans & Seas    → seas_and_oceans, currents
   Climate          → zones, weather_phenomena
   ============================================================ */

(function () {
  const GEO_QUESTIONS = [

    /* ── World Capitals › African Capitals ───────────────────
       ID format: geo_cap_africa_capitals_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── World Capitals › European Capitals ──────────────────
       ID format: geo_cap_europe_capitals_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── World Capitals › Asian Capitals ─────────────────────
       ID format: geo_cap_asia_capitals_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── World Capitals › Americas Capitals ──────────────────
       ID format: geo_cap_americas_capitals_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Landforms › Mountains & Ranges ─────────────────────
       ID format: geo_land_mountains_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Landforms › Rivers & Lakes ─────────────────────────
       ID format: geo_land_rivers_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Landforms › Deserts ─────────────────────────────────
       ID format: geo_land_deserts_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Landforms › Islands & Archipelagos ─────────────────
       ID format: geo_land_islands_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Flags & Borders › African Flags ────────────────────
       ID format: geo_flags_africa_flags_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Flags & Borders › European Flags ───────────────────
       ID format: geo_flags_europe_flags_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Flags & Borders › Asian Flags ──────────────────────
       ID format: geo_flags_asia_flags_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Flags & Borders › Americas Flags ───────────────────
       ID format: geo_flags_americas_flags_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Oceans & Seas › Seas & Oceans ──────────────────────
       ID format: geo_oceans_seas_and_oceans_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Oceans & Seas › Ocean Currents ─────────────────────
       ID format: geo_oceans_currents_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Climate › Climate Zones ────────────────────────────
       ID format: geo_climate_zones_001, _002, _003 ...
       ADD QUESTIONS BELOW THIS LINE                          */


    /* ── Climate › Weather Phenomena ────────────────────────
       ID format: geo_climate_weather_phenomena_001, _002 ...
       ADD QUESTIONS BELOW THIS LINE                          */


  ];

  // Append to global QUESTIONS array (defined in js/taxonomy.js)
  if (typeof QUESTIONS !== 'undefined') {
    QUESTIONS.push(...GEO_QUESTIONS);
  } else {
    console.warn('QuizSpark: QUESTIONS global not found. Ensure taxonomy.js loads first.');
  }
})();

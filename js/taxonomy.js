/* ============================================================
   QuizSpark — js/taxonomy.js
   Defines the full niche tree. Must load before engine.js,
   ui.js, and all question files. Exported as a plain global.
   ============================================================ */

const TAXONOMY = [

  /* ── Science & Technology ─────────────────────────────────── */
  {
    key: "sci", label: "Science & Technology", icon: "⚗️", color: "#60b8ff",
    subs: [
      { key: "phy", label: "Physics", subs: [
        { key: "mechanics",   label: "Mechanics" },
        { key: "thermo",      label: "Thermodynamics" },
        { key: "optics",      label: "Optics & light" },
        { key: "quantum",     label: "Quantum physics" },
        { key: "relativity",  label: "Relativity" },
      ]},
      { key: "bio", label: "Biology", subs: [
        { key: "cell_biology", label: "Cell biology" },
        { key: "genetics",     label: "Genetics" },
        { key: "ecology",      label: "Ecology" },
        { key: "anatomy",      label: "Human anatomy" },
        { key: "evolution",    label: "Evolution" },
      ]},
      { key: "chem", label: "Chemistry", subs: [
        { key: "elements",  label: "Elements & periodic table" },
        { key: "reactions", label: "Chemical reactions" },
        { key: "organic",   label: "Organic chemistry" },
        { key: "bonding",   label: "Atomic bonding" },
      ]},
      { key: "space", label: "Space & Astronomy", subs: [
        { key: "planets",           label: "Planets & moons" },
        { key: "stars",             label: "Stars & stellar objects" },
        { key: "galaxies",          label: "Galaxies & cosmology" },
        { key: "space_exploration", label: "Space exploration" },
      ]},
      { key: "comp", label: "Computing & AI", subs: [
        { key: "programming", label: "Programming" },
        { key: "hardware",    label: "Hardware & systems" },
        { key: "internet",    label: "The internet" },
        { key: "ai_ml",       label: "AI & machine learning" },
      ]},
    ]
  },

  /* ── History ──────────────────────────────────────────────── */
  {
    key: "hist", label: "History", icon: "📜", color: "#fb923c",
    subs: [
      { key: "anc", label: "Ancient worlds", subs: [
        { key: "egypt",       label: "Ancient Egypt" },
        { key: "greece",      label: "Ancient Greece" },
        { key: "rome",        label: "Ancient Rome" },
        { key: "mesopotamia", label: "Mesopotamia" },
        { key: "china",       label: "Ancient China" },
      ]},
      { key: "wars", label: "Wars & conflicts", subs: [
        { key: "ww1",             label: "World War I" },
        { key: "ww2",             label: "World War II" },
        { key: "cold_war",        label: "The Cold War" },
        { key: "ancient_battles", label: "Ancient battles" },
      ]},
      { key: "col", label: "Colonialism & empire", subs: [
        { key: "africa_colonialism",     label: "Africa under colonialism" },
        { key: "asia_colonialism",       label: "Asia under colonialism" },
        { key: "independence_movements", label: "Independence movements" },
      ]},
      { key: "rev", label: "Revolutions", subs: [
        { key: "french_revolution",     label: "The French Revolution" },
        { key: "american_revolution",   label: "The American Revolution" },
        { key: "industrial_revolution", label: "Industrial Revolution" },
        { key: "african_independence",  label: "African independence" },
      ]},
      { key: "mod", label: "Modern era", subs: [
        { key: "20th_century", label: "20th century" },
        { key: "21st_century", label: "21st century" },
        { key: "inventions",   label: "Inventions & discoveries" },
      ]},
    ]
  },

  /* ── Geography ────────────────────────────────────────────── */
  {
    key: "geo", label: "Geography", icon: "🌍", color: "#34d399",
    subs: [
      { key: "cap", label: "World capitals", subs: [
        { key: "africa_capitals",   label: "African capitals" },
        { key: "europe_capitals",   label: "European capitals" },
        { key: "asia_capitals",     label: "Asian capitals" },
        { key: "americas_capitals", label: "Americas capitals" },
      ]},
      { key: "land", label: "Landforms", subs: [
        { key: "mountains", label: "Mountains & ranges" },
        { key: "rivers",    label: "Rivers & lakes" },
        { key: "deserts",   label: "Deserts" },
        { key: "islands",   label: "Islands & archipelagos" },
      ]},
      { key: "flags", label: "Flags & borders", subs: [
        { key: "africa_flags",   label: "African flags" },
        { key: "europe_flags",   label: "European flags" },
        { key: "asia_flags",     label: "Asian flags" },
        { key: "americas_flags", label: "Americas flags" },
      ]},
      { key: "oceans", label: "Oceans & seas", subs: [
        { key: "seas_and_oceans", label: "Seas & oceans" },
        { key: "currents",        label: "Ocean currents" },
      ]},
      { key: "climate", label: "Climate & weather", subs: [
        { key: "zones",             label: "Climate zones" },
        { key: "weather_phenomena", label: "Weather phenomena" },
      ]},
    ]
  },

  /* ── Pop Culture ──────────────────────────────────────────── */
  {
    key: "pop", label: "Pop Culture", icon: "🎬", color: "#f472b6",
    subs: [
      { key: "film", label: "Movies & film", subs: [
        { key: "classics",   label: "Classic films" },
        { key: "directors",  label: "Directors & cinematography" },
        { key: "franchises", label: "Franchises & sequels" },
        { key: "awards",     label: "Awards & records" },
      ]},
      { key: "mus", label: "Music", subs: [
        { key: "hiphop",          label: "Hip-hop & rap" },
        { key: "rock",            label: "Rock & alternative" },
        { key: "classical_music", label: "Classical music" },
        { key: "afrobeats",       label: "Afrobeats & African pop" },
        { key: "kpop",            label: "K-pop & Korean wave" },
      ]},
      { key: "tv", label: "TV & streaming", subs: [
        { key: "drama",     label: "Drama series" },
        { key: "comedy",    label: "Comedy series" },
        { key: "animation", label: "Animation & anime" },
      ]},
      { key: "games", label: "Gaming", subs: [
        { key: "video_games_history", label: "Gaming history" },
        { key: "gaming_characters",   label: "Characters & lore" },
        { key: "esports",             label: "Esports" },
      ]},
      { key: "internet", label: "Internet culture", subs: [
        { key: "memes",         label: "Memes & internet humour" },
        { key: "social_media",  label: "Social media" },
        { key: "viral_moments", label: "Viral moments" },
      ]},
    ]
  },

  /* ── Sports ───────────────────────────────────────────────── */
  {
    key: "spo", label: "Sports", icon: "⚽", color: "#378ADD",
    subs: [
      { key: "football", label: "Football (soccer)", subs: [
        { key: "premier_league", label: "Premier League" },
        { key: "world_cup",      label: "FIFA World Cup" },
        { key: "afcon",          label: "AFCON" },
        { key: "legends",        label: "Football legends" },
      ]},
      { key: "ath", label: "Athletics", subs: [
        { key: "olympics",          label: "The Olympics" },
        { key: "athletics_records", label: "World records" },
      ]},
      { key: "tennis", label: "Tennis", subs: [
        { key: "grand_slams",    label: "Grand Slams" },
        { key: "tennis_legends", label: "Tennis legends" },
      ]},
      { key: "cricket", label: "Cricket", subs: [
        { key: "test_cricket",    label: "Test cricket" },
        { key: "cricket_records", label: "Cricket records" },
      ]},
      { key: "bball", label: "Basketball", subs: [
        { key: "nba",  label: "NBA" },
        { key: "fiba", label: "FIBA & international" },
      ]},
      { key: "combat", label: "Combat sports", subs: [
        { key: "boxing", label: "Boxing" },
        { key: "mma",    label: "MMA & UFC" },
      ]},
    ]
  },

  /* ── Arts & Literature ────────────────────────────────────── */
  {
    key: "art", label: "Arts & Literature", icon: "🎭", color: "#a78bfa",
    subs: [
      { key: "lit", label: "Literature", subs: [
        { key: "shakespeare",       label: "Shakespeare" },
        { key: "classic_novels",    label: "Classic novels" },
        { key: "african_literature",label: "African literature" },
        { key: "poetry",            label: "Poetry" },
      ]},
      { key: "vis", label: "Visual arts", subs: [
        { key: "painting",     label: "Painting" },
        { key: "sculpture",    label: "Sculpture" },
        { key: "architecture", label: "Architecture" },
      ]},
      { key: "theatre", label: "Theatre & performance", subs: [
        { key: "broadway",      label: "Broadway & musicals" },
        { key: "greek_theatre", label: "Greek theatre" },
      ]},
      { key: "myth", label: "Mythology", subs: [
        { key: "greek_myth",    label: "Greek mythology" },
        { key: "norse_myth",    label: "Norse mythology" },
        { key: "egyptian_myth", label: "Egyptian mythology" },
        { key: "african_myth",  label: "African mythology" },
      ]},
    ]
  },

  /* ── Food & Nature ────────────────────────────────────────── */
  {
    key: "nat", label: "Food & Nature", icon: "🌿", color: "#f97316",
    subs: [
      { key: "food", label: "Food & cooking", subs: [
        { key: "world_cuisines",     label: "World cuisines" },
        { key: "ingredients",        label: "Ingredients & spices" },
        { key: "cooking_techniques", label: "Cooking techniques" },
      ]},
      { key: "animal", label: "Animals & wildlife", subs: [
        { key: "mammals",     label: "Mammals" },
        { key: "marine_life", label: "Marine life" },
        { key: "birds",       label: "Birds" },
        { key: "insects",     label: "Insects & arachnids" },
      ]},
      { key: "plant", label: "Plants & fungi", subs: [
        { key: "trees",   label: "Trees & forests" },
        { key: "flowers", label: "Flowers & flowering plants" },
        { key: "fungi",   label: "Fungi & mushrooms" },
      ]},
      { key: "eco", label: "Ecosystems", subs: [
        { key: "rainforest",       label: "Rainforests" },
        { key: "savanna",          label: "Savannas & grasslands" },
        { key: "ocean_ecosystems", label: "Ocean ecosystems" },
      ]},
    ]
  },

  /* ── Language & Words ─────────────────────────────────────── */
  {
    key: "lang", label: "Language & Words", icon: "💬", color: "#94a3b8",
    subs: [
      { key: "ety", label: "Etymology", subs: [
        { key: "word_origins",   label: "Word origins" },
        { key: "borrowed_words", label: "Borrowed words" },
      ]},
      { key: "world", label: "World languages", subs: [
        { key: "most_spoken",          label: "Most spoken languages" },
        { key: "language_families",    label: "Language families" },
        { key: "endangered_languages", label: "Endangered languages" },
      ]},
      { key: "idiom", label: "Idioms & proverbs", subs: [
        { key: "english_idioms", label: "English idioms" },
        { key: "global_proverbs",label: "Global proverbs" },
      ]},
      { key: "ling", label: "Linguistics", subs: [
        { key: "grammar",   label: "Grammar" },
        { key: "phonetics", label: "Phonetics & sounds" },
      ]},
    ]
  },

];


/* ── Helpers ──────────────────────────────────────────────────
   Utility functions that read TAXONOMY.
   Used by engine.js and ui.js — no ES modules, plain globals.
   ────────────────────────────────────────────────────────── */

/**
 * getTaxonomyNode(nicheKey, subKey, superKey)
 * Returns the matching node at any depth of the tree.
 * Pass only nicheKey to get the top-level niche object.
 * Pass nicheKey + subKey to get the sub-niche object.
 * Pass all three to get the super-sub-niche leaf.
 */
function getTaxonomyNode(nicheKey, subKey, superKey) {
  const niche = TAXONOMY.find(n => n.key === nicheKey);
  if (!niche) return null;
  if (!subKey) return niche;
  const sub = niche.subs.find(s => s.key === subKey);
  if (!sub) return null;
  if (!superKey) return sub;
  return (sub.subs || []).find(ss => ss.key === superKey) || null;
}

/**
 * getAllSuperSubs(nicheKey, subKey)
 * Returns a flat array of all super-sub-niche leaf keys
 * under the given niche (and optionally sub-niche).
 * Used by the engine to know which question files to filter.
 */
function getAllSuperSubs(nicheKey, subKey) {
  const niche = TAXONOMY.find(n => n.key === nicheKey);
  if (!niche) return [];
  const subs = subKey
    ? niche.subs.filter(s => s.key === subKey)
    : niche.subs;
  const leaves = [];
  subs.forEach(s => (s.subs || []).forEach(ss => leaves.push(ss.key)));
  return leaves;
}

/**
 * getNicheColor(nicheKey)
 * Quick lookup for a niche's accent color string.
 */
function getNicheColor(nicheKey) {
  const niche = TAXONOMY.find(n => n.key === nicheKey);
  return niche ? niche.color : '#60b8ff';
}

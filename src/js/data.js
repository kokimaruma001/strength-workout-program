// ─── WORKOUT DATA ────────────────────────────────────────────────────────────
const WORKOUTS = [
  {
    key: "lower", label: "LOWER POWER", focus: "Strength Foundation",
    gym: [
      { id: "sq",  name: "Barbell Back Squat",        sets: "5x3",    note: "Heavy — 85%+ 1RM",               weighted: true },
      { id: "dl",  name: "Conventional Deadlift",     sets: "4x3",    note: "Explosive pull",                  weighted: true },
      { id: "bs",  name: "Belt Squat",                sets: "3x8",    note: "Quad pump + knee health",         weighted: true },
      { id: "rh",  name: "Reverse Hyperextension",    sets: "3x15",   note: "Lower back protection",           weighted: false },
      { id: "ca",  name: "Farmer's Walk",             sets: "4x20m",  note: "Grip & full body tension",        weighted: true },
    ],
    home: [
      { id: "jp",  name: "Goblet Squat",                sets: "4x10",   note: "KB-held squat pattern — brace and drive", weighted: true,  equipment: "🏋️ KB" },
      { id: "sl",  name: "KB Romanian Deadlift",        sets: "3x8",    note: "Hinge with controlled tempo",            weighted: true,  equipment: "🏋️ KB" },
      { id: "lp",  name: "Bulgarian Split Squat (KB-loaded)", sets: "3x10ea", note: "Single-leg strength + balance",          weighted: true,  equipment: "🏋️ KB" },
      { id: "glb", name: "KB Swing",                    sets: "4x15",   note: "Hip hinge power and tempo",              weighted: true,  equipment: "🏋️ KB" },
      { id: "hp",  name: "MB Squat-to-Press",          sets: "3x8",    note: "Explosive squat + overhead transfer",    weighted: true,  equipment: "🟠 MB" },
    ],
  },
  {
    key: "upper", label: "UPPER POWER", focus: "Push & Pull Strength",
    gym: [
      { id: "bp",  name: "Bench Press",               sets: "5x3",    note: "Heavy + explosive press",         weighted: true },
      { id: "wpu", name: "Weighted Pull-Ups",         sets: "4x5",    note: "Control the negative",            weighted: true },
      { id: "op",  name: "Overhead Press",            sets: "4x5",    note: "Strict — no leg drive",           weighted: true },
      { id: "dbr", name: "Heavy Dumbbell Row",        sets: "4x8ea",  note: "Drop to floor between reps",      weighted: true },
      { id: "wd",  name: "Weighted Dips",             sets: "3x8",    note: "Full ROM — chest dip",            weighted: true },
      { id: "fc",  name: "Face Pulls",                sets: "3x20",   note: "Shoulder health",                 weighted: false },
    ],
    home: [
      { id: "pup", name: "KB Floor Press",             sets: "4x8",    note: "Strong pressing without rack",         weighted: true,  equipment: "🏋️ KB" },
      { id: "inv", name: "KB/MB Push-Up Variation",   sets: "3x12",   note: "Push-up with MB on back or KB on chest", weighted: false, equipment: "🏋️ KB + 🟠 MB" },
      { id: "pke", name: "Pike Push-Up",               sets: "3x10",   note: "Shoulder strength and overhead pressing pattern", weighted: false, equipment: "🧍 Bodyweight" },
      { id: "arc", name: "Single-Arm KB Overhead Press", sets: "3x8ea", note: "Strict unilateral press for shoulders", weighted: true, equipment: "🏋️ KB" },
      { id: "iso", name: "KB Renegade Row",            sets: "3x8ea",  note: "Anti-rotation row under load",         weighted: true,  equipment: "🏋️ KB" },
    ],
  },
  {
    key: "fullbody", label: "FULL BODY POWER", focus: "Combat Athleticism",
    gym: [
      { id: "pdl", name: "Rack Pull Deadlift",        sets: "3x3",    note: "Max weight — pure power",         weighted: true },
      { id: "mbs", name: "Medicine Ball Slam",        sets: "4x8",    note: "Explosive — full body",           weighted: true },
      { id: "kbs", name: "Kettlebell Swing",          sets: "4x15",   note: "Hip hinge power",                 weighted: true },
      { id: "wp2", name: "Weighted Pull-Ups",         sets: "3x5",    note: "Progress from upper day",         weighted: true },
      { id: "lnd", name: "Landmine Rotational Press", sets: "3x10ea", note: "Rotational power = combat ready", weighted: true },
      { id: "sld", name: "Sled Push/Pull",            sets: "4x20m",  note: "Conditioning + leg drive",        weighted: true },
    ],
    home: [
      { id: "bxj", name: "KB Clean & Press",          sets: "4x6ea",  note: "Explosive full-body transfer",        weighted: true,  equipment: "🏋️ KB" },
      { id: "mbt", name: "KB Snatch",                 sets: "4x6ea",  note: "Power and coordination through the hips", weighted: true, equipment: "🏋️ KB" },
      { id: "mtc", name: "MB Full-Body Slam",         sets: "4x8",    note: "Explosive throw with force transfer", weighted: true,  equipment: "🟠 MB" },
      { id: "bkb", name: "Turkish Get-Up",            sets: "3x5ea",  note: "Control, stability, and shoulder strength", weighted: true, equipment: "🏋️ KB" },
      { id: "plk", name: "KB Thruster",               sets: "3x8",    note: "Squat to press under one load",       weighted: true,  equipment: "🏋️ KB" },
    ],
  },
  {
    key: "conditioning", label: "CONDITIONING", focus: "MMA Readiness",
    gym: [
      { id: "hb",  name: "Heavy Bag Rounds",          sets: "5x3min", note: "60sec rest — pace yourself",      weighted: false },
      { id: "spr", name: "Sprint Intervals",          sets: "8x40m",  note: "Full sprint — 90sec rest",        weighted: false },
      { id: "rj",  name: "Rope Jumps",                sets: "5x2min", note: "Footwork & conditioning",         weighted: false },
    ],
    home: [
      { id: "sbx", name: "Sprint/Shuttle Finisher",   sets: "6x20s",  note: "Bodyweight conditioning with quick feet", weighted: false, equipment: "🧍 Bodyweight" },
      { id: "hit", name: "KB Swing Intervals",        sets: "8x20s",  note: "High-output hip hinge conditioning",     weighted: true,  equipment: "🏋️ KB" },
      { id: "rcj", name: "MB Slam Intervals",         sets: "6x10",   note: "Fast MB slams for power endurance",      weighted: true,  equipment: "🟠 MB" },
    ],
  },
];

const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DAILY_MOBILITY = [
  "Hip 90/90 stretch — 2min each side",
  "Thoracic rotation — 10 reps each side",
  "Dead hang (30sec) — shoulder decompression",
  "Hip flexor lunge stretch — 90sec each side",
  "Glute bridge hold — 30sec",
  "Shoulder dislocations with band/towel — 10 reps",
];

// ─── EXERCISE METADATA FOR ALTERNATIVES ───────────────────────────────────────
// Map exercises to categories for finding alternatives. Each exercise now includes
// four substitutes for gym mode and four for home mode, plus additional strength/power
// alternatives that are surfaced in the modal without changing the base workout lists.
const EXERCISE_CATEGORIES = {
  // Lower Power
  "sq":   { category: "squat", name: "Barbell Back Squat", alternatives: { gym: ["bs", "pdl", "lnd", "ca"], home: ["jp", "lp", "sl", "glb"] } },
  "dl":   { category: "deadlift", name: "Conventional Deadlift", alternatives: { gym: ["pdl", "sld", "ca", "lnd"], home: ["sl", "glb", "hp", "jp"] } },
  "bs":   { category: "squat", name: "Belt Squat", alternatives: { gym: ["sq", "pdl", "ca", "lnd"], home: ["jp", "lp", "sl", "glb"] } },
  "rh":   { category: "posterior_chain", name: "Reverse Hyperextension", alternatives: { gym: ["ca", "sld", "pdl", "lnd"], home: ["glb", "hp", "sl", "lp"] } },
  "ca":   { category: "grip_tension", name: "Farmer's Walk", alternatives: { gym: ["sld", "lnd", "pdl", "kbs"], home: ["mtc", "bkb", "jp", "hp"] } },
  "jp":   { category: "squat", name: "Jump Squats", alternatives: { gym: ["sq", "bs", "pdl", "bp"], home: ["lp", "sl", "glb", "hp"] } },
  "sl":   { category: "deadlift", name: "Single-Leg RDL", alternatives: { gym: ["dl", "pdl", "ca", "lnd"], home: ["jp", "lp", "glb", "hp"] } },
  "lp":   { category: "squat", name: "Lateral Lunges", alternatives: { gym: ["sq", "bs", "bp", "wd"], home: ["jp", "sl", "glb", "hp"] } },
  "glb":  { category: "posterior_chain", name: "Glute Bridge w/ Pause", alternatives: { gym: ["rh", "dl", "pdl", "ca"], home: ["hp", "sl", "jp", "lp"] } },
  "hp":   { category: "posterior_chain", name: "Hip Thrust", alternatives: { gym: ["rh", "dl", "pdl", "ca"], home: ["glb", "sl", "jp", "lp"] } },
  // Upper Power
  "bp":   { category: "pressing", name: "Bench Press", alternatives: { gym: ["wd", "op", "lnd", "ca"], home: ["pup", "pke", "arc", "inv"] } },
  "wpu":  { category: "pulling", name: "Weighted Pull-Ups", alternatives: { gym: ["dbr", "wd", "op", "bp"], home: ["inv", "iso", "pup", "arc"] } },
  "op":   { category: "pressing", name: "Overhead Press", alternatives: { gym: ["bp", "wd", "lnd", "ca"], home: ["pke", "arc", "pup", "iso"] } },
  "dbr":  { category: "pulling", name: "Heavy Dumbbell Row", alternatives: { gym: ["wpu", "bp", "wd", "op"], home: ["inv", "iso", "pup", "arc"] } },
  "wd":   { category: "pressing", name: "Weighted Dips", alternatives: { gym: ["bp", "op", "lnd", "ca"], home: ["pup", "pke", "arc", "inv"] } },
  "fc":   { category: "shoulder_health", name: "Face Pulls", alternatives: { gym: ["op", "bp", "dbr", "wpu"], home: ["pup", "pke", "arc", "iso"] } },
  "pup":  { category: "pressing", name: "Push-Ups (weighted bag)", alternatives: { gym: ["bp", "wd", "op", "lnd"], home: ["arc", "pke", "inv", "iso"] } },
  "inv":  { category: "pulling", name: "Inverted Row", alternatives: { gym: ["wpu", "dbr", "bp", "wd"], home: ["pup", "arc", "pke", "iso"] } },
  "pke":  { category: "pressing", name: "Pike Push-Ups", alternatives: { gym: ["op", "bp", "wd", "lnd"], home: ["arc", "pup", "inv", "iso"] } },
  "arc":  { category: "pressing", name: "Archer Push-Ups", alternatives: { gym: ["bp", "op", "wd", "lnd"], home: ["pup", "pke", "inv", "iso"] } },
  "iso":  { category: "pulling", name: "Isometric Pull", alternatives: { gym: ["wpu", "dbr", "bp", "op"], home: ["inv", "pup", "arc", "pke"] } },
  // Full Body Power
  "pdl":  { category: "deadlift", name: "Rack Pull Deadlift", alternatives: { gym: ["dl", "sq", "sld", "ca"], home: ["sl", "glb", "hp", "jp"] } },
  "mbs":  { category: "explosive", name: "Medicine Ball Slam", alternatives: { gym: ["kbs", "sld", "lnd", "ca"], home: ["bxj", "mbt", "mtc", "bkb"] } },
  "kbs":  { category: "explosive", name: "Kettlebell Swing", alternatives: { gym: ["mbs", "pdl", "sld", "ca"], home: ["bxj", "mbt", "mtc", "jp"] } },
  "wp2":  { category: "pulling", name: "Weighted Pull-Ups", alternatives: { gym: ["wpu", "dbr", "bp", "op"], home: ["inv", "iso", "pup", "arc"] } },
  "lnd":  { category: "rotational", name: "Landmine Rotational Press", alternatives: { gym: ["ca", "bp", "op", "wd"], home: ["pke", "arc", "pup", "jp"] } },
  "sld":  { category: "explosive", name: "Sled Push/Pull", alternatives: { gym: ["ca", "kbs", "pdl", "mbs"], home: ["mtc", "bkb", "jp", "sl"] } },
  // Full Body Home
  "bxj":  { category: "explosive", name: "Burpee Box Jump", alternatives: { gym: ["mbs", "kbs", "pdl", "ca"], home: ["mbt", "mtc", "bkb", "plk"] } },
  "mbt":  { category: "explosive", name: "Heavy Object Throw", alternatives: { gym: ["mbs", "kbs", "pdl", "sld"], home: ["bxj", "mtc", "bkb", "plk"] } },
  "mtc":  { category: "conditioning", name: "Mountain Climbers", alternatives: { gym: ["sld", "ca", "kbs", "mbs"], home: ["bkb", "bxj", "plk", "hit"] } },
  "bkb":  { category: "conditioning", name: "Bear Crawl", alternatives: { gym: ["sld", "ca", "kbs", "mbs"], home: ["mtc", "bxj", "plk", "hit"] } },
  "plk":  { category: "core", name: "Plank w/ Hip Tap", alternatives: { gym: ["ca", "sld", "mbs", "kbs"], home: ["mtc", "bkb", "bxj", "hit"] } },
  // Conditioning
  "hb":   { category: "conditioning", name: "Heavy Bag Rounds", alternatives: { gym: ["spr", "rj", "sld", "ca"], home: ["sbx", "hit", "rcj", "mtc"] } },
  "spr":  { category: "conditioning", name: "Sprint Intervals", alternatives: { gym: ["hb", "rj", "ca", "lnd"], home: ["sbx", "hit", "rcj", "mtc"] } },
  "rj":   { category: "conditioning", name: "Rope Jumps", alternatives: { gym: ["spr", "hb", "ca", "lnd"], home: ["rcj", "sbx", "hit", "mtc"] } },
  "sbx":  { category: "conditioning", name: "Shadow Boxing", alternatives: { gym: ["hb", "spr", "rj", "ca"], home: ["hit", "rcj", "mtc", "bkb"] } },
  "hit":  { category: "conditioning", name: "HIIT Circuit", alternatives: { gym: ["hb", "spr", "rj", "ca"], home: ["sbx", "rcj", "mtc", "bkb"] } },
  "rcj":  { category: "conditioning", name: "Rope Jump", alternatives: { gym: ["hb", "spr", "rj", "ca"], home: ["sbx", "hit", "mtc", "bkb"] } },
};

function getEquipmentLabel(exercise) {
  if (!exercise) return '🧍 Bodyweight';
  if (exercise.equipment) return exercise.equipment;
  const name = String(exercise.name || '').toLowerCase();
  if (name.includes('medicine ball') || name.includes('med ball') || name.includes('mb')) return '🟠 MB';
  if (name.includes('kettlebell') || name.includes('kb')) return '🏋️ KB';
  return '🧍 Bodyweight';
}

const EXTRA_ALTERNATIVES = {
  sq: { gym: [{ id: "sq-front-squat", name: "Front Squat", sets: "4x6", note: "Barbell front rack squat", weighted: true }, { id: "sq-safety-bar-squat", name: "Safety Bar Squat", sets: "3x8", note: "More torso-friendly squat variation", weighted: true }, { id: "sq-zercher-squat", name: "Zercher Squat", sets: "3x8", note: "Front-loaded squat for core tension", weighted: true }], home: [{ id: "sq-front-squat", name: "Front Squat", sets: "4x6", note: "Barbell front rack squat", weighted: true }, { id: "sq-safety-bar-squat", name: "Safety Bar Squat", sets: "3x8", note: "More torso-friendly squat variation", weighted: true }, { id: "sq-zercher-squat", name: "Zercher Squat", sets: "3x8", note: "Front-loaded squat for core tension", weighted: true }] },
  dl: { gym: [{ id: "dl-trap-bar-deadlift", name: "Trap Bar Deadlift", sets: "4x5", note: "More upright torso position", weighted: true }, { id: "dl-sumo-deadlift", name: "Sumo Deadlift", sets: "4x4", note: "Wide stance pull for leg drive", weighted: true }, { id: "dl-block-pull", name: "Block Pull", sets: "4x3", note: "Short-range strength pull", weighted: true }], home: [{ id: "dl-trap-bar-deadlift", name: "Trap Bar Deadlift", sets: "4x5", note: "More upright torso position", weighted: true }, { id: "dl-sumo-deadlift", name: "Sumo Deadlift", sets: "4x4", note: "Wide stance pull for leg drive", weighted: true }, { id: "dl-block-pull", name: "Block Pull", sets: "4x3", note: "Short-range strength pull", weighted: true }] },
  bs: { gym: [{ id: "bs-zercher-squat", name: "Zercher Squat", sets: "3x8", note: "Front-loaded squat for core tension", weighted: true }, { id: "bs-goblet-squat", name: "Goblet Squat", sets: "3x10", note: "Great squat pattern under load", weighted: true }, { id: "bs-front-squat", name: "Front Squat", sets: "3x8", note: "Rack-based squat variation", weighted: true }], home: [{ id: "bs-zercher-squat", name: "Zercher Squat", sets: "3x8", note: "Front-loaded squat for core tension", weighted: true }, { id: "bs-goblet-squat", name: "Goblet Squat", sets: "3x10", note: "Great squat pattern under load", weighted: true }, { id: "bs-front-squat", name: "Front Squat", sets: "3x8", note: "Rack-based squat variation", weighted: true }] },
  rh: { gym: [{ id: "rh-good-morning", name: "Good Morning", sets: "3x8", note: "Posterior chain hinge strength", weighted: true }, { id: "rh-barbell-glute-bridge", name: "Barbell Glute Bridge", sets: "3x10", note: "Hip extension strength", weighted: true }, { id: "rh-back-extension", name: "45° Back Extension", sets: "3x12", note: "Lower-back fatigue management", weighted: true }], home: [{ id: "rh-good-morning", name: "Good Morning", sets: "3x8", note: "Posterior chain hinge strength", weighted: true }, { id: "rh-barbell-glute-bridge", name: "Barbell Glute Bridge", sets: "3x10", note: "Hip extension strength", weighted: true }, { id: "rh-back-extension", name: "45° Back Extension", sets: "3x12", note: "Lower-back fatigue management", weighted: true }] },
  ca: { gym: [{ id: "ca-suitcase-carry", name: "Suitcase Carry", sets: "4x20m", note: "Offset loading for anti-lateral flexion", weighted: true }, { id: "ca-trap-bar-carry", name: "Trap Bar Carry", sets: "4x20m", note: "Heavy carry with upright posture", weighted: true }, { id: "ca-yoke-walk", name: "Yoke Walk", sets: "4x20m", note: "Full-body bracing and carry strength", weighted: true }], home: [{ id: "ca-suitcase-carry", name: "Suitcase Carry", sets: "4x20m", note: "Offset loading for anti-lateral flexion", weighted: true }, { id: "ca-trap-bar-carry", name: "Trap Bar Carry", sets: "4x20m", note: "Heavy carry with upright posture", weighted: true }, { id: "ca-yoke-walk", name: "Yoke Walk", sets: "4x20m", note: "Full-body bracing and carry strength", weighted: true }] },
  jp: { gym: [{ id: "jp-box-jumps", name: "Box Jumps", sets: "4x6", note: "Explosive vertical jump", weighted: false }, { id: "jp-depth-jumps", name: "Depth Jumps", sets: "4x4", note: "Reactive power variation", weighted: false }, { id: "jp-trap-bar-jumps", name: "Trap Bar Jumps", sets: "4x4", note: "Explosive power through the hips", weighted: true }], home: [{ id: "jp-box-jumps", name: "Box Jumps", sets: "4x6", note: "Explosive vertical jump", weighted: false }, { id: "jp-depth-jumps", name: "Depth Jumps", sets: "4x4", note: "Reactive power variation", weighted: false }, { id: "jp-trap-bar-jumps", name: "Trap Bar Jumps", sets: "4x4", note: "Explosive power through the hips", weighted: true }] },
  sl: { gym: [{ id: "sl-cossack-squat", name: "Cossack Squat", sets: "3x10ea", note: "Adductor strength and mobility", weighted: false }, { id: "sl-b-stance-rdl", name: "B-Stance RDL", sets: "3x8ea", note: "Single-leg hinge with a narrow stance", weighted: true }, { id: "sl-pistol-squat", name: "Pistol Squat", sets: "3x6ea", note: "Single-leg strength progression", weighted: false }], home: [{ id: "sl-cossack-squat", name: "Cossack Squat", sets: "3x10ea", note: "Adductor strength and mobility", weighted: false }, { id: "sl-b-stance-rdl", name: "B-Stance RDL", sets: "3x8ea", note: "Single-leg hinge with a narrow stance", weighted: true }, { id: "sl-pistol-squat", name: "Pistol Squat", sets: "3x6ea", note: "Single-leg strength progression", weighted: false }] },
  lp: { gym: [{ id: "lp-curtsy-lunge", name: "Curtsy Lunge", sets: "3x10ea", note: "Hip stability and glute recruitment", weighted: false }, { id: "lp-cossack-squat", name: "Cossack Squat", sets: "3x10ea", note: "Adductor strength and mobility", weighted: false }, { id: "lp-skater-squat", name: "Skater Squat", sets: "3x10ea", note: "Lateral strength pattern", weighted: false }], home: [{ id: "lp-curtsy-lunge", name: "Curtsy Lunge", sets: "3x10ea", note: "Hip stability and glute recruitment", weighted: false }, { id: "lp-cossack-squat", name: "Cossack Squat", sets: "3x10ea", note: "Adductor strength and mobility", weighted: false }, { id: "lp-skater-squat", name: "Skater Squat", sets: "3x10ea", note: "Lateral strength pattern", weighted: false }] },
  glb: { gym: [{ id: "glb-barbell-glute-bridge", name: "Barbell Glute Bridge", sets: "3x10", note: "Heavy hip extension", weighted: true }, { id: "glb-cable-pull-through", name: "Cable Pull-Through", sets: "3x12", note: "Hip hinge with cable tension", weighted: true }, { id: "glb-hip-thrust-banded", name: "Hip Thrust (banded)", sets: "3x12", note: "Band-assisted hip extension", weighted: false }], home: [{ id: "glb-barbell-glute-bridge", name: "Barbell Glute Bridge", sets: "3x10", note: "Heavy hip extension", weighted: true }, { id: "glb-cable-pull-through", name: "Cable Pull-Through", sets: "3x12", note: "Hip hinge with cable tension", weighted: true }, { id: "glb-hip-thrust-banded", name: "Hip Thrust (banded)", sets: "3x12", note: "Band-assisted hip extension", weighted: false }] },
  hp: { gym: [{ id: "hp-barbell-glute-bridge", name: "Barbell Glute Bridge", sets: "3x10", note: "Heavy hip extension", weighted: true }, { id: "hp-cable-pull-through", name: "Cable Pull-Through", sets: "3x12", note: "Hip hinge with cable tension", weighted: true }, { id: "hp-single-leg-hip-thrust", name: "Single-Leg Hip Thrust", sets: "3x8ea", note: "Unilateral hip extension", weighted: false }], home: [{ id: "hp-barbell-glute-bridge", name: "Barbell Glute Bridge", sets: "3x10", note: "Heavy hip extension", weighted: true }, { id: "hp-cable-pull-through", name: "Cable Pull-Through", sets: "3x12", note: "Hip hinge with cable tension", weighted: true }, { id: "hp-single-leg-hip-thrust", name: "Single-Leg Hip Thrust", sets: "3x8ea", note: "Unilateral hip extension", weighted: false }] },
  bp: { gym: [{ id: "bp-incline-barbell-press", name: "Incline Barbell Press", sets: "4x6", note: "Upper chest pressing variation", weighted: true }, { id: "bp-close-grip-bench", name: "Close-Grip Bench", sets: "4x6", note: "Triceps-dominant pressing", weighted: true }, { id: "bp-floor-press", name: "Floor Press", sets: "4x8", note: "Shorter ROM with strong lockout", weighted: true }], home: [{ id: "bp-incline-barbell-press", name: "Incline Barbell Press", sets: "4x6", note: "Upper chest pressing variation", weighted: true }, { id: "bp-close-grip-bench", name: "Close-Grip Bench", sets: "4x6", note: "Triceps-dominant pressing", weighted: true }, { id: "bp-floor-press", name: "Floor Press", sets: "4x8", note: "Shorter ROM with strong lockout", weighted: true }] },
  wpu: { gym: [{ id: "wpu-lat-pulldown-heavy", name: "Lat Pulldown (heavy)", sets: "4x8", note: "Vertical pulling under load", weighted: true }, { id: "wpu-chin-ups-weighted", name: "Chin-Ups (weighted)", sets: "4x5", note: "Supinated pulling strength", weighted: true }, { id: "wpu-rack-chin", name: "Rack Chin", sets: "4x6", note: "Strong rack-based chin variation", weighted: true }], home: [{ id: "wpu-lat-pulldown-heavy", name: "Lat Pulldown (heavy)", sets: "4x8", note: "Vertical pulling under load", weighted: true }, { id: "wpu-chin-ups-weighted", name: "Chin-Ups (weighted)", sets: "4x5", note: "Supinated pulling strength", weighted: true }, { id: "wpu-rack-chin", name: "Rack Chin", sets: "4x6", note: "Strong rack-based chin variation", weighted: true }] },
  op: { gym: [{ id: "op-push-press", name: "Push Press", sets: "4x5", note: "Leg drive into the press", weighted: true }, { id: "op-arnold-press", name: "Arnold Press", sets: "3x10", note: "Seated shoulder press variation", weighted: true }, { id: "op-z-press", name: "Z-Press", sets: "3x8", note: "Strict press with unsupported torso", weighted: true }], home: [{ id: "op-push-press", name: "Push Press", sets: "4x5", note: "Leg drive into the press", weighted: true }, { id: "op-arnold-press", name: "Arnold Press", sets: "3x10", note: "Seated shoulder press variation", weighted: true }, { id: "op-z-press", name: "Z-Press", sets: "3x8", note: "Strict press with unsupported torso", weighted: true }] },
  dbr: { gym: [{ id: "dbr-t-bar-row", name: "T-Bar Row", sets: "4x8", note: "Chest-supported or chest-supported row", weighted: true }, { id: "dbr-pendlay-row", name: "Pendlay Row", sets: "4x8", note: "Barbell row with strict setup", weighted: true }, { id: "dbr-chest-supported-row", name: "Chest-Supported Row", sets: "4x10", note: "Lower back friendly row", weighted: true }], home: [{ id: "dbr-t-bar-row", name: "T-Bar Row", sets: "4x8", note: "Chest-supported or chest-supported row", weighted: true }, { id: "dbr-pendlay-row", name: "Pendlay Row", sets: "4x8", note: "Barbell row with strict setup", weighted: true }, { id: "dbr-chest-supported-row", name: "Chest-Supported Row", sets: "4x10", note: "Lower back friendly row", weighted: true }] },
  wd: { gym: [{ id: "wd-close-grip-bench", name: "Close-Grip Bench Press", sets: "4x6", note: "Triceps-focused press", weighted: true }, { id: "wd-floor-press", name: "Floor Press", sets: "4x8", note: "Short ROM press", weighted: true }, { id: "wd-jm-press", name: "JM Press", sets: "3x8", note: "Strong triceps lockout movement", weighted: true }], home: [{ id: "wd-close-grip-bench", name: "Close-Grip Bench Press", sets: "4x6", note: "Triceps-focused press", weighted: true }, { id: "wd-floor-press", name: "Floor Press", sets: "4x8", note: "Short ROM press", weighted: true }, { id: "wd-jm-press", name: "JM Press", sets: "3x8", note: "Strong triceps lockout movement", weighted: true }] },
  fc: { gym: [{ id: "fc-band-pull-aparts", name: "Band Pull-Aparts", sets: "3x20", note: "Scapular retraction warm-up", weighted: false }, { id: "fc-rear-delt-fly", name: "Rear Delt Fly", sets: "3x12", note: "Posterior delt isolation", weighted: true }, { id: "fc-prone-y-raise", name: "Prone Y-Raise", sets: "3x12", note: "Upper back and shoulder health", weighted: false }], home: [{ id: "fc-band-pull-aparts", name: "Band Pull-Aparts", sets: "3x20", note: "Scapular retraction warm-up", weighted: false }, { id: "fc-rear-delt-fly", name: "Rear Delt Fly", sets: "3x12", note: "Posterior delt isolation", weighted: true }, { id: "fc-prone-y-raise", name: "Prone Y-Raise", sets: "3x12", note: "Upper back and shoulder health", weighted: false }] },
  pup: { gym: [{ id: "pup-decline-weighted-push-ups", name: "Decline Weighted Push-Ups", sets: "4x10", note: "More chest and shoulder demand", weighted: true }, { id: "pup-deficit-push-ups", name: "Deficit Push-Ups", sets: "4x12", note: "Greater ROM and strength", weighted: false }, { id: "pup-plyo-push-ups", name: "Plyo Push-Ups", sets: "4x8", note: "Explosive pressing variation", weighted: false }], home: [{ id: "pup-decline-weighted-push-ups", name: "Decline Weighted Push-Ups", sets: "4x10", note: "More chest and shoulder demand", weighted: true }, { id: "pup-deficit-push-ups", name: "Deficit Push-Ups", sets: "4x12", note: "Greater ROM and strength", weighted: false }, { id: "pup-plyo-push-ups", name: "Plyo Push-Ups", sets: "4x8", note: "Explosive pressing variation", weighted: false }] },
  inv: { gym: [{ id: "inv-trx-row-weighted", name: "TRX Row (weighted vest)", sets: "4x10", note: "Suspension rowing under load", weighted: true }, { id: "inv-feet-elevated-inverted-row", name: "Feet-Elevated Inverted Row", sets: "4x10", note: "More bodyweight tension", weighted: false }, { id: "inv-ring-row", name: "Ring Row", sets: "4x12", note: "Scaled rowing with high tension", weighted: false }], home: [{ id: "inv-trx-row-weighted", name: "TRX Row (weighted vest)", sets: "4x10", note: "Suspension rowing under load", weighted: true }, { id: "inv-feet-elevated-inverted-row", name: "Feet-Elevated Inverted Row", sets: "4x10", note: "More bodyweight tension", weighted: false }, { id: "inv-ring-row", name: "Ring Row", sets: "4x12", note: "Scaled rowing with high tension", weighted: false }] },
  pke: { gym: [{ id: "pke-wall-assisted-handstand-push-up", name: "Wall-Assisted Handstand Push-Up", sets: "3x6", note: "Advanced shoulder strength variation", weighted: false }, { id: "pke-deficit-pike-push-up", name: "Deficit Pike Push-Up", sets: "3x8", note: "Greater ROM and shoulder demand", weighted: false }, { id: "pke-elevated-pike-push-up", name: "Elevated Pike Push-Up", sets: "3x10", note: "Increased load with less bodyweight", weighted: false }], home: [{ id: "pke-wall-assisted-handstand-push-up", name: "Wall-Assisted Handstand Push-Up", sets: "3x6", note: "Advanced shoulder strength variation", weighted: false }, { id: "pke-deficit-pike-push-up", name: "Deficit Pike Push-Up", sets: "3x8", note: "Greater ROM and shoulder demand", weighted: false }, { id: "pke-elevated-pike-push-up", name: "Elevated Pike Push-Up", sets: "3x10", note: "Increased load with less bodyweight", weighted: false }] },
  arc: { gym: [{ id: "arc-diamond-push-ups-weighted", name: "Diamond Push-Ups (weighted)", sets: "3x8", note: "Triceps-dominant push-up progression", weighted: true }, { id: "arc-one-arm-push-up-progression", name: "One-Arm Push-Up Progression", sets: "3x6ea", note: "Single-arm strength progressions", weighted: false }, { id: "arc-deficit-archer-push-up", name: "Deficit Archer Push-Up", sets: "3x6ea", note: "Greater range and strength demand", weighted: false }], home: [{ id: "arc-diamond-push-ups-weighted", name: "Diamond Push-Ups (weighted)", sets: "3x8", note: "Triceps-dominant push-up progression", weighted: true }, { id: "arc-one-arm-push-up-progression", name: "One-Arm Push-Up Progression", sets: "3x6ea", note: "Single-arm strength progressions", weighted: false }, { id: "arc-deficit-archer-push-up", name: "Deficit Archer Push-Up", sets: "3x6ea", note: "Greater range and strength demand", weighted: false }] },
  iso: { gym: [{ id: "iso-dead-hang-weighted", name: "Dead Hang (weighted)", sets: "3x20s", note: "Grip and shoulder endurance", weighted: true }, { id: "iso-flexed-arm-hang", name: "Flexed Arm Hang", sets: "3x20s", note: "Upper-back and grip hold", weighted: false }, { id: "iso-towel-pull-up-hold", name: "Towel Pull-Up Hold", sets: "3x20s", note: "Grip and isometric pulling", weighted: false }], home: [{ id: "iso-dead-hang-weighted", name: "Dead Hang (weighted)", sets: "3x20s", note: "Grip and shoulder endurance", weighted: true }, { id: "iso-flexed-arm-hang", name: "Flexed Arm Hang", sets: "3x20s", note: "Upper-back and grip hold", weighted: false }, { id: "iso-towel-pull-up-hold", name: "Towel Pull-Up Hold", sets: "3x20s", note: "Grip and isometric pulling", weighted: false }] },
  pdl: { gym: [{ id: "pdl-block-pull", name: "Block Pull", sets: "4x3", note: "Short-range strength pull", weighted: true }, { id: "pdl-deficit-deadlift", name: "Deficit Deadlift", sets: "3x3", note: "Greater ROM and strength demand", weighted: true }, { id: "pdl-snatch-grip-deadlift", name: "Snatch-Grip Deadlift", sets: "3x3", note: "Grip and upper-back demand", weighted: true }], home: [{ id: "pdl-block-pull", name: "Block Pull", sets: "4x3", note: "Short-range strength pull", weighted: true }, { id: "pdl-deficit-deadlift", name: "Deficit Deadlift", sets: "3x3", note: "Greater ROM and strength demand", weighted: true }, { id: "pdl-snatch-grip-deadlift", name: "Snatch-Grip Deadlift", sets: "3x3", note: "Grip and upper-back demand", weighted: true }] },
  mbs: { gym: [{ id: "mbs-wall-ball-shots", name: "Wall Ball Shots", sets: "4x8", note: "Explosive overhead power", weighted: true }, { id: "mbs-rotational-slam", name: "Rotational Slam", sets: "4x8", note: "Rotational force and core power", weighted: true }, { id: "mbs-overhead-slam", name: "Overhead Slam", sets: "4x8", note: "Explosive shoulder and core power", weighted: true }], home: [{ id: "mbs-wall-ball-shots", name: "Wall Ball Shots", sets: "4x8", note: "Explosive overhead power", weighted: true }, { id: "mbs-rotational-slam", name: "Rotational Slam", sets: "4x8", note: "Rotational force and core power", weighted: true }, { id: "mbs-overhead-slam", name: "Overhead Slam", sets: "4x8", note: "Explosive shoulder and core power", weighted: true }] },
  kbs: { gym: [{ id: "kbs-kettlebell-snatch", name: "Kettlebell Snatch", sets: "4x8ea", note: "One-arm power and coordination", weighted: true }, { id: "kbs-kettlebell-clean-press", name: "Kettlebell Clean & Press", sets: "4x8ea", note: "Explosive transfer of force", weighted: true }, { id: "kbs-american-kb-swing", name: "American KB Swing", sets: "4x10", note: "High-force hip hinge variation", weighted: true }], home: [{ id: "kbs-kettlebell-snatch", name: "Kettlebell Snatch", sets: "4x8ea", note: "One-arm power and coordination", weighted: true }, { id: "kbs-kettlebell-clean-press", name: "Kettlebell Clean & Press", sets: "4x8ea", note: "Explosive transfer of force", weighted: true }, { id: "kbs-american-kb-swing", name: "American KB Swing", sets: "4x10", note: "High-force hip hinge variation", weighted: true }] },
  wp2: { gym: [{ id: "wp2-chin-ups-weighted", name: "Chin-Ups (weighted)", sets: "4x5", note: "Supinated pulling strength", weighted: true }, { id: "wp2-rack-chin", name: "Rack Chin", sets: "4x6", note: "Strong rack-based chin variation", weighted: true }, { id: "wp2-towel-pull-ups", name: "Towel Pull-Ups", sets: "3x6", note: "Grip and upper-back challenge", weighted: false }], home: [{ id: "wp2-chin-ups-weighted", name: "Chin-Ups (weighted)", sets: "4x5", note: "Supinated pulling strength", weighted: true }, { id: "wp2-rack-chin", name: "Rack Chin", sets: "4x6", note: "Strong rack-based chin variation", weighted: true }, { id: "wp2-towel-pull-ups", name: "Towel Pull-Ups", sets: "3x6", note: "Grip and upper-back challenge", weighted: false }] },
  lnd: { gym: [{ id: "lnd-cable-woodchopper", name: "Cable Woodchopper", sets: "3x10ea", note: "Rotational core and anti-rotation", weighted: true }, { id: "lnd-landmine-press", name: "Landmine Press", sets: "3x10ea", note: "Press with rotational setup", weighted: true }, { id: "lnd-pallof-press", name: "Pallof Press", sets: "3x12ea", note: "Anti-rotation bracing", weighted: true }], home: [{ id: "lnd-cable-woodchopper", name: "Cable Woodchopper", sets: "3x10ea", note: "Rotational core and anti-rotation", weighted: true }, { id: "lnd-landmine-press", name: "Landmine Press", sets: "3x10ea", note: "Press with rotational setup", weighted: true }, { id: "lnd-pallof-press", name: "Pallof Press", sets: "3x12ea", note: "Anti-rotation bracing", weighted: true }] },
  sld: { gym: [{ id: "sld-prowler-push", name: "Prowler Push", sets: "4x20m", note: "High-intensity sled push", weighted: true }, { id: "sld-heavy-sled-drag", name: "Heavy Sled Drag", sets: "4x20m", note: "Full-body posterior force", weighted: true }, { id: "sld-yoke-walk", name: "Yoke Walk", sets: "4x20m", note: "Carry and leg drive", weighted: true }], home: [{ id: "sld-prowler-push", name: "Prowler Push", sets: "4x20m", note: "High-intensity sled push", weighted: true }, { id: "sld-heavy-sled-drag", name: "Heavy Sled Drag", sets: "4x20m", note: "Full-body posterior force", weighted: true }, { id: "sld-yoke-walk", name: "Yoke Walk", sets: "4x20m", note: "Carry and leg drive", weighted: true }] },
  bxj: { gym: [{ id: "bxj-tuck-jumps", name: "Tuck Jumps", sets: "4x6", note: "Explosive jumping pattern", weighted: false }, { id: "bxj-broad-jumps", name: "Broad Jumps", sets: "4x4", note: "Horizontal power development", weighted: false }, { id: "bxj-squat-jump-to-box", name: "Squat Jump to Box", sets: "4x6", note: "Explosive lower-body power", weighted: false }], home: [{ id: "bxj-tuck-jumps", name: "Tuck Jumps", sets: "4x6", note: "Explosive jumping pattern", weighted: false }, { id: "bxj-broad-jumps", name: "Broad Jumps", sets: "4x4", note: "Horizontal power development", weighted: false }, { id: "bxj-squat-jump-to-box", name: "Squat Jump to Box", sets: "4x6", note: "Explosive lower-body power", weighted: false }] },
  mbt: { gym: [{ id: "mbt-rotational-med-ball-throw", name: "Rotational Med Ball Throw", sets: "4x6", note: "Explosive rotational power", weighted: true }, { id: "mbt-sandbag-toss", name: "Sandbag Toss", sets: "4x6", note: "High-force throw variation", weighted: true }, { id: "mbt-overhead-slam", name: "Overhead Slam", sets: "4x8", note: "Explosive shoulder and core power", weighted: true }], home: [{ id: "mbt-rotational-med-ball-throw", name: "Rotational Med Ball Throw", sets: "4x6", note: "Explosive rotational power", weighted: true }, { id: "mbt-sandbag-toss", name: "Sandbag Toss", sets: "4x6", note: "High-force throw variation", weighted: true }, { id: "mbt-overhead-slam", name: "Overhead Slam", sets: "4x8", note: "Explosive shoulder and core power", weighted: true }] },
  mtc: { gym: [{ id: "mtc-high-knees-weighted", name: "High Knees (weighted vest)", sets: "4x20s", note: "Sprint mechanics and conditioning", weighted: true }, { id: "mtc-sprinter-sit-ups", name: "Sprinter Sit-Ups", sets: "4x12", note: "Explosive core and hip flexion", weighted: false }, { id: "mtc-explosive-mountain-climbers", name: "Explosive Mountain Climbers", sets: "4x20s", note: "Higher-output conditioning", weighted: false }], home: [{ id: "mtc-high-knees-weighted", name: "High Knees (weighted vest)", sets: "4x20s", note: "Sprint mechanics and conditioning", weighted: true }, { id: "mtc-sprinter-sit-ups", name: "Sprinter Sit-Ups", sets: "4x12", note: "Explosive core and hip flexion", weighted: false }, { id: "mtc-explosive-mountain-climbers", name: "Explosive Mountain Climbers", sets: "4x20s", note: "Higher-output conditioning", weighted: false }] },
  bkb: { gym: [{ id: "bkb-weighted-bear-crawl", name: "Weighted Bear Crawl", sets: "4x10m", note: "Loaded locomotion and core", weighted: true }, { id: "bkb-crab-walk", name: "Crab Walk", sets: "4x10m", note: "Lateral and trunk stability", weighted: false }, { id: "bkb-loaded-carry-crawl", name: "Loaded Carry Crawl", sets: "4x10m", note: "Carry and locomotion blend", weighted: true }], home: [{ id: "bkb-weighted-bear-crawl", name: "Weighted Bear Crawl", sets: "4x10m", note: "Loaded locomotion and core", weighted: true }, { id: "bkb-crab-walk", name: "Crab Walk", sets: "4x10m", note: "Lateral and trunk stability", weighted: false }, { id: "bkb-loaded-carry-crawl", name: "Loaded Carry Crawl", sets: "4x10m", note: "Carry and locomotion blend", weighted: true }] },
  plk: { gym: [{ id: "plk-weighted-plank", name: "Weighted Plank", sets: "3x45s", note: "Core tension under load", weighted: true }, { id: "plk-side-plank-reach-through", name: "Side Plank Reach-Through", sets: "3x10ea", note: "Anti-rotation core strength", weighted: false }, { id: "plk-rkc-plank", name: "RKC Plank", sets: "3x30s", note: "Bracing and tension control", weighted: false }], home: [{ id: "plk-weighted-plank", name: "Weighted Plank", sets: "3x45s", note: "Core tension under load", weighted: true }, { id: "plk-side-plank-reach-through", name: "Side Plank Reach-Through", sets: "3x10ea", note: "Anti-rotation core strength", weighted: false }, { id: "plk-rkc-plank", name: "RKC Plank", sets: "3x30s", note: "Bracing and tension control", weighted: false }] },
  hb: { gym: [{ id: "hb-sledgehammer-slams", name: "Sledgehammer Slams", sets: "4x10", note: "Explosive rotational power", weighted: true }, { id: "hb-tire-flips", name: "Tire Flips", sets: "4x6", note: "Full-body power and conditioning", weighted: true }, { id: "hb-battle-ropes", name: "Battle Ropes", sets: "4x20s", note: "High-output conditioning", weighted: false }], home: [{ id: "hb-sledgehammer-slams", name: "Sledgehammer Slams", sets: "4x10", note: "Explosive rotational power", weighted: true }, { id: "hb-tire-flips", name: "Tire Flips", sets: "4x6", note: "Full-body power and conditioning", weighted: true }, { id: "hb-battle-ropes", name: "Battle Ropes", sets: "4x20s", note: "High-output conditioning", weighted: false }] },
  spr: { gym: [{ id: "spr-hill-sprints", name: "Hill Sprints", sets: "8x20s", note: "Power and acceleration work", weighted: false }, { id: "spr-weighted-vest-sprints", name: "Weighted Vest Sprints", sets: "8x20s", note: "Added resistance for sprint power", weighted: true }, { id: "spr-sled-sprints", name: "Sled Sprints", sets: "6x20m", note: "Resisted acceleration", weighted: true }], home: [{ id: "spr-hill-sprints", name: "Hill Sprints", sets: "8x20s", note: "Power and acceleration work", weighted: false }, { id: "spr-weighted-vest-sprints", name: "Weighted Vest Sprints", sets: "8x20s", note: "Added resistance for sprint power", weighted: true }, { id: "spr-sled-sprints", name: "Sled Sprints", sets: "6x20m", note: "Resisted acceleration", weighted: true }] },
  rj: { gym: [{ id: "rj-double-unders", name: "Double Unders", sets: "5x30s", note: "Fast rope coordination", weighted: false }, { id: "rj-weighted-jump-rope", name: "Weighted Jump Rope", sets: "5x1min", note: "Higher-output conditioning", weighted: true }, { id: "rj-box-step-overs", name: "Box Step-Overs (fast)", sets: "5x20s", note: "Footwork and rhythm", weighted: false }], home: [{ id: "rj-double-unders", name: "Double Unders", sets: "5x30s", note: "Fast rope coordination", weighted: false }, { id: "rj-weighted-jump-rope", name: "Weighted Jump Rope", sets: "5x1min", note: "Higher-output conditioning", weighted: true }, { id: "rj-box-step-overs", name: "Box Step-Overs (fast)", sets: "5x20s", note: "Footwork and rhythm", weighted: false }] },
  sbx: { gym: [{ id: "sbx-weighted-shadow-boxing", name: "Weighted Shadow Boxing", sets: "5x3min", note: "Higher-output conditioning work", weighted: true }, { id: "sbx-med-ball-punches", name: "Med Ball Punches", sets: "4x10", note: "Explosive striking power", weighted: true }, { id: "sbx-battle-ropes", name: "Battle Ropes", sets: "4x20s", note: "Explosive conditioning", weighted: false }], home: [{ id: "sbx-weighted-shadow-boxing", name: "Weighted Shadow Boxing", sets: "5x3min", note: "Higher-output conditioning work", weighted: true }, { id: "sbx-med-ball-punches", name: "Med Ball Punches", sets: "4x10", note: "Explosive striking power", weighted: true }, { id: "sbx-battle-ropes", name: "Battle Ropes", sets: "4x20s", note: "Explosive conditioning", weighted: false }] },
  hit: { gym: [{ id: "hit-tabata-sled-push", name: "Tabata Sled Push", sets: "8x20s", note: "High-intensity sled intervals", weighted: true }, { id: "hit-complex-barbell-circuit", name: "Complex Barbell Circuit", sets: "4 rounds", note: "Multi-movement strength conditioning", weighted: true }, { id: "hit-kettlebell-flow", name: "Kettlebell Flow", sets: "4 rounds", note: "Coordination and conditioning", weighted: true }], home: [{ id: "hit-tabata-sled-push", name: "Tabata Sled Push", sets: "8x20s", note: "High-intensity sled intervals", weighted: true }, { id: "hit-complex-barbell-circuit", name: "Complex Barbell Circuit", sets: "4 rounds", note: "Multi-movement strength conditioning", weighted: true }, { id: "hit-kettlebell-flow", name: "Kettlebell Flow", sets: "4 rounds", note: "Coordination and conditioning", weighted: true }] },
  rcj: { gym: [{ id: "rcj-double-unders", name: "Double Unders", sets: "5x30s", note: "Fast rope coordination", weighted: false }, { id: "rcj-battle-ropes", name: "Battle Ropes", sets: "4x20s", note: "Explosive conditioning", weighted: false }, { id: "rcj-weighted-jump-rope", name: "Weighted Jump Rope", sets: "5x1min", note: "Higher-output conditioning", weighted: true }], home: [{ id: "rcj-double-unders", name: "Double Unders", sets: "5x30s", note: "Fast rope coordination", weighted: false }, { id: "rcj-battle-ropes", name: "Battle Ropes", sets: "4x20s", note: "Explosive conditioning", weighted: false }, { id: "rcj-weighted-jump-rope", name: "Weighted Jump Rope", sets: "5x1min", note: "Higher-output conditioning", weighted: true }] },
};

// Helper function to get similar exercises
function getSimilarExercises(exId, currentMode, currentWorkoutKey) {
  const exerciseMeta = EXERCISE_CATEGORIES[exId];
  if (!exerciseMeta) return [];

  const alternativeMode = currentMode === 'home' ? 'home' : 'gym';
  const baseAlternatives = Array.isArray(exerciseMeta.alternatives)
    ? exerciseMeta.alternatives
    : (exerciseMeta.alternatives?.[alternativeMode] || []);
  const extraAlternatives = EXTRA_ALTERNATIVES[exId]?.[alternativeMode] || [];
  const mergedAlternatives = [...baseAlternatives, ...extraAlternatives];
  const similar = [];
  const seenIds = new Set();

  // Only show alternatives from the active tab to avoid mixing gym and home exercises.
  mergedAlternatives.forEach(altRef => {
    let alt = null;

    if (typeof altRef === 'string') {
      alt = findExerciseById(altRef);
    } else if (altRef && altRef.id) {
      alt = { ...altRef, mode: currentMode, workoutKey: currentWorkoutKey || null };
    }

    if (!alt || alt.mode !== currentMode) return;
    if (seenIds.has(alt.id)) return;

    seenIds.add(alt.id);
    similar.push(alt);
  });

  return similar;
}

// Helper function to find exercise object by ID across all workouts
function findExerciseById(exId) {
  for (let wk of WORKOUTS) {
    const ex = wk.gym.find(e => e.id === exId);
    if (ex) return { ...ex, mode: 'gym', workoutKey: wk.key };
    const homeEx = wk.home.find(e => e.id === exId);
    if (homeEx) return { ...homeEx, mode: 'home', workoutKey: wk.key };
  }
  return null;
}

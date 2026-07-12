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
      { id: "jp",  name: "Jump Squats",               sets: "4x10",   note: "Explosive power",                 weighted: false },
      { id: "sl",  name: "Single-Leg RDL",            sets: "3x10ea", note: "Use bag/backpack for load",       weighted: true },
      { id: "lp",  name: "Lateral Lunges",            sets: "3x12ea", note: "Hip mobility + strength",         weighted: false },
      { id: "glb", name: "Glute Bridge w/ Pause",     sets: "4x15",   note: "3 sec hold at top",               weighted: false },
      { id: "hp",  name: "Hip Thrust",                sets: "3x20",   note: "Drive through heels",             weighted: false },
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
      { id: "pup", name: "Push-Ups (weighted bag)",   sets: "4x15",   note: "Slow negative 3 sec",             weighted: false },
      { id: "inv", name: "Inverted Row",              sets: "4x12",   note: "Feet elevated for harder",        weighted: false },
      { id: "pke", name: "Pike Push-Ups",             sets: "3x12",   note: "OHP substitute",                  weighted: false },
      { id: "arc", name: "Archer Push-Ups",           sets: "3x8ea",  note: "Single arm progression",          weighted: false },
      { id: "iso", name: "Isometric Pull",            sets: "3x30s",  note: "Towel on door — back activation", weighted: false },
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
      { id: "bxj", name: "Burpee Box Jump",           sets: "4x6",    note: "Max explosion",                   weighted: false },
      { id: "mbt", name: "Heavy Object Throw",        sets: "4x10",   note: "Use any heavy object",            weighted: false },
      { id: "mtc", name: "Mountain Climbers",         sets: "4x30s",  note: "Combat conditioning",             weighted: false },
      { id: "bkb", name: "Bear Crawl",                sets: "4x10m",  note: "Full body coordination",          weighted: false },
      { id: "plk", name: "Plank w/ Hip Tap",          sets: "3x20ea", note: "Core bracing for grappling",      weighted: false },
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
      { id: "sbx", name: "Shadow Boxing",             sets: "5x3min", note: "Stay light on feet",              weighted: false },
      { id: "hit", name: "HIIT Circuit",              sets: "4 rounds", note: "45s on / 15s off",              weighted: false },
      { id: "rcj", name: "Rope Jump",                 sets: "5x2min", note: "Footwork",                        weighted: false },
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
// four substitutes for gym mode and four for home mode.
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

// Helper function to get similar exercises
function getSimilarExercises(exId, currentMode, currentWorkoutKey) {
  const exerciseMeta = EXERCISE_CATEGORIES[exId];
  if (!exerciseMeta) return [];

  const alternativeMode = currentMode === 'home' ? 'home' : 'gym';
  const alternatives = Array.isArray(exerciseMeta.alternatives)
    ? exerciseMeta.alternatives
    : (exerciseMeta.alternatives?.[alternativeMode] || []);
  const similar = [];

  // Only show alternatives from the active tab to avoid mixing gym and home exercises
  alternatives.forEach(altId => {
    const alt = findExerciseById(altId);
    if (alt && alt.mode === currentMode) {
      similar.push(alt);
    }
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

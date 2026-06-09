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
// Map exercises to categories for finding alternatives
const EXERCISE_CATEGORIES = {
  // Lower Power
  "sq":   { category: "squat", name: "Barbell Back Squat", alternatives: ["bs", "jp", "sl"] },
  "dl":   { category: "deadlift", name: "Conventional Deadlift", alternatives: ["pdl", "sl"] },
  "bs":   { category: "squat", name: "Belt Squat", alternatives: ["sq", "jp", "lp"] },
  "rh":   { category: "posterior_chain", name: "Reverse Hyperextension", alternatives: ["glb", "hp", "sl"] },
  "ca":   { category: "grip_tension", name: "Farmer's Walk", alternatives: [] },
  "jp":   { category: "squat", name: "Jump Squats", alternatives: ["sq", "bs", "lp"] },
  "sl":   { category: "deadlift", name: "Single-Leg RDL", alternatives: ["dl", "rh", "glb"] },
  "lp":   { category: "squat", name: "Lateral Lunges", alternatives: ["jp", "bs", "sl"] },
  "glb":  { category: "posterior_chain", name: "Glute Bridge w/ Pause", alternatives: ["hp", "rh", "sl"] },
  "hp":   { category: "posterior_chain", name: "Hip Thrust", alternatives: ["glb", "rh", "dl"] },
  // Upper Power
  "bp":   { category: "pressing", name: "Bench Press", alternatives: ["pup", "wd", "pke"] },
  "wpu":  { category: "pulling", name: "Weighted Pull-Ups", alternatives: ["inv", "iso", "dbr"] },
  "op":   { category: "pressing", name: "Overhead Press", alternatives: ["pke", "bp"] },
  "dbr":  { category: "pulling", name: "Heavy Dumbbell Row", alternatives: ["wpu", "inv", "iso"] },
  "wd":   { category: "pressing", name: "Weighted Dips", alternatives: ["bp", "pup", "pke"] },
  "fc":   { category: "shoulder_health", name: "Face Pulls", alternatives: [] },
  "pup":  { category: "pressing", name: "Push-Ups (weighted bag)", alternatives: ["bp", "wd", "pke"] },
  "inv":  { category: "pulling", name: "Inverted Row", alternatives: ["wpu", "dbr", "iso"] },
  "pke":  { category: "pressing", name: "Pike Push-Ups", alternatives: ["op", "bp", "wd"] },
  "arc":  { category: "pressing", name: "Archer Push-Ups", alternatives: ["pup", "bp"] },
  "iso":  { category: "pulling", name: "Isometric Pull", alternatives: ["wpu", "inv", "dbr"] },
  // Full Body Power
  "pdl":  { category: "deadlift", name: "Rack Pull Deadlift", alternatives: ["dl", "kbs"] },
  "mbs":  { category: "explosive", name: "Medicine Ball Slam", alternatives: ["mbt", "bxj"] },
  "kbs":  { category: "explosive", name: "Kettlebell Swing", alternatives: ["mbs", "pdl", "bxj"] },
  "wp2":  { category: "pulling", name: "Weighted Pull-Ups", alternatives: ["wpu", "inv", "iso"] },
  "lnd":  { category: "rotational", name: "Landmine Rotational Press", alternatives: ["mbs", "arc"] },
  "sld":  { category: "explosive", name: "Sled Push/Pull", alternatives: ["kbs", "mbs", "mtc"] },
  // Full Body Home
  "bxj":  { category: "explosive", name: "Burpee Box Jump", alternatives: ["mbt", "mtc", "mbs"] },
  "mbt":  { category: "explosive", name: "Heavy Object Throw", alternatives: ["mbs", "bxj"] },
  "mtc":  { category: "conditioning", name: "Mountain Climbers", alternatives: ["sld", "bxj", "hit"] },
  "bkb":  { category: "conditioning", name: "Bear Crawl", alternatives: ["mtc", "plk"] },
  "plk":  { category: "core", name: "Plank w/ Hip Tap", alternatives: ["bkb", "iso"] },
  // Conditioning
  "hb":   { category: "conditioning", name: "Heavy Bag Rounds", alternatives: ["sbx", "hit"] },
  "spr":  { category: "conditioning", name: "Sprint Intervals", alternatives: ["hit", "rcj"] },
  "rj":   { category: "conditioning", name: "Rope Jumps", alternatives: ["rcj", "hit"] },
  "sbx":  { category: "conditioning", name: "Shadow Boxing", alternatives: ["hb", "hit"] },
  "hit":  { category: "conditioning", name: "HIIT Circuit", alternatives: ["hb", "spr", "sbx"] },
  "rcj":  { category: "conditioning", name: "Rope Jump", alternatives: ["rj", "spr", "hit"] },
};

// Helper function to get similar exercises
function getSimilarExercises(exId, currentMode, currentWorkoutKey) {
  const exerciseMeta = EXERCISE_CATEGORIES[exId];
  if (!exerciseMeta) return [];

  const alternatives = exerciseMeta.alternatives || [];
  const similar = [];

  // Collect all alternative exercises
  alternatives.forEach(altId => {
    const alt = findExerciseById(altId);
    if (alt) {
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

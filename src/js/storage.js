// ═══════════════════════════════════════════════════════════════════════════════
// DATA PERSISTENCE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// This system automatically saves all user data to browser localStorage:
//
// 1. SCHEDULE DATA (Persisted on setup confirmation):
//    - selectedDays: User's chosen workout days
//    - schedule: Mapping of days to workout types
//    - mode: Current mode preference (gym or home)
//
// 2. WORKOUT DATA (Persisted after each action):
//    - workoutLog: Daily exercise completion and weight tracking
//    - mobilityLog: Daily mobility routine completion
//
// Data is automatically loaded on app startup, so users never lose progress.
// To reset all data, users can call clearAllData() from the browser console.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── STORAGE HELPERS ────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  workoutLog: 'ppLog',
  mobilityLog: 'ppMobility',
  selectedDays: 'ppSelectedDays',
  schedule: 'ppSchedule',
  mode: 'ppMode',
};

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Error loading state:', e);
    return fallback;
  }
}

function saveState(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

function getWorkoutLog() {
  return loadState(STORAGE_KEYS.workoutLog, {});
}

function getMobilityLog() {
  return loadState(STORAGE_KEYS.mobilityLog, {});
}

function getSelectedDays() {
  return loadState(STORAGE_KEYS.selectedDays, []);
}

function getSchedule() {
  return loadState(STORAGE_KEYS.schedule, {});
}

function getMode() {
  return loadState(STORAGE_KEYS.mode, 'gym');
}

function saveWorkoutLog(log) {
  saveState(STORAGE_KEYS.workoutLog, log);
}

function saveMobilityLog(log) {
  saveState(STORAGE_KEYS.mobilityLog, log);
}

function saveSelectedDays(days) {
  saveState(STORAGE_KEYS.selectedDays, days);
}

function saveSchedule(schedule) {
  saveState(STORAGE_KEYS.schedule, schedule);
}

function saveMode(mode) {
  saveState(STORAGE_KEYS.mode, mode);
}

function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.workoutLog);
    localStorage.removeItem(STORAGE_KEYS.mobilityLog);
    localStorage.removeItem(STORAGE_KEYS.selectedDays);
    localStorage.removeItem(STORAGE_KEYS.schedule);
    localStorage.removeItem(STORAGE_KEYS.mode);
    console.log('All data cleared');
  } catch (e) {
    console.error('Error clearing data:', e);
  }
}

// Get today's entry
function getTodayEntry(workoutLog) {
  const today = isoToday();
  return workoutLog[today] || { completed: {}, weights: {}, done: false };
}

// Update exercise completion
function toggleExercise(workoutLog, exId, mode, workoutKey) {
  const today = isoToday();
  const entry = workoutLog[today] || { completed: {}, weights: {}, done: false };
  entry.completed[exId] = !entry.completed[exId];
  entry.mode = mode;
  entry.workoutKey = workoutKey;
  
  // Check if all are done
  const workout = WORKOUTS.find(w => w.key === workoutKey);
  if (workout) {
    const exercises = mode === 'gym' ? workout.gym : workout.home;
    const allDone = exercises.every(e => entry.completed[e.id]);
    entry.done = allDone;
  }
  
  workoutLog[today] = entry;
  return workoutLog;
}

// Update exercise weight
function updateExerciseWeight(workoutLog, exId, field, val, mode, workoutKey) {
  const today = isoToday();
  const entry = workoutLog[today] || { completed: {}, weights: {}, done: false };
  if (!entry.weights) entry.weights = {};
  if (!entry.weights[exId]) entry.weights[exId] = {};
  entry.weights[exId][field] = val;
  entry.mode = mode;
  entry.workoutKey = workoutKey;
  workoutLog[today] = entry;
  return workoutLog;
}

// Toggle mobility
function toggleMobility(mobilityLog, index) {
  const today = isoToday();
  const key = `${today}-${index}`;
  mobilityLog[key] = !mobilityLog[key];
  return mobilityLog;
}

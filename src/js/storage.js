// ─── STORAGE HELPERS ────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  workoutLog: 'ppLog',
  mobilityLog: 'ppMobility',
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

function saveWorkoutLog(log) {
  saveState(STORAGE_KEYS.workoutLog, log);
}

function saveMobilityLog(log) {
  saveState(STORAGE_KEYS.mobilityLog, log);
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

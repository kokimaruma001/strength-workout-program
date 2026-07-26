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
  currentUser: 'ppCurrentUser',
};

function getStorageKey(key, user = null) {
  const activeUser = user || getCurrentUser();
  if (!activeUser) return key;
  return `${key}_${activeUser}`;
}

function loadState(key, fallback, user = null) {
  try {
    const storageKey = getStorageKey(key, user);
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Error loading state:', e);
    return fallback;
  }
}

function saveState(key, val, user = null) {
  try {
    const storageKey = getStorageKey(key, user);
    localStorage.setItem(storageKey, JSON.stringify(val));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

// ─── USER MANAGEMENT ────────────────────────────────────────────────────────
function getCurrentUser() {
  try {
    return localStorage.getItem(STORAGE_KEYS.currentUser);
  } catch (e) {
    console.error('Error getting current user:', e);
    return null;
  }
}

function setCurrentUser(userName) {
  try {
    if (userName) {
      localStorage.setItem(STORAGE_KEYS.currentUser, userName);
    } else {
      localStorage.removeItem(STORAGE_KEYS.currentUser);
    }
  } catch (e) {
    console.error('Error setting current user:', e);
  }
}

function getAllUsers() {
  const users = new Set();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const match = key?.match(/_(.+)$/);
      if (match && match[1]) {
        users.add(match[1]);
      }
    }
  } catch (e) {
    console.error('Error getting users:', e);
  }
  return Array.from(users).sort();
}

function getWorkoutLog() {
  return loadState('ppLog', {});
}

function getMobilityLog() {
  return loadState('ppMobility', {});
}

function getSelectedDays() {
  return loadState('ppSelectedDays', []);
}

function getSchedule() {
  return loadState('ppSchedule', {});
}

function getMode() {
  return loadState('ppMode', 'gym');
}

function getExerciseSubstitutions() {
  return loadState('ppSubstitutions', {});
}

function saveWorkoutLog(log) {
  saveState('ppLog', log);
}

function saveMobilityLog(log) {
  saveState('ppMobility', log);
}

function saveSelectedDays(days) {
  saveState('ppSelectedDays', days);
}

function saveSchedule(schedule) {
  saveState('ppSchedule', schedule);
}

function saveMode(mode) {
  saveState('ppMode', mode);
}

function saveExerciseSubstitutions(subs) {
  saveState('ppSubstitutions', subs);
}

function clearAllData() {
  try {
    const user = getCurrentUser();
    if (!user) return;
    localStorage.removeItem(`ppLog_${user}`);
    localStorage.removeItem(`ppMobility_${user}`);
    localStorage.removeItem(`ppSelectedDays_${user}`);
    localStorage.removeItem(`ppSchedule_${user}`);
    localStorage.removeItem(`ppMode_${user}`);
    localStorage.removeItem(`ppSubstitutions_${user}`);
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    console.log(`All data cleared for user: ${user}`);
  } catch (e) {
    console.error('Error clearing data:', e);
  }
}

// Get today's entry
function getTodayEntry(workoutLog) {
  const today = isoToday();
  return workoutLog[today] || { completed: {}, weights: {}, done: false };
}

function copyWorkoutEntry(previousEntry = {}, currentEntry = {}) {
  const hasExistingData = Object.keys(currentEntry.completed || {}).length > 0 ||
    Object.keys(currentEntry.weights || {}).length > 0 ||
    currentEntry.done;

  if (hasExistingData) {
    return currentEntry;
  }

  return {
    ...currentEntry,
    completed: { ...(previousEntry.completed || {}) },
    weights: previousEntry.weights ? JSON.parse(JSON.stringify(previousEntry.weights)) : {},
    done: Boolean(previousEntry.done),
    mode: previousEntry.mode || currentEntry.mode,
    workoutKey: previousEntry.workoutKey || currentEntry.workoutKey,
  };
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

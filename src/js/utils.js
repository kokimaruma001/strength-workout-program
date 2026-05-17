// ─── UTILITY FUNCTIONS ──────────────────────────────────────────────────────
function buildSchedule(days) {
  const s = {};
  days.forEach((d, i) => { s[d] = WORKOUTS[i % WORKOUTS.length]; });
  return s;
}

function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString().slice(0,10);
}

function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
}

function isoToday() {
  return new Date().toISOString().slice(0,10);
}

function formatDate(dateStr, format = 'short') {
  const date = new Date(dateStr + 'T00:00:00');
  if (format === 'short') {
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  } else if (format === 'long') {
    return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
  }
  return date.toLocaleDateString("en-GB");
}

function createElement(tag, className = '', innerHTML = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function getWorkoutByExId(exId) {
  for (let wk of WORKOUTS) {
    const ex = [...wk.gym, ...wk.home].find(e => e.id === exId);
    if (ex) return { workout: wk, exercise: ex };
  }
  return { workout: null, exercise: null };
}

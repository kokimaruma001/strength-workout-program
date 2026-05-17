import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────
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

function buildSchedule(days) {
  const s = {};
  days.forEach((d, i) => { s[d] = WORKOUTS[i % WORKOUTS.length]; });
  return s;
}

function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - d.getDay() + 1);
  return d.toISOString().slice(0,10);
}

function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
}

function isoToday() {
  return new Date().toISOString().slice(0,10);
}

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
function loadState(key, fallback) {
  try {
    const raw = window._ppStore?.[key];
    return raw !== undefined ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function saveState(key, val) {
  if (!window._ppStore) window._ppStore = {};
  window._ppStore[key] = JSON.stringify(val);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("setup");
  const [navTab, setNavTab] = useState("today"); // today | week | month
  const [selectedDays, setSelectedDays] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [activeDay, setActiveDay] = useState(null);
  const [mode, setMode] = useState("gym");
  const [showMobility, setShowMobility] = useState(false);

  // workoutLog: { [dateISO]: { completed: {exId: bool}, weights: {exId: {kg, reps}}, done: bool, workoutKey, mode } }
  const [workoutLog, setWorkoutLog] = useState(() => loadState("ppLog", {}));
  const [mobilityLog, setMobilityLog] = useState(() => loadState("ppMobility", {}));

  useEffect(() => { saveState("ppLog", workoutLog); }, [workoutLog]);
  useEffect(() => { saveState("ppMobility", mobilityLog); }, [mobilityLog]);

  const today = isoToday();
  const todayEntry = workoutLog[today] || { completed: {}, weights: {}, done: false };

  const workout = activeDay ? schedule[activeDay] : null;
  const exercises = workout ? (mode === "gym" ? workout.gym : workout.home) : [];

  const doneCount = exercises.filter(e => todayEntry.completed?.[e.id]).length;
  const pct = exercises.length ? Math.round((doneCount / exercises.length) * 100) : 0;

  const scheduledDays = Object.keys(schedule);

  // ── helpers ──
  const toggleEx = (id) => {
    setWorkoutLog(prev => {
      const entry = prev[today] || { completed: {}, weights: {}, done: false };
      const updated = { ...entry, completed: { ...entry.completed, [id]: !entry.completed[id] } };
      const allDone = exercises.every(e => updated.completed[e.id]);
      return { ...prev, [today]: { ...updated, done: allDone, workoutKey: workout?.key, mode } };
    });
  };

  const setWeight = (id, field, val) => {
    setWorkoutLog(prev => {
      const entry = prev[today] || { completed: {}, weights: {}, done: false };
      const w = entry.weights?.[id] || {};
      return { ...prev, [today]: { ...entry, weights: { ...entry.weights, [id]: { ...w, [field]: val } }, workoutKey: workout?.key, mode } };
    });
  };

  const toggleMobility = (i) => {
    setMobilityLog(prev => ({ ...prev, [`${today}-${i}`]: !prev[`${today}-${i}`] }));
  };

  const confirmSchedule = () => {
    if (selectedDays.length < 2) return;
    const sorted = ALL_DAYS.filter(d => selectedDays.includes(d));
    setSchedule(buildSchedule(sorted));
    setActiveDay(sorted[0]);
    setScreen("tracker");
  };

  // ─── STYLES ──────────────────────────────────────────────────────
  const S = {
    page: { minHeight: "100vh", background: "#0a0a0a", color: "#e8e4dc", fontFamily: "'Courier New', monospace" },
    header: { background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%)", borderBottom: "2px solid #c8501a", padding: "20px 20px 14px", position: "relative" },
    eyebrow: { fontSize: "10px", letterSpacing: "6px", color: "#c8501a", marginBottom: "4px" },
    title: { fontSize: "22px", fontWeight: "900", letterSpacing: "2px" },
    pad: { padding: "14px 14px 100px" },
    sectionLabel: { fontSize: "10px", letterSpacing: "4px", color: "#666", marginBottom: "10px" },
    card: { background: "#111", border: "1px solid #222", padding: "14px", marginBottom: "14px" },
    tabBtn: (a) => ({ flex: 1, padding: "10px 4px", background: a ? "#c8501a" : "#111", border: "none", color: a ? "#fff" : "#555", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", fontFamily: "'Courier New', monospace", textTransform: "uppercase", transition: "all 0.2s" }),
    pill: (a) => ({ padding: "7px 11px", background: a ? "#c8501a" : "transparent", border: `1px solid ${a ? "#c8501a" : "#333"}`, color: a ? "#fff" : "#666", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", textTransform: "uppercase", fontFamily: "'Courier New', monospace", transition: "all 0.2s" }),
  };

  // ─── SETUP SCREEN ────────────────────────────────────────────────
  if (screen === "setup") {
    const sortedSel = ALL_DAYS.filter(d => selectedDays.includes(d));
    return (
      <div style={S.page}>
        <div style={S.header}>
          <div style={S.eyebrow}>FUNCTIONAL STRENGTH SYSTEM</div>
          <div style={S.title}>POWER PROTOCOL</div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "4px", letterSpacing: "2px" }}>BUILD LIKE ANATOLI. MOVE LIKE BAKI.</div>
        </div>
        <div style={{ padding: "20px 14px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#c8501a", marginBottom: "4px" }}>SCHEDULE SETUP</div>
          <div style={{ fontSize: "17px", fontWeight: "900", marginBottom: "4px" }}>CHOOSE YOUR DAYS</div>
          <div style={{ fontSize: "12px", color: "#555", marginBottom: "20px", lineHeight: "1.7" }}>
            Pick 2–4 days you're available. Workouts map in order: Lower → Upper → Full Body → Conditioning.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            {ALL_DAYS.map(day => {
              const sel = selectedDays.includes(day);
              const idx = sortedSel.indexOf(day);
              const wk = sel && idx >= 0 ? WORKOUTS[idx % WORKOUTS.length] : null;
              return (
                <div key={day} onClick={() => setSelectedDays(p => p.includes(day) ? p.filter(d => d !== day) : [...p, day])}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px", background: sel ? "#1a0a00" : "#111", border: `1px solid ${sel ? "#c8501a" : "#222"}`, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "18px", height: "18px", border: `2px solid ${sel ? "#c8501a" : "#444"}`, background: sel ? "#c8501a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {sel && <span style={{ fontSize: "10px", color: "#fff" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: sel ? "900" : "400", letterSpacing: "2px", color: sel ? "#e8e4dc" : "#555", textTransform: "uppercase" }}>{day}</span>
                  </div>
                  {wk && <span style={{ fontSize: "9px", color: "#c8501a", letterSpacing: "1px" }}>{wk.label}</span>}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", marginBottom: "14px", textAlign: "center", color: selectedDays.length >= 2 ? "#4CAF50" : "#555" }}>
            {selectedDays.length < 2 ? `SELECT ${2 - selectedDays.length} MORE DAY${selectedDays.length === 1 ? "" : "S"}` : `${selectedDays.length} DAYS SELECTED ✓`}
          </div>
          <button onClick={confirmSchedule} disabled={selectedDays.length < 2} style={{ width: "100%", padding: "15px", background: selectedDays.length >= 2 ? "#c8501a" : "#1a1a1a", border: `1px solid ${selectedDays.length >= 2 ? "#c8501a" : "#333"}`, color: selectedDays.length >= 2 ? "#fff" : "#444", fontSize: "13px", letterSpacing: "4px", textTransform: "uppercase", cursor: selectedDays.length >= 2 ? "pointer" : "not-allowed", fontFamily: "'Courier New', monospace", fontWeight: "900" }}>
            BUILD MY PROGRAM →
          </button>
        </div>
      </div>
    );
  }

  // ─── NAV ─────────────────────────────────────────────────────────
  const NavBar = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", borderTop: "2px solid #c8501a", zIndex: 100, background: "#0a0a0a" }}>
      {[["today","TODAY"],["week","WEEK"],["month","MONTH"]].map(([k,l]) => (
        <button key={k} onClick={() => setNavTab(k)} style={S.tabBtn(navTab === k)}>{l}</button>
      ))}
    </div>
  );

  // ─── TODAY TAB ───────────────────────────────────────────────────
  if (navTab === "today") return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={S.eyebrow}>FUNCTIONAL STRENGTH SYSTEM</div>
            <div style={S.title}>POWER PROTOCOL</div>
          </div>
          <button onClick={() => { setScreen("setup"); setSelectedDays([]); setSchedule({}); }} style={{ background: "transparent", border: "1px solid #333", color: "#555", fontSize: "9px", letterSpacing: "2px", padding: "5px 8px", cursor: "pointer", fontFamily: "'Courier New', monospace", marginTop: "6px" }}>EDIT DAYS</button>
        </div>
      </div>
      <div style={S.pad}>
        {/* Day Tabs */}
        <div style={{ marginBottom: "16px" }}>
          <div style={S.sectionLabel}>YOUR SCHEDULE</div>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
            {scheduledDays.map(day => (
              <button key={day} onClick={() => setActiveDay(day)} style={S.pill(activeDay === day)}>{day.slice(0,3)}</button>
            ))}
          </div>
        </div>

        {/* Workout label */}
        <div style={{ background: "#111", border: "1px solid #222", borderLeft: "3px solid #c8501a", padding: "12px 14px", marginBottom: "14px" }}>
          <div style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "2px" }}>{workout?.label}</div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "3px", letterSpacing: "1px" }}>{workout?.focus}</div>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", marginBottom: "14px", border: "1px solid #333", overflow: "hidden" }}>
          {["gym","home"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "11px", background: mode === m ? "#c8501a" : "#111", border: "none", color: mode === m ? "#fff" : "#555", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>
              {m === "gym" ? "🏋️ GYM" : "🏠 HOME"}
            </button>
          ))}
        </div>

        {mode === "home" && (
          <div style={{ background: "#1a1200", border: "1px solid #4a3000", padding: "9px 12px", marginBottom: "14px", fontSize: "11px", color: "#c8a050", letterSpacing: "1px" }}>
            ⚡ GYM CANCELLED — HOME ALTERNATIVE LOADED
          </div>
        )}

        {/* Progress */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#666" }}>SESSION PROGRESS</span>
            <span style={{ fontSize: "12px", color: pct === 100 ? "#4CAF50" : "#c8501a", fontWeight: "900" }}>{doneCount}/{exercises.length} — {pct}%</span>
          </div>
          <div style={{ height: "3px", background: "#1a1a1a" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#4CAF50" : "#c8501a", transition: "width 0.4s ease", boxShadow: `0 0 6px ${pct === 100 ? "#4CAF50" : "#c8501a"}` }} />
          </div>
          {pct === 100 && <div style={{ textAlign: "center", marginTop: "6px", fontSize: "10px", color: "#4CAF50", letterSpacing: "3px" }}>✓ SESSION COMPLETE — LOGGED</div>}
        </div>

        {/* Exercise list with weight inputs */}
        <div style={{ marginBottom: "22px" }}>
          {exercises.map(ex => {
            const done = !!todayEntry.completed?.[ex.id];
            const w = todayEntry.weights?.[ex.id] || {};
            return (
              <div key={ex.id} style={{ marginBottom: "8px", background: done ? "#0d1a0d" : "#111", border: `1px solid ${done ? "#2a4a2a" : "#222"}`, transition: "all 0.2s" }}>
                <div onClick={() => toggleEx(ex.id)} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 14px", cursor: "pointer", opacity: done ? 0.8 : 1 }}>
                  <div style={{ width: "20px", height: "20px", border: `2px solid ${done ? "#4CAF50" : "#c8501a"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px", background: done ? "#4CAF50" : "transparent" }}>
                    {done && <span style={{ fontSize: "11px", color: "#fff" }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", textDecoration: done ? "line-through" : "none", color: done ? "#555" : "#e8e4dc" }}>{ex.name}</div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "3px" }}>
                      <span style={{ fontSize: "10px", color: "#c8501a" }}>{ex.sets}</span>
                      <span style={{ fontSize: "10px", color: "#444" }}>{ex.note}</span>
                    </div>
                  </div>
                </div>
                {ex.weighted && (
                  <div style={{ display: "flex", gap: "8px", padding: "0 14px 10px 46px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "9px", color: "#555", letterSpacing: "2px", marginBottom: "3px" }}>KG</div>
                      <input type="number" placeholder="0" value={w.kg || ""} onChange={e => setWeight(ex.id, "kg", e.target.value)}
                        style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", color: "#e8e4dc", padding: "6px 8px", fontSize: "13px", fontFamily: "'Courier New', monospace", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "9px", color: "#555", letterSpacing: "2px", marginBottom: "3px" }}>REPS</div>
                      <input type="number" placeholder="0" value={w.reps || ""} onChange={e => setWeight(ex.id, "reps", e.target.value)}
                        style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", color: "#e8e4dc", padding: "6px 8px", fontSize: "13px", fontFamily: "'Courier New', monospace", boxSizing: "border-box" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobility */}
        <div style={{ marginBottom: "22px" }}>
          <button onClick={() => setShowMobility(!showMobility)} style={{ width: "100%", padding: "11px 14px", background: "#111", border: "1px solid #333", borderLeft: "3px solid #4a8fcc", color: "#4a8fcc", display: "flex", justifyContent: "space-between", cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase" }}>
            <span>DAILY MOBILITY & STRETCHES</span><span>{showMobility ? "▲" : "▼"}</span>
          </button>
          {showMobility && (
            <div style={{ border: "1px solid #222", borderTop: "none" }}>
              {DAILY_MOBILITY.map((item, i) => {
                const done = !!mobilityLog[`${today}-${i}`];
                return (
                  <div key={i} onClick={() => toggleMobility(i)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: done ? "#0a0d0a" : "#0d0d0d", borderBottom: "1px solid #1a1a1a", cursor: "pointer" }}>
                    <div style={{ width: "16px", height: "16px", border: `2px solid ${done ? "#4a8fcc" : "#333"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? "#4a8fcc" : "transparent" }}>
                      {done && <span style={{ fontSize: "9px", color: "#fff" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "11px", color: done ? "#444" : "#aaa", textDecoration: done ? "line-through" : "none" }}>{item}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly schedule mini */}
        <div style={{ background: "#111", border: "1px solid #222", padding: "14px", marginBottom: "14px" }}>
          <div style={S.sectionLabel}>THIS WEEK'S SCHEDULE</div>
          {scheduledDays.map(day => (
            <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: "11px", color: day === activeDay ? "#c8501a" : "#555", fontWeight: day === activeDay ? "900" : "400" }}>{day === activeDay ? "▶ " : ""}{day.toUpperCase()}</span>
              <span style={{ fontSize: "10px", color: "#333" }}>{schedule[day]?.label}</span>
            </div>
          ))}
        </div>

        <ReminderSection scheduledDays={scheduledDays} />
      </div>
      <NavBar />
    </div>
  );

  // ─── WEEK TAB ────────────────────────────────────────────────────
  if (navTab === "week") return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.eyebrow}>FUNCTIONAL STRENGTH SYSTEM</div>
        <div style={S.title}>WEEKLY VIEW</div>
      </div>
      <div style={S.pad}>
        <WeekView workoutLog={workoutLog} schedule={schedule} S={S} />
      </div>
      <NavBar />
    </div>
  );

  // ─── MONTH TAB ───────────────────────────────────────────────────
  if (navTab === "month") return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.eyebrow}>FUNCTIONAL STRENGTH SYSTEM</div>
        <div style={S.title}>MONTHLY VIEW</div>
      </div>
      <div style={S.pad}>
        <MonthView workoutLog={workoutLog} S={S} />
      </div>
      <NavBar />
    </div>
  );
}

// ─── WEEK VIEW ────────────────────────────────────────────────────────────────
function WeekView({ workoutLog, schedule, S }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDates = (offset = 0) => {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - d.getDay() + 1 + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(d);
      day.setDate(d.getDate() + i);
      return day.toISOString().slice(0,10);
    });
  };

  const weekDates = getWeekDates(weekOffset);
  const weekLabel = (() => {
    const s = new Date(weekDates[0]);
    const e = new Date(weekDates[6]);
    return `${s.getDate()} ${s.toLocaleString("default",{month:"short"})} – ${e.getDate()} ${e.toLocaleString("default",{month:"short"})} ${e.getFullYear()}`;
  })();

  const workedDates = weekDates.filter(d => workoutLog[d]?.done);
  const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  // Collect all exercises with weights logged this week
  const weightEntries = [];
  weekDates.forEach(date => {
    const entry = workoutLog[date];
    if (!entry) return;
    Object.entries(entry.weights || {}).forEach(([exId, w]) => {
      if (w.kg) {
        const wk = WORKOUTS.find(wt => [...wt.gym,...wt.home].find(e => e.id === exId));
        const ex = wk ? [...wk.gym,...wk.home].find(e => e.id === exId) : null;
        weightEntries.push({ date, exId, name: ex?.name || exId, kg: parseFloat(w.kg), reps: w.reps });
      }
    });
  });

  // Bar chart data for sessions per day
  const barData = weekDates.map((date, i) => ({
    day: dayNames[i],
    done: workoutLog[date]?.done ? 1 : 0,
    date,
  }));

  // Weight progression per exercise
  const exMap = {};
  weightEntries.forEach(e => {
    if (!exMap[e.name]) exMap[e.name] = [];
    exMap[e.name].push(e);
  });

  return (
    <div>
      {/* Week nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <button onClick={() => setWeekOffset(o => o - 1)} style={{ background: "transparent", border: "1px solid #333", color: "#888", padding: "6px 12px", cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: "14px" }}>‹</button>
        <span style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px" }}>{weekLabel}</span>
        <button onClick={() => setWeekOffset(o => Math.min(0, o + 1))} style={{ background: "transparent", border: "1px solid #333", color: weekOffset < 0 ? "#888" : "#333", padding: "6px 12px", cursor: weekOffset < 0 ? "pointer" : "default", fontFamily: "'Courier New', monospace", fontSize: "14px" }}>›</button>
      </div>

      {/* Session dots */}
      <div style={{ background: "#111", border: "1px solid #222", padding: "14px", marginBottom: "14px" }}>
        <div style={S.sectionLabel}>SESSIONS THIS WEEK — {workedDates.length} / {Object.keys(schedule).length}</div>
        <div style={{ display: "flex", gap: "6px" }}>
          {weekDates.map((date, i) => {
            const done = workoutLog[date]?.done;
            const isToday = date === isoToday();
            return (
              <div key={date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{ fontSize: "9px", color: isToday ? "#c8501a" : "#444", letterSpacing: "1px" }}>{dayNames[i]}</div>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: done ? "#c8501a" : "#1a1a1a", border: `2px solid ${isToday ? "#c8501a" : "#222"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done && <span style={{ fontSize: "11px", color: "#fff" }}>✓</span>}
                </div>
                <div style={{ fontSize: "8px", color: "#333" }}>{new Date(date).getDate()}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ background: "#111", border: "1px solid #222", padding: "14px", marginBottom: "14px" }}>
        <div style={S.sectionLabel}>WORKOUT DAYS</div>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={barData} barCategoryGap="30%">
            <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 10, fontFamily: "'Courier New', monospace" }} axisLine={false} tickLine={false} />
            <Bar dataKey="done" radius={[2,2,0,0]}>
              {barData.map((d, i) => <Cell key={i} fill={d.done ? "#c8501a" : "#1a1a1a"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weights logged this week */}
      <div style={{ background: "#111", border: "1px solid #222", padding: "14px", marginBottom: "14px" }}>
        <div style={S.sectionLabel}>WEIGHTS LOGGED THIS WEEK</div>
        {weightEntries.length === 0 ? (
          <div style={{ fontSize: "12px", color: "#444", letterSpacing: "1px" }}>No weight data logged yet — add weights in TODAY tab.</div>
        ) : (
          Object.entries(exMap).map(([name, entries]) => (
            <div key={name} style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "11px", color: "#c8501a", letterSpacing: "1px", marginBottom: "6px", fontWeight: "900" }}>{name}</div>
              {entries.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ fontSize: "11px", color: "#666" }}>{new Date(e.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}</span>
                  <span style={{ fontSize: "11px", color: "#e8e4dc", fontWeight: "700" }}>{e.kg} kg {e.reps ? `× ${e.reps} reps` : ""}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Workout summary per day */}
      <div style={{ background: "#111", border: "1px solid #222", padding: "14px" }}>
        <div style={S.sectionLabel}>SESSION DETAILS</div>
        {weekDates.filter(d => workoutLog[d]).map(date => {
          const entry = workoutLog[date];
          const wk = WORKOUTS.find(w => w.key === entry.workoutKey);
          return (
            <div key={date} style={{ padding: "10px 0", borderBottom: "1px solid #1a1a1a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: "#e8e4dc", fontWeight: "900" }}>{new Date(date).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"short"})}</span>
                <span style={{ fontSize: "10px", color: entry.done ? "#4CAF50" : "#c8501a", letterSpacing: "1px" }}>{entry.done ? "DONE" : "PARTIAL"}</span>
              </div>
              {wk && <span style={{ fontSize: "10px", color: "#555", letterSpacing: "1px" }}>{wk.label} · {entry.mode?.toUpperCase()}</span>}
            </div>
          );
        })}
        {weekDates.every(d => !workoutLog[d]) && <div style={{ fontSize: "12px", color: "#444" }}>No sessions logged this week.</div>}
      </div>
    </div>
  );
}

// ─── MONTH VIEW ───────────────────────────────────────────────────────────────
function MonthView({ workoutLog, S }) {
  const now = new Date();
  const [monthOffset, setMonthOffset] = useState(0);

  const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const monthName = `${MONTHS[month]} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = (firstDow + 6) % 7; // Mon=0

  const allDates = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return d.toISOString().slice(0, 10);
  });

  const workedDates = allDates.filter(d => workoutLog[d]?.done);
  const totalSessions = workedDates.length;

  // Weekly breakdown for bar chart
  const weeklyData = (() => {
    const weeks = {};
    allDates.forEach(d => {
      const wk = getWeekKey(new Date(d));
      if (!weeks[wk]) weeks[wk] = { label: `W${Object.keys(weeks).length + 1}`, sessions: 0, totalKg: 0 };
      if (workoutLog[d]?.done) weeks[wk].sessions++;
      Object.values(workoutLog[d]?.weights || {}).forEach(w => {
        if (w.kg) weeks[wk].totalKg += parseFloat(w.kg);
      });
    });
    return Object.values(weeks);
  })();

  // Top exercises by max weight this month
  const exBests = {};
  allDates.forEach(date => {
    Object.entries(workoutLog[date]?.weights || {}).forEach(([exId, w]) => {
      if (!w.kg) return;
      const wk = WORKOUTS.find(wt => [...wt.gym,...wt.home].find(e => e.id === exId));
      const ex = wk ? [...wk.gym,...wk.home].find(e => e.id === exId) : null;
      const name = ex?.name || exId;
      if (!exBests[name] || parseFloat(w.kg) > exBests[name]) exBests[name] = parseFloat(w.kg);
    });
  });

  const calCells = [...Array(startOffset).fill(null), ...allDates];

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <button onClick={() => setMonthOffset(o => o - 1)} style={{ background: "transparent", border: "1px solid #333", color: "#888", padding: "6px 12px", cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: "14px" }}>‹</button>
        <span style={{ fontSize: "13px", color: "#aaa", letterSpacing: "2px", fontWeight: "900" }}>{monthName.toUpperCase()}</span>
        <button onClick={() => setMonthOffset(o => Math.min(0, o + 1))} style={{ background: "transparent", border: "1px solid #333", color: monthOffset < 0 ? "#888" : "#333", padding: "6px 12px", cursor: monthOffset < 0 ? "pointer" : "default", fontFamily: "'Courier New', monospace", fontSize: "14px" }}>›</button>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        {[
          { label: "SESSIONS", val: totalSessions },
          { label: "THIS MONTH", val: `${daysInMonth}d` },
          { label: "CONSISTENCY", val: `${daysInMonth > 0 ? Math.round((totalSessions / daysInMonth) * 7) : 0}/wk` },
        ].map(({ label, val }) => (
          <div key={label} style={{ flex: 1, background: "#111", border: "1px solid #222", padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#c8501a" }}>{val}</div>
            <div style={{ fontSize: "8px", color: "#555", letterSpacing: "1px", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Calendar heatmap */}
      <div style={{ background: "#111", border: "1px solid #222", padding: "14px", marginBottom: "14px" }}>
        <div style={S.sectionLabel}>WORKOUT CALENDAR</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "6px" }}>
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: "9px", color: "#444", paddingBottom: "2px" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {calCells.map((date, i) => {
            if (!date) return <div key={i} />;
            const done = workoutLog[date]?.done;
            const isToday = date === isoToday();
            const day = new Date(date).getDate();
            return (
              <div key={date} style={{ aspectRatio: "1", background: done ? "#c8501a" : "#1a1a1a", border: `1px solid ${isToday ? "#c8501a" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px" }}>
                <span style={{ fontSize: "9px", color: done ? "#fff" : "#444" }}>{day}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
          <div style={{ width: "10px", height: "10px", background: "#c8501a", borderRadius: "2px" }} />
          <span style={{ fontSize: "9px", color: "#555" }}>Workout completed</span>
        </div>
      </div>

      {/* Weekly sessions bar */}
      <div style={{ background: "#111", border: "1px solid #222", padding: "14px", marginBottom: "14px" }}>
        <div style={S.sectionLabel}>SESSIONS PER WEEK</div>
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={weeklyData} barCategoryGap="25%">
            <XAxis dataKey="label" tick={{ fill: "#555", fontSize: 10, fontFamily: "'Courier New', monospace" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", color: "#e8e4dc", fontFamily: "'Courier New', monospace", fontSize: "11px" }} formatter={(v) => [`${v} sessions`, ""]} />
            <Bar dataKey="sessions" fill="#c8501a" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total KG lifted per week */}
      {weeklyData.some(w => w.totalKg > 0) && (
        <div style={{ background: "#111", border: "1px solid #222", padding: "14px", marginBottom: "14px" }}>
          <div style={S.sectionLabel}>TOTAL WEIGHT LIFTED PER WEEK (KG)</div>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="label" tick={{ fill: "#555", fontSize: 10, fontFamily: "'Courier New', monospace" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", color: "#e8e4dc", fontFamily: "'Courier New', monospace", fontSize: "11px" }} formatter={(v) => [`${v} kg`, ""]} />
              <Line type="monotone" dataKey="totalKg" stroke="#c8501a" strokeWidth={2} dot={{ fill: "#c8501a", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Personal bests this month */}
      <div style={{ background: "#111", border: "1px solid #222", padding: "14px" }}>
        <div style={S.sectionLabel}>BEST WEIGHTS THIS MONTH</div>
        {Object.keys(exBests).length === 0 ? (
          <div style={{ fontSize: "12px", color: "#444" }}>No weight data logged yet.</div>
        ) : (
          Object.entries(exBests).sort((a,b) => b[1]-a[1]).map(([name, kg]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: "11px", color: "#aaa" }}>{name}</span>
              <span style={{ fontSize: "13px", color: "#c8501a", fontWeight: "900" }}>{kg} kg</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── REMINDER ─────────────────────────────────────────────────────────────────
function ReminderSection({ scheduledDays }) {
  const short = { Monday:"Mon", Tuesday:"Tue", Wednesday:"Wed", Thursday:"Thu", Friday:"Fri", Saturday:"Sat", Sunday:"Sun" };
  const [time, setTime] = useState("07:00");
  const [active, setActive] = useState(() => Object.fromEntries(scheduledDays.map(d => [d, true])));
  const [done, setDone] = useState(false);

  return (
    <div style={{ background: "#111", border: "1px solid #222", padding: "14px" }}>
      <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#666", marginBottom: "10px" }}>WORKOUT REMINDER</div>
      {!done ? (
        <>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "12px" }}>
            {scheduledDays.map(d => (
              <button key={d} onClick={() => setActive(p => ({ ...p, [d]: !p[d] }))} style={{ padding: "6px 10px", background: active[d] ? "#c8501a" : "transparent", border: `1px solid ${active[d] ? "#c8501a" : "#333"}`, color: active[d] ? "#fff" : "#555", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>
                {short[d] || d.slice(0,3)}
              </button>
            ))}
          </div>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", color: "#e8e4dc", padding: "9px 10px", fontSize: "14px", fontFamily: "'Courier New', monospace", marginBottom: "10px", boxSizing: "border-box" }} />
          <button onClick={() => setDone(true)} style={{ width: "100%", padding: "11px", background: "#c8501a", border: "none", color: "#fff", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>SET REMINDER</button>
        </>
      ) : (
        <div style={{ padding: "12px", background: "#0d1a0d", border: "1px solid #2a4a2a", textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "#4CAF50", letterSpacing: "2px" }}>✓ REMINDER SET — {time}</div>
          <div style={{ fontSize: "9px", color: "#555", marginTop: "5px" }}>{Object.entries(active).filter(([,v])=>v).map(([k])=>short[k]||k.slice(0,3)).join(" · ")}</div>
          <button onClick={() => setDone(false)} style={{ marginTop: "10px", padding: "5px 12px", background: "transparent", border: "1px solid #333", color: "#555", fontSize: "9px", cursor: "pointer", fontFamily: "'Courier New', monospace" }}>EDIT</button>
        </div>
      )}
    </div>
  );
}

function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString().slice(0,10);
}

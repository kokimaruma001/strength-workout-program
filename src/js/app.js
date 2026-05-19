// ─── STATE MANAGEMENT ───────────────────────────────────────────────────────
let state = {
  screen: 'setup',  // setup | tracker
  navTab: 'today',  // today | week | month
  selectedDays: [],
  schedule: {},
  activeDay: null,
  mode: 'gym',  // gym | home
  showMobility: false,
  workoutLog: {},
  mobilityLog: {},
};

// ─── INIT STATE ──────────────────────────────────────────────────────────────
function initState() {
  state.workoutLog = getWorkoutLog();
  state.mobilityLog = getMobilityLog();
  state.selectedDays = getSelectedDays();
  state.schedule = getSchedule();
  state.mode = getMode();
  
  // If user has a saved schedule, skip setup screen
  if (Object.keys(state.schedule).length > 0) {
    state.screen = 'tracker';
    state.activeDay = state.selectedDays[0] || Object.keys(state.schedule)[0];
  }
}

// ─── STATE UPDATES ───────────────────────────────────────────────────────────
function setScreen(screen) {
  state.screen = screen;
  if (screen === 'setup') {
    // Preserve current selections when editing (don't clear them)
    // This allows users to modify their existing setup
  }
  render();
}

function setNavTab(tab) {
  state.navTab = tab;
  render();
}

function toggleDay(day) {
  if (state.selectedDays.includes(day)) {
    state.selectedDays = state.selectedDays.filter(d => d !== day);
  } else {
    state.selectedDays.push(day);
  }
  render();
}

function confirmSchedule() {
  if (state.selectedDays.length < 2) return;
  const sorted = ALL_DAYS.filter(d => state.selectedDays.includes(d));
  state.schedule = buildSchedule(sorted);
  state.activeDay = sorted[0];
  state.screen = 'tracker';
  
  // Persist schedule to storage
  saveSelectedDays(state.selectedDays);
  saveSchedule(state.schedule);
  
  render();
}

function setActiveDay(day) {
  state.activeDay = day;
  render();
}

function setMode(mode) {
  state.mode = mode;
  saveMode(mode);
  render();
}

function toggleExercise(exId) {
  const workout = state.schedule[state.activeDay];
  state.workoutLog = toggleExercise(state.workoutLog, exId, state.mode, workout?.key);
  saveWorkoutLog(state.workoutLog);
  render();
}

function setWeight(exId, field, val) {
  const workout = state.schedule[state.activeDay];
  state.workoutLog = updateExerciseWeight(state.workoutLog, exId, field, val, state.mode, workout?.key);
  saveWorkoutLog(state.workoutLog);
}

function toggleMobilityItem(i) {
  state.mobilityLog = toggleMobility(state.mobilityLog, i);
  saveMobilityLog(state.mobilityLog);
  render();
}

function setShowMobility(show) {
  state.showMobility = show;
  render();
}

// ─── RENDER FUNCTIONS ────────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  if (state.screen === 'setup') {
    app.appendChild(renderSetup());
  } else {
    app.appendChild(renderTracker());
  }
}

function renderSetup() {
  const container = createElement('div', 'page');
  
  const header = createElement('div', 'header');
  header.innerHTML = `
    <div class="eyebrow">FUNCTIONAL STRENGTH SYSTEM</div>
    <div class="title">POWER PROTOCOL</div>
    <div class="subtitle">BUILD LIKE ANATOLI. MOVE LIKE BAKI.</div>
  `;
  
  const content = createElement('div', 'setup-content');
  
  const heading = createElement('div');
  heading.innerHTML = `
    <div style="font-size: 10px; letter-spacing: 4px; color: #c8501a; margin-bottom: 4px; text-transform: uppercase;">SCHEDULE SETUP</div>
    <div style="font-size: 17px; font-weight: 900; margin-bottom: 4px;">CHOOSE YOUR DAYS</div>
    <div style="font-size: 12px; color: #555; margin-bottom: 20px; line-height: 1.7;">
      Pick 2–4 days you're available. Workouts map in order: Lower → Upper → Full Body → Conditioning.
    </div>
  `;
  content.appendChild(heading);
  
  const daySelector = createElement('div', 'day-selector');
  ALL_DAYS.forEach(day => {
    const selected = state.selectedDays.includes(day);
    const idx = state.selectedDays.filter(d => ALL_DAYS.indexOf(d) < ALL_DAYS.indexOf(day)).length;
    const workout = selected && idx >= 0 ? WORKOUTS[idx % WORKOUTS.length] : null;
    
    const dayOption = createElement('div', `day-option ${selected ? 'selected' : ''}`);
    dayOption.onclick = () => { toggleDay(day); };
    dayOption.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="day-checkbox">${selected ? '✓' : ''}</div>
        <span class="day-label">${day}</span>
      </div>
      ${workout ? `<span class="day-workout">${workout.label}</span>` : ''}
    `;
    daySelector.appendChild(dayOption);
  });
  content.appendChild(daySelector);
  
  const status = createElement('div', `selection-status ${state.selectedDays.length >= 2 ? 'complete' : ''}`);
  if (state.selectedDays.length < 2) {
    status.textContent = `SELECT ${2 - state.selectedDays.length} MORE DAY${state.selectedDays.length === 1 ? '' : 'S'}`;
  } else {
    status.textContent = `${state.selectedDays.length} DAYS SELECTED ✓`;
  }
  content.appendChild(status);
  
  const btn = createElement('button', 'btn-primary');
  btn.textContent = 'BUILD MY PROGRAM →';
  btn.disabled = state.selectedDays.length < 2;
  btn.onclick = confirmSchedule;
  content.appendChild(btn);
  
  container.appendChild(header);
  container.appendChild(content);
  return container;
}

function renderTracker() {
  const container = createElement('div', 'page');
  
  if (state.navTab === 'today') {
    container.appendChild(renderTodayView());
  } else if (state.navTab === 'week') {
    container.appendChild(renderWeekView());
  } else if (state.navTab === 'month') {
    container.appendChild(renderMonthView());
  }
  
  container.appendChild(renderNavBar());
  return container;
}

function renderTodayView() {
  const fragment = document.createDocumentFragment();
  
  // Header
  const header = createElement('div', 'header');
  const headerContent = createElement('div');
  headerContent.style.display = 'flex';
  headerContent.style.justifyContent = 'space-between';
  headerContent.style.alignItems = 'flex-start';
  headerContent.innerHTML = `
    <div>
      <div class="eyebrow">FUNCTIONAL STRENGTH SYSTEM</div>
      <div class="title">POWER PROTOCOL</div>
    </div>
  `;
  
  const editBtn = createElement('button', 'btn-secondary');
  editBtn.textContent = 'EDIT DAYS';
  editBtn.onclick = () => setScreen('setup');
  headerContent.appendChild(editBtn);
  
  header.appendChild(headerContent);
  fragment.appendChild(header);
  
  // Content
  const content = createElement('div', 'content');
  
  // Day tabs
  const dayTabsSection = createElement('div');
  dayTabsSection.style.marginBottom = '16px';
  const dayTabsLabel = createElement('div', 'section-label');
  dayTabsLabel.textContent = 'YOUR SCHEDULE';
  dayTabsSection.appendChild(dayTabsLabel);
  
  const dayTabs = createElement('div', 'day-tabs');
  Object.keys(state.schedule).forEach(day => {
    const pill = createElement('button', `btn-pill ${state.activeDay === day ? 'active' : ''}`);
    pill.textContent = day.slice(0, 3);
    pill.onclick = () => setActiveDay(day);
    dayTabs.appendChild(pill);
  });
  dayTabsSection.appendChild(dayTabs);
  content.appendChild(dayTabsSection);
  
  // Workout label
  const workout = state.schedule[state.activeDay];
  if (workout) {
    const workoutLabel = createElement('div', 'card bordered');
    workoutLabel.innerHTML = `
      <div class="workout-label-main">${workout.label}</div>
      <div class="workout-label-focus">${workout.focus}</div>
    `;
    content.appendChild(workoutLabel);
    
    // Mode toggle
    const modeToggle = createElement('div', 'mode-toggle');
    ['gym', 'home'].forEach(m => {
      const btn = createElement('button', `mode-btn ${state.mode === m ? 'active' : ''}`);
      btn.textContent = m === 'gym' ? '🏋️ GYM' : '🏠 HOME';
      btn.onclick = () => setMode(m);
      modeToggle.appendChild(btn);
    });
    content.appendChild(modeToggle);
    
    // Warning banner
    if (state.mode === 'home') {
      const warning = createElement('div', 'warning-banner');
      warning.textContent = '⚡ GYM CANCELLED — HOME ALTERNATIVE LOADED';
      content.appendChild(warning);
    }
    
    // Progress
    const exercises = state.mode === 'gym' ? workout.gym : workout.home;
    const today = isoToday();
    const todayEntry = state.workoutLog[today] || { completed: {} };
    const doneCount = exercises.filter(e => todayEntry.completed?.[e.id]).length;
    const pct = exercises.length ? Math.round((doneCount / exercises.length) * 100) : 0;
    
    const progressSection = createElement('div', 'progress-section');
    const progressHeader = createElement('div', 'progress-header');
    progressHeader.innerHTML = `
      <span class="progress-label">SESSION PROGRESS</span>
      <span class="progress-value ${pct === 100 ? 'complete' : ''}">${doneCount}/${exercises.length} — ${pct}%</span>
    `;
    progressSection.appendChild(progressHeader);
    
    const progressBar = createElement('div', 'progress-bar');
    const fill = createElement('div', `progress-fill ${pct === 100 ? 'complete' : ''}`);
    fill.style.width = `${pct}%`;
    progressBar.appendChild(fill);
    progressSection.appendChild(progressBar);
    
    if (pct === 100) {
      const complete = createElement('div', 'progress-complete');
      complete.textContent = '✓ SESSION COMPLETE — LOGGED';
      progressSection.appendChild(complete);
    }
    content.appendChild(progressSection);
    
    // Exercise list
    const exerciseList = createElement('div', 'exercise-list');
    exercises.forEach(ex => {
      const done = !!todayEntry.completed?.[ex.id];
      const weights = todayEntry.weights?.[ex.id] || {};
      
      const item = createElement('div', `exercise-item ${done ? 'completed' : ''}`);
      const header = createElement('div', 'exercise-header');
      header.onclick = () => toggleExercise(ex.id);
      
      const checkbox = createElement('div', 'exercise-checkbox');
      if (done) checkbox.textContent = '✓';
      
      const content_inner = createElement('div', 'exercise-content');
      const name = createElement('div', 'exercise-name');
      name.textContent = ex.name;
      
      const meta = createElement('div', 'exercise-meta');
      const sets = createElement('span', 'exercise-sets');
      sets.textContent = ex.sets;
      const note = createElement('span', 'exercise-note');
      note.textContent = ex.note;
      meta.appendChild(sets);
      meta.appendChild(note);
      
      content_inner.appendChild(name);
      content_inner.appendChild(meta);
      
      header.appendChild(checkbox);
      header.appendChild(content_inner);
      item.appendChild(header);
      
      // Weight inputs
      if (ex.weighted) {
        const weightsDiv = createElement('div', 'exercise-weights');
        
        const kgGroup = createElement('div', 'weight-input-group');
        const kgLabel = createElement('div', 'weight-label');
        kgLabel.textContent = 'KG';
        const kgInput = createElement('input');
        kgInput.type = 'number';
        kgInput.placeholder = '0';
        kgInput.value = weights.kg || '';
        kgInput.onchange = (e) => setWeight(ex.id, 'kg', e.target.value);
        kgGroup.appendChild(kgLabel);
        kgGroup.appendChild(kgInput);
        
        const repsGroup = createElement('div', 'weight-input-group');
        const repsLabel = createElement('div', 'weight-label');
        repsLabel.textContent = 'REPS';
        const repsInput = createElement('input');
        repsInput.type = 'number';
        repsInput.placeholder = '0';
        repsInput.value = weights.reps || '';
        repsInput.onchange = (e) => setWeight(ex.id, 'reps', e.target.value);
        repsGroup.appendChild(repsLabel);
        repsGroup.appendChild(repsInput);
        
        weightsDiv.appendChild(kgGroup);
        weightsDiv.appendChild(repsGroup);
        item.appendChild(weightsDiv);
      }
      
      exerciseList.appendChild(item);
    });
    content.appendChild(exerciseList);
    
    // Mobility section
    const mobilitySection = createElement('div', 'mobility-section');
    const mobilityToggle = createElement('button', 'mobility-toggle');
    mobilityToggle.innerHTML = `
      <span>DAILY MOBILITY & STRETCHES</span>
      <span>${state.showMobility ? '▲' : '▼'}</span>
    `;
    mobilityToggle.onclick = () => setShowMobility(!state.showMobility);
    mobilitySection.appendChild(mobilityToggle);
    
    if (state.showMobility) {
      const list = createElement('div', 'mobility-list');
      DAILY_MOBILITY.forEach((item, i) => {
        const key = `${today}-${i}`;
        const done = !!state.mobilityLog[key];
        const itemDiv = createElement('div', `mobility-item ${done ? 'completed' : ''}`);
        itemDiv.onclick = () => toggleMobilityItem(i);
        itemDiv.innerHTML = `
          <div class="mobility-checkbox">${done ? '✓' : ''}</div>
          <span class="mobility-text">${item}</span>
        `;
        list.appendChild(itemDiv);
      });
      mobilitySection.appendChild(list);
    }
    content.appendChild(mobilitySection);
    
    // Weekly schedule mini
    const weeklyCard = createElement('div', 'card');
    const weeklyLabel = createElement('div', 'section-label');
    weeklyLabel.textContent = "THIS WEEK'S SCHEDULE";
    weeklyCard.appendChild(weeklyLabel);
    
    Object.keys(state.schedule).forEach(day => {
      const dayRow = createElement('div');
      dayRow.style.display = 'flex';
      dayRow.style.justifyContent = 'space-between';
      dayRow.style.alignItems = 'center';
      dayRow.style.padding = '7px 0';
      dayRow.style.borderBottom = '1px solid #1a1a1a';
      dayRow.style.fontSize = '11px';
      dayRow.style.color = day === state.activeDay ? '#c8501a' : '#555';
      dayRow.style.fontWeight = day === state.activeDay ? '900' : '400';
      
      const dayName = day === state.activeDay ? '▶ ' : '';
      dayRow.innerHTML = `
        <span>${dayName}${day.toUpperCase()}</span>
        <span style="font-size: 10px; color: #333;">${state.schedule[day]?.label}</span>
      `;
      weeklyCard.appendChild(dayRow);
    });
    content.appendChild(weeklyCard);
  }
  
  fragment.appendChild(content);
  return fragment;
}

function renderWeekView() {
  const fragment = document.createDocumentFragment();
  
  // Header
  const header = createElement('div', 'header');
  header.innerHTML = `
    <div class="eyebrow">FUNCTIONAL STRENGTH SYSTEM</div>
    <div class="title">WEEKLY VIEW</div>
  `;
  fragment.appendChild(header);
  
  // Content
  const content = createElement('div', 'content');
  content.style.paddingBottom = '100px';
  
  // Week nav and stats
  const weekDates = getWeekDates(0);
  const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  
  const nav = createElement('div', 'week-nav');
  const prevBtn = createElement('button', 'nav-btn');
  prevBtn.textContent = '‹';
  prevBtn.disabled = true;
  const label = createElement('span', 'nav-label');
  const s = new Date(weekDates[0]);
  const e = new Date(weekDates[6]);
  label.textContent = `${s.getDate()} ${s.toLocaleString("default",{month:"short"})} – ${e.getDate()} ${e.toLocaleString("default",{month:"short"})} ${e.getFullYear()}`;
  const nextBtn = createElement('button', 'nav-btn');
  nextBtn.textContent = '›';
  nextBtn.disabled = true;
  nav.appendChild(prevBtn);
  nav.appendChild(label);
  nav.appendChild(nextBtn);
  content.appendChild(nav);
  
  // Session dots
  const dotsCard = createElement('div', 'card');
  const dotsLabel = createElement('div', 'section-label');
  const workedDates = weekDates.filter(d => state.workoutLog[d]?.done);
  dotsLabel.innerHTML = `SESSIONS THIS WEEK — ${workedDates.length} / ${Object.keys(state.schedule).length}`;
  dotsCard.appendChild(dotsLabel);
  
  const datesContainer = createElement('div', 'week-dates');
  weekDates.forEach((date, i) => {
    const done = state.workoutLog[date]?.done;
    const isToday = date === isoToday();
    const dateDiv = createElement('div', 'week-date');
    dateDiv.innerHTML = `
      <div class="week-day ${isToday ? 'today' : ''}">${dayNames[i]}</div>
      <div class="week-dot ${done ? 'done' : ''} ${isToday ? 'today' : ''}">${done ? '✓' : ''}</div>
      <div class="week-date-num">${new Date(date).getDate()}</div>
    `;
    datesContainer.appendChild(dateDiv);
  });
  dotsCard.appendChild(datesContainer);
  content.appendChild(dotsCard);
  
  // Chart
  const chartCard = createElement('div', 'chart-container');
  const chartLabel = createElement('div', 'section-label');
  chartLabel.textContent = 'WORKOUT DAYS';
  chartCard.appendChild(chartLabel);
  const canvas = createElement('canvas', 'chart-canvas');
  canvas.id = 'weekChart';
  canvas.height = 80;
  chartCard.appendChild(canvas);
  content.appendChild(chartCard);
  
  // Weights logged
  const weightsCard = createElement('div', 'card');
  const weightsLabel = createElement('div', 'section-label');
  weightsLabel.textContent = 'WEIGHTS LOGGED THIS WEEK';
  weightsCard.appendChild(weightsLabel);
  
  const weightEntries = [];
  weekDates.forEach(date => {
    const entry = state.workoutLog[date];
    if (!entry) return;
    Object.entries(entry.weights || {}).forEach(([exId, w]) => {
      if (w.kg) {
        const { exercise } = getWorkoutByExId(exId);
        if (exercise) {
          weightEntries.push({ date, name: exercise.name, kg: parseFloat(w.kg), reps: w.reps });
        }
      }
    });
  });
  
  if (weightEntries.length === 0) {
    weightsCard.innerHTML += '<div style="font-size: 12px; color: #444; letter-spacing: 1px;">No weight data logged yet — add weights in TODAY tab.</div>';
  } else {
    const exMap = {};
    weightEntries.forEach(e => {
      if (!exMap[e.name]) exMap[e.name] = [];
      exMap[e.name].push(e);
    });
    
    Object.entries(exMap).forEach(([name, entries]) => {
      const nameDiv = createElement('div');
      nameDiv.style.marginBottom = '14px';
      nameDiv.innerHTML = `<div style="font-size: 11px; color: #c8501a; letter-spacing: 1px; margin-bottom: 6px; font-weight: 900;">${name}</div>`;
      
      entries.forEach(e => {
        const entryDiv = createElement('div');
        entryDiv.style.display = 'flex';
        entryDiv.style.justifyContent = 'space-between';
        entryDiv.style.padding = '5px 0';
        entryDiv.style.borderBottom = '1px solid #1a1a1a';
        entryDiv.innerHTML = `
          <span style="font-size: 11px; color: #666;">${formatDate(e.date, 'short')}</span>
          <span style="font-size: 11px; color: #e8e4dc; font-weight: 700;">${e.kg} kg ${e.reps ? `× ${e.reps} reps` : ''}</span>
        `;
        nameDiv.appendChild(entryDiv);
      });
      weightsCard.appendChild(nameDiv);
    });
  }
  content.appendChild(weightsCard);
  
  fragment.appendChild(content);
  
  // Render chart after content is appended
  setTimeout(() => {
    const data = weekDates.map(d => state.workoutLog[d]?.done ? 1 : 0);
    createBarChart('weekChart', dayNames, data, 'Sessions');
  }, 0);
  
  return fragment;
}

function renderMonthView() {
  const fragment = document.createDocumentFragment();
  
  // Header
  const header = createElement('div', 'header');
  header.innerHTML = `
    <div class="eyebrow">FUNCTIONAL STRENGTH SYSTEM</div>
    <div class="title">MONTHLY VIEW</div>
  `;
  fragment.appendChild(header);
  
  // Content
  const content = createElement('div', 'content');
  content.style.paddingBottom = '100px';
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = `${MONTHS[month]} ${year}`;
  
  const nav = createElement('div', 'month-nav');
  const prevBtn = createElement('button', 'nav-btn');
  prevBtn.textContent = '‹';
  prevBtn.disabled = true;
  const label = createElement('span', 'nav-label');
  label.style.fontSize = '13px';
  label.style.fontWeight = '900';
  label.style.letterSpacing = '2px';
  label.textContent = monthName.toUpperCase();
  const nextBtn = createElement('button', 'nav-btn');
  nextBtn.textContent = '›';
  nextBtn.disabled = true;
  nav.appendChild(prevBtn);
  nav.appendChild(label);
  nav.appendChild(nextBtn);
  content.appendChild(nav);
  
  // Stats
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const allDates = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return d.toISOString().slice(0, 10);
  });
  const workedDates = allDates.filter(d => state.workoutLog[d]?.done);
  const totalSessions = workedDates.length;
  
  const statsRow = createElement('div', 'stats-row');
  [
    { label: 'SESSIONS', val: totalSessions },
    { label: 'THIS MONTH', val: `${daysInMonth}d` },
    { label: 'CONSISTENCY', val: `${daysInMonth > 0 ? Math.round((totalSessions / daysInMonth) * 7) : 0}/wk` },
  ].forEach(({ label, val }) => {
    const card = createElement('div', 'stat-card');
    card.innerHTML = `
      <div class="stat-value">${val}</div>
      <div class="stat-label">${label}</div>
    `;
    statsRow.appendChild(card);
  });
  content.appendChild(statsRow);
  
  // Calendar heatmap
  const calCard = createElement('div', 'card');
  const calLabel = createElement('div', 'section-label');
  calLabel.textContent = 'WORKOUT CALENDAR';
  calCard.appendChild(calLabel);
  
  const dayHeaders = createElement('div', 'calendar-grid');
  dayHeaders.style.marginBottom = '6px';
  ['M','T','W','T','F','S','S'].forEach(d => {
    const h = createElement('div', 'calendar-header');
    h.textContent = d;
    dayHeaders.appendChild(h);
  });
  calCard.appendChild(dayHeaders);
  
  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = (firstDow + 6) % 7;
  const allCells = [...Array(startOffset).fill(null), ...allDates];
  
  const grid = createElement('div', 'calendar-grid');
  allCells.forEach(date => {
    if (!date) {
      grid.appendChild(createElement('div'));
    } else {
      const done = state.workoutLog[date]?.done;
      const isToday = date === isoToday();
      const cell = createElement('div', `calendar-cell ${done ? 'done' : ''} ${isToday ? 'today' : ''}`);
      cell.textContent = new Date(date).getDate();
      grid.appendChild(cell);
    }
  });
  calCard.appendChild(grid);
  
  const legend = createElement('div', 'calendar-legend');
  legend.innerHTML = `
    <div class="legend-dot"></div>
    <span class="legend-text">Workout completed</span>
  `;
  calCard.appendChild(legend);
  content.appendChild(calCard);
  
  // Weekly sessions bar
  const weeklyData = (() => {
    const weeks = {};
    allDates.forEach(d => {
      const wk = getWeekKey(new Date(d));
      if (!weeks[wk]) weeks[wk] = { label: `W${Object.keys(weeks).length + 1}`, sessions: 0 };
      if (state.workoutLog[d]?.done) weeks[wk].sessions++;
    });
    return Object.values(weeks);
  })();
  
  const weeklyCard = createElement('div', 'chart-container');
  const weeklyLabel = createElement('div', 'section-label');
  weeklyLabel.textContent = 'SESSIONS PER WEEK';
  weeklyCard.appendChild(weeklyLabel);
  const canvas = createElement('canvas', 'chart-canvas');
  canvas.id = 'monthChart';
  canvas.height = 90;
  weeklyCard.appendChild(canvas);
  content.appendChild(weeklyCard);
  
  fragment.appendChild(content);
  
  // Render chart after content is appended
  setTimeout(() => {
    const labels = weeklyData.map(w => w.label);
    const data = weeklyData.map(w => w.sessions);
    createBarChart('monthChart', labels, data, 'Sessions');
  }, 0);
  
  return fragment;
}

function renderNavBar() {
  const nav = createElement('div', 'nav-bar');
  
  [['today','TODAY'],['week','WEEK'],['month','MONTH']].forEach(([k, l]) => {
    const btn = createElement('button', `btn-tab ${state.navTab === k ? 'active' : ''}`);
    btn.textContent = l;
    btn.onclick = () => setNavTab(k);
    nav.appendChild(btn);
  });
  
  return nav;
}

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────
function getWeekDates(offset = 0) {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - d.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d);
    day.setDate(d.getDate() + i + offset * 7);
    return day.toISOString().slice(0,10);
  });
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initState();
  render();
});

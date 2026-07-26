const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dataPath = path.join(__dirname, '..', 'src', 'js', 'data.js');
const utilsPath = path.join(__dirname, '..', 'src', 'js', 'utils.js');
const storagePath = path.join(__dirname, '..', 'src', 'js', 'storage.js');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const utilsSource = fs.readFileSync(utilsPath, 'utf8');
const storageSource = fs.readFileSync(storagePath, 'utf8');

const context = {
  console,
  setTimeout,
  clearTimeout,
  document: {
    createElement() {
      return { style: {}, appendChild() {}, setAttribute() {}, addEventListener() {}, className: '' };
    },
  },
};
vm.createContext(context);
vm.runInContext(dataSource, context);
vm.runInContext(utilsSource, context);

const storageContext = {
  console,
  setTimeout,
  clearTimeout,
  localStorage: {
    getItem() { return null; },
    setItem() {},
    removeItem() {},
    key() { return null; },
    length: 0,
  },
  WORKOUTS: [],
};
vm.createContext(storageContext);
vm.runInContext(dataSource, storageContext);
vm.runInContext(utilsSource, storageContext);
vm.runInContext(storageSource, storageContext);

test('getSimilarExercises only returns alternatives from the selected mode', () => {
  const gymAlternatives = context.getSimilarExercises('sq', 'gym', 'lower');
  const homeAlternatives = context.getSimilarExercises('sq', 'home', 'lower');

  assert.ok(gymAlternatives.length > 0);
  assert.ok(homeAlternatives.length > 0);
  assert.ok(gymAlternatives.every(ex => ex.mode === 'gym'));
  assert.ok(homeAlternatives.every(ex => ex.mode === 'home'));
});

test('each exercise exposes four home and gym alternatives', () => {
  const workouts = vm.runInContext('WORKOUTS', context);
  const exercises = [
    ...workouts.flatMap(wk => wk.gym.map(ex => ({ ...ex, mode: 'gym', workoutKey: wk.key }))),
    ...workouts.flatMap(wk => wk.home.map(ex => ({ ...ex, mode: 'home', workoutKey: wk.key }))),
  ];

  exercises.forEach(ex => {
    const gymAlternatives = context.getSimilarExercises(ex.id, 'gym', ex.workoutKey);
    const homeAlternatives = context.getSimilarExercises(ex.id, 'home', ex.workoutKey);

    assert.ok(gymAlternatives.length >= 4, `${ex.id} should expose at least four gym alternatives`);
    assert.ok(homeAlternatives.length >= 4, `${ex.id} should expose at least four home alternatives`);
    assert.ok(gymAlternatives.every(alt => alt.mode === 'gym'));
    assert.ok(homeAlternatives.every(alt => alt.mode === 'home'));
  });
});

test('home workouts expose equipment-specific exercises with full metadata', () => {
  const workouts = vm.runInContext('WORKOUTS', context);
  const homeExercises = workouts.flatMap(wk => wk.home.map(ex => ({ ...ex, workoutKey: wk.key })));

  assert.ok(homeExercises.length >= 12, 'home workouts should include a full 4-protocol set');
  homeExercises.forEach(ex => {
    assert.ok(ex.name, `${ex.id} should have a name`);
    assert.ok(ex.sets, `${ex.id} should have sets`);
    assert.ok(ex.note, `${ex.id} should have a note`);
    assert.equal(typeof ex.weighted, 'boolean', `${ex.id} should have a boolean weighted flag`);
    assert.ok(ex.equipment, `${ex.id} should expose equipment metadata`);
    assert.match(ex.equipment, /kb|mb|bodyweight/i, `${ex.id} should use a supported equipment tag`);
  });
});

test('toggleExercise and updateExerciseWeight preserve the entry structure before copy', () => {
  const workoutLog = {};
  const updatedLog = storageContext.toggleExercise(workoutLog, 'sq', 'gym', 'lower');
  const weightedLog = storageContext.updateExerciseWeight(updatedLog, 'sq', 'kg', '100', 'gym', 'lower');

  const today = storageContext.isoToday();
  const serializedCompleted = JSON.parse(JSON.stringify(weightedLog[today].completed));
  const serializedWeights = JSON.parse(JSON.stringify(weightedLog[today].weights));

  assert.deepEqual(serializedCompleted, { sq: true });
  assert.deepEqual(serializedWeights.sq, { kg: '100' });
  assert.equal(weightedLog[today].done, false);
});

test('copyWorkoutEntry carries over completed, weights, and done state', () => {
  const previousEntry = {
    completed: { sq: true },
    weights: { sq: { kg: '100', reps: '5' } },
    done: true,
    mode: 'gym',
    workoutKey: 'lower',
  };

  const copiedEntry = storageContext.copyWorkoutEntry(previousEntry, { completed: {}, weights: {}, done: false });
  const copiedCompleted = JSON.parse(JSON.stringify(copiedEntry.completed));
  const copiedWeights = JSON.parse(JSON.stringify(copiedEntry.weights));

  assert.deepEqual(copiedCompleted, previousEntry.completed);
  assert.deepEqual(copiedWeights, previousEntry.weights);
  assert.equal(copiedEntry.done, true);
  assert.equal(copiedEntry.mode, 'gym');
  assert.equal(copiedEntry.workoutKey, 'lower');
});

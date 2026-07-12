const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dataPath = path.join(__dirname, '..', 'src', 'js', 'data.js');
const storagePath = path.join(__dirname, '..', 'src', 'js', 'storage.js');
const source = fs.readFileSync(dataPath, 'utf8');
const storageSource = fs.readFileSync(storagePath, 'utf8');

const context = {
  console,
  setTimeout,
  clearTimeout,
};
vm.createContext(context);
vm.runInContext(source, context);

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

test('toggleExercise and updateExerciseWeight preserve the entry structure before copy', () => {
  const workoutLog = {};
  const updatedLog = storageContext.toggleExercise(workoutLog, 'sq', 'gym', 'lower');
  const weightedLog = storageContext.updateExerciseWeight(updatedLog, 'sq', 'kg', '100', 'gym', 'lower');

  assert.deepEqual(weightedLog[storageContext.isoToday()].completed, { sq: true });
  assert.deepEqual(weightedLog[storageContext.isoToday()].weights.sq, { kg: '100' });
  assert.equal(weightedLog[storageContext.isoToday()].done, false);
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

  assert.deepEqual(copiedEntry.completed, previousEntry.completed);
  assert.deepEqual(copiedEntry.weights, previousEntry.weights);
  assert.equal(copiedEntry.done, true);
  assert.equal(copiedEntry.mode, 'gym');
  assert.equal(copiedEntry.workoutKey, 'lower');
});

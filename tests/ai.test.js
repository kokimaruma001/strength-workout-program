const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { sanitizeRecommendations } = require('../server');

const aiSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', 'ai.js'), 'utf8');
const context = { Date, Set, Map, Number, String, Array, Object, fetch() {} };
vm.createContext(context);
vm.runInContext(aiSource, context);

test('recommendation payload limits history to the active eight-week workout and estimates work', () => {
  const today = new Date();
  const recentDate = new Date(today.getTime() - (3 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
  const oldDate = new Date(today.getTime() - (60 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
  const workout = { key: 'upper', label: 'Upper Power', focus: 'Push and pull' };
  const exercises = [{ id: 'bp', name: 'Bench Press', sets: '4x8', note: 'Controlled reps' }];
  const payload = context.buildWorkoutRecommendationPayload({
    workout,
    mode: 'gym',
    unavailableEquipment: '  bench rack  ',
    exercises,
    candidates: [...exercises, { id: 'pup', name: 'Push-up', sets: '3x12', mode: 'gym' }],
    workoutLog: {
      [recentDate]: {
        workoutKey: 'upper',
        mode: 'gym',
        completed: { bp: true },
        weights: { bp: { kg: '50', reps: '8' } },
      },
      [oldDate]: {
        workoutKey: 'upper',
        mode: 'gym',
        weights: { bp: { kg: '45', reps: '8' } },
      },
      '2026-01-01': {
        workoutKey: 'lower',
        mode: 'gym',
        weights: { bp: { kg: '40', reps: '8' } },
      },
    },
    equipmentLabel: exercise => exercise.equipment || 'barbell',
  });

  assert.equal(payload.unavailableEquipment, 'bench rack');
  assert.equal(payload.history.length, 1);
  assert.equal(payload.history[0].estimatedVolumeKg, 1600);
  assert.equal(payload.history[0].completed, true);
});

test('AI substitutions are limited to supplied candidates in the active mode', () => {
  const payload = {
    mode: 'home',
    exercises: [{ id: 'sq', name: 'Goblet Squat' }],
    candidates: [
      { id: 'sq', mode: 'home' },
      { id: 'split-squat', name: 'Split Squat', sets: '3x8', equipment: 'Bodyweight', mode: 'home' },
      { id: 'barbell-squat', mode: 'gym' },
    ],
  };
  const result = sanitizeRecommendations({
    summary: 'Try a controlled variation.',
    progression: [{ exerciseId: 'sq', recommendation: 'Add one rep.', rationale: 'Recent work is steady.' }],
    alternatives: [
      { originalExerciseId: 'sq', alternativeId: 'split-squat', rationale: 'Keeps the squat pattern.' },
      { originalExerciseId: 'sq', alternativeId: 'barbell-squat', rationale: 'Wrong mode.' },
      { originalExerciseId: 'sq', alternativeId: 'invented', rationale: 'Not in the catalog.' },
    ],
  }, payload);

  assert.equal(result.progression.length, 1);
  assert.equal(result.alternatives.length, 1);
  assert.equal(result.alternatives[0].name, 'Split Squat');
});
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dataPath = path.join(__dirname, '..', 'src', 'js', 'data.js');
const source = fs.readFileSync(dataPath, 'utf8');

const context = {
  console,
  setTimeout,
  clearTimeout,
};
vm.createContext(context);
vm.runInContext(source, context);

test('getSimilarExercises only returns alternatives from the selected mode', () => {
  const gymAlternatives = context.getSimilarExercises('sq', 'gym', 'lower');
  const homeAlternatives = context.getSimilarExercises('sq', 'home', 'lower');

  assert.ok(gymAlternatives.length > 0);
  assert.ok(homeAlternatives.length > 0);
  assert.ok(gymAlternatives.every(ex => ex.mode === 'gym'));
  assert.ok(homeAlternatives.every(ex => ex.mode === 'home'));
});

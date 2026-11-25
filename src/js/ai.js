function buildWorkoutRecommendationPayload({
  workout,
  mode,
  workoutLog,
  unavailableEquipment,
  exercises,
  candidates,
  equipmentLabel,
}) {
  const now = Date.now();
  const eightWeeksAgo = now - (56 * 24 * 60 * 60 * 1000);
  const exerciseIds = new Set(exercises.map(exercise => exercise.id));
  const history = Object.entries(workoutLog || {})
    .filter(([date, entry]) => {
      const timestamp = Date.parse(`${date}T00:00:00Z`);
      return Number.isFinite(timestamp) && timestamp >= eightWeeksAgo && timestamp <= now &&
        entry?.workoutKey === workout.key && entry?.mode === mode;
    })
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .flatMap(([date, entry]) => Array.from(exerciseIds).flatMap(exerciseId => {
      const exercise = exercises.find(item => item.id === exerciseId);
      const weight = entry.weights?.[exerciseId] || {};
      const kilograms = Number(weight.kg);
      const reps = Number(weight.reps);
      if (!Number.isFinite(kilograms) && !Number.isFinite(reps)) return [];

      const plannedSets = Number.parseInt(exercise?.sets || '', 10);
      const estimatedVolume = Number.isFinite(kilograms) && Number.isFinite(reps) && Number.isFinite(plannedSets)
        ? Math.round(kilograms * reps * plannedSets * 100) / 100
        : null;

      return [{
        date,
        exerciseId,
        completed: Boolean(entry.completed?.[exerciseId]),
        kilograms: Number.isFinite(kilograms) ? kilograms : null,
        reps: Number.isFinite(reps) ? reps : null,
        estimatedVolumeKg: estimatedVolume,
      }];
    }))
    .slice(-120);

  return {
    workout: { key: workout.key, label: workout.label, focus: workout.focus },
    mode,
    unavailableEquipment: String(unavailableEquipment || '').trim().slice(0, 300),
    exercises: exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      sets: exercise.sets,
      note: exercise.note,
      equipment: equipmentLabel(exercise),
    })),
    candidates: candidates.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      sets: exercise.sets,
      note: exercise.note,
      equipment: equipmentLabel(exercise),
      mode: exercise.mode || mode,
    })),
    history,
  };
}

async function requestWorkoutRecommendations(payload) {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Could not load suggestions. Please try again.');
  }
  return result;
}
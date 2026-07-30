function apiError(body, fallbackMessage) {
  const err = new Error(body.error || fallbackMessage);
  err.code = body.code;
  return err;
}

export async function fetchWorkouts() {
  const res = await fetch('/api/workouts');
  return res.json();
}

export async function createWorkout(payload) {
  const res = await fetch('/api/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw apiError(body, 'Ошибка сохранения');
  }
  return body;
}

export async function deleteWorkout(workoutId) {
  const res = await fetch(`/api/workouts/${workoutId}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw apiError(body, 'Ошибка удаления');
  }
}

export async function fetchGlucoseForWorkout(workoutId, windowHours) {
  const res = await fetch(`/api/workouts/${workoutId}/glucose?window=${windowHours}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw apiError(body, 'Не удалось загрузить данные глюкозы');
  }
  return body;
}

export function buildWorkoutPayload(fields) {
  return {
    category: fields.category,
    start_time: fields.start_time,
    end_time: fields.end_time,
    intensity: fields.intensity ? Number(fields.intensity) : null,
    tags: String(fields.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    notes: fields.notes || null,
  };
}

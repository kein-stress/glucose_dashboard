import { CATEGORY_LABELS, fmtDisplay } from '../lib/format.js';

export function WorkoutList({ workouts, selectedWorkoutId, onSelect }) {
  if (workouts.length === 0) {
    return (
      <ul id="workout-list">
        <li className="meta">Пока нет тренировок</li>
      </ul>
    );
  }

  return (
    <ul id="workout-list">
      {workouts.map((w) => (
        <li
          key={w.id}
          className={'workout-item' + (w.id === selectedWorkoutId ? ' selected' : '')}
          onClick={() => onSelect(w.id)}
        >
          <div className="category">{CATEGORY_LABELS[w.category] || w.category}</div>
          <div className="meta">
            {fmtDisplay(w.start_time)} → {fmtDisplay(w.end_time)}
          </div>
          {w.tags.length > 0 && <div className="meta">{w.tags.join(', ')}</div>}
        </li>
      ))}
    </ul>
  );
}

import { fmtDisplay } from '../lib/format.js';
import { LOCALE_INTL_TAG } from '../i18n/translations.js';
import { useI18n } from '../i18n/I18nContext.jsx';

export function WorkoutList({ workouts, selectedWorkoutId, onSelect, onDelete }) {
  const { t, locale } = useI18n();
  const intlTag = LOCALE_INTL_TAG[locale];

  if (workouts.length === 0) {
    return (
      <ul id="workout-list">
        <li className="meta">{t('list.empty')}</li>
      </ul>
    );
  }

  function handleDelete(e, workout) {
    e.stopPropagation();
    if (window.confirm(t('list.confirmDelete'))) {
      onDelete(workout.id);
    }
  }

  return (
    <ul id="workout-list">
      {workouts.map((w) => (
        <li
          key={w.id}
          className={'workout-item' + (w.id === selectedWorkoutId ? ' selected' : '')}
          onClick={() => onSelect(w.id)}
        >
          <button
            type="button"
            className="workout-item-delete"
            aria-label={t('list.delete')}
            title={t('list.delete')}
            onClick={(e) => handleDelete(e, w)}
          >
            ×
          </button>
          <div className="category">{t(`category.${w.category}`)}</div>
          <div className="meta">
            {fmtDisplay(w.start_time, intlTag)} → {fmtDisplay(w.end_time, intlTag)}
          </div>
          {w.tags.length > 0 && <div className="meta">{w.tags.join(', ')}</div>}
        </li>
      ))}
    </ul>
  );
}

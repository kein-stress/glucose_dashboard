import { fmtDisplay } from '../lib/format.js';
import { LOCALE_INTL_TAG } from '../i18n/translations.js';
import { useI18n } from '../i18n/I18nContext.jsx';

export function WorkoutList({ workouts, selectedWorkoutId, onSelect }) {
  const { t, locale } = useI18n();
  const intlTag = LOCALE_INTL_TAG[locale];

  if (workouts.length === 0) {
    return (
      <ul id="workout-list">
        <li className="meta">{t('list.empty')}</li>
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

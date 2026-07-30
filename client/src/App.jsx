import { useState } from 'react';
import { useWorkouts } from './hooks/useWorkouts.js';
import { WorkoutForm } from './components/WorkoutForm.jsx';
import { WorkoutList } from './components/WorkoutList.jsx';
import { GlucoseChart } from './components/GlucoseChart.jsx';
import { glucoseUnitLabel } from './lib/format.js';
import { DEFAULT_GLUCOSE_UNIT_BY_LOCALE } from './i18n/translations.js';
import { useI18n } from './i18n/I18nContext.jsx';

const GLUCOSE_UNIT_STORAGE_KEY = 'glucoseUnit';

function defaultUnitForLocale(locale) {
  return DEFAULT_GLUCOSE_UNIT_BY_LOCALE[locale] || 'mgdl';
}

export function App() {
  const { t, locale, setLocale, supportedLocales, localeLabels } = useI18n();
  const { workouts, addWorkout } = useWorkouts();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [windowHours, setWindowHours] = useState(2);
  const [glucoseUnit, setGlucoseUnit] = useState(
    () => localStorage.getItem(GLUCOSE_UNIT_STORAGE_KEY) || defaultUnitForLocale(locale)
  );

  function handleGlucoseUnitChange(unit) {
    setGlucoseUnit(unit);
    localStorage.setItem(GLUCOSE_UNIT_STORAGE_KEY, unit);
  }

  function handleLocaleChange(nextLocale) {
    setLocale(nextLocale);
    // Only follow the locale's default unit if the user never picked one explicitly.
    if (!localStorage.getItem(GLUCOSE_UNIT_STORAGE_KEY)) {
      setGlucoseUnit(defaultUnitForLocale(nextLocale));
    }
  }

  async function handleCreate(payload) {
    const created = await addWorkout(payload);
    setSelectedWorkoutId(created.id);
  }

  return (
    <>
      <header>
        <h1>{t('app.title')}</h1>
        <p className="subtitle">{t('app.subtitle')}</p>
        <label className="unit-control">
          {t('app.languageLabel')}
          <select value={locale} onChange={(e) => handleLocaleChange(e.target.value)}>
            {supportedLocales.map((code) => (
              <option key={code} value={code}>
                {localeLabels[code]}
              </option>
            ))}
          </select>
        </label>
        <label className="unit-control">
          {t('app.unitLabel')}
          <select
            value={glucoseUnit}
            onChange={(e) => handleGlucoseUnitChange(e.target.value)}
          >
            {['mgdl', 'mmol'].map((value) => (
              <option key={value} value={value}>
                {glucoseUnitLabel(value, locale)}
              </option>
            ))}
          </select>
        </label>
      </header>

      <main>
        <section className="panel" id="form-panel">
          <h2>{t('form.title')}</h2>
          <WorkoutForm onCreate={handleCreate} />
        </section>

        <section className="panel" id="list-panel">
          <h2>{t('list.title')}</h2>
          <WorkoutList
            workouts={workouts}
            selectedWorkoutId={selectedWorkoutId}
            onSelect={setSelectedWorkoutId}
          />
        </section>

        <section className="panel" id="chart-panel">
          <h2>{t('chart.title')}</h2>
          <GlucoseChart
            workoutId={selectedWorkoutId}
            windowHours={windowHours}
            onWindowHoursChange={setWindowHours}
            unit={glucoseUnit}
          />
        </section>
      </main>
    </>
  );
}

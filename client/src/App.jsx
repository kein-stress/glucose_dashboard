import { useState } from 'react';
import { useWorkouts } from './hooks/useWorkouts.js';
import { WorkoutForm } from './components/WorkoutForm.jsx';
import { WorkoutList } from './components/WorkoutList.jsx';
import { GlucoseChart } from './components/GlucoseChart.jsx';
import { LanguageSwitcher } from './components/LanguageSwitcher.jsx';
import { LoginForm } from './components/LoginForm.jsx';
import { glucoseUnitLabel } from './lib/format.js';
import { DEFAULT_GLUCOSE_UNIT_BY_LOCALE } from './i18n/translations.js';
import { useI18n } from './i18n/I18nContext.jsx';
import { useAuth } from './auth/AuthContext.jsx';

const GLUCOSE_UNIT_STORAGE_KEY = 'glucoseUnit';

function defaultUnitForLocale(locale) {
  return DEFAULT_GLUCOSE_UNIT_BY_LOCALE[locale] || 'mgdl';
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.1em"
      height="1.1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function App() {
  const { t, locale, setLocale, supportedLocales, localeLabels, localeFlags } = useI18n();
  const { authenticated, logout } = useAuth();
  return authenticated ? (
    <Dashboard
      t={t}
      locale={locale}
      setLocale={setLocale}
      supportedLocales={supportedLocales}
      localeLabels={localeLabels}
      localeFlags={localeFlags}
      onLogout={logout}
    />
  ) : authenticated === false ? (
    <LoginForm />
  ) : (
    <p id="app-loading">{t('app.loading')}</p>
  );
}

function Dashboard({ t, locale, setLocale, supportedLocales, localeLabels, localeFlags, onLogout }) {
  const { workouts, addWorkout, removeWorkout } = useWorkouts();
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

  async function handleDelete(id) {
    await removeWorkout(id);
    if (id === selectedWorkoutId) {
      setSelectedWorkoutId(null);
    }
  }

  return (
    <>
      <header>
        <div className="header-top">
          <div className="header-heading">
            <h1>{t('app.title')}</h1>
            <p className="subtitle">{t('app.subtitle')}</p>
          </div>
          <div className="header-actions">
            <LanguageSwitcher
              locale={locale}
              locales={supportedLocales}
              labels={localeLabels}
              flags={localeFlags}
              onChange={handleLocaleChange}
            />
            <button
              type="button"
              className="logout-button"
              onClick={onLogout}
              title={t('app.logout')}
              aria-label={t('app.logout')}
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
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
            onDelete={handleDelete}
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

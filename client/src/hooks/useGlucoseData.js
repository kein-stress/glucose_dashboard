import { useEffect, useState } from 'react';
import { fetchGlucoseForWorkout } from '../api/workouts.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { localizeApiError } from '../lib/apiError.js';

export function useGlucoseData(workoutId, windowHours) {
  const { t } = useI18n();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (workoutId == null) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    fetchGlucoseForWorkout(workoutId, windowHours)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setData(null);
        setError(localizeApiError(t, err));
      });

    return () => {
      cancelled = true;
    };
  }, [workoutId, windowHours, t]);

  return { data, error };
}

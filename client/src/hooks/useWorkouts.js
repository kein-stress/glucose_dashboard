import { useCallback, useEffect, useState } from 'react';
import { createWorkout, deleteWorkout, fetchWorkouts } from '../api/workouts.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { localizeApiError } from '../lib/apiError.js';

export function useWorkouts() {
  const { t } = useI18n();
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    try {
      const data = await fetchWorkouts();
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError(localizeApiError(t, err));
    }
  }, [t]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addWorkout = useCallback(
    async (payload) => {
      const created = await createWorkout(payload);
      await reload();
      return created;
    },
    [reload],
  );

  const removeWorkout = useCallback(
    async (id) => {
      await deleteWorkout(id);
      await reload();
    },
    [reload],
  );

  return { workouts, error, reload, addWorkout, removeWorkout };
}

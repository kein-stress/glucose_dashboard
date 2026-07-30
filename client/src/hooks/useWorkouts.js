import { useCallback, useEffect, useState } from 'react';
import { createWorkout, deleteWorkout, fetchWorkouts } from '../api/workouts.js';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    try {
      const data = await fetchWorkouts();
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

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

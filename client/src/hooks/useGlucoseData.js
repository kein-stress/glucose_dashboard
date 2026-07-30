import { useEffect, useState } from 'react';
import { fetchGlucoseForWorkout } from '../api/workouts.js';

export function useGlucoseData(workoutId, windowHours) {
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
        setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [workoutId, windowHours]);

  return { data, error };
}

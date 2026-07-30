import { useState } from 'react';
import { useWorkouts } from './hooks/useWorkouts.js';
import { WorkoutForm } from './components/WorkoutForm.jsx';
import { WorkoutList } from './components/WorkoutList.jsx';
import { GlucoseChart } from './components/GlucoseChart.jsx';

export function App() {
  const { workouts, addWorkout } = useWorkouts();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [windowHours, setWindowHours] = useState(2);

  async function handleCreate(payload) {
    const created = await addWorkout(payload);
    setSelectedWorkoutId(created.id);
  }

  return (
    <>
      <header>
        <h1>Glucose × Workout Dashboard</h1>
        <p className="subtitle">Наблюдательный дашборд. Не источник рекомендаций по дозировке.</p>
      </header>

      <main>
        <section className="panel" id="form-panel">
          <h2>Новая тренировка</h2>
          <WorkoutForm onCreate={handleCreate} />
        </section>

        <section className="panel" id="list-panel">
          <h2>Тренировки</h2>
          <WorkoutList
            workouts={workouts}
            selectedWorkoutId={selectedWorkoutId}
            onSelect={setSelectedWorkoutId}
          />
        </section>

        <section className="panel" id="chart-panel">
          <h2>Глюкоза вокруг тренировки</h2>
          <GlucoseChart
            workoutId={selectedWorkoutId}
            windowHours={windowHours}
            onWindowHoursChange={setWindowHours}
          />
        </section>
      </main>
    </>
  );
}

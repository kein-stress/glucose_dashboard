import { useState } from 'react';
import { buildWorkoutPayload } from '../api/workouts.js';

const initialFields = {
  category: 'strength',
  start_time: '',
  end_time: '',
  intensity: '',
  tags: '',
  notes: '',
};

export function WorkoutForm({ onCreate }) {
  const [fields, setFields] = useState(initialFields);
  const [error, setError] = useState(null);

  function update(key) {
    return (event) => setFields((f) => ({ ...f, [key]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      await onCreate(buildWorkoutPayload(fields));
      setFields(initialFields);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Категория
          <select value={fields.category} onChange={update('category')} required>
            <option value="strength">Силовая</option>
            <option value="cardio">Кардио</option>
            <option value="mobility">Мобильность/растяжка</option>
            <option value="other">Другое</option>
          </select>
        </label>

        <label>
          Начало
          <input type="datetime-local" value={fields.start_time} onChange={update('start_time')} required />
        </label>

        <label>
          Конец
          <input type="datetime-local" value={fields.end_time} onChange={update('end_time')} required />
        </label>

        <label>
          Интенсивность (1–10)
          <input type="number" min="1" max="10" value={fields.intensity} onChange={update('intensity')} />
        </label>

        <label>
          Теги (через запятую)
          <input type="text" placeholder="ноги, база, зал" value={fields.tags} onChange={update('tags')} />
        </label>

        <label>
          Заметки
          <textarea rows="2" value={fields.notes} onChange={update('notes')} />
        </label>

        <button type="submit">Сохранить тренировку</button>
      </form>
      <p className="error" hidden={!error}>{error}</p>
    </>
  );
}
